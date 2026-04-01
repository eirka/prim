import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useToast } from 'vue-toastification';
import handlers from '@/api/handlers';
import userHandlers, { clearFavoritesCache } from '@/api/userHandlers';
import { getAvatar } from '@/composables/useUtils';
import config from '@/config';
import type { WhoamiResponse } from '@/types';
import { useBoardStore } from './board';

// Two separate caches with different strategies:
// - CACHE_KEY (auth): persists user identity across page loads, no TTL (cleared on logout)
// - WHOAMI_KEY: short-lived API response cache (5-min TTL) to avoid redundant /whoami calls
const CACHE_KEY = 'global.cache';
const WHOAMI_KEY = 'global.whoami';
const WHOAMI_TTL = 5 * 60 * 1000; // 5 minutes

// Fixture data used when config.test_mode is set. The group field is overridden
// at runtime in setAuthState() based on test_mode value ('mod' → 3, 'user' → 1).
const TEST_WHOAMI: WhoamiResponse = {
  user: {
    id: 3,
    name: 'Test',
    group: 3,
    authenticated: true,
    email: 'test@test.com',
    last_active: '2026-02-28T06:28:25Z',
  },
};

interface AuthCache {
  id: number;
  name: string;
  isAuthenticated: boolean;
  avatar: string | null;
  lastactive: string;
}

interface WhoamiCache {
  data: WhoamiResponse;
  timestamp: number;
}

const saveWhoamiCache = (data: WhoamiResponse) => {
  try {
    localStorage.setItem(WHOAMI_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    /* ignore */
  }
};

const getWhoamiCache = (): WhoamiResponse | null => {
  try {
    const cached = localStorage.getItem(WHOAMI_KEY);
    if (!cached) return null;
    const parsed: WhoamiCache = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > WHOAMI_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const id = ref(1);
  const name = ref('Anonymous');
  const isAuthenticated = ref(false);
  const avatar = ref<string | null>(null);
  const lastactive = ref(new Date());

  const set = (uid: number, uname: string, auth: boolean, uavatar: string | null, ulast: Date) => {
    id.value = uid;
    name.value = uname;
    isAuthenticated.value = auth;
    avatar.value = uavatar;
    lastactive.value = ulast;
  };

  const setDefault = () => {
    set(1, 'Anonymous', false, null, new Date());
  };

  const saveCache = () => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          id: id.value,
          name: name.value,
          isAuthenticated: isAuthenticated.value,
          avatar: avatar.value,
          lastactive: lastactive.value,
        })
      );
    } catch {
      /* ignore */
    }
  };

  const getCache = (): AuthCache | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  // Clears all client-side session state: auth cache, whoami cache, favorites
  // cache, and board cache. Called on explicit logout, 401 responses, and when
  // cross-tab logout is detected (whoami says unauthenticated but cache exists).
  const destroySession = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(WHOAMI_KEY);
    clearFavoritesCache();
    setDefault();
    const board = useBoardStore();
    board.destroyCache();
    board.setDefault();
  };

  // Initializes auth through a cascade of progressively more expensive sources:
  // 1. test_mode → use fixture data (dev only)
  // 2. localStorage caches → restore previous session immediately (avoids flash)
  // 3. whoami cache → recent API response, still fresh within 5-min TTL
  // 4. Live /whoami API call → authoritative source, updates all caches
  //
  // At each step, if the API says the user is no longer authenticated but we
  // have a cached session, we destroy the session (detects logout from another
  // tab). Network errors (5xx) intentionally preserve cached state to avoid
  // logging users out during transient outages.
  const setAuthState = async () => {
    const board = useBoardStore();

    if (config.test_mode) {
      const ss = TEST_WHOAMI.user;
      const group = config.test_mode === 'mod' ? 3 : 1;
      set(ss.id, ss.name, true, getAvatar(ss.id), new Date(ss.last_active));
      board.set(group);
      return;
    }

    const cas = getCache();
    const cib = board.getCache();

    if (cas && cib) {
      set(cas.id, cas.name, cas.isAuthenticated, cas.avatar, new Date(cas.lastactive));
      board.set(cib.group);
    } else {
      setDefault();
      board.setDefault();
    }

    const cached = getWhoamiCache();
    if (cached) {
      saveWhoamiCache(cached);
      const ss = cached.user;

      if (cas && !ss.authenticated) {
        destroySession();
        return;
      }

      if (ss.authenticated) {
        set(ss.id, ss.name, true, getAvatar(ss.id), new Date(ss.last_active));
        saveCache();
        board.set(ss.group);
        board.saveCache();
      }
      return;
    }

    try {
      const data = await handlers.whoami();
      saveWhoamiCache(data);
      const ss = data.user;

      if (cas && !ss.authenticated) {
        destroySession();
        return;
      }

      if (ss.authenticated) {
        set(ss.id, ss.name, true, getAvatar(ss.id), new Date(ss.last_active));
        saveCache();
        board.set(ss.group);
        board.saveCache();
      }
    } catch (e) {
      const err = e as { status?: number };
      if (err.status && err.status >= 400 && err.status < 500) {
        destroySession();
      }
    }
  };

  const logOut = async () => {
    if (!config.test_mode) {
      try {
        await userHandlers.logout();
      } catch {
        /* ignore */
      }
    }
    destroySession();
    const toast = useToast();
    toast.success('Logged Out');
  };

  // Group IDs from the Pram API: 3=moderator, 4=admin
  const showModControls = computed(() => {
    if (!isAuthenticated.value) return false;
    const board = useBoardStore();
    return board.group === 3 || board.group === 4;
  });

  // Returns true if the given date is newer than the user's last recorded activity.
  // Used by directory and index views to show "NEW" badges on recent content.
  const getLastActive = (date: string | Date): boolean => {
    if (!date) return false;
    const d = new Date(date);
    return !Number.isNaN(d.getTime()) && lastactive.value < d;
  };

  return {
    id,
    name,
    isAuthenticated,
    avatar,
    lastactive,
    set,
    setDefault,
    destroySession,
    setAuthState,
    logOut,
    showModControls,
    getLastActive,
    saveCache,
  };
});

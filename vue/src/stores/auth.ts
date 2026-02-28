import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import handlers from '@/api/handlers';
import userHandlers from '@/api/userHandlers';
import { useBoardStore } from './board';
import { useToast } from 'vue-toastification';
import { getAvatar } from '@/composables/useUtils';
import type { WhoamiResponse } from '@/types';

const CACHE_KEY = 'global.cache';
const WHOAMI_KEY = 'global.whoami';
const WHOAMI_TTL = 5 * 60 * 1000; // 5 minutes

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

  const destroySession = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(WHOAMI_KEY);
    setDefault();
    const board = useBoardStore();
    board.destroyCache();
    board.setDefault();
  };

  const setAuthState = async () => {
    const board = useBoardStore();
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
    try {
      await userHandlers.logout();
    } catch {
      /* ignore */
    }
    destroySession();
    const toast = useToast();
    toast.success('Logged Out');
  };

  const showModControls = computed(() => {
    if (!isAuthenticated.value) return false;
    const board = useBoardStore();
    return board.group === 3 || board.group === 4;
  });

  const getLastActive = (date: string | Date): boolean => {
    if (!date) return false;
    const d = new Date(date);
    return !isNaN(d.getTime()) && lastactive.value < d;
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

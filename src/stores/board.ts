import { defineStore } from 'pinia';
import { ref } from 'vue';
import config from '@/config';

// Cache key is per-imageboard so multiple boards can coexist in localStorage.
// The board store tracks the user's permission group for the current board.
const IB_CACHE_KEY = `ib${config.ib_id}.data`;

interface BoardCache {
  group: number;
}

export const useBoardStore = defineStore('board', () => {
  // User's group/role on this board: 1=guest, 2=registered, 3=moderator, 4=admin.
  // Set from the whoami API response. See usergroupClass() in useUtils.ts for
  // the corresponding CSS class mapping.
  const group = ref(1);

  const set = (g: number) => {
    group.value = g;
  };

  const setDefault = () => {
    set(1);
  };

  const saveCache = () => {
    try {
      localStorage.setItem(IB_CACHE_KEY, JSON.stringify({ group: group.value }));
    } catch {
      /* ignore */
    }
  };

  const getCache = (): BoardCache | null => {
    try {
      const cached = localStorage.getItem(IB_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const destroyCache = () => {
    localStorage.removeItem(IB_CACHE_KEY);
  };

  return { group, set, setDefault, saveCache, getCache, destroyCache };
});

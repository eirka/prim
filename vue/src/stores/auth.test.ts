import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

function createMockStorage(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

const mockStorage = createMockStorage();
vi.stubGlobal('localStorage', mockStorage);

vi.mock('@/config', () => ({
  default: {
    api_srv: 'https://api.test.com',
    img_srv: 'https://img.test.com',
    ib_id: 1,
    csrf_token: 'test-csrf-token',
  },
}));

const mockWhoami = vi.fn();
vi.mock('@/api/handlers', () => ({
  default: { whoami: mockWhoami },
}));

const mockLogout = vi.fn();
vi.mock('@/api/userHandlers', () => ({
  default: { logout: mockLogout },
}));

const mockToastSuccess = vi.fn();
vi.mock('vue-toastification', () => ({
  useToast: vi.fn(() => ({ success: mockToastSuccess })),
}));

vi.mock('@/composables/useUtils', () => ({
  getAvatar: (id: number) => `https://img.test.com/avatars/${id}.png?123`,
}));

const { useAuthStore } = await import('./auth');
const { useBoardStore } = await import('./board');

beforeEach(() => {
  setActivePinia(createPinia());
  mockStorage.clear();
  mockWhoami.mockReset();
  mockLogout.mockReset();
  mockToastSuccess.mockClear();
});

describe('set()', () => {
  it('updates all auth refs from arguments', () => {
    const auth = useAuthStore();
    const date = new Date('2024-06-15T12:00:00Z');
    auth.set(42, 'TestUser', true, 'avatar.png', date);

    expect(auth.id).toBe(42);
    expect(auth.name).toBe('TestUser');
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.avatar).toBe('avatar.png');
    expect(auth.lastactive).toEqual(date);
  });

  it('accepts null avatar', () => {
    const auth = useAuthStore();
    auth.set(1, 'Anon', false, null, new Date());

    expect(auth.avatar).toBeNull();
  });
});

describe('setDefault()', () => {
  it('resets to anonymous defaults', () => {
    const auth = useAuthStore();
    auth.set(42, 'TestUser', true, 'avatar.png', new Date());
    auth.setDefault();

    expect(auth.id).toBe(1);
    expect(auth.name).toBe('Anonymous');
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.avatar).toBeNull();
  });
});

describe('saveCache()', () => {
  it('persists current state to localStorage', () => {
    const auth = useAuthStore();
    auth.set(42, 'TestUser', true, 'avatar.png', new Date('2024-01-01T00:00:00Z'));
    auth.saveCache();

    const cached = JSON.parse(localStorage.getItem('global.cache')!);
    expect(cached.id).toBe(42);
    expect(cached.name).toBe('TestUser');
    expect(cached.isAuthenticated).toBe(true);
    expect(cached.avatar).toBe('avatar.png');
  });

  it('silently handles localStorage errors', () => {
    const auth = useAuthStore();
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });

    expect(() => auth.saveCache()).not.toThrow();
    spy.mockRestore();
  });
});

describe('destroySession()', () => {
  it('removes global.cache from localStorage', () => {
    localStorage.setItem('global.cache', JSON.stringify({ id: 5 }));
    const auth = useAuthStore();
    auth.destroySession();

    expect(localStorage.getItem('global.cache')).toBeNull();
  });

  it('resets auth state to defaults', () => {
    const auth = useAuthStore();
    auth.set(42, 'TestUser', true, 'avatar.png', new Date());
    auth.destroySession();

    expect(auth.id).toBe(1);
    expect(auth.name).toBe('Anonymous');
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.avatar).toBeNull();
  });

  it('cascades to board store', () => {
    localStorage.setItem('ib1.data', JSON.stringify({ group: 3 }));
    const auth = useAuthStore();
    const board = useBoardStore();
    board.set(3);

    auth.destroySession();

    expect(localStorage.getItem('ib1.data')).toBeNull();
    expect(board.group).toBe(1);
  });
});

describe('setAuthState()', () => {
  it('no cache + whoami authenticated: sets state and saves cache', async () => {
    mockWhoami.mockResolvedValue({
      user: {
        id: 5,
        name: 'Alice',
        authenticated: true,
        group: 2,
        last_active: '2024-06-15T12:00:00Z',
      },
    });

    const auth = useAuthStore();
    await auth.setAuthState();

    expect(auth.id).toBe(5);
    expect(auth.name).toBe('Alice');
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.avatar).toBe('https://img.test.com/avatars/5.png?123');
    expect(localStorage.getItem('global.cache')).not.toBeNull();
    expect(useBoardStore().group).toBe(2);
  });

  it('no cache + whoami not authenticated: remains default', async () => {
    mockWhoami.mockResolvedValue({
      user: {
        id: 1,
        name: 'Anonymous',
        authenticated: false,
        group: 1,
        last_active: '',
      },
    });

    const auth = useAuthStore();
    await auth.setAuthState();

    expect(auth.id).toBe(1);
    expect(auth.name).toBe('Anonymous');
    expect(auth.isAuthenticated).toBe(false);
    expect(localStorage.getItem('global.cache')).toBeNull();
  });

  it('cache exists + whoami authenticated: updates from server', async () => {
    localStorage.setItem(
      'global.cache',
      JSON.stringify({
        id: 5,
        name: 'OldName',
        isAuthenticated: true,
        avatar: 'old.png',
        lastactive: '2024-01-01T00:00:00Z',
      })
    );
    localStorage.setItem('ib1.data', JSON.stringify({ group: 2 }));

    mockWhoami.mockResolvedValue({
      user: {
        id: 5,
        name: 'NewName',
        authenticated: true,
        group: 3,
        last_active: '2024-06-15T12:00:00Z',
      },
    });

    const auth = useAuthStore();
    await auth.setAuthState();

    expect(auth.name).toBe('NewName');
    expect(useBoardStore().group).toBe(3);
  });

  it('cache exists + whoami NOT authenticated: destroys session', async () => {
    localStorage.setItem(
      'global.cache',
      JSON.stringify({
        id: 5,
        name: 'OldUser',
        isAuthenticated: true,
        avatar: 'old.png',
        lastactive: '2024-01-01T00:00:00Z',
      })
    );
    localStorage.setItem('ib1.data', JSON.stringify({ group: 2 }));

    mockWhoami.mockResolvedValue({
      user: {
        id: 1,
        name: 'Anonymous',
        authenticated: false,
        group: 1,
        last_active: '',
      },
    });

    const auth = useAuthStore();
    await auth.setAuthState();

    expect(auth.isAuthenticated).toBe(false);
    expect(auth.id).toBe(1);
    expect(auth.name).toBe('Anonymous');
    expect(localStorage.getItem('global.cache')).toBeNull();
  });

  it('cache exists + whoami throws 4xx: destroys session', async () => {
    localStorage.setItem(
      'global.cache',
      JSON.stringify({
        id: 5,
        name: 'OldUser',
        isAuthenticated: true,
        avatar: 'old.png',
        lastactive: '2024-01-01T00:00:00Z',
      })
    );
    localStorage.setItem('ib1.data', JSON.stringify({ group: 2 }));

    mockWhoami.mockRejectedValue({ status: 403 });

    const auth = useAuthStore();
    await auth.setAuthState();

    expect(auth.isAuthenticated).toBe(false);
    expect(auth.id).toBe(1);
    expect(localStorage.getItem('global.cache')).toBeNull();
  });

  it('cache exists + network error (no status): preserves cached state', async () => {
    localStorage.setItem(
      'global.cache',
      JSON.stringify({
        id: 5,
        name: 'CachedUser',
        isAuthenticated: true,
        avatar: 'cached.png',
        lastactive: '2024-01-01T00:00:00Z',
      })
    );
    localStorage.setItem('ib1.data', JSON.stringify({ group: 3 }));

    mockWhoami.mockRejectedValue(new Error('Network error'));

    const auth = useAuthStore();
    await auth.setAuthState();

    expect(auth.isAuthenticated).toBe(true);
    expect(auth.id).toBe(5);
    expect(auth.name).toBe('CachedUser');
    expect(localStorage.getItem('global.cache')).not.toBeNull();
  });

  it('no cache + whoami throws: does not crash, stays default', async () => {
    mockWhoami.mockRejectedValue({ status: 500 });

    const auth = useAuthStore();
    await auth.setAuthState();

    expect(auth.id).toBe(1);
    expect(auth.name).toBe('Anonymous');
    expect(auth.isAuthenticated).toBe(false);
  });
});

describe('logOut()', () => {
  it('calls logout API, destroys session, and shows toast', async () => {
    mockLogout.mockResolvedValue({ success_message: 'ok' });
    const auth = useAuthStore();
    auth.set(5, 'Alice', true, 'avatar.png', new Date());

    await auth.logOut();

    expect(mockLogout).toHaveBeenCalledOnce();
    expect(auth.id).toBe(1);
    expect(auth.isAuthenticated).toBe(false);
    expect(mockToastSuccess).toHaveBeenCalledWith('Logged Out');
  });

  it('still destroys session and toasts even if logout API fails', async () => {
    mockLogout.mockRejectedValue(new Error('network'));
    const auth = useAuthStore();
    auth.set(5, 'Alice', true, 'avatar.png', new Date());

    await auth.logOut();

    expect(auth.isAuthenticated).toBe(false);
    expect(auth.id).toBe(1);
    expect(mockToastSuccess).toHaveBeenCalledWith('Logged Out');
  });

  it('removes localStorage cache', async () => {
    localStorage.setItem('global.cache', JSON.stringify({ id: 5 }));
    mockLogout.mockResolvedValue({ success_message: 'ok' });
    const auth = useAuthStore();

    await auth.logOut();

    expect(localStorage.getItem('global.cache')).toBeNull();
  });
});

describe('showModControls', () => {
  it('returns false when not authenticated', () => {
    const auth = useAuthStore();
    auth.set(1, 'Anon', false, null, new Date());
    useBoardStore().set(3);

    expect(auth.showModControls).toBe(false);
  });

  it('returns true when authenticated and group is 3 (moderator)', () => {
    const auth = useAuthStore();
    auth.set(5, 'Mod', true, null, new Date());
    useBoardStore().set(3);

    expect(auth.showModControls).toBe(true);
  });

  it('returns true when authenticated and group is 4 (admin)', () => {
    const auth = useAuthStore();
    auth.set(5, 'Admin', true, null, new Date());
    useBoardStore().set(4);

    expect(auth.showModControls).toBe(true);
  });

  it('returns false when authenticated but group is 2 (regular user)', () => {
    const auth = useAuthStore();
    auth.set(5, 'User', true, null, new Date());
    useBoardStore().set(2);

    expect(auth.showModControls).toBe(false);
  });
});

describe('getLastActive()', () => {
  it('returns true when the given date is after lastactive', () => {
    const auth = useAuthStore();
    auth.set(1, 'Anon', false, null, new Date('2024-01-01T00:00:00Z'));

    expect(auth.getLastActive('2024-06-15T00:00:00Z')).toBe(true);
  });

  it('returns false when the given date is before lastactive', () => {
    const auth = useAuthStore();
    auth.set(1, 'Anon', false, null, new Date('2024-06-15T00:00:00Z'));

    expect(auth.getLastActive('2024-01-01T00:00:00Z')).toBe(false);
  });

  it('returns false for an invalid date string', () => {
    const auth = useAuthStore();

    expect(auth.getLastActive('not-a-date')).toBe(false);
  });

  it('returns false for an empty string', () => {
    const auth = useAuthStore();

    expect(auth.getLastActive('')).toBe(false);
  });
});

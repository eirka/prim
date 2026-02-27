import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/config', () => ({
  default: {
    img_srv: 'https://img.test.com',
    api_srv: 'https://api.test.com',
    ib_id: 1,
    csrf_token: 'test-token',
  },
}));

const mockRouterPush = vi.fn();
vi.mock('@/router', () => ({
  default: { push: mockRouterPush },
}));

const {
  setQuote,
  getQuote,
  clearQuote,
  apiError,
  getError,
  getFormAction,
  getImgSrc,
  getThumbSrc,
  getAvatar,
  formatDate,
  usergroupClass,
} = await import('./useUtils');

beforeEach(() => {
  clearQuote();
  mockRouterPush.mockClear();
});

describe('quote management', () => {
  it('getQuote returns empty string initially', () => {
    expect(getQuote()).toBe('');
  });

  it('setQuote appends >>N format with trailing space', () => {
    setQuote(42);
    expect(getQuote()).toBe('>>42 ');
  });

  it('setQuote accumulates multiple quotes', () => {
    setQuote(1);
    setQuote(2);
    expect(getQuote()).toBe('>>1 >>2 ');
  });

  it('clearQuote resets to empty string', () => {
    setQuote(99);
    clearQuote();
    expect(getQuote()).toBe('');
  });

  it('setQuote ignores non-number values', () => {
    setQuote('not a number' as unknown as number);
    expect(getQuote()).toBe('');
  });
});

describe('apiError and getError', () => {
  it('getError returns null before any apiError call', async () => {
    vi.resetModules();
    const { getError: freshGetError } = await import('./useUtils');
    expect(freshGetError()).toBeNull();
  });

  it('apiError stores the code and pushes /error route', () => {
    apiError(404);
    expect(getError()).toBe(404);
    expect(mockRouterPush).toHaveBeenCalledWith('/error');
  });

  it('apiError with undefined does not push route', () => {
    apiError(undefined);
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});

describe('getFormAction', () => {
  it('prepends api_srv to the path', () => {
    expect(getFormAction('/post/login')).toBe('https://api.test.com/post/login');
  });

  it('returns empty string for non-string input', () => {
    expect(getFormAction(null as unknown as string)).toBe('');
  });
});

describe('getImgSrc', () => {
  it('returns img_srv/src/ prefix + filename', () => {
    expect(getImgSrc('abc.jpg')).toBe('https://img.test.com/src/abc.jpg');
  });

  it('returns empty string for null', () => {
    expect(getImgSrc(null)).toBe('');
  });
});

describe('getThumbSrc', () => {
  it('returns thumb path for non-gif source', () => {
    expect(getThumbSrc('thumb.jpg', 'source.jpg')).toBe('https://img.test.com/thumb/thumb.jpg');
  });

  it('returns full src path when source extension is gif', () => {
    expect(getThumbSrc('thumb.jpg', 'source.gif')).toBe('https://img.test.com/src/source.gif');
  });

  it('returns empty string when filename is null', () => {
    expect(getThumbSrc(null, 'source.jpg')).toBe('');
  });

  it('returns empty string when source is null', () => {
    expect(getThumbSrc('thumb.jpg', null)).toBe('');
  });

  it('checks only the last extension via pop()', () => {
    // 'file.gif.jpg' → pop() → 'jpg' → thumb path, not src path
    expect(getThumbSrc('t.jpg', 'file.gif.jpg')).toBe('https://img.test.com/thumb/t.jpg');
  });
});

describe('getAvatar', () => {
  it('returns avatar URL with .png and cache-busting query string', () => {
    const result = getAvatar(7);
    expect(result).toMatch(/^https:\/\/img\.test\.com\/avatars\/7\.png\?\d+$/);
  });

  it('returns empty string for null id', () => {
    expect(getAvatar(null)).toBe('');
  });
});

describe('formatDate', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatDate('2024-01-15T12:00:00Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('strips the comma from locale string output', () => {
    const result = formatDate('2024-01-15T12:00:00Z');
    expect(result).not.toContain(',');
  });

  it('accepts a Date object', () => {
    const result = formatDate(new Date('2024-06-01T00:00:00Z'));
    expect(typeof result).toBe('string');
    expect(result).not.toContain(',');
  });
});

describe('usergroupClass', () => {
  it('returns group_registered for group 2', () => {
    expect(usergroupClass(2)).toBe('group_registered');
  });

  it('returns group_moderator for group 3', () => {
    expect(usergroupClass(3)).toBe('group_moderator');
  });

  it('returns group_admin for group 4', () => {
    expect(usergroupClass(4)).toBe('group_admin');
  });

  it('returns group_guest for any other value', () => {
    expect(usergroupClass(0)).toBe('group_guest');
    expect(usergroupClass(1)).toBe('group_guest');
    expect(usergroupClass(99)).toBe('group_guest');
  });
});

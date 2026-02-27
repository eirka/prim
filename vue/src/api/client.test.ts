import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/config', () => ({
  default: {
    api_srv: 'https://api.test.com',
    csrf_token: 'test-csrf-token',
    ib_id: 1,
  },
}));

const mockDestroySession = vi.fn();
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({ destroySession: mockDestroySession })),
}));

const mockRouterPush = vi.fn();
vi.mock('@/router', () => ({
  default: { push: mockRouterPush },
}));

const mockToastError = vi.fn();
vi.mock('vue-toastification', () => ({
  useToast: vi.fn(() => ({ error: mockToastError })),
}));

function mockFetchResponse(status: number, body: Record<string, unknown> = {}) {
  return vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    })
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  mockDestroySession.mockClear();
  mockRouterPush.mockClear();
  mockToastError.mockClear();
  vi.stubGlobal('fetch', mockFetchResponse(200, { success: true }));
});

// Re-import after mocks are set up
const { get, post, del } = await import('./client');

describe('get()', () => {
  it('sends GET to BASE + url', async () => {
    await get('/get/index/1/1');

    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://api.test.com/get/index/1/1');
    expect(init.method).toBeUndefined();
  });

  it('does not send X-XSRF-TOKEN header', async () => {
    await get('/get/index/1/1');

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers).not.toHaveProperty('X-XSRF-TOKEN');
  });

  it('does not send Content-Type header', async () => {
    await get('/get/index/1/1');

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers).not.toHaveProperty('Content-Type');
  });

  it('includes credentials', async () => {
    await get('/get/index/1/1');

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.credentials).toBe('include');
  });
});

describe('post()', () => {
  it('sends POST with JSON-stringified body', async () => {
    const body = { name: 'test', ib: 1 };
    await post('/post/login', body);

    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://api.test.com/post/login');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(body));
  });

  it('sends X-XSRF-TOKEN header with csrf token', async () => {
    await post('/post/login', { name: 'test' });

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers['X-XSRF-TOKEN']).toBe('test-csrf-token');
  });

  it('sends Content-Type: application/json', async () => {
    await post('/post/login', { name: 'test' });

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers['Content-Type']).toBe('application/json');
  });

  it('includes credentials', async () => {
    await post('/post/login', { name: 'test' });

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.credentials).toBe('include');
  });
});

describe('del()', () => {
  it('sends DELETE method', async () => {
    await del('/admin/thread/1/42');

    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://api.test.com/admin/thread/1/42');
    expect(init.method).toBe('DELETE');
  });

  it('sends X-XSRF-TOKEN header', async () => {
    await del('/admin/thread/1/42');

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers['X-XSRF-TOKEN']).toBe('test-csrf-token');
  });

  it('does not send Content-Type header (no body)', async () => {
    await del('/admin/thread/1/42');

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers).not.toHaveProperty('Content-Type');
  });

  it('includes credentials', async () => {
    await del('/admin/thread/1/42');

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.credentials).toBe('include');
  });
});

describe('error handling', () => {
  it('calls destroySession and reloads on 401', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(401));
    const mockReload = vi.fn();
    vi.stubGlobal('window', { location: { reload: mockReload } });

    await get('/get/whoami/1');

    expect(mockDestroySession).toHaveBeenCalled();
    expect(mockReload).toHaveBeenCalled();
  });

  it('shows toast and redirects on 403', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(403, { error_message: 'Banned' }));

    await get('/get/whoami/1');

    expect(mockToastError).toHaveBeenCalledWith('Banned');
    expect(mockRouterPush).toHaveBeenCalledWith('/account');
  });

  it('shows default message on 403 without error_message', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(403, {}));

    await get('/get/whoami/1');

    expect(mockToastError).toHaveBeenCalledWith('Forbidden');
  });

  it('throws on other error statuses', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(500, { error_message: 'Server Error' }));

    await expect(get('/get/index/1/1')).rejects.toEqual({
      status: 500,
      data: { error_message: 'Server Error' },
    });
  });
});

import config from '@/config';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { useToast } from 'vue-toastification';

const BASE = config.api_srv;

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

function getCsrfToken(): string {
  return config.csrf_token || '';
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const needsCsrf = !SAFE_METHODS.has(method);
  const hasBody = options.body != null;

  const res = await fetch(BASE + url, {
    credentials: 'include',
    ...options,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers as Record<string, string> | undefined),
      ...(needsCsrf ? { 'X-XSRF-TOKEN': getCsrfToken() } : {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      const auth = useAuthStore();
      auth.destroySession();
      window.location.reload();
      return undefined as never;
    }
    if (res.status === 403) {
      const data = await res.json().catch(() => ({}));
      const toast = useToast();
      toast.error(data.error_message || 'Forbidden');
      router.push('/account');
      return undefined as never;
    }
    const data = await res.json().catch(() => ({}));
    throw { status: res.status, data };
  }

  return res.json() as Promise<T>;
}

export function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

export function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function del<T>(url: string): Promise<T> {
  return request<T>(url, {
    method: 'DELETE',
  });
}

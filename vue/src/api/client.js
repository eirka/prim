import config from '@/config'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { useToast } from 'vue-toastification'

const BASE = config.api_srv

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE'])

function getCsrfToken() {
  return config.csrf_token || ''
}

async function request(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const needsCsrf = !SAFE_METHODS.has(method)
  const hasBody = options.body != null

  const res = await fetch(BASE + url, {
    credentials: 'include',
    ...options,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
      ...(needsCsrf ? { 'X-XSRF-TOKEN': getCsrfToken() } : {})
    }
  })

  if (!res.ok) {
    if (res.status === 401) {
      const auth = useAuthStore()
      auth.destroySession()
      window.location.reload()
      return
    }
    if (res.status === 403) {
      const data = await res.json().catch(() => ({}))
      const toast = useToast()
      toast.error(data.error_message || 'Forbidden')
      router.push('/account')
      return
    }
    const data = await res.json().catch(() => ({}))
    throw { status: res.status, data }
  }

  return res.json()
}

export function get(url) {
  return request(url)
}

export function post(url, body) {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export function del(url) {
  return request(url, {
    method: 'DELETE'
  })
}

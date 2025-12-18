import { getAccessToken } from '../oidc/techdadosOidc'

function env(name: string, fallback?: string): string {
  const v = (import.meta as any)?.env?.[name]
  return (v ?? fallback ?? '').toString()
}

export type BffFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export async function bffFetch(path: string, options?: BffFetchOptions): Promise<any> {
  const base = env('VITE_API_BASE_URL', 'http://localhost:8000/api/v1')
  const url = base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')

  const token = await getAccessToken()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options?.headers || {}),
  }

  if (token) headers.Authorization = `Bearer ${token}`
  if (options?.body !== undefined) headers['Content-Type'] = 'application/json'

  const resp = await fetch(url, {
    method: options?.method || 'GET',
    headers,
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const ctype = resp.headers.get('content-type') || ''
  const payload = ctype.includes('application/json') ? await resp.json() : await resp.text()

  if (!resp.ok) {
    const msg = typeof payload === 'string' ? payload : JSON.stringify(payload)
    throw new Error(`BFF ${resp.status} ${resp.statusText}: ${msg}`)
  }
  return payload
}

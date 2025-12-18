import { getAccessToken } from '../oidc/techdadosOidc'

/**
 * Base URL do BFF.
 * - Configure via VITE_BFF_BASE_URL no apps/web/.env (ex.: http://localhost:8000)
 * - Se não definido, cai no default.
 */
export function getBffBaseUrl(): string {
  const env = (import.meta as any).env ?? {}
  return (env.VITE_BFF_BASE_URL as string) || 'http://localhost:8000'
}

function joinUrl(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

export async function bffFetch(path: string, init: RequestInit = {}): Promise<any> {
  const token = await getAccessToken()

  const headers = new Headers(init.headers || {})
  headers.set('Accept', headers.get('Accept') || 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(joinUrl(getBffBaseUrl(), path), { ...init, headers })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`BFF ${res.status} ${res.statusText} — ${text}`.trim())
  }

  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

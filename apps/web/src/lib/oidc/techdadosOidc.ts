import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import type { User } from 'oidc-client-ts'

function env(name: string, fallback?: string): string {
  const v = (import.meta as any)?.env?.[name]
  return (v ?? fallback ?? '').toString()
}

export function createTechDadosUserManager(): UserManager {
  const authority = env('VITE_OIDC_AUTHORITY')
  const client_id = env('VITE_OIDC_CLIENT_ID', 'techdados')
  const redirect_uri = env('VITE_OIDC_REDIRECT_URI')
  const post_logout_redirect_uri = env('VITE_OIDC_POST_LOGOUT_REDIRECT_URI')

  if (!authority || !redirect_uri) {
    throw new Error('OIDC env faltando: VITE_OIDC_AUTHORITY e/ou VITE_OIDC_REDIRECT_URI')
  }

  return new UserManager({
    authority,
    client_id,
    redirect_uri,
    post_logout_redirect_uri,
    response_type: 'code',
    scope: 'openid profile email',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    automaticSilentRenew: true,
  })
}

let _mgr: UserManager | null = null
export function techdadosOidc(): UserManager {
  if (!_mgr) _mgr = createTechDadosUserManager()
  return _mgr
}

export async function getUser(): Promise<User | null> {
  return techdadosOidc().getUser()
}

export async function getAccessToken(): Promise<string | null> {
  const u = await getUser()
  return u?.access_token ?? null
}

export async function signIn(): Promise<void> {
  await techdadosOidc().signinRedirect()
}

export async function signOut(): Promise<void> {
  await techdadosOidc().signoutRedirect()
}

export async function handleCallback(): Promise<User> {
  return techdadosOidc().signinRedirectCallback()
}

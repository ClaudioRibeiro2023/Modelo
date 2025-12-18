import { bffFetch } from './bffClient'

export type MeResponse = {
  user_id: string
  roles: string[]
  scopes: string[]
  scope?: any
  auth_mode?: string
  request_id?: string | null
}

export async function getMe(): Promise<MeResponse> {
  return (await bffFetch('/api/me')) as MeResponse
}

import { decodeJwtPayload } from './jwt'

export type TechDadosClaims = {
  userId?: string
  roles: string[]
  scopes: string[]
  raw?: any
}

function parseListOrString(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v))
    return v
      .map(String)
      .map(s => s.trim())
      .filter(Boolean)
  if (typeof v === 'string') {
    const s = v.trim()
    if (!s) return []
    if (s.includes(','))
      return s
        .split(',')
        .map(p => p.trim())
        .filter(Boolean)
    return s
      .split(' ')
      .map(p => p.trim())
      .filter(Boolean)
  }
  return []
}

export function extractRolesFromJwt(accessToken: string, clientId = 'techdados'): string[] {
  const claims = decodeJwtPayload(accessToken)
  if (!claims) return []

  const ra = claims['resource_access']
  if (ra && typeof ra === 'object' && ra[clientId] && Array.isArray(ra[clientId].roles)) {
    return ra[clientId].roles.map(String)
  }

  const realm = claims['realm_access']
  if (realm && typeof realm === 'object' && Array.isArray(realm.roles)) {
    return realm.roles.map(String)
  }

  return parseListOrString(claims['roles'])
}

export function extractScopesFromJwt(accessToken: string, scopesClaim = 'td_scopes'): string[] {
  const claims = decodeJwtPayload(accessToken)
  if (!claims) return []
  const scopes = parseListOrString(claims[scopesClaim])
  if (scopes.length) return scopes

  const fall1 = parseListOrString(claims['scopes'])
  if (fall1.length) return fall1

  const fall2 = parseListOrString(claims['scope'])
  if (fall2.length) return fall2

  return []
}

export function buildTechDadosClaims(
  accessToken: string,
  opts?: { clientId?: string; scopesClaim?: string }
): TechDadosClaims {
  const clientId = opts?.clientId ?? 'techdados'
  const scopesClaim = opts?.scopesClaim ?? 'td_scopes'
  const raw = decodeJwtPayload(accessToken)
  const userId = raw?.preferred_username || raw?.email || raw?.sub
  return {
    userId: userId ? String(userId) : undefined,
    roles: extractRolesFromJwt(accessToken, clientId),
    scopes: extractScopesFromJwt(accessToken, scopesClaim),
    raw,
  }
}

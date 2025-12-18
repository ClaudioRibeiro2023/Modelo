export type TechDadosRole = 'admin' | 'audit' | 'strategic' | 'tactical' | 'operational' | 'support'

export function hasAnyRole(roles: string[], allowed: TechDadosRole[]): boolean {
  if (!allowed.length) return true
  const set = new Set((roles || []).map(r => r.toLowerCase()))
  return allowed.some(a => set.has(a))
}

export function isAdmin(roles: string[]): boolean {
  return hasAnyRole(roles, ['admin'])
}

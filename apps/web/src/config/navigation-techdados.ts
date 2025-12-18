import type { TechDadosRole } from '../lib/auth/rbac'
import { hasAnyRole } from '../lib/auth/rbac'

export type NavItem = {
  id: string
  label: string
  path: string
  allowedRoles: TechDadosRole[]
}

const CATALOG: NavItem[] = [
  { id: 'home', label: 'Visão geral', path: '/', allowedRoles: ['admin', 'strategic', 'tactical'] },
  {
    id: 'epi',
    label: 'Epidemiologia',
    path: '/epi',
    allowedRoles: ['admin', 'strategic', 'tactical', 'operational'],
  },
  {
    id: 'ops',
    label: 'Operação',
    path: '/ops',
    allowedRoles: ['admin', 'tactical', 'operational'],
  },
  { id: 'etl', label: 'ETL / Qualidade', path: '/etl', allowedRoles: ['admin', 'audit'] },
  { id: 'audit', label: 'Auditoria', path: '/audit', allowedRoles: ['admin', 'audit'] },
  { id: 'admin', label: 'Admin', path: '/admin', allowedRoles: ['admin'] },
  { id: 'auth_debug', label: 'Auth Debug', path: '/admin/auth-debug', allowedRoles: ['admin'] },
]

export function buildTechDadosNavigation(input: { roles: string[] }): NavItem[] {
  const roles = (input.roles || []).map(r => r.toLowerCase())
  return CATALOG.filter(it => hasAnyRole(roles, it.allowedRoles))
}

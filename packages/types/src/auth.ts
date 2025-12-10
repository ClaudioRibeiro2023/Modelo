// ============================================================================
// Authentication & Authorization Types
// ============================================================================

/**
 * User roles available in the system
 */
export type UserRole = 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'VIEWER'

/**
 * Alias for backwards compatibility
 */
export type Role = UserRole

/**
 * All available roles as a constant array
 */
export const ALL_ROLES: UserRole[] = ['ADMIN', 'GESTOR', 'OPERADOR', 'VIEWER']

/**
 * Individual role constants for convenience
 */
export const ROLE_ADMIN: UserRole = 'ADMIN'
export const ROLE_GESTOR: UserRole = 'GESTOR'
export const ROLE_OPERADOR: UserRole = 'OPERADOR'
export const ROLE_VIEWER: UserRole = 'VIEWER'

/**
 * Simplified user interface for frontend consumption
 */
export interface AuthUser {
  id: string
  email: string
  name: string
  roles: UserRole[]
  avatar?: string
}

/**
 * Auth context type definition
 */
export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: UserRole | UserRole[]) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  getAccessToken: () => Promise<string | null>
}

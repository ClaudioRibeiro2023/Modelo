// Auth context and hooks
export { AuthProvider, useAuth, getUserManager } from './AuthContext'
export { oidcConfig } from './oidcConfig'

// Types
export type { UserRole, Role, AuthUser, AuthContextType } from './types'
export { ALL_ROLES, ROLE_ADMIN, ROLE_GESTOR, ROLE_OPERADOR, ROLE_VIEWER } from './types'

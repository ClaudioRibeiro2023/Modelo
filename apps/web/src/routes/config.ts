import type { ComponentType } from 'react'
import { lazy } from 'react'
import type { Role } from '@techdados/shared'

// Lazy-loaded page components
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage }))
)
const DocsPage = lazy(() => import('@/pages/DocsPage').then(m => ({ default: m.DocsPage })))
const LgpdPage = lazy(() => import('@/pages/LgpdPage').then(m => ({ default: m.LgpdPage })))
const ConfigPage = lazy(() =>
  import('@/pages/admin/ConfigPage').then(m => ({ default: m.ConfigPage }))
)
const UsersPage = lazy(() =>
  import('@/pages/admin/UsersPage').then(m => ({ default: m.UsersPage }))
)
const ExemploPage = lazy(() => import('@/modules/exemplo').then(m => ({ default: m.ExemploPage })))

/**
 * Route configuration type
 */
export interface RouteConfig {
  /** Route path */
  path: string
  /** Lazy-loaded component */
  element: ComponentType
  /** Required roles (empty = no role required, just auth) */
  roles?: Role[]
  /** Require all roles (true) or any role (false) */
  requireAll?: boolean
  /** Child routes */
  children?: RouteConfig[]
}

/**
 * Public routes (no authentication required)
 */
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage }))),
  },
]

/**
 * Protected routes (authentication required)
 */
export const protectedRoutes: RouteConfig[] = [
  // Main pages
  { path: '/', element: HomePage },
  { path: '/profile', element: ProfilePage },
  { path: '/dashboard', element: HomePage },
  { path: '/relatorios', element: HomePage },

  // Modules
  { path: '/exemplo', element: ExemploPage },

  // Info pages
  { path: '/docs', element: DocsPage },
  { path: '/lgpd', element: LgpdPage },
]

/**
 * Admin routes (authentication + specific roles required)
 */
export const adminRoutes: RouteConfig[] = [
  { path: '/admin/config', element: ConfigPage, roles: ['ADMIN', 'GESTOR'] },
  { path: '/admin/usuarios', element: UsersPage, roles: ['ADMIN'] },
  { path: '/admin/etl', element: ConfigPage, roles: ['ADMIN'] },
  { path: '/admin/observability', element: ConfigPage, roles: ['ADMIN'] },
]

/**
 * All routes combined
 */
export const allRoutes = {
  public: publicRoutes,
  protected: protectedRoutes,
  admin: adminRoutes,
}

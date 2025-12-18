import type { RouteObject } from 'react-router-dom'
import TechDadosLoginPage from '../pages/auth/TechDadosLoginPage'
import TechDadosAuthCallbackPage from '../pages/auth/TechDadosAuthCallbackPage'
import AuthDebugPage from '../pages/admin/AuthDebugPage'
import RequireAuth from '../components/auth/RequireAuth'

/**
 * Rotas “drop-in” para o TechDados.
 * Integre no seu router real adicionando:
 *   ...techdadosRouteObjects
 */
const techdadosRouteObjects: RouteObject[] = [
  { path: '/auth/login', element: <TechDadosLoginPage /> },
  { path: '/auth/callback', element: <TechDadosAuthCallbackPage /> },
  {
    path: '/admin/auth-debug',
    element: (
      <RequireAuth>
        <AuthDebugPage />
      </RequireAuth>
    ),
  },
]

export default techdadosRouteObjects
export { techdadosRouteObjects }

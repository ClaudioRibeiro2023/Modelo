import React, { useEffect, useState } from 'react'
import { getAccessToken } from '../../lib/oidc/techdadosOidc'

/**
 * RequireAuth: gating simples para UX.
 * - Se não houver token, redireciona para /auth/login
 * - Não substitui RBAC no BFF
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      const t = await getAccessToken()
      if (!t) {
        window.location.href = '/auth/login'
        return
      }
      setReady(true)
    })()
  }, [])

  if (!ready) return <div style={{ padding: 24 }}>Verificando sessão…</div>
  return <>{children}</>
}

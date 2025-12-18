import { useEffect, useMemo, useState } from 'react'
import { getAccessToken } from '../../lib/oidc/techdadosOidc'
import { buildTechDadosClaims } from '../../lib/auth/claims'

export default function AuthDebugPage() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => setToken(await getAccessToken()))()
  }, [])

  const claims = useMemo(() => {
    if (!token) return null
    return buildTechDadosClaims(token, { clientId: 'techdados', scopesClaim: 'td_scopes' })
  }, [token])

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>Auth Debug (dev)</h1>
      {!token && <p>Nenhum access_token encontrado. Faça login primeiro.</p>}
      {token && (
        <>
          <section style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18 }}>Resumo</h2>
            <ul>
              <li>
                <b>User</b>: {claims?.userId || '-'}
              </li>
              <li>
                <b>Roles</b>: {(claims?.roles || []).join(', ') || '-'}
              </li>
              <li>
                <b>Scopes</b>: {(claims?.scopes || []).join(', ') || '-'}
              </li>
            </ul>
          </section>

          <section style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18 }}>Token (primeiros 256 chars)</h2>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{token.slice(0, 256)}…</pre>
          </section>

          <section style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18 }}>Claims (raw)</h2>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(claims?.raw ?? {}, null, 2)}
            </pre>
          </section>
        </>
      )}
    </div>
  )
}

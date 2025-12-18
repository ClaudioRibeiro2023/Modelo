import React, { useEffect, useMemo, useState } from 'react'
import { getAccessToken } from '../../lib/oidc/techdadosOidc'
import { buildTechDadosClaims } from '../../lib/auth/claims'
import { getMe, type MeResponse } from '../../lib/api/me'

export default function AuthDebugPage() {
  const [token, setToken] = useState<string | null>(null)
  const [me, setMe] = useState<MeResponse | null>(null)
  const [meError, setMeError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => setToken(await getAccessToken()))()
  }, [])

  const claims = useMemo(() => {
    if (!token) return null
    return buildTechDadosClaims(token, { clientId: 'techdados', scopesClaim: 'td_scopes' })
  }, [token])

  useEffect(() => {
    if (!token) return
    setMe(null)
    setMeError(null)
    ;(async () => {
      try {
        const data = await getMe()
        setMe(data)
      } catch (e: any) {
        setMeError(e?.message || String(e))
      }
    })()
  }, [token])

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Auth Debug</h1>

      {!token ? (
        <p>Sem token OIDC no momento. Faça login pelo fluxo do TechDados.</p>
      ) : (
        <>
          <section style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18 }}>Resumo</h2>
            <ul>
              <li>
                <b>User (claims)</b>: {claims?.userId || '—'}
              </li>
              <li>
                <b>Roles (claims)</b>: {(claims?.roles || []).join(', ') || '—'}
              </li>
              <li>
                <b>Scopes (claims)</b>: {(claims?.scopes || []).join(', ') || '—'}
              </li>
            </ul>
          </section>

          <section style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18 }}>/api/me (BFF)</h2>
            {meError ? (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{meError}</pre>
            ) : me ? (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(me, null, 2)}</pre>
            ) : (
              <p>Carregando…</p>
            )}
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

import { useEffect, useState } from 'react'
import { handleCallback } from '../../lib/oidc/techdadosOidc'

export default function TechDadosAuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'ok' | 'error'>('processing')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        await handleCallback()
        setStatus('ok')
        window.location.href = '/'
      } catch (e: any) {
        setStatus('error')
        setError(e?.message || String(e))
      }
    })()
  }, [])

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Autenticando…</h1>
      {status === 'processing' && <p>Processando retorno do Keycloak…</p>}
      {status === 'error' && (
        <>
          <p style={{ color: 'crimson' }}>Falha ao autenticar</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </>
      )}
    </div>
  )
}

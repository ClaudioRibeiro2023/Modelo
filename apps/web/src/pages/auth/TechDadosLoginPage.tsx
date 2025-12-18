import { signIn } from '../../lib/oidc/techdadosOidc'

export default function TechDadosLoginPage() {
  return (
    <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Entrar no TechDados</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Você será redirecionado para o login do Keycloak (OIDC).
      </p>
      <button
        onClick={() => signIn()}
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.15)',
          cursor: 'pointer',
        }}
      >
        Continuar
      </button>
      <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
        <div>
          Se isso falhar, confira seu <code>apps/web/.env.local</code>.
        </div>
      </div>
    </div>
  )
}

# Bloco 09 — Frontend OIDC (Keycloak) + RBAC (UI gating) + Navegação por módulos

Data: 2025-12-17

## Objetivo

Habilitar no **frontend** (apps/web):

1. Login OIDC contra Keycloak (realm `techdados`)
2. Gestão de sessão (access_token via oidc-client-ts)
3. Extração de **roles** e **scopes** do JWT (apenas para **gating visual**)
4. Construção de uma **navegação por módulos** com base em roles (UI)
5. Página de debug para validar claims (dev)

> Importante: **o enforcement real continua no BFF**.  
> O RBAC no frontend é para UX, não para segurança.

---

## 1) Arquivos adicionados neste bloco

### 1.1 Auth/OIDC helpers

- `apps/web/src/lib/auth/jwt.ts`
- `apps/web/src/lib/auth/claims.ts`
- `apps/web/src/lib/auth/rbac.ts`
- `apps/web/src/lib/oidc/techdadosOidc.ts`

### 1.2 Páginas (prontas) — você só precisa plugar nas rotas

- `apps/web/src/pages/auth/TechDadosLoginPage.tsx`
- `apps/web/src/pages/auth/TechDadosAuthCallbackPage.tsx`
- `apps/web/src/pages/admin/AuthDebugPage.tsx`

### 1.3 Navegação por roles

- `apps/web/src/config/navigation-techdados.ts`

### 1.4 Documentos de operação e contrato

- `docs/operacao/frontend-auth-oidc-smoke.md`
- `docs/contratos-integracao/frontend-oidc.md`
- `docs/produto/navegacao-por-perfil.md`

---

## 2) Variáveis de ambiente (Vite)

Crie um `.env.local` em `apps/web/` (não comite) com:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Keycloak local (Bloco 08)
VITE_OIDC_AUTHORITY=http://localhost:8080/realms/techdados
VITE_OIDC_CLIENT_ID=techdados

# Ajuste conforme a porta do seu frontend (template usa 13000)
VITE_OIDC_REDIRECT_URI=http://localhost:13000/auth/callback
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:13000/
```

> `VITE_OIDC_AUTHORITY` deve ser igual ao `issuer` (`TD_JWT_ISSUER`) do BFF.

---

## 3) Integração mínima no app (1 arquivo por vez)

### Passo A — adicionar rotas

No seu roteador principal (ex.: `apps/web/src/routes/config.ts` ou equivalente), adicione:

- `/auth/login` → `TechDadosLoginPage`
- `/auth/callback` → `TechDadosAuthCallbackPage`
- `/admin/auth-debug` → `AuthDebugPage` (opcional)

> O template já possui páginas/rotas de auth.  
> Se já existir, **reaproveite** e apenas conecte o `techdadosOidc.ts`.

### Passo B — proteger rotas privadas

No componente `ProtectedRoute` (ex.: `apps/web/src/components/auth/ProtectedRoute.tsx`):

- se não houver `access_token`, redirecionar para `/auth/login`

### Passo C — anexar token nas chamadas de API

No client HTTP do frontend (em geral em `packages/shared/src/api/client.ts` ou similar):

- incluir `Authorization: Bearer <token>`

No MVP, você pode usar:

- `techdadosOidc.getAccessToken()` (helper criado neste bloco)

### Passo D — navegação por módulo

Onde você carrega o mapa de navegação (ex.: `navigation-default.ts`),
troque para usar:

- `buildTechDadosNavigation({ roles })`

Isso permite esconder módulos por perfil.

---

## 4) Smoke test

Siga o passo-a-passo em:

- `docs/operacao/frontend-auth-oidc-smoke.md`

---

## 5) Próximo bloco sugerido (Bloco 10)

- Frontend: integração “de verdade” com o mapa de navegação atual do template (schema), plugando sem duplicar.
- BFF: endpoint `/me` para o frontend obter `roles/scopes` do servidor (fonte de verdade).
- Observabilidade: log de login/logout e falhas.

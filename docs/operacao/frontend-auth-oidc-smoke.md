# Smoke — Frontend OIDC (Keycloak) + chamada ao BFF

## Pré-requisitos

- Bloco 08 aplicado (Keycloak local)
- Bloco 07 aplicado (BFF em modo JWT)
- Frontend rodando (porta 13000 no template)
- `.env.local` configurado em `apps/web/`

## 1) Subir Keycloak

```bash
docker compose -f infra/docker-compose.local.yml up -d keycloak
```

## 2) Rodar BFF em modo JWT

Env (exemplo):

```bash
export TD_AUTH_MODE=jwt
export TD_JWT_ISSUER=http://localhost:8080/realms/techdados
export TD_JWT_AUDIENCE=techdados
export TD_JWT_JWKS_URL=http://localhost:8080/realms/techdados/protocol/openid-connect/certs
export TD_JWT_CLIENT_ID=techdados
export TD_JWT_SCOPES_CLAIM=td_scopes
```

Suba o BFF normalmente.

## 3) Rodar frontend

```bash
pnpm -C apps/web dev
```

## 4) Login

- Acesse: `http://localhost:13000/auth/login`
- Você deve ser redirecionado para o Keycloak.
- Login com `dev@techdados.local` / `dev`
- Volta para `/auth/callback` e finaliza.

## 5) Validar token

- Acesse `/admin/auth-debug` e veja roles/scopes decodificados.

## 6) Chamar o BFF com token

Abra uma página do app que busque dados do BFF.
O client deve enviar:

- `Authorization: Bearer <access_token>`

Resultado esperado:

- 200 se roles/scopes são permitidos (e o upstream responder)
- 403 se o RBAC do BFF bloquear

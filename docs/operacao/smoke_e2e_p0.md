# Smoke Test E2E (P0) — TechDados

## Objetivo

Validar login OIDC + token + chamadas ao BFF + proxy do upstream.

## 0) Pré-requisitos

- Keycloak local rodando (realm `techdados`)
- BFF rodando (porta do backend)
- Frontend rodando (porta 13000 no template)

## 1) Variáveis do frontend (apps/web/.env.local)

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_OIDC_AUTHORITY=http://localhost:8080/realms/techdados
VITE_OIDC_CLIENT_ID=techdados
VITE_OIDC_REDIRECT_URI=http://localhost:13000/auth/callback
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:13000/
```

## 2) Variáveis do BFF

```bash
TD_AUTH_MODE=jwt
TD_JWT_ISSUER=http://localhost:8080/realms/techdados
TD_JWT_AUDIENCE=techdados
TD_JWT_JWKS_URL=http://localhost:8080/realms/techdados/protocol/openid-connect/certs

TD_TECHDENGUE_BASE_URL=https://techdengue-api.railway.app
TD_TECHDENGUE_TIMEOUT_S=15
TD_TECHDENGUE_RETRIES=2
TD_TECHDENGUE_CACHE_DEFAULT_TTL_S=60
```

## 3) Rodar

### 3.1 Keycloak

```bash
docker compose -f infra/docker-compose.local.yml up -d keycloak
```

### 3.2 BFF

Suba o serviço (conforme seu template). Exemplo (local):

```bash
cd api-template
python -m uvicorn app.techdados_bff.main:app --reload --port 8000
```

### 3.3 Frontend

```bash
pnpm -C apps/web dev
```

## 4) Validar no browser

1. Abra:

- http://localhost:13000/auth/login

2. Login no Keycloak
3. Após callback, abra:

- http://localhost:13000/admin/auth-debug (dev)

## 5) Validar chamadas ao BFF

- `GET http://localhost:8000/api/v1/techdengue/health`
- `GET http://localhost:8000/api/v1/techdengue/facts`

## Critério de sucesso

- token presente e decodificado no debug
- endpoints acima retornam 200/JSON

# Smoke test — BFF `/api/me`

## Objetivo

Validar rapidamente:

- BFF respondendo
- Request-ID presente
- Integração do frontend chamando `/api/me` com Bearer Token

## 1) Subir o BFF

Na pasta `api-template/`:

```bash
uvicorn app.techdados_bff.main:app --reload --port 8000
```

## 2) Modo MOCK (rápido)

Defina:

- `TD_AUTH_MODE=mock`
- `TD_MOCK_USER_ID=dev`
- `TD_MOCK_ROLES=admin`
- `TD_MOCK_SCOPES=STATE:MG,MUNICIPIO:3106200`

Chamada:

```bash
curl -i http://localhost:8000/api/me
```

Esperado:

- HTTP 200
- JSON com roles/scopes e `request_id` (header `x-request-id` e campo JSON)

## 3) Modo JWT (Keycloak)

Pré-requisitos:

- Keycloak rodando e configurado (blocos 07–08)
- Frontend OIDC rodando (bloco 09)
- `TD_AUTH_MODE=jwt` no BFF
- Variáveis JWT/JWKS configuradas (ver docs/contratos-integracao/auth-jwt-keycloak.md)

Teste via frontend:

- Acesse a página **Auth Debug**
- Verifique a seção **/api/me (BFF)** com JSON preenchido.

## 4) Checklist de troubleshooting

- 401 no `/api/me`:
  - token ausente, expirada ou audience/issuer divergente
- 5xx:
  - JWKS inacessível (rede / URL)
  - clock skew (ajuste `TD_JWT_CLOCK_SKEW_SECONDS`)

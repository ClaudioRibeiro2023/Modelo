# Bloco 10 — BFF /me endpoint + runner main.py + frontend consumo

Data: 2025-12-17

## Objetivo

Criar um endpoint simples de “identidade” no BFF para:

- validar rapidamente o **fluxo OIDC/JWT** ponta a ponta,
- fornecer a “fonte de verdade” para **roles e scopes**,
- suportar o debug operacional (request-id, auth-mode) e o recorte territorial.

## Entregas

### Backend (BFF)

- `GET /api/me`:
  - retorna `user_id`, `roles`, `scopes`, `scope` (metadados), `auth_mode` e `request_id`
- entrypoint `app.techdados_bff.main:app` para executar isolado:
  - `uvicorn app.techdados_bff.main:app --reload --port 8000`

### Frontend

- `bffClient.ts` + `me.ts` para chamar o BFF com Bearer Token
- `AuthDebugPage` exibe:
  - claims locais (decode do token)
  - resposta do BFF em `/api/me`

## Arquivos

Veja `MANIFEST.json`.

## Como validar rapidamente

Siga `docs/operacao/bff-me-smoke.md`.

## Observações

- Em `TD_AUTH_MODE=mock`, o `/api/me` retorna o usuário simulado.
- Em `TD_AUTH_MODE=jwt`, o `/api/me` exige Bearer Token válido.

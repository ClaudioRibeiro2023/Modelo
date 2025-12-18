# Bloco 07 — Auth JWT (Keycloak) + Claims (roles/scopes) + cache JWKS (MVP seguro)

Data: 2025-12-17

## Objetivo

Trocar o modo de autenticação do BFF de `mock/disabled` para `jwt` (Keycloak), extraindo:

- `roles` (realm/client roles)
- `scopes` territoriais (ex.: `STATE:MG`, `MUNICIPIO:3106200`)

com validação de assinatura via **JWKS** (cache em memória) e validação de claims (`iss`, `aud`, `exp`).

> Este bloco não configura o Keycloak automaticamente (infra já existe no template), mas define o **contrato** e o **código** no BFF.

---

## 1) Resultado esperado

Com `TD_AUTH_MODE=jwt`, todas as rotas que dependem de `user_ctx` passam a:

1. Ler `Authorization: Bearer <token>`
2. Validar assinatura (JWKS)
3. Construir `UserContext(user_id, roles, scopes)`
4. Aplicar RBAC + escopo territorial, mantendo política existente.

---

## 2) Variáveis de ambiente (mínimas)

### JWT / Keycloak

- `TD_AUTH_MODE=jwt`
- `TD_JWT_ISSUER=<issuer>`  
  Ex.: `https://<host>/realms/techdados`
- `TD_JWT_AUDIENCE=<audience>`  
  Ex.: `techdados` (client_id)
- `TD_JWT_JWKS_URL=<jwks_url>`  
  Ex.: `https://<host>/realms/techdados/protocol/openid-connect/certs`
- `TD_JWT_CLIENT_ID=techdados` _(default)_

### Cache JWKS

- `TD_JWT_JWKS_TTL_SECONDS=21600` _(6h default)_

### Claims (escopo territorial)

- `TD_JWT_SCOPES_CLAIM=td_scopes` _(default; pode ser `scope`, `scopes`, etc.)_

---

## 3) Dependência necessária (obrigatório para validar assinatura)

Instalar:

- `python-jose[cryptography]`

Use scripts incluídos:

- Windows: `scripts/patch-requirements-auth.ps1`
- Linux/Mac: `scripts/patch-requirements-auth.sh`

Eles:

1. adicionam dependência no `api-template/requirements.txt` (append-only, se não existir)
2. instalam com `pip`

> Se você preferir não alterar `requirements.txt`, pode instalar manualmente:  
> `pip install "python-jose[cryptography]"`

---

## 4) Como o BFF extrai roles e scopes

### 4.1 Roles (prioridade)

1. `resource_access[TD_JWT_CLIENT_ID].roles`
2. `realm_access.roles`
3. claim `roles` (fallback)

### 4.2 Scopes territoriais

Por padrão, do claim `td_scopes`:

- pode ser `list[str]` ou `string` (CSV ou space-separated)

Fallbacks:

- `scopes` (list)
- `scope` (string "a b c")

---

## 5) Configuração mínima no Keycloak (metodologia)

Ver:

- `docs/contratos-integracao/auth-jwt-keycloak.md`

---

## 6) Smoke test

Ver:

- `docs/operacao/bff-auth-jwt-smoke.md`

---

## 7) ADR

Este bloco adiciona decisão de segurança (auth) e cria:

- `docs/adr_v2/004-auth-jwt-keycloak.md`

---

## 8) Próximo bloco sugerido (Bloco 08)

- Integração com Keycloak real no docker-compose (realm + client + mapper td_scopes via seed).
- RBAC alinhado ao PDF “Hierarquia de acessos” (perfis finais e matrizes).

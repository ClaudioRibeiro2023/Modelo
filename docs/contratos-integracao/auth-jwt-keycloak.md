# Auth JWT (Keycloak) — Contrato de integração (TechDados)

## Objetivo

Padronizar como o TechDados (BFF) autentica usuários e extrai:

- identidade (`user_id`)
- `roles`
- `scopes` territoriais (ex.: `STATE:MG`, `MUNICIPIO:3106200`)

## Token esperado

Header HTTP:

- `Authorization: Bearer <JWT>`

O token deve conter:

- `iss` (issuer)
- `aud` (audience) — normalmente o client_id
- `exp`

## Verificação

O BFF valida assinatura via JWKS:

- URL configurável por env: `TD_JWT_JWKS_URL`

## Claims de roles

O BFF extrai roles nesta ordem:

1. `resource_access[client_id].roles` (client roles)
2. `realm_access.roles` (realm roles)
3. `roles` (fallback)

Config:

- `TD_JWT_CLIENT_ID` (default: `techdados`)

## Claims de scopes territoriais

O BFF extrai escopos do claim:

- `td_scopes` (default via `TD_JWT_SCOPES_CLAIM`)

Formatos aceitos:

- `["STATE:MG", "MUNICIPIO:3106200"]`
- `"STATE:MG MUNICIPIO:3106200"`
- `"STATE:MG,MUNICIPIO:3106200"`

Fallback:

- `scopes` (list)
- `scope` (string)

## Como produzir `td_scopes` no Keycloak

Recomendação:

- Criar um **Protocol Mapper** no Client `techdados` (OIDC).
- Mapear um atributo do usuário ou grupo para o claim `td_scopes`.
- Alternativa: usar `scope` e padronizar valores territoriais.

> Observação: este documento descreve o contrato. O seed automático do Keycloak fica para o próximo bloco.

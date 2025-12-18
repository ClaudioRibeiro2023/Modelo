# Claims, roles e scopes (JWT) — contrato para Keycloak / Auth

## Objetivo

Padronizar como o TechDados receberá informações de identidade e autorização.

## 1) Roles

As roles devem existir no realm do Keycloak (ex.: `techdados`), e serem emitidas em:

- `realm_access.roles` (padrão Keycloak)

Roles canônicas sugeridas:

- `admin`
- `audit`
- `strategic`
- `tactical`
- `operational`
- `support`

Sinônimos podem ser tratados no BFF (ex.: `estrategico` → `strategic`), mas o ideal é **padronizar no IdP**.

## 2) Scopes (escopo territorial)

O TechDados suporta scopes em `td_scopes` (claim custom), emitido como lista:

Exemplo:

```json
{
  "td_scopes": ["STATE:MG", "MUNICIPIO:3106200", "MUNICIPIO:3129707"]
}
```

Padrões de scope recomendados:

- `STATE:<UF>` (ex.: `STATE:MG`)
- `MUNICIPIO:<codigo_ibge>`
- Futuro:
  - `URS:<id>`
  - `CONSORCIO:<id>`
  - `MICRO:<id>`
  - `MACRO:<id>`

## 3) Compatibilidade local

Enquanto o Keycloak não está aplicado, usar:

- `TD_AUTH_MODE=mock`
- `TD_MOCK_ROLES=...`
- `TD_MOCK_SCOPES=...`

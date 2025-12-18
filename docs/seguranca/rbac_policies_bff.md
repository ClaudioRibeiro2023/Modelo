# RBAC/Scopes no BFF — Políticas Canônicas (TechDados)

## Princípio

- O **BFF** é a fonte de verdade do enforcement.
- Frontend faz “UI gating” apenas para UX.
- O enforcement deve considerar:
  1. Roles (perfil)
  2. Scopes (permissão granular)
  3. Escopo territorial (UF/município, quando aplicável)

## Claims esperados (Keycloak)

- Roles:
  - preferencial: `resource_access[client_id].roles`
  - fallback: `realm_access.roles`
- Scopes:
  - claim `td_scopes` (array ou string)
- Território (opcional):
  - claim `td_territory` (ex.: {"ufs":["MG"], "municipios":["Contagem"]})

## Scopes sugeridos (MVP)

- `td:read` — leitura de dados (padrão)
- `td:export` — exportação (CSV/Parquet/PDF)
- `td:admin` — configurações administrativas
- `td:audit` — acesso a logs/auditoria

## Roles sugeridos

- admin, audit, strategic, tactical, operational, support

## Mapeamento inicial (exemplo)

- `/api/v1/techdengue/*` → exige `td:read`
- endpoints de export → exige `td:export`
- `/api/v1/audit/*` → exige role audit/admin e `td:audit`
- `/api/v1/admin/*` → exige role admin e `td:admin`

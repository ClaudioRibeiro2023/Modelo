# Smoke test — BFF RBAC + Escopo

## Pré-requisitos

- BFF rodando localmente
- `TD_AUTH_MODE=mock` (ou `disabled`)

## Caso A — admin (tudo liberado)

Env:

- `TD_MOCK_ROLES=admin`
- `TD_MOCK_SCOPES=STATE:MG`

Testes:

- `GET /facts?limit=50`
- `GET /gold?limit=1000&format=csv` (deve permitir)
- `GET /monitor/ping` (deve permitir)

## Caso B — operational (sem export)

Env:

- `TD_MOCK_ROLES=operational`
- `TD_MOCK_SCOPES=STATE:MG`

Testes:

- `GET /facts?limit=50` (OK)
- `GET /gold?limit=1000&format=csv` (DEVE NEGAR: export não permitido)

## Caso C — tactical com escopo municipal

Env:

- `TD_MOCK_ROLES=tactical`
- `TD_MOCK_SCOPES=MUNICIPIO:3106200`

Testes:

- `GET /dengue?limit=200` (OK, mas só itens do município devem aparecer _quando o dataset tiver código IBGE_)
- `GET /facts?limit=200&format=csv` (DEVE NEGAR: export com MUNICIPIO:\* bloqueado no MVP)

## Observações

Se o upstream não incluir `codigo_ibge` nos registros, o filtro municipal poderá retornar poucos/nenhum item no MVP.
Nesse caso, evoluir para P1: resolver nome↔código via cache da rota `/municipios`.

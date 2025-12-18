# Contrato — Upstream API de Dados (Techdengue)

> Este documento descreve o que o TechDados espera do Upstream (API de Dados).

## Base URL

- `TD_TECHDENGUE_BASE_URL` (ex.: `https://techdengue-api.railway.app`)

## Endpoints principais (observados)

- `DELETE /api/v1/keys/{id}`
- `GET /api/v1/audit/logs`
- `GET /api/v1/audit/logs?limit=100&min_status=400`
- `GET /api/v1/audit/stats`
- `GET /api/v1/cache/stats`
- `GET /api/v1/keys`
- `GET /api/v1/risk/dashboard`
- `GET /api/v1/risk/municipio/{codigo_ibge}`
- `GET /api/v1/status`
- `GET /api/v1/weather`
- `GET /api/v1/weather/{cidade}`
- `GET /api/v1/weather/{cidade}/risk`
- `GET /dengue`
- `GET /dengue?limit=100&ano=2024`
- `GET /docs`
- `GET /facts`
- `GET /facts?limit=100&offset=0&format=json`
- `GET /health`
- `GET /municipios`
- `GET /municipios?limit=100&q=Belo`
- `GET /redoc`
- `POST /api/v1/cache/clear`
- `POST /api/v1/cache/clear?pattern=weather`
- `POST /api/v1/risk/analyze`

## Padrões de resposta (recomendados)

- JSON por padrão
- Paginação (quando aplicável): `limit` e `offset`
- Erros: payload com `detail` e `status_code` (ou equivalente)

## Cacheability (sugestão)

- `GET /api/v1/weather*` → TTL 10–60 min
- `GET /dengue*` → TTL 5–30 min (dependendo de refresh)
- `GET /facts` → TTL 1–5 min

## Considerações de segurança

- Upstream pode ser público, mas o TechDados deve:
  - impor RBAC no BFF
  - registrar auditoria de acesso/exports
  - aplicar recorte territorial antes de exibir/exportar

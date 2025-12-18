# Catálogo de Datasets (Techdengue → TechDados)

> Este catálogo é orientado a **produto**: o que existe, para que serve, como filtrar e como confiar.

---

## D0 — Upstream API (fonte de ingestão do TechDados)

**Tipo:** HTTP API | **Modo:** read-only | **Owner:** Techdengue/TechDados

### Endpoints principais (observados no guia de integração)

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

### Observações de uso

- **BFF** faz proxy/adapter e impõe RBAC (scopes + território).
- Cache: recomendado para `/weather/*` e endpoints “pesados”.

---

## D1 — Epidemiologia (Dengue 2024/2025)

**Tipo:** Base analítica (fonte original: planilha) | **Chave:** `codmun` (código IBGE) | **Granularidade:** município × tempo

### Campos típicos

- Município, UF, código IBGE
- Incidência (casos/100 mil)
- Séries (semana/mês), pico e sazonalidade

### Uso no produto

- mapas temáticos
- rankings
- séries temporais
- comparação “antes vs depois” (quando combinada com D2)

---

## D2 — Operacional (Atividades Techdengue)

**Tipo:** Base operacional (fonte original: planilha) | **Chave:** `CODIGO IBGE` | **Granularidade:** atividade × município × data

### Variáveis típicas

- `HA_MAP` (hectares mapeados)
- `POIs` por categoria (dezenas de classes)
- `DEVOLUTIVAS` / devolutivas realizadas
- `DATA_MAP` (data de mapeamento)
- Analista, contratante, status

### Métricas deriváveis

- Produtividade: `POIs / HA_MAP`
- Cobertura: `HA_MAP / HA_URBANOS`
- Conversão: `DEVOLUTIVAS / POIs`

---

## D3 — Geoespacial (PostGIS)

**Tipo:** Postgres + PostGIS | **Chave:** `codigo_ibge` | **Granularidade:** geometria (ponto/polígono) × tempo

### Tabelas citadas

- `banco_techdengue` (dados operacionais + geometria)
- `planilha_campo` (registros de campo)

### Uso no produto

- mapas de POIs e hotspots
- clusterização espacial
- validação/correlação com incidência

---

## Qualidade e governança (mínimo)

Para cada dataset/endpoint:

- **refresh**: diário/semanal/on-demand
- **latência aceitável**: em ms/s
- **SLO de disponibilidade**
- **validações**: tipos, nulos, outliers

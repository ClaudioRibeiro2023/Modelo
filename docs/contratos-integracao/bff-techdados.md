# Contrato BFF TechDados — MVP

> **Versão:** v1.0-mvp  
> **Data:** 2025-12-17  
> **Status:** Em implementação

---

## Base URL

- **Dev:** `http://localhost:8000/api/v1`
- **Prod:** `https://<domain>/api/v1`

---

## Autenticação

Todos os endpoints (exceto `/health`) exigem Bearer token JWT (Keycloak).

```
Authorization: Bearer <access_token>
```

### Claims esperados

| Claim                | Tipo     | Descrição                                             |
| -------------------- | -------- | ----------------------------------------------------- |
| `sub`                | string   | User ID                                               |
| `preferred_username` | string   | Username                                              |
| `realm_access.roles` | string[] | Roles do realm                                        |
| `td_scopes`          | string[] | Scopes TechDados (`td:read`, `td:export`, `td:admin`) |
| `td_territory`       | object   | Escopo territorial (`type`, `id`)                     |

---

## Endpoints MVP

### 1. Health Check

```
GET /health
```

**Auth:** Não requer  
**Resposta:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-12-17T22:00:00Z",
  "upstream": {
    "techdengue": "healthy" | "degraded" | "unhealthy"
  }
}
```

---

### 2. Me (Usuário Autenticado)

```
GET /me
```

**Auth:** Bearer token  
**Scopes:** Nenhum específico  
**Resposta:**

```json
{
  "user_id": "uuid",
  "username": "joao.silva",
  "email": "joao@example.com",
  "roles": ["tactical", "operational"],
  "scopes": ["td:read", "td:export"],
  "territory": {
    "type": "STATE",
    "id": "MG",
    "name": "Minas Gerais"
  },
  "permissions": {
    "can_export": true,
    "can_admin": false,
    "can_audit": false
  }
}
```

---

### 3. Nav (Menu Dinâmico)

```
GET /nav
```

**Auth:** Bearer token  
**Scopes:** Nenhum específico  
**Resposta:**

```json
{
  "modules": [
    {
      "id": "home",
      "label": "Visão Geral",
      "path": "/",
      "icon": "home",
      "children": []
    },
    {
      "id": "epi",
      "label": "Epidemiologia",
      "path": "/epi",
      "icon": "activity",
      "children": [
        { "id": "epi-overview", "label": "Resumo", "path": "/epi/overview" },
        { "id": "epi-rankings", "label": "Rankings", "path": "/epi/rankings" },
        { "id": "epi-series", "label": "Séries", "path": "/epi/series" }
      ]
    },
    {
      "id": "ops",
      "label": "Operação",
      "path": "/ops",
      "icon": "clipboard",
      "children": [
        { "id": "ops-coverage", "label": "Cobertura", "path": "/ops/coverage" },
        { "id": "ops-productivity", "label": "Produtividade", "path": "/ops/productivity" }
      ]
    },
    {
      "id": "risk",
      "label": "Risco",
      "path": "/risk",
      "icon": "alert-triangle",
      "children": [{ "id": "risk-dashboard", "label": "Dashboard", "path": "/risk/dashboard" }]
    },
    {
      "id": "exports",
      "label": "Exportações",
      "path": "/exports",
      "icon": "download",
      "visible_if": "td:export"
    },
    {
      "id": "audit",
      "label": "Auditoria",
      "path": "/audit",
      "icon": "shield",
      "visible_if": "role:admin"
    }
  ]
}
```

**Nota:** `visible_if` é processado no BFF; módulos não autorizados não aparecem.

---

### 4. Epidemiologia — Incidência

```
GET /epidemiologia/incidencia
```

**Auth:** Bearer token  
**Scopes:** `td:read`  
**Query Params:**

| Param           | Tipo   | Obrigatório | Default    | Descrição                     |
| --------------- | ------ | ----------- | ---------- | ----------------------------- |
| `uf`            | string | Não         | (do token) | Filtro por UF                 |
| `municipio`     | string | Não         | —          | Código IBGE                   |
| `ano`           | int    | Não         | 2024       | Ano                           |
| `semana_inicio` | int    | Não         | 1          | Semana epidemiológica inicial |
| `semana_fim`    | int    | Não         | 52         | Semana epidemiológica final   |
| `limit`         | int    | Não         | 100        | Máximo de registros           |

**Resposta:**

```json
{
  "data": [
    {
      "codigo_ibge": "3106200",
      "municipio": "Belo Horizonte",
      "uf": "MG",
      "ano": 2024,
      "semana_epi": 45,
      "casos": 1234,
      "populacao": 2512000,
      "incidencia_100k": 49.12
    }
  ],
  "meta": {
    "total": 853,
    "limit": 100,
    "offset": 0,
    "territory_filter": "STATE:MG"
  }
}
```

**RBAC:** Aplica recorte territorial automático baseado em `td_territory` do token.

---

### 5. Operação — Cobertura

```
GET /operacao/cobertura
```

**Auth:** Bearer token  
**Scopes:** `td:read`  
**Query Params:**

| Param       | Tipo   | Obrigatório | Default    | Descrição           |
| ----------- | ------ | ----------- | ---------- | ------------------- | ------- | ------ |
| `uf`        | string | Não         | (do token) | Filtro por UF       |
| `municipio` | string | Não         | —          | Código IBGE         |
| `periodo`   | string | Não         | "month"    | `week`              | `month` | `year` |
| `limit`     | int    | Não         | 100        | Máximo de registros |

**Resposta:**

```json
{
  "data": [
    {
      "codigo_ibge": "3106200",
      "municipio": "Belo Horizonte",
      "uf": "MG",
      "periodo": "2024-11",
      "ha_mapeados": 15420.5,
      "ha_urbanos": 33100.0,
      "cobertura_pct": 46.58,
      "pois_total": 8934,
      "devolutivas": 2341
    }
  ],
  "meta": {
    "total": 120,
    "limit": 100,
    "offset": 0
  }
}
```

---

### 6. Risco — Dashboard

```
GET /risco/dashboard
```

**Auth:** Bearer token  
**Scopes:** `td:read`  
**Query Params:**

| Param | Tipo   | Obrigatório | Default    | Descrição     |
| ----- | ------ | ----------- | ---------- | ------------- |
| `uf`  | string | Não         | (do token) | Filtro por UF |

**Resposta:**

```json
{
  "summary": {
    "alto": 12,
    "medio": 45,
    "baixo": 96,
    "total_municipios": 153
  },
  "top_risco": [
    {
      "codigo_ibge": "3106200",
      "municipio": "Belo Horizonte",
      "risk_score": 0.87,
      "risk_level": "alto",
      "drivers": ["incidencia_alta", "cobertura_baixa"]
    }
  ],
  "updated_at": "2025-12-17T20:00:00Z"
}
```

---

### 7. Export

```
POST /export
```

**Auth:** Bearer token  
**Scopes:** `td:export` (obrigatório)  
**Body:**

```json
{
  "dataset": "epidemiologia" | "operacao" | "risco",
  "format": "csv" | "parquet",
  "filters": {
    "uf": "MG",
    "ano": 2024,
    "semana_inicio": 1,
    "semana_fim": 52
  },
  "columns": ["municipio", "casos", "incidencia_100k"]
}
```

**Resposta (sucesso):**

```json
{
  "export_id": "uuid",
  "status": "completed",
  "download_url": "/export/download/uuid",
  "rows": 853,
  "size_bytes": 45231,
  "expires_at": "2025-12-18T22:00:00Z"
}
```

**Resposta (sem scope):**

```json
{
  "detail": "Scope 'td:export' required",
  "status_code": 403
}
```

**Auditoria:** Toda exportação gera log com:

- `user_id`, `dataset`, `filters`, `rows`, `size_bytes`, `timestamp`

---

## Códigos de Erro

| Código | Descrição                             |
| ------ | ------------------------------------- |
| 400    | Bad Request (parâmetros inválidos)    |
| 401    | Unauthorized (token ausente/inválido) |
| 403    | Forbidden (scope/role insuficiente)   |
| 404    | Not Found                             |
| 422    | Unprocessable Entity (validação)      |
| 500    | Internal Server Error                 |
| 502    | Bad Gateway (upstream indisponível)   |
| 503    | Service Unavailable                   |

---

## Rate Limiting

| Tipo            | Limite              |
| --------------- | ------------------- |
| Requests gerais | 100/min por usuário |
| Exports         | 10/hora por usuário |

---

## Cache

| Endpoint           | TTL   |
| ------------------ | ----- |
| `/health`          | 30s   |
| `/nav`             | 5min  |
| `/epidemiologia/*` | 30min |
| `/operacao/*`      | 30min |
| `/risco/*`         | 15min |

---

## Upstream Mapping

| BFF Endpoint                | Upstream Endpoint             |
| --------------------------- | ----------------------------- |
| `/epidemiologia/incidencia` | `GET /dengue` + transformação |
| `/operacao/cobertura`       | `GET /facts` + agregação      |
| `/risco/dashboard`          | `GET /api/v1/risk/dashboard`  |

---

## Observabilidade

### Logs (JSON stdout)

```json
{
  "timestamp": "2025-12-17T22:00:00Z",
  "level": "info",
  "event": "api_request",
  "user_id": "uuid",
  "endpoint": "/epidemiologia/incidencia",
  "method": "GET",
  "status": 200,
  "duration_ms": 145,
  "territory": "STATE:MG",
  "params": { "ano": 2024, "limit": 100 }
}
```

### Métricas (Prometheus-style)

- `bff_requests_total{endpoint, status}`
- `bff_request_duration_seconds{endpoint}`
- `bff_upstream_errors_total{upstream}`
- `bff_exports_total{dataset, format}`

---

## Variáveis de Ambiente

| Var                      | Descrição          | Default     |
| ------------------------ | ------------------ | ----------- |
| `TD_TECHDENGUE_BASE_URL` | URL do upstream    | —           |
| `TD_KEYCLOAK_ISSUER`     | Issuer do Keycloak | —           |
| `TD_KEYCLOAK_AUDIENCE`   | Audience esperado  | `techdados` |
| `TD_LOG_LEVEL`           | Nível de log       | `info`      |
| `TD_CACHE_TTL_DEFAULT`   | TTL padrão cache   | `1800`      |

---

_Contrato BFF TechDados MVP — 2025-12-17_

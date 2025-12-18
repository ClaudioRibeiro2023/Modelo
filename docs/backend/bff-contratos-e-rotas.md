# BFF — Contratos e Rotas (FastAPI) | TechDados

**Versão:** v1.0  
**Última atualização:** 2025-12-17  
**Objetivo:** especificar rotas P0 do BFF com RBAC/ABAC, cache e auditoria.

Base: `/api/v1`

---

## Rotas P0

### GET `/health`

Público (dev) — retorna `{ ok: true }`.

### GET `/api/v1/status`

Acesso: `admin|auditoria|suporte`. Cache 60–300s.

### GET `/api/v1/ref/municipios`

Acesso: `admin|estrategico|tatico|operacional|auditoria`. Cache 24h.  
ABAC: restringir por escopo.

### GET `/api/v1/home/panorama`

Acesso: todos (exceto suporte por padrão). Cache 30–60m.  
Params: `scope_type`, `scope_id`, `window`/`from`/`to`.  
Auditoria: `DATA_VIEW_OPENED` + `DATA_QUERY_EXECUTED`.

### GET `/api/v1/home/alertas`

Acesso: idem panorama. Cache 30m.  
Regra de alerta: documentada e auditável.

### GET `/api/v1/epi/ranking`

Acesso: `admin|estrategico|tatico|auditoria` (+ operacional no município). Cache 60m.

### GET `/api/v1/epi/tendencia`

Acesso: `admin|estrategico|tatico|operacional|auditoria`. Cache 60m.

### GET `/api/v1/risk/dashboard`

Acesso: `admin|estrategico|tatico|auditoria`. Cache 30–60m.

### GET `/api/v1/risk/municipio/{codigo_ibge}`

Acesso: `admin|tatico|operacional|auditoria` (com ABAC). Cache 30–60m.

### GET `/api/v1/weather/{city}`

Acesso: `admin|estrategico|tatico|operacional|auditoria`. Cache 15–30m.

---

## Export (P0 controlado)

### POST `/api/v1/export`

Acesso: `admin|estrategico|tatico`.  
Auditoria: `EXPORT_REQUESTED` → `EXPORT_COMPLETED/FAILED`.

---

## Checklist DoD

- [ ] RBAC/ABAC definido por rota
- [ ] cache TTL definido por rota
- [ ] auditoria definida por rota
- [ ] modelo de erro padronizado

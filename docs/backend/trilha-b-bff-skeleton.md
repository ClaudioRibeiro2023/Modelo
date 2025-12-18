# Trilha B — BFF FastAPI Skeleton (TechDados)

**Versão:** v1.0  
**Atualizado em:** 2025-12-17  
**Objetivo:** fornecer um backend BFF (FastAPI) para o TechDados, preparado para:

- consumir a **API Provedora de Dados** (aplicação já existente)
- normalizar contratos e KPIs
- aplicar **RBAC + ABAC** (escopo territorial)
- implementar cache TTL e auditoria
- expor rotas P0 para o frontend (views do TechDados)

---

## 1) Arquitetura (resumo)

O BFF fica entre:

- Frontend (React/Vite)
- Provedor de Dados (sua outra API)

Responsabilidades do BFF:

1. **Segurança** (RBAC + ABAC)
2. **Normalização** (campos, enums, KPIs)
3. **Resiliência** (timeout/retry/circuit)
4. **Cache** por rota + escopo efetivo
5. **Auditoria** de uso e exportação
6. **Contratos estáveis** para o frontend

---

## 2) Estrutura entregue neste bloco

Raiz do pacote: `api-template/app/techdados_bff/`

- `api/` — router e dependências (FastAPI)
- `security/` — auth (mock/keycloak), rbac e abac
- `clients/` — client do provedor (http)
- `services/` — regras de domínio (home, epi, risk, etc.)
- `cache/` — TTL cache (memória) + interface
- `audit/` — emissão de eventos em log estruturado
- `core/` — settings, errors, request_id, logging

---

## 3) Rotas P0 (montadas em `/api/v1`)

- `GET /health`
- `GET /status`
- `GET /ref/municipios`
- `GET /home/panorama`
- `GET /home/alertas`
- `GET /epi/ranking`
- `GET /epi/tendencia`
- `GET /risk/dashboard`
- `GET /risk/municipio/{codigo_ibge}`
- `GET /weather/{city}`
- `POST /export`

> Cada rota define: roles mínimas, ABAC (escopo), cache TTL e auditoria.

---

## 4) Variáveis de ambiente (P0)

### Auth

- `TD_AUTH_MODE=mock|keycloak|disabled` _(P0: use mock)_
- `TD_MOCK_USER_ID=dev`
- `TD_MOCK_ROLES=admin,estrategico`
- `TD_MOCK_SCOPES=STATE:MG,URS:URS-SJDR,MUNICIPIO:3106200`

### Provedor de dados

- `TD_PROVIDER_ENABLED=0|1`
- `TD_PROVIDER_BASE_URL=https://...`
- `TD_PROVIDER_TIMEOUT_S=15`
- `TD_PROVIDER_RETRY=2`

### Cache

- `TD_CACHE_ENABLED=1`
- `TD_CACHE_TTL_HOME_S=1800`
- `TD_CACHE_TTL_EPI_S=3600`
- `TD_CACHE_TTL_RISK_S=1800`
- `TD_CACHE_TTL_WEATHER_S=900`

### Keycloak (P2)

- `TD_KEYCLOAK_ISSUER_URL=...`
- `TD_KEYCLOAK_AUDIENCE=...`

---

## 5) Convenção RBAC/ABAC

### Roles (RBAC)

- `admin`, `estrategico`, `tatico`, `operacional`, `auditoria`, `apoio_indireto`

### Scopes territoriais (ABAC)

Lista de strings:

- `STATE:MG`
- `URS:<id>`
- `CONSORCIO:<id>`
- `MUNICIPIO:<codigo_ibge>`
- `AREA:<id>`

O ABAC valida que o usuário pode consultar o escopo solicitado (ou um “pai” que engloba).

---

## 6) Próximo passo recomendado (P1)

- Ajustar `provider_client.py` para bater nos endpoints reais da sua API de dados (OpenAPI)
- Mapear `claims` do Keycloak para roles/scopes reais
- Substituir cache memória por Redis (quando necessário)

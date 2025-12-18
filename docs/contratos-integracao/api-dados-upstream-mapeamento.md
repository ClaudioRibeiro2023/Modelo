# Contrato — Integração TechDados (BFF) ↔ API de Dados (Upstream Techdengue)

Este documento registra o **mapeamento oficial** entre:

- **Endpoints do BFF** (TechDados) — padronizados sob `/api/v1/...`
- **Endpoints do Upstream** (API de dados Techdengue)

> Fonte do upstream (referência): GUIA_INTEGRACAO.md (docs fornecidos no projeto)

---

## 1) Configuração (env)

- `TECHDENGUE_API_BASE_URL` (ex.: `https://techdengue-api.railway.app`)
- `TECHDENGUE_API_KEY` (enviado como header `X-API-Key`, quando definido)

---

## 2) Mapeamento de endpoints

### 2.1 Saúde/Monitoramento

| BFF (TechDados)              | Upstream      | Observação                                       |
| ---------------------------- | ------------- | ------------------------------------------------ |
| `GET /api/v1/monitor/health` | `GET /health` | BFF tenta upstream; se falhar, retorna degradado |

### 2.2 Atividades (Facts)

| BFF                 | Upstream     | Query params repassados            |
| ------------------- | ------------ | ---------------------------------- |
| `GET /api/v1/facts` | `GET /facts` | `limit, offset, format, q, fields` |

### 2.3 Casos de dengue

| BFF                  | Upstream      | Query params            |
| -------------------- | ------------- | ----------------------- |
| `GET /api/v1/dengue` | `GET /dengue` | `limit, offset, ano, q` |

### 2.4 Municípios

| BFF                      | Upstream          | Query params |
| ------------------------ | ----------------- | ------------ |
| `GET /api/v1/municipios` | `GET /municipios` | `limit, q`   |

### 2.5 Gold (export)

| BFF                | Upstream    | Query params                       |
| ------------------ | ----------- | ---------------------------------- |
| `GET /api/v1/gold` | `GET /gold` | `limit, offset, format, q, fields` |

### 2.6 Clima

| BFF                                 | Upstream                            |
| ----------------------------------- | ----------------------------------- |
| `GET /api/v1/weather`               | `GET /api/v1/weather`               |
| `GET /api/v1/weather/{cidade}`      | `GET /api/v1/weather/{cidade}`      |
| `GET /api/v1/weather/{cidade}/risk` | `GET /api/v1/weather/{cidade}/risk` |

### 2.7 Risco (IA)

| BFF                                        | Upstream                                   |
| ------------------------------------------ | ------------------------------------------ |
| `POST /api/v1/risk/analyze`                | `POST /api/v1/risk/analyze`                |
| `GET /api/v1/risk/dashboard`               | `GET /api/v1/risk/dashboard`               |
| `GET /api/v1/risk/municipio/{codigo_ibge}` | `GET /api/v1/risk/municipio/{codigo_ibge}` |

---

## 3) Padrão de erros

- Upstream 4xx/5xx → BFF responde com `502 Bad Gateway` por padrão (erro de integração),
  preservando detalhes em `details.upstream_*` **sem vazar segredos**.

---

## 4) Evoluções previstas

- Escopo territorial (claims/roles → filtros em facts/dengue)
- Cache interno no BFF (Redis) para endpoints “quentes”
- Observabilidade: métricas por endpoint + latência upstream

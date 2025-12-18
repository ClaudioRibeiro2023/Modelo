# Contrato de Integração — Upstream API de Dados (Techdengue)

> **Objetivo**: registrar de forma canônica como o TechDados consome a API upstream de dados do Techdengue
> (e quais endpoints fazem parte do "MVP de consumo").

## Base URL (referência)

- Produção (referência): `https://techdengue-api.railway.app`
- Swagger: `/docs`
- Redoc: `/redoc`

> **Autenticação**: alguns endpoints exigem API Key via header `X-API-Key`.

---

## Endpoints do MVP (consumo inicial)

### Saúde / status

- `GET /health` _(público)_

### Dados principais

- `GET /facts` _(público)_
- `GET /dengue` _(público)_
- `GET /municipios` _(público)_
- `GET /gold` _(público, suporta CSV)_

### Clima e risco

- `GET /api/v1/weather/{cidade}` _(público)_
- `GET /api/v1/weather/{cidade}/risk` _(público)_
- `GET /api/v1/risk/dashboard` _(público)_
- `POST /api/v1/risk/analyze` _(público — computacionalmente intensivo; cache recomendado)_

### Datasets (pesquisa)

- `GET /datasets` _(público)_

---

## Exemplo — Risk Analyze (payload)

```json
{
  "municipio": "Contagem",
  "casos_recentes": 200,
  "casos_ano_anterior": 100,
  "populacao": 660000
}
```

---

## Convenções de consumo no TechDados (BFF)

- **Timeout**: 15s (default) — ajustável por env
- **Retries**: 2 (default) — apenas para erros de conexão/timeout e 5xx
- **Cache**:
  - `facts`: 10 min
  - `municipios` (por query): 1h
  - `weather`: 10 min
  - `risk/dashboard`: 2–5 min
  - `risk/analyze`: opcional (1h) se payload idempotente

---

## Observabilidade / Auditoria

- Logar:
  - endpoint upstream consumido
  - duração (ms)
  - status code
  - cache hit/miss
- **Nunca** logar `X-API-Key` em texto.

---

## Referências

- Documento base: `GUIA_INTEGRACAO.md` (fornecido pelo projeto)

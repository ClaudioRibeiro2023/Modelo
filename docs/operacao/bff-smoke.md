# Smoke Tests — BFF TechDados (Trilha B)

> Objetivo: validar rapidamente que o BFF está conseguindo falar com o upstream.

## Pré-requisito

Definir:

- `TECHDENGUE_API_BASE_URL`
- (opcional) `TECHDENGUE_API_KEY`

## 1) Health

```bash
curl -sS "http://localhost:8000/api/v1/monitor/health" | jq
```

## 2) Facts (json)

```bash
curl -sS "http://localhost:8000/api/v1/facts?limit=10&format=json" | jq
```

## 3) Dengue (json)

```bash
curl -sS "http://localhost:8000/api/v1/dengue?limit=10&ano=2024" | jq
```

## 4) Municípios (json)

```bash
curl -sS "http://localhost:8000/api/v1/municipios?limit=10&q=Belo" | jq
```

## 5) Weather (json)

```bash
curl -sS "http://localhost:8000/api/v1/weather/Belo%20Horizonte" | jq
```

## 6) Risk dashboard

```bash
curl -sS "http://localhost:8000/api/v1/risk/dashboard" | jq
```

## 7) Risk analyze (POST)

```bash
curl -sS -X POST "http://localhost:8000/api/v1/risk/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "municipio": "Uberlândia",
    "codigo_ibge": "3170206",
    "casos_recentes": 150,
    "casos_ano_anterior": 80,
    "temperatura_media": 28.5
  }' | jq
```

## Observação

Se `jq` não estiver instalado no Windows, remova `| jq` e avalie o JSON cru.

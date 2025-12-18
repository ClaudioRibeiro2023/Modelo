# Operação — Smoke Test do Upstream Techdengue (via BFF)

> Objetivo: validar rapidamente que o BFF do TechDados consegue conversar com o upstream.

## Pré-requisitos

- Backend do TechDados rodando
- Variáveis de ambiente do upstream configuradas (ver `LEIA-ME.md` do bloco)

## Rotas (via BFF)

1. Health

- `GET http://localhost:<PORT>/api/v1/techdengue/health`

2. Facts

- `GET http://localhost:<PORT>/api/v1/techdengue/facts`

3. Municípios (query)

- `GET http://localhost:<PORT>/api/v1/techdengue/municipios?q=contagem&limit=5`

4. Weather (cidade)

- `GET http://localhost:<PORT>/api/v1/techdengue/weather/Contagem`

5. Weather Risk (cidade)

- `GET http://localhost:<PORT>/api/v1/techdengue/weather/Contagem/risk`

6. Risk Dashboard

- `GET http://localhost:<PORT>/api/v1/techdengue/risk/dashboard`

7. Risk Analyze

- `POST http://localhost:<PORT>/api/v1/techdengue/risk/analyze`

```json
{
  "municipio": "Contagem",
  "casos_recentes": 200,
  "casos_ano_anterior": 100,
  "populacao": 660000
}
```

## Critérios de aprovação

- 200/OK para health e facts
- JSON válido para todos os endpoints
- latência "aceitável" (< 2s) para endpoints simples (quando cache hit, < 100ms)

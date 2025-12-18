# Data Quality (MVP) — TechDados

## Objetivo

Garantir consistência mínima para dashboards/exports:

- evitar dados vazios ou inválidos
- detectar outliers e quebras de contrato

## Onde roda

- MVP: validações no BFF (na borda, antes de responder)
- Evolução: job diário (ETL/quality) + relatórios em /etl/quality

## Checks por dataset (MVP)

### D1 — Dengue

- campos obrigatórios: codigo_ibge, periodo, casos/incidencia
- incidência >= 0
- casos >= 0
- cobertura temporal: período solicitado deve ter dados

### D2 — Operação

- HA_MAP >= 0
- POIs >= 0
- cobertura % = HA_MAP / HA_URBANOS (se HA_URBANOS > 0)
- outlier: POIs/ha muito acima do p99 → marcar

### D0 — Upstream endpoints

- health ok
- facts responde JSON
- contratos: schemas básicos (keys principais)

## Thresholds (iniciais)

- missing rate (campos obrigatórios) < 1%
- erros upstream por minuto < X (definir com uso real)
- latência p95 (BFF) < 1500ms (ajustável)

## Logging

- registrar falhas de validação com:
  - endpoint
  - filtro aplicado
  - status
  - motivo (sem PII sensível)

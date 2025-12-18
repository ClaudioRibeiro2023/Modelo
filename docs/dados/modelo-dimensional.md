# Modelo Dimensional (sugestão TechDados)

> Objetivo: suportar dashboards e análises com consistência e performance.

## Fatos (tabelas de fatos)

### fact_atividade

- activity_id
- municipio_id
- tempo_id (data_map)
- ha_map
- pois_total
- devolutivas_total
- (opcional) pois*por_categoria*\* (ou fact_poi_categoria)

### fact_dengue

- municipio_id
- tempo_id (semana/mês)
- casos
- incidencia_100k

### fact_poi_categoria (recomendado)

- activity_id
- municipio_id
- tempo_id
- categoria_poi_id
- quantidade

## Dimensões

### dim_municipio

- codigo_ibge (PK)
- nome
- uf
- populacao
- ha_urbanos
- regional/consorcio (se existir)

### dim_tempo

- data (PK)
- ano, mes, semana_epi, trimestre

### dim_categoria_poi

- id
- nome
- familia
- criticidade

### dim_contratante

- id
- nome
- tipo

### dim_analista

- id
- nome
- time

## Regras

- Chave territorial: **sempre** código IBGE.
- Datas: normalizar timezone e formatos.
- Agregações: registrar sempre “intervalo” e “granularidade” no endpoint/export.

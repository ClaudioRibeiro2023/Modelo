# Dicionário de Métricas (MVP)

> Regra: toda métrica usada em gráfico ou KPI precisa estar aqui.

## Epidemiologia

### Casos

- **Definição:** número de casos notificados/confirmados (conforme fonte)
- **Unidade:** casos
- **Granularidade:** município × tempo

### Incidência (por 100 mil)

- **Fórmula:** `casos / população * 100000`
- **Unidade:** casos/100k
- **Granularidade:** município × tempo

### Pico (semana/mês)

- **Definição:** período com maior incidência no intervalo
- **Uso:** sazonalidade e alertas

## Operação

### Hectares mapeados (HA_MAP)

- **Definição:** área efetivamente mapeada na atividade
- **Unidade:** ha
- **Granularidade:** atividade

### Cobertura urbana (%)

- **Fórmula:** `HA_MAP / HA_URBANOS`
- **Unidade:** %
- **Granularidade:** município × período (agregado)

### POIs (total)

- **Definição:** total de POIs identificados (todas as classes)
- **Unidade:** contagem
- **Granularidade:** atividade

### Densidade de POIs

- **Fórmula:** `POIs / HA_MAP`
- **Unidade:** POIs/ha
- **Granularidade:** atividade (ou agregado)

### Devolutivas (total)

- **Definição:** devolutivas/correções executadas em campo
- **Unidade:** contagem
- **Granularidade:** atividade

### Conversão (devolutivas/POIs)

- **Fórmula:** `DEVOLUTIVAS / POIs`
- **Unidade:** %
- **Granularidade:** atividade (ou agregado)

## Integradas (impacto)

### Correlação Incidência × Densidade de POIs

- **Definição:** correlação estatística (Pearson/Spearman) no período
- **Uso:** validar hipóteses e priorização territorial

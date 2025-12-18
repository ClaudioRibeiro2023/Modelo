# Dicionário de Dimensões (MVP)

Dimensões são “eixos” de corte/filtragem.

## Dimensão: Tempo

- dia
- semana epidemiológica
- mês
- trimestre
- ano

## Dimensão: Território

- país
- UF
- município (código IBGE + nome)
- regional/consórcio (se aplicável)
- área urbana (hectares) — atributo de município

## Dimensão: Operação (atividade)

- atividade_id
- status (planejada / executada / remapeada / etc.)
- contratante
- analista
- tipo de entrega (mapeamento, remapeamento, devolutiva)

## Dimensão: Categoria de POI

- categoria (ex.: caixa d’água, piscina, pneu, sucata etc.)
- família (macro-grupo)
- criticidade (baixa/média/alta)

## Dimensão: Saúde (quando existir)

- casos
- incidência / 100 mil
- hospitalizações (se disponível)

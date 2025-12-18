# Matriz de Análises (MVP + Expandido)

> Cada linha aqui vira: (1) endpoints BFF, (2) cards/gráficos, (3) export, (4) RBAC.

## MVP (prioridade P0/P1)

### A1 — Mapa de Calor de Incidência

- **Pergunta:** Onde a dengue está mais intensa?
- **Datasets:** D1 (dengue) + dim_municipio
- **Métricas:** incidência/100k
- **Filtros:** período, UF, município
- **Visual:** mapa temático + legenda
- **Export:** CSV (td:export)
- **RBAC:** strategic/tactical/operational

### A2 — Ranking Top N Municípios

- **Pergunta:** Quais municípios lideram incidência?
- **Datasets:** D1
- **Métricas:** incidência/100k, casos
- **Visual:** tabela + barras
- **Export:** CSV
- **RBAC:** strategic/tactical/operational

### A3 — Cobertura territorial (Operação)

- **Pergunta:** Quanto da área urbana foi coberta?
- **Datasets:** D2 + dim_municipio (ha_urbanos)
- **Métricas:** HA_MAP, cobertura %
- **Visual:** barras + ranking
- **Export:** CSV/Parquet
- **RBAC:** tactical/operational

### A4 — Produtividade Operacional

- **Pergunta:** POIs/ha por analista/contratante?
- **Datasets:** D2
- **Métricas:** POIs/ha
- **Visual:** barras + boxplot (futuro)
- **Export:** CSV
- **RBAC:** tactical/operational/admin

### A5 — Categorias Críticas (POI)

- **Pergunta:** Quais classes geram mais risco?
- **Datasets:** D2 (+ fact_poi_categoria se existir)
- **Métricas:** quantidade por categoria, densidade por ha
- **Visual:** Pareto (80/20)
- **Export:** CSV
- **RBAC:** tactical/operational

### A6 — Correlação Dengue × Operação

- **Pergunta:** Densidade de POIs se relaciona com incidência?
- **Datasets:** D1 + D2 (mesma janela temporal)
- **Método:** Pearson/Spearman
- **Visual:** scatter + linha
- **Export:** CSV (resultados agregados)
- **RBAC:** strategic/tactical

### A7 — Risco (Dashboard Upstream)

- **Pergunta:** Quais municípios estão em risco (modelo)?
- **Datasets:** D0 `/api/v1/risk/dashboard`
- **Visual:** cards + ranking
- **Export:** CSV
- **RBAC:** strategic/tactical

### A8 — Clima e risco por cidade

- **Pergunta:** Como o clima influencia risco?
- **Datasets:** D0 `/api/v1/weather/{cidade}/risk`
- **Visual:** séries + indicador
- **Export:** CSV
- **RBAC:** tactical/operational

---

## Expandido (P2/P3)

- Predição de surtos (modelos)
- Hotspots geoespaciais avançados
- ROI / custo-efetividade (quando dados financeiros existirem)
- Segmentação por URS/consórcio

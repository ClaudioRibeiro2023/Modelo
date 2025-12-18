# Matriz de Análises — TechDados (Pergunta → KPI → Dataset → View → Acesso)

**Versão:** v1.0  
**Última atualização:** 2025-12-17  
**Objetivo:** consolidar, em um único lugar, o plano de análises do TechDados, conectando:

1. **O que analisar** (perguntas e hipóteses)
2. **Como medir** (KPIs e fórmulas)
3. **Com quais dados** (datasets/endpoints)
4. **Como apresentar** (views, gráficos, mapas, tabelas)
5. **Para quem** (hierarquia de acesso + escopo territorial)
6. **Como governar** (classificação, exportação, auditoria, cache)

Documentos relacionados:

- Catálogo de datasets: `docs/dados/catalogo-datasets.md`
- Dicionário de campos: `docs/dados/dicionario-campos.md`
- NFRs: `docs/produto/nfrs.md`
- RBAC/ABAC: `docs/seguranca/rbac.md`
- Matriz perfis x ações: `docs/seguranca/matriz-perfis-acoes.md`
- Auditoria: `docs/seguranca/auditoria-eventos.md`
- Contrato do provedor/API: `docs/contratos-integracao/api-dados.md`

---

## 1) Definições rápidas

### 1.1 Perfis (hierarquia)

> Os nomes abaixo são “canônicos TechDados” (ajustar para os nomes reais no Keycloak).

- **ADMIN**: configuração, chaves, auditoria completa, cache clear, governança.
- **ESTRATÉGICO**: visão macro (estado/URS), indicadores consolidados, sem microdetalhe sensível.
- **TÁTICO**: visão por município/área de responsabilidade, detalhamento operacional controlado.
- **OPERACIONAL**: execução e rotinas (tarefas/atividades), visão limitada e territorialmente restrita.
- **APOIO_INDIRETO**: leitura controlada (relatórios consolidados), sem exportações de alto risco.

### 1.2 Escopo (ABAC)

- `STATE:MG`
- `URS:<id>`
- `CONSORCIO:<id>`
- `MUNICIPIO:<codigo_ibge>`
- `AREA:<id>` (quando existir)

### 1.3 Classificação e exportação (padrão)

- `data_class`: `public | restricted | sensitive`
- `export_policy`: `none | aggregated | deidentified | full_controlled`

---

## 2) Árvore inicial de módulos e submódulos (padrão v1)

### M0 — Home (Panorama 360°)

- M0.1 KPIs principais (cards)
- M0.2 Mapa rápido (risco/incidência)
- M0.3 Tendência (últimas semanas)
- M0.4 Alertas (mudanças relevantes)

### M1 — Epidemiologia (Dengue)

- M1.1 Incidência e ranking
- M1.2 Tendência temporal e sazonalidade
- M1.3 Comparativos (ano/semana)
- M1.4 Mapas (incidência/cluster) _(P1+)_

### M2 — Risco (Modelos e Priorização)

- M2.1 Dashboard de risco (visão geral)
- M2.2 Risco por município (detalhe + drivers)
- M2.3 Priorização (score composto)
- M2.4 Análises “on-demand” _(P2)_

### M3 — Clima e Contexto

- M3.1 Clima atual e forecast
- M3.2 Clima + risco (risco derivado do clima)

### M4 — Operação Techdengue

- M4.1 Cobertura e produtividade
- M4.2 Conversão e devolutivas
- M4.3 Categorias críticas (tipos de criadouros)
- M4.4 Séries operacionais _(P1)_

### M5 — Impacto e Evidência

- M5.1 Correlação (dengue × operação)
- M5.2 Inferência/causalidade _(P2)_
- M5.3 ROI _(P2)_

### M6 — Governança e Observabilidade

- M6.1 Health / Status
- M6.2 Auditoria (stats/logs)
- M6.3 Cache / Rate limit (admin)

---

## 3) Matriz — MVP (P0)

| ID        | Módulo | Pergunta/Objetivo            | KPIs                                       | Datasets (IDs)        | View (TD_VIEW) | Filtros/ABAC        | Perfil mínimo  | Classificação / Export   | Cache TTL | DoD (aceite)                           |
| --------- | ------ | ---------------------------- | ------------------------------------------ | --------------------- | -------------- | ------------------- | -------------- | ------------------------ | --------: | -------------------------------------- |
| TD_AN_001 | M0.1   | “Como está o cenário agora?” | casos (período), variação WoW, risco médio | TD_DS_002, TD_DS_004  | TD_VIEW_001    | STATE/URS/MUNICIPIO | ESTRATÉGICO    | restricted / aggregated  |    30–60m | cards consistentes com filtros         |
| TD_AN_010 | M1.1   | Ranking Top N                | casos, incidencia_100k                     | TD_DS_002 + TD_DS_003 | TD_VIEW_010    | STATE/URS/MUNICIPIO | TÁTICO         | restricted / aggregated  |       60m | incidência calculada quando necessário |
| TD_AN_020 | M2.1   | Dashboard de risco           | risk_score, risk_level                     | TD_DS_004             | TD_VIEW_020    | STATE/URS           | ESTRATÉGICO    | restricted / aggregated  |    30–60m | thresholds documentados                |
| TD_AN_030 | M3.1   | Clima atual/forecast         | temp, chuva, umidade                       | TD_DS_006             | TD_VIEW_030    | MUNICIPIO           | OPERACIONAL    | public/restricted / none |    15–30m | mapeamento cidade→IBGE quando possível |
| TD_AN_050 | M6.1   | Status do sistema            | ok/latência/uptime                         | TD_DS_007             | TD_VIEW_050    | —                   | APOIO_INDIRETO | none                     |      1–5m | health BFF + provedor                  |

---

## 4) Evolução (P1 / P2)

- P1: mapas avançados, séries operacionais, priorização multi-critério, painéis admin de cache.
- P2: análises on-demand, inferência causal, ROI (com governança forte).

---

## 5) Checklist de fechamento (DoD)

- [ ] cada análise P0 tem KPI, dataset, view, perfil mínimo, ABAC e export policy
- [ ] P0/P1/P2 priorizados
- [ ] regras de alerta e score compostos versionadas

# Matriz de Análises — TechDados

Este documento é a “lista mestra” do que o TechDados pode entregar a partir dos dados disponíveis (upstream + internos).
Ele serve para:

- priorização do MVP
- desenho de módulos e submódulos
- definição de RBAC por análise
- criação de backlog (cards/tarefas) com IDs e critérios de aceite

## 0. Como ler esta matriz

Cada análise tem:

- **ID** (ex.: `EPI-001`) — vira o “código” do card no backlog
- **Módulo** — onde aparece na navegação
- **Pergunta** — qual decisão ela suporta
- **Dataset/Endpoint** — origem principal
- **Métricas** — o que é calculado/mostrado
- **Dimensões** — eixos de corte (tempo, território, etc.)
- **Visual** — tipo de gráfico/visão
- **RBAC** — perfis que podem ver/exportar

> **Nota:** algumas análises dependem de enriquecimento/normalização no BFF (DTO estável, incidência por 100k, etc.).

---

## 1) Mapa de Data Products (inventário rápido)

| Data Product          | Endpoint                   | Domínio       | Observação                                    |
| --------------------- | -------------------------- | ------------- | --------------------------------------------- |
| Saúde — dengue        | `/dengue`                  | Epidemiologia | base para incidência/ranking/curvas           |
| Dimensão — municípios | `/municipios`              | Dimensões     | filtros, buscas, joins                        |
| Operação — atividades | `/facts`                   | Operação      | POIs, hectares, produtividade (campos variam) |
| Clima — cidade        | `/api/v1/weather/{cidade}` | Clima         | inclui índice favorabilidade                  |
| Risco — IA            | `/api/v1/risk/*`           | Risco         | recomendações e confiança                     |
| Dataset BI            | `/gold`                    | Exportação    | extrações para Power BI                       |
| Auditoria upstream    | `/api/v1/audit/*`          | Auditoria     | visão de acessos e stats                      |

---

## 2) MVP — o que entregar primeiro (P0)

### P0.1 Dashboard “Visão Geral”

- KPIs executivos (casos, incidência média, municípios críticos, hectares mapeados, POIs totais, produtividade)
- alertas (risco IA, clima favorável, crescimento anômalo)
- top 10 municípios por incidência e por crescimento

### P0.2 Epidemiologia (mínimo)

- série temporal (por mês/semana se houver)
- ranking por incidência
- comparação ano a ano (2024 vs 2025)

### P0.3 Operação (mínimo)

- total de atividades e hectares mapeados
- POIs totais e por categoria
- produtividade (POIs/ha) por município

### P0.4 Clima (mínimo)

- índice de favorabilidade por cidade
- top cidades com maior favorabilidade + risco climático

### P0.5 Risco (mínimo)

- dashboard consolidado (regional)
- risco por município + recomendações

---

## 3) Catálogo de análises (IDs)

> Convenção:  
> `EPI-*` epidemiologia | `OPS-*` operação | `CLI-*` clima | `RSK-*` risco | `EXP-*` exportação | `GOV-*` governança/auditoria

### 3.1 Epidemiologia (EPI)

| ID      | Análise                        | Pergunta                  | Dataset               | Métricas        | Visual       | RBAC                           |
| ------- | ------------------------------ | ------------------------- | --------------------- | --------------- | ------------ | ------------------------------ |
| EPI-001 | Ranking por incidência         | Onde está pior?           | /dengue               | incidência_100k | tabela + bar | strategic,tactical,operational |
| EPI-002 | Ranking por casos totais       | Onde há mais volume?      | /dengue               | total           | tabela       | strategic,tactical             |
| EPI-003 | Curva temporal (UF/Região)     | Como evolui no tempo?     | /dengue               | total por tempo | line         | strategic,tactical,operational |
| EPI-004 | Curva por município            | Qual o pico/local?        | /dengue + /municipios | total/tempo     | line         | tactical,operational           |
| EPI-005 | Comparativo ano a ano          | Melhorou ou piorou?       | /dengue               | variação %      | bar + table  | strategic,tactical             |
| EPI-006 | Detecção de anomalia (simples) | Há subida fora do padrão? | /dengue               | z-score / delta | line + badge | strategic,tactical             |
| EPI-007 | Top crescimento (MoM/YoY)      | Onde acelerou mais?       | /dengue               | delta abs/rel   | table        | strategic,tactical             |
| EPI-008 | “Municipios críticos” (score)  | Onde priorizar?           | /dengue + clima + ops | score composto  | table        | tactical                       |
| EPI-009 | Casos vs risco IA              | Risco explica casos?      | /dengue + /risk       | correlação      | scatter      | strategic,tactical             |
| EPI-010 | Casos vs favorabilidade        | Clima explica casos?      | /dengue + /weather    | correlação      | scatter      | strategic,tactical             |

**Notas de implementação (EPI)**

- Se /dengue não entregar incidência por 100k, calcular no BFF usando população (quando disponível) ou marcar como “pendente”.
- Priorizar “dados simultâneos” para respeitar sazonalidade.

### 3.2 Operação (OPS)

| ID      | Análise                           | Pergunta                     | Dataset              | Métricas           | Visual       | RBAC                 |
| ------- | --------------------------------- | ---------------------------- | -------------------- | ------------------ | ------------ | -------------------- |
| OPS-001 | Atividades por período            | Quantas ações foram feitas?  | /facts               | qtd_atividades     | line/bar     | tactical,operational |
| OPS-002 | Hectares mapeados (tempo)         | Qual a cobertura no tempo?   | /facts               | ha_mapeados        | line         | tactical             |
| OPS-003 | Cobertura por município           | Quem recebeu mais cobertura? | /facts + /municipios | ha_mapeados        | table        | tactical,operational |
| OPS-004 | POIs por categoria                | Quais criadouros predominam? | /facts               | pois_por_categoria | bar          | tactical,operational |
| OPS-005 | POIs totais                       | Quantos POIs?                | /facts               | pois_total         | KPI          | tactical,operational |
| OPS-006 | Produtividade (POIs/ha)           | Eficiência do mapeamento     | /facts               | pois_total/ha      | table        | tactical,operational |
| OPS-007 | Devolutivas (taxa)                | A operação virou ação?       | /facts               | devolutivas/pois   | gauge        | tactical             |
| OPS-008 | Mapa de calor (quando houver geo) | Onde estão os POIs?          | /facts (geo)         | densidade          | map          | tactical             |
| OPS-009 | Operação vs casos                 | A ação reduz casos?          | /facts + /dengue     | corr/lag           | line/scatter | strategic,tactical   |

**Notas (OPS)**

- /facts pode ter variação de schema. O BFF deve mapear para um DTO mínimo:
  `activity_id, codigo_ibge, data, ha_mapeados, pois_total, pois_por_categoria, devolutivas_total, status`.
- Onde não houver dado, o frontend mostra “não disponível” com tooltip.

### 3.3 Clima (CLI)

| ID      | Análise                   | Pergunta                      | Dataset                       | Métricas              | Visual  | RBAC                           |
| ------- | ------------------------- | ----------------------------- | ----------------------------- | --------------------- | ------- | ------------------------------ |
| CLI-001 | Favorabilidade por cidade | Onde o clima favorece dengue? | /api/v1/weather               | indice_favorabilidade | table   | strategic,tactical,operational |
| CLI-002 | Top cidades favoráveis    | Onde monitorar mais?          | /api/v1/weather               | top N                 | bar     | strategic,tactical             |
| CLI-003 | Risco climático (cidade)  | Qual risco baseado no clima?  | /api/v1/weather/{cidade}/risk | risco                 | badge   | tactical,operational           |
| CLI-004 | Favorabilidade x casos    | Clima está correlacionado?    | /weather + /dengue            | correlação            | scatter | strategic,tactical             |

### 3.4 Risco (IA) (RSK)

| ID      | Análise                     | Pergunta                 | Dataset                       | Métricas          | Visual        | RBAC                           |
| ------- | --------------------------- | ------------------------ | ----------------------------- | ----------------- | ------------- | ------------------------------ |
| RSK-001 | Dashboard regional de risco | Onde está em alerta?     | /api/v1/risk/dashboard        | risco agregado    | cards + table | strategic,tactical,operational |
| RSK-002 | Risco por município         | Qual o risco local?      | /api/v1/risk/municipio/{ibge} | risco             | detail page   | tactical,operational           |
| RSK-003 | Recomendação de ações       | O que fazer agora?       | /risk/\*                      | recomendações     | list          | tactical,operational           |
| RSK-004 | Auditoria de modelo         | Qual modelo e confiança? | /risk/\*                      | confianca, modelo | badge         | strategic,tactical             |

### 3.5 Exportação (EXP)

| ID      | Export                    | Pergunta           | Dataset | Saída       | RBAC               |
| ------- | ------------------------- | ------------------ | ------- | ----------- | ------------------ |
| EXP-001 | Export dengue (CSV)       | Levar para BI?     | /dengue | csv         | strategic,tactical |
| EXP-002 | Export facts (CSV)        | Report operacional | /facts  | csv         | tactical           |
| EXP-003 | Export gold (CSV/Parquet) | Dataset completo   | /gold   | csv/parquet | admin,strategic    |
| EXP-004 | Export trilha (auditoria) | Evidências LGPD    | /audit  | csv         | audit,admin        |

### 3.6 Governança / Auditoria (GOV)

| ID      | Análise                 | Pergunta            | Dataset             | Visual | RBAC        |
| ------- | ----------------------- | ------------------- | ------------------- | ------ | ----------- |
| GOV-001 | Acessos por usuário     | Quem acessou o quê? | /api/v1/audit/logs  | table  | audit,admin |
| GOV-002 | Stats de auditoria      | Volume de acessos   | /api/v1/audit/stats | KPI    | audit,admin |
| GOV-003 | Exportações registradas | Quem exportou?      | interno (BFF)       | table  | audit,admin |

---

## 4) Backlog sugerido por sprints (macro)

### Sprint 1 (MVP: P0)

- Visão geral (cards + top rankings)
- Epidemiologia: EPI-001, EPI-003, EPI-005
- Clima: CLI-001
- Risco: RSK-001
- Operação: OPS-001, OPS-006 (se /facts já disponível)

### Sprint 2

- Drill-down municipal (EPI-004, RSK-002, OPS-003)
- Export básico (EXP-001, EXP-002)
- Auditoria mínima no BFF (GOV-003)

### Sprint 3

- Comparativos avançados, correlações e priorização (EPI-008, OPS-009, CLI-004)
- Gold export (EXP-003) com trilha
- UX polish e performance

---

## 5) Critérios de qualidade (pré-release)

1. **Consistência**: DTOs estáveis mesmo com mudança upstream
2. **RBAC**: nenhum usuário consegue “burlar” escopo via querystring
3. **Observabilidade**: logs de requisições e auditoria de export
4. **Performance**: cache e paginação em todas as tabelas grandes
5. **Confiabilidade**: handling de rate limit (429) com retries/backoff no BFF

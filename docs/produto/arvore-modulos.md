# Árvore de Módulos — TechDados

Este documento transforma o “catálogo de módulos” (docs/produto/modulos.yaml) em uma visão editorial para:

- UX / navegação
- RBAC aplicado ao produto
- backlog por módulos e entregas por sprint

## 1. Princípios

1. **Produto orientado a decisões:** cada módulo deve responder perguntas claras (ex.: “onde está pior?”, “onde agir primeiro?”).
2. **Filtros universais:** território (UF/município/região), tempo, status de execução, contratante (quando fizer sentido).
3. **RBAC + Escopo territorial:** não é só “o que o usuário pode ver”, é “de qual território ele pode ver”.
4. **Exportação como capability:** exportar é um “poder” (governado por perfil e classificação de dado).

## 2. Árvore de módulos

### 2.1 Visão geral

- **Visão geral (/)**
  - KPIs executivos (P0)
  - Alertas e anomalias (P1)
  - “Mapa mental” do que está acontecendo (P1)

### 2.2 Epidemiologia (/epi)

- Resumo (/epi/overview)
- Séries temporais (/epi/series)
- Rankings (/epi/rankings)
- Comparações (/epi/comparisons)
- Exportações (/epi/export)

### 2.3 Operação (/ops)

- Resumo (/ops/overview)
- Cobertura (/ops/coverage)
- POIs (/ops/pois)
- Produtividade (/ops/productivity)
- Exportações (/ops/export)

### 2.4 Clima (/clima)

- Clima atual + índice de favorabilidade
- Risco climático por cidade
- Integração com decisões (ex.: “dias de maior risco”)

### 2.5 Risco (IA) (/risco)

- Dashboard regional consolidado
- Detalhe por município (com recomendação)
- Histórico de decisões / justificativas (P2)

### 2.6 ETL / Qualidade (/etl)

- Catálogo de pipelines e jobs
- Qualidade de dados (completude, duplicidade, atraso)
- Erros e incidentes

### 2.7 Auditoria (/audit)

- Acessos por usuário/tenant
- Exportações (quem, o quê, quando, escopo)
- Evidências LGPD (P2)

### 2.8 Admin (/admin)

- Tenants / configurações
- Roles e escopos (território)
- Chaves e integrações

## 3. Padrão de páginas (layout)

Para todos os módulos:

- **Header** com breadcrumb + filtros globais
- **Cards** de KPIs principais
- **Gráficos** (line, bar, map quando disponível)
- **Tabela** com drill-down
- **Export** (CSV/Parquet) quando permitido

## 4. Definição de “pronto” (DoD) por módulo

Um módulo é considerado “entregue” quando possui:

1. filtros funcionando (com escopo territorial aplicado)
2. pelo menos 1 visão executiva e 1 visão operacional
3. logs/auditoria de acesso/consulta
4. exportação (se aplicável) respeitando RBAC

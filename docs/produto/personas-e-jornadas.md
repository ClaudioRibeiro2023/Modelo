# Personas e Jornadas — TechDados

**Versão:** v1.0  
**Objetivo:** definir públicos, necessidades, decisões e jornadas do TechDados, servindo como base para:

- Matriz de análises (`docs/produto/matriz-analises.md`)
- Árvore de módulos (`docs/produto/arvore-modulos.md`)
- RBAC/ABAC (`docs/seguranca/rbac.md`)
- Contratos do BFF e política de exportação (`docs/contratos-integracao/*`)

---

## 1) Contexto: para quem o TechDados existe

O TechDados é um produto de **análise e governança** que transforma dados do ecossistema Techdengue em:

- **Decisões** (priorização e estratégia)
- **Acompanhamento** (execução operacional)
- **Evidência** (transparência e prestação de contas)
- **Governança** (controle de acesso, exportação e auditoria)

Seu uso é condicionado por:

- **Hierarquia de acesso** (perfis de usuário)
- **Escopo territorial** (estado/URS/consórcio/município/área/rota)
- **Classificação do dado** (public/restricted/sensitive)
- **Política de exportação** (aggregated/deidentified/full_controlled)
- **Auditoria** (rastreabilidade de ações e extrações)

---

## 2) Modelo de segmentação de usuários (macro)

O TechDados organiza os usuários em 4 macrogrupos (com subperfis), alinhados ao documento normativo do Techdengue:

1. **Estratégico**
   - Decisão em nível macro (SES/gestão executiva/alta direção)
2. **Tático**
   - Coordenação regional/consórcios e gestão de execução
3. **Operacional**
   - Execução municipal e operação de campo/serviço
4. **Apoio, Auditoria e Suporte**
   - Acesso controlado para suporte, fiscalização e verificação

---

## 3) Personas detalhadas

> **Nota:** as personas aqui descrevem o “uso real”.  
> A implementação de permissões deve ser feita em `docs/seguranca/rbac.md` e na matriz Perfis x Ações.

### P1 — Gestor Estratégico (SES / Direção)

**Objetivo:** direcionar políticas, priorizar alocação de recursos e avaliar impacto.  
**Escopo territorial típico:** Estado inteiro, macro-regiões, URS, consórcios.  
**Nível de detalhe recomendado:** agregado e padronizado (evitar sensível).  
**Ações-chave:**

- Acompanhar **tendência** e **ranking** de incidência (por SE)
- Comparar territórios (URS/consórcios/municípios) com métricas padronizadas
- Avaliar correlação entre esforço operacional (atividades/ha/POIs) e indicadores epidemiológicos
- Gerar relatórios executivos e séries históricas agregadas

**Perguntas que precisa responder (exemplos):**

- Onde a situação está piorando nas últimas 4–8 semanas epidemiológicas?
- Quais URS/territórios estão fora do padrão e por quê?
- Onde o esforço operacional está alto/baixo versus impacto?
- Onde priorizar recursos no próximo ciclo?

**Views típicas:**

- Painel executivo (KPIs + alertas)
- Tendência SE (estado e ranking territorial)
- Comparativos (URS/consórcios)
- Relatórios agregados (PDF/CSV agregado)

**Restrições:**

- Exportação normalmente **aggregated**.
- Sem acesso a endereços/coordenadas detalhadas (sensitive).

---

### P2 — Coordenador Tático Regional (URS / Consórcio)

**Objetivo:** monitorar execução, performance operacional e priorização regional.  
**Escopo territorial típico:** uma URS, conjunto de municípios, consórcio.  
**Nível de detalhe:** mix de agregado + detalhamento operacional controlado.  
**Ações-chave:**

- Identificar gargalos de execução (atrasos, baixa cobertura, baixa produtividade)
- Priorizar municípios/bairros/áreas conforme risco e evidências
- Comparar municípios da mesma região para equalizar performance
- Monitorar indicadores de qualidade e consistência

**Perguntas:**

- Quais municípios estão com pior tendência e menor cobertura?
- Quais equipes/operadores estão com performance abaixo do esperado?
- Quais áreas devem ser priorizadas nos próximos 7–14 dias?
- Há inconsistência entre o que foi feito e o que foi reportado?

**Views típicas:**

- “Mapa da região” (com agregações e clusters)
- Performance operacional (atividades, produtividade, devolutivas)
- Funil de execução (planejado → executado → evidenciado)
- Exportação controlada (agregada e, quando aplicável, anonimizada)

**Restrições:**

- Acesso limitado ao escopo regional.
- Exportação sensível bloqueada por padrão.

---

### P3 — Gestor Municipal (Saúde / Vigilância)

**Objetivo:** decidir ações de curto prazo no território municipal, responder a surtos e planejar execução.  
**Escopo territorial típico:** município.  
**Nível de detalhe:** operacional mais detalhado dentro do município.  
**Ações-chave:**

- Acompanhar incidência e risco local (por bairro/área quando permitido)
- Acompanhar atividades realizadas e pendências
- Identificar hotspots e priorizar bairros/rotas
- Produzir relatórios para gestão local

**Perguntas:**

- Quais bairros/áreas estão concentrando mais risco e/ou casos?
- Quais atividades foram realizadas e quais ainda faltam?
- Onde há reincidência (área remapeada com novos focos)?
- Como comprovar execução/resultado para prestação de contas local?

**Views típicas:**

- Painel municipal (série SE + mapa)
- Execução e cobertura (ha/atividades/POIs)
- Devolutivas e evidências (sem sensíveis quando não necessário)
- Export local (agregado; detalhado apenas se permitido)

**Restrições:**

- Sem acesso fora do município.
- Dados sensíveis sob estrita regra, preferencialmente anonimizados.

---

### P4 — Operacional de Campo / Execução (Coordenação Operacional)

**Objetivo:** executar e registrar atividades, garantir qualidade, comprovar entregas.  
**Escopo:** rota/área/atividade.  
**Nível de detalhe:** alto no microescopo, baixo fora dele.  
**Ações-chave:**

- Visualizar “o que fazer hoje” (lista/rotas/áreas)
- Registrar execução e pendências
- Consultar evidências e devolutivas
- Validar qualidade mínima (checklists)

**Perguntas:**

- Onde devo atuar agora?
- O que já foi feito nesta área?
- Há reincidência / retorno de focos?
- Como registrar evidência com consistência?

**Views típicas:**

- Lista de atividades (status, prioridade)
- Mapa operacional (camadas necessárias)
- Checklists e validações
- Export normalmente bloqueado (ou muito restrito)

---

### P5 — Analista de Dados / BI (Interno TechDados/Techdengue)

**Objetivo:** garantir qualidade, consistência e capacidade analítica; construir relatórios/insights.  
**Escopo:** amplo, com preferência por agregação/anonimização.  
**Nível de detalhe:** depende da tarefa, mas com governança rígida.  
**Ações-chave:**

- Criar e validar métricas, KPIs e modelos
- Analisar performance e gerar relatórios estratégicos
- Detectar inconsistências e outliers
- Operar “camada gold” para BI e análises profundas (quando previsto)

**Perguntas:**

- Os dados estão coerentes (tempos, chaves, nulidade)?
- KPIs estão sendo calculados da mesma forma em todas as telas?
- Há padrões regionais que explicam variações?
- Quais análises devem virar produto (view) e quais devem ficar internas?

**Views típicas:**

- Data Quality
- Catálogo de datasets / dicionário de campos
- Painéis avançados (exploratórios)
- Export com rastreabilidade (quando autorizado)

---

### P6 — Auditoria / Controle / Fiscalização

**Objetivo:** verificar conformidade, rastreabilidade e integridade das entregas/dados.  
**Escopo:** variado, conforme credencial e necessidade formal.  
**Ações-chave:**

- Consultar logs de auditoria
- Validar integridade de relatórios e versões
- Verificar exportações e acessos
- Analisar coerência entre execução e indicadores agregados

**Restrições:**

- Sem edição de dados primários.
- Acesso sensível somente com processo formal.

---

### P7 — Suporte / Helpdesk

**Objetivo:** auxiliar usuários e resolver problemas sem acessar informação sensível desnecessária.  
**Ações-chave:**

- Diagnóstico de erro/fluxo
- Acesso “impersonate” controlado (quando existir) para reproduzir problemas
- Sem exportação completa; sem edição epidemiológica

---

## 4) Jornadas (fluxos de uso) — padrão por perfil

> Cada jornada abaixo deve virar:
>
> - telas/módulos (árvore)
> - requisitos de filtro
> - requisitos de export
> - eventos de auditoria

### Jornada J1 — “Panorama e tendência” (Estratégico/Tático)

**Entrada:** período (últimas 4–8 SE), território (estado/URS/consórcio)  
**Saídas:** KPIs + tendência + ranking + alertas  
**Decisão:** priorizar recursos, ações e comunicação

**Mínimo necessário (dados):**

- dengue semanal / SE
- população (padronização por 100k)
- recortes territoriais

---

### Jornada J2 — “Execução e performance” (Tático/Operacional)

**Entrada:** período, território, status da atividade  
**Saídas:** atividades executadas/pendentes, produtividade, cobertura, qualidade  
**Decisão:** corrigir gargalos, replanejar execução, cobrar evidências

**Mínimo necessário (dados):**

- atividades (status, data, ha, equipe/operador)
- devolutivas e indicadores de qualidade
- (quando existir) POIs/ha e métricas de campo

---

### Jornada J3 — “Priorizar onde agir” (Municipal/Tático)

**Entrada:** município/região, camada de risco, hotspots  
**Saídas:** mapa + lista priorizada (áreas/bairros/rotas)  
**Decisão:** priorizar o próximo ciclo de ação

**Mínimo necessário (dados):**

- risco/clima (quando habilitado)
- dengue por SE (tendência)
- hotspots/clusters (geo agregado)
- atividades anteriores (histórico)

---

### Jornada J4 — “Prestação de contas” (Estratégico/Municipal/Auditoria)

**Entrada:** período e território  
**Saídas:** relatório PDF + export agregado + logs  
**Decisão:** demonstrar resultados, justificar investimentos, conformidade

**Mínimo necessário (dados):**

- KPIs agregados
- logs de auditoria de exportação
- contexto de execução (atividades)

---

### Jornada J5 — “Qualidade e consistência” (BI/Suporte/Auditoria)

**Entrada:** dataset e janela temporal  
**Saídas:** alertas de inconsistência, outliers, gaps, atrasos, schema mismatch  
**Decisão:** corrigir pipeline, ajustar contrato, bloquear view problemática

**Mínimo necessário (dados):**

- schemas (contrato fino)
- health do provedor
- trilhas de auditoria
- validações definidas

---

## 5) Requisitos transversais por persona

### 5.1 Filtros globais (base comum)

- Tempo: ano, mês, semana epidemiológica, range custom
- Território: UF → URS → consórcio → município → (área/rota quando aplicável)
- Contratante/cliente (quando aplicável)
- Status operacional (planejado/em execução/finalizado)
- Tipo de atividade / tipo de ponto/POI (se existir no dataset)

### 5.2 Exportação e governança

- Estratégico: **aggregated** por padrão
- Tático: aggregated + deidentified (caso permitido)
- Operacional: export restrito ou bloqueado
- Auditoria: acesso a logs e relatórios, com regra formal para sensível

### 5.3 Auditoria mínima (eventos)

- login/logout
- mudança de filtro territorial
- consulta a dados restritos
- export (qualquer nível)
- ações administrativas

---

## 6) Saídas esperadas deste documento (como usar)

Este documento deve ser usado como entrada para:

1. `docs/produto/perguntas-de-negocio.md`
   - transformar necessidades em perguntas priorizadas

2. `docs/produto/matriz-analises.md`
   - mapear cada análise/view com RBAC, data_class, escopo e critérios de aceite

3. `docs/produto/arvore-modulos.md`
   - construir a árvore de navegação e módulos do app

4. Implementação (web + bff)
   - guardas de rota e escopo territorial
   - mascaramento/aggregation e export_policy

---

## Próximo arquivo a ser gerado

**Arquivo 03:** `docs/produto/perguntas-de-negocio.md`

> Lista priorizada (P0/P1/P2) das perguntas que o TechDados deve responder, derivadas das jornadas e já sugerindo KPIs e datasets.

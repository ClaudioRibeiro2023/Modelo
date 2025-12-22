# TechDados — Portal de Documentação (Source of Truth)

> **Este arquivo é o portal canônico do projeto TechDados.**  
> Tudo que for documentação deve estar em `docs/` e ser linkado a partir daqui.

---

## Visão geral

**TechDados** é a aplicação de análise, monitoramento e governança de dados do ecossistema **Techdengue**, com foco em:

- **Epidemiologia:** séries temporais, tendência, ranking, comparativos e indicadores padronizados.
- **Operação:** atividades, produtividade, cobertura, qualidade operacional, devolutivas e evidências.
- **Geo & priorização:** visão territorial (UF/URS/consórcios/municípios), hotspots, mapas e clusters.
- **Risco & clima:** camadas meteorológicas e risco (quando habilitado).
- **Governança:** RBAC/ABAC, classificação de dados, exportação controlada, auditoria e rastreabilidade.

O TechDados foi iniciado a partir do template **modelo** e já possui como alicerce:

- Monorepo **pnpm**.
- Frontend **React 18 + Vite + TailwindCSS**.
- Backend **FastAPI** (candidato natural a **BFF** do TechDados).
- Integração com **Keycloak** (Auth/RBAC/Claims).

---

## Regras de governança de documentação

1. **Não criar `.md` temporário fora de `docs/`.**
2. Alterações relevantes devem ser registradas em:
   - `docs/00-auditoria/LOG_DE_LIMPEZA.md`
   - `docs/00-auditoria/VALIDACAO_FINAL.md`
3. Conteúdos substituídos devem ir para:
   - `docs/_archive/YYYY-MM-DD/`
4. **ADRs canônicos** ficam em:
   - `docs/adr_v2/`
5. Documentos “stubs” (ex.: `ARCHITECTURE.md`) devem apenas **apontar** para os canônicos.

---

## 🎯 Guia Mestre MVP

> **Documento principal para execução do MVP TechDados**

- **Guia Mestre de Implementação:** [`docs/_backlog/GUIA_MESTRE_MVP.md`](_backlog/GUIA_MESTRE_MVP.md)

---

## Onde começar

- **Setup local:** `docs/operacao/setup-local.md`
- **Variáveis de ambiente:** `docs/operacao/variaveis-ambiente.md`
- **Troubleshooting:** `docs/operacao/troubleshooting.md`
- **RBAC & Segurança (canônico):** `docs/seguranca/rbac.md`
- **Contrato placeholder da API de dados:** `docs/contratos-integracao/api-dados.md`

---

## Índice por área (canônico)

### Projeto

- `docs/projeto/CONTEXT_PACK.md`
- `docs/projeto/ONBOARDING_RAPIDO.md`
- `docs/projeto/DECISOES_E_CONVICOES.md`

### Arquitetura

- C4
  - `docs/arquitetura/c4-context.md`
  - `docs/arquitetura/c4-container.md`
  - `docs/arquitetura/c4-component.md`
- Mapa do repositório
  - `docs/arquitetura/mapa-repo.md`
- BFF (documentos de referência)
  - `docs/arquitetura/bff-arquitetura-e-modulos.md`
  - `docs/arquitetura/trilha-b-bff-skeleton.md`

### Operação (execução)

- Setup / ambiente
  - `docs/operacao/setup-local.md`
  - `docs/operacao/variaveis-ambiente.md`
- Runbook / deploy
  - `docs/operacao/runbook.md`
  - `docs/operacao/deploy.md`
- Testes / smoke
  - `docs/operacao/testes.md`
  - `docs/operacao/bff-smoke.md`
  - `docs/operacao/smoke_e2e_p0.md`
  - `docs/operacao/e2e-auth-keycloak-local.md`
- Trilha B (checklist)
  - `docs/operacao/trilha-b-bff-checklist.md`

### Segurança

- RBAC
  - `docs/seguranca/rbac.md`
  - `docs/seguranca/rbac_policies_bff.md`
- Escopo territorial / hierarquia
  - `docs/seguranca/hierarquia-acessos.md`
  - `docs/seguranca/hierarquia-acessos-resumo.md`
- Exportação / hardening
  - `docs/seguranca/politica-exportacao.md`
  - `docs/seguranca/headers-seguranca.md`
- Referências normativas
  - `docs/seguranca/_refs/README.md`
  - `docs/seguranca/_refs/Hierarquia_de_acessos_Sistema_Techdengue_v1.0.pdf`

### Contratos de integração

- Base (template)
  - `docs/contratos-integracao/auth.md`
  - `docs/contratos-integracao/openapi.md`
  - `docs/contratos-integracao/api.md`
- Upstream (Techdengue)
  - `docs/contratos-integracao/upstream-techdengue-api.md`
  - `docs/contratos-integracao/api-dados-upstream-mapeamento.md`
- BFF (TechDados)
  - `docs/contratos-integracao/bff-techdados.md`
  - `docs/contratos-integracao/bff-contratos-e-rotas.md`
  - `docs/contratos-integracao/bff-me.md`
  - `docs/contratos-integracao/nav-endpoint.md`
  - `docs/contratos-integracao/export-filter-contract.md`
  - `docs/contratos-integracao/claims-roles-scopes.md`
  - `docs/contratos-integracao/keycloak-seed.md`
  - `docs/contratos-integracao/frontend-oidc.md`

### Produto

- `docs/produto/matriz-analises.md`
- `docs/produto/arvore-modulos.md`
- `docs/produto/navegacao-por-perfil.md`
- `docs/produto/matriz-perfis-modulos.md`
- `docs/produto/design-system.md`
- `docs/produto/modulos.yaml`
- `docs/produto/personas-e-jornadas.md`
- `docs/produto/template-analise.md`

### Dados

- `docs/dados/INDEX.md`
- `docs/dados/catalogo-datasets.md`
- `docs/dados/dicionario-campos.md`
- `docs/dados/dicionario-dimensoes.md`
- `docs/dados/dicionario-metricas.md`
- `docs/dados/modelo-dimensional.md`
- `docs/dados/data-quality.md`

### Governança

- `docs/governanca/processo-mudanca.md`
- `docs/governanca/versionamento.md`

### Auditoria

- `docs/00-auditoria/INVENTARIO_DOCS.md`
- `docs/00-auditoria/LOG_DE_LIMPEZA.md`
- `docs/00-auditoria/VALIDACAO_FINAL.md`
- `docs/00-auditoria/RELATORIO_AJUSTES_DOCS.md` (a criar)

### Backlog

- `docs/_backlog/README.md`
- `docs/_backlog/GUIA_MESTRE_MVP.md`
- `docs/_backlog/todo.md`
- `docs/_backlog/UI_UX_IMPROVEMENTS.md`

---

## Status do projeto

### Fundação (Fase 1) — ✅ concluída

- Rebranding aplicado (TechDados)
- Docs canônicas preservadas
- RBAC atualizado com premissas TechDados
- Placeholder de contrato de API criado
- Validações: `pnpm install`, `pnpm lint`, `pnpm typecheck` ✅

Registros:

- Auditoria: `docs/00-auditoria/LOG_DE_LIMPEZA.md`
- Validação: `docs/00-auditoria/VALIDACAO_FINAL.md`

---

## Roadmap de construção (Índice estrutural v1.1)

> Esta é a árvore de construção do TechDados — **passo a passo**.  
> Ela será refinada conforme novas decisões (ADR) forem aprovadas.

### 0) Regras e convenções

- Auditoria e rastreabilidade
  - `docs/00-auditoria/LOG_DE_LIMPEZA.md`
  - `docs/00-auditoria/VALIDACAO_FINAL.md`
- Convenções operacionais
  - `docs/operacao/convencoes.md` (se existir, manter como referência)
  - `docs/operacao/setup-local.md`
  - `docs/operacao/variaveis-ambiente.md`

### 1) Fundação (já concluída)

- Mantida como registro e baseline
  - `docs/00-auditoria/*`

### 2) Arquitetura-alvo e decisões

- C4 (Context/Container/Component)
  - `docs/arquitetura/c4-context.md`
  - `docs/arquitetura/c4-container.md`
  - `docs/arquitetura/c4-component.md`
- ADRs (decisões do TechDados)
  - `docs/adr_v2/README.md`
  - `docs/adr_v2/` (novos ADRs do TechDados serão adicionados aqui)

> **Observação:** o TechDados deve formalizar ADR próprio para:
>
> - BFF obrigatório (FastAPI)
> - Estratégia de integração com o provedor de dados (API Techdengue)
> - Padrões de cache, exportação, auditoria e mascaramento

### 3) Segurança e Governança (RBAC/ABAC)

- RBAC canônico
  - `docs/seguranca/rbac.md`
- Headers e hardening (se aplicável)
  - `docs/seguranca/headers-seguranca.md`

> Referência normativa obrigatória (Techdengue):
>
> - “Hierarquia de acessos – Sistema Techdengue (v1.0)”  
>   Localização: `docs/seguranca/_refs/` (ver README para instruções)

### 4) Contratos de integração (dados / auth / openapi)

- Contrato placeholder do provedor de dados
  - `docs/contratos-integracao/api-dados.md`
- Contratos de autenticação e OpenAPI (base do template)
  - `docs/contratos-integracao/auth.md`
  - `docs/contratos-integracao/openapi.md`
  - `docs/contratos-integracao/api.md`

> Diretriz: todo endpoint do BFF deve declarar:
>
> - `data_class`: public | restricted | sensitive
> - `territorial_scope`: state | urs | consorcio | municipio | area | rota
> - `export_policy`: aggregated | deidentified | full_controlled
> - auditoria: eventos mínimos por operação

### 5) Contrato de dados fino (catálogo + schemas + KPIs)

> **Esta seção será criada na Fase 2.**  
> Sem isso, o projeto vira retrabalho por divergência de definições.

- Catálogo de datasets (o que existe e como acessar)
  - `docs/dados/catalogo-datasets.md`
- Dicionário de campos + normalização (IBGE, datas, chaves, nomes)
  - `docs/dados/dicionario-campos.md`
- Dicionário de dimensões
  - `docs/dados/dicionario-dimensoes.md`
- Dicionário de métricas
  - `docs/dados/dicionario-metricas.md`
- Qualidade de dados
  - `docs/dados/data-quality.md`
- Modelo dimensional
  - `docs/dados/modelo-dimensional.md`

Pendências desta seção:

- Glossário de KPIs (definição + fórmula + unidade + exemplos): `docs/dados/glossario-kpis.md` (a criar)
- Modelo lógico (dim/fact): `docs/arquitetura/modelo-dados-logico.md` (a criar)

### 6) Planejamento analítico (inventário → RBAC → módulos)

- Matriz mestre das análises (fonte única)
  - `docs/produto/matriz-analises.md`
- Árvores de módulos/submódulos (derivadas da matriz)
  - `docs/produto/arvore-modulos.md`
- NFRs e critérios de aceite (p95, export, auditoria, etc.)
  - `docs/produto/nfrs.md` (a criar)
- Perguntas de negócio e jornadas (por perfil)
  - `docs/produto/perguntas-de-negocio.md` (a criar)
  - `docs/produto/personas-e-jornadas.md`

### 7) Implementação MVP (Web + BFF)

- Autenticação real (Keycloak) + guardas de rota
- Enforcement RBAC/ABAC no BFF
- Módulos MVP:
  - Epidemiologia (SE/tendência/ranking/comparativos)
  - Operações (atividades/produtividade/cobertura/devolutivas)
- Export **agregado** + auditoria mínima
- Observabilidade:
  - health/status do provedor
  - health/status do BFF

### 8) R2 (Geo + Qualidade + Export avançado)

- Mapas/clusters/hotspots
- Data Quality e alertas
- Export anonimizado (quando aplicável)
- E2E nos fluxos críticos

### 9) R3 (Risco/IA + Automação)

- Risco/Clima
- Risk Analyze com governança mínima
- Relatórios PDF por perfil
- Alertas automáticos e auditáveis

### 10) Testes, CI/CD e Go-live

- Book of Tests (contrato, RBAC, export, performance, e2e)
- Hardening e segurança
- Deploy/rollback
- Validação final assinada

---

## Templates (a criar e manter em docs/)

> Estes arquivos serão criados passo a passo para acelerar e padronizar.

- **T1 — Matriz Mestre de Análises:** `docs/produto/matriz-analises.md`
- **T2 — Glossário de KPIs:** `docs/dados/glossario-kpis.md`
- **T3 — Catálogo de datasets:** `docs/dados/catalogo-datasets.md`
- **T4 — Matriz RBAC (Perfis x Ações):** `docs/seguranca/matriz-perfis-acoes.md`
- **T5 — ADR TechDados (v2):** usar `docs/adr_v2/template_v2.md`

---

## Backlog e melhorias contínuas

- Backlog canônico:
  - `docs/_backlog/README.md`
  - `docs/_backlog/UI_UX_IMPROVEMENTS.md`
  - `docs/_backlog/todo.md`

---

## Referências internas úteis

- ADRs base do template:
  - `docs/adr_v2/001-stack-tecnologica.md`
  - `docs/adr_v2/002-arquitetura-modular.md`
  - `docs/adr_v2/003-autenticacao-jwt-rbac.md`
  - `docs/adr_v2/004-auth-jwt-keycloak.md`

---

# TechDados — Context Pack (Memória do Projeto)

## Visão do produto e público

O **TechDados** é a aplicação de análise, monitoramento e governança de dados do ecossistema **Techdengue**, voltada para perfis:

- Gestão (estratégico/tático)
- Operação (operacional)
- Auditoria/controle

Foco do produto:

- Epidemiologia (séries, tendências, rankings)
- Operação (atividades, cobertura, produtividade)
- Risco & clima (quando habilitado)
- Governança (RBAC/ABAC, exportação controlada, auditoria)

## Escopo do MVP (e fora de escopo)

### MVP (P0/P1)

- Web (React/Vite) com navegação por perfil e filtros globais
- BFF (FastAPI) com:
  - autenticação (mock no dev / Keycloak no P2)
  - RBAC + ABAC (escopo territorial)
  - cache por rota
  - auditoria mínima por operação
  - rotas P0 (health/status/ref/municipios/home/epi/risk/weather/export/me/nav)
- Contratos e runbooks mantidos em `docs/` (portal: `docs/INDEX.md`)

### Fora de escopo (neste momento)

- IA avançada (explicabilidade, recomendações completas)
- Pipeline/ETL completo e observabilidade enterprise
- Governança LGPD completa (evidências e automações P2/P3)

## Arquitetura (Web/BFF/Keycloak/Upstream)

Visão resumida:

- **Web**: `apps/web/` (React 18 + Vite)
- **BFF**: `api-template/` (FastAPI)
- **IdP**: Keycloak (OIDC/JWT)
- **Upstream**: API de dados Techdengue (consumida via BFF)

Referências:

- C4: `docs/arquitetura/c4-context.md`, `docs/arquitetura/c4-container.md`, `docs/arquitetura/c4-component.md`
- BFF (estrutura): `docs/arquitetura/bff-arquitetura-e-modulos.md`

## RBAC + escopo territorial + export policy

Regras centrais:

- RBAC determina **o que** o usuário pode acessar.
- ABAC/escopo territorial determina **de qual território** o usuário pode acessar.
- Exportação é capability governada (perfil + política + auditoria).

Links canônicos:

- RBAC: `docs/seguranca/rbac.md`
- Policies BFF: `docs/seguranca/rbac_policies_bff.md`
- Hierarquia de acessos: `docs/seguranca/hierarquia-acessos.md`
- Política de exportação: `docs/seguranca/politica-exportacao.md`

## Contratos principais (links)

- Upstream (Techdengue):
  - `docs/contratos-integracao/upstream-techdengue-api.md`
  - `docs/contratos-integracao/api-dados-upstream-mapeamento.md`
- BFF (TechDados):
  - `docs/contratos-integracao/bff-techdados.md`
  - `docs/contratos-integracao/bff-contratos-e-rotas.md`
  - `docs/contratos-integracao/nav-endpoint.md`
  - `docs/contratos-integracao/bff-me.md`
- Auth / OIDC:
  - `docs/contratos-integracao/auth.md`
  - `docs/contratos-integracao/auth-jwt-keycloak.md`

## Produto: árvore/módulos e matriz de análises

- Matriz: `docs/produto/matriz-analises.md`
- Árvore: `docs/produto/arvore-modulos.md`
- Navegação por perfil: `docs/produto/navegacao-por-perfil.md`

## Convenções de docs e governança

- Portal canônico: `docs/INDEX.md`
- ADRs: `docs/adr_v2/`
- Arquivamento: `docs/_archive/YYYY-MM-DD/` (sempre com `MOTIVO.md` quando houver escolha/substituição)
- Auditoria da documentação: `docs/00-auditoria/`

## Variáveis de ambiente essenciais

Referência canônica:

- `docs/operacao/variaveis-ambiente.md`

Atalhos (mais usados no MVP):

- BFF: `TD_AUTH_MODE`, `TD_PROVIDER_ENABLED`, `TD_PROVIDER_BASE_URL`
- Web: `VITE_*` (Keycloak / demo mode)

## Runbook e smoke tests

- Runbook: `docs/operacao/runbook.md`
- Setup local: `docs/operacao/setup-local.md`
- Smoke (BFF): `docs/operacao/bff-smoke.md`
- Smoke E2E P0: `docs/operacao/smoke_e2e_p0.md`

## Como pedir para um agente executar (mini prompt interno)

Quando solicitar mudanças, inclua:

- objetivo + critério de aceite
- arquivos canônicos a considerar (principalmente `docs/INDEX.md` e docs do domínio)
- restrições (não inventar endpoints upstream; contrato-first)
- comandos de validação esperados (lint/typecheck/smoke)

## Pendências (P1/P2)

- Criar `docs/dados/glossario-kpis.md`
- Criar `docs/arquitetura/modelo-dados-logico.md`
- Criar `docs/produto/nfrs.md` e `docs/produto/perguntas-de-negocio.md`
- Consolidar eventual sobreposição: `docs/contratos-integracao/auth.md` vs `docs/contratos-integracao/auth-jwt-keycloak.md`

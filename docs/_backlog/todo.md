# TechDados — TODO Mestre (Guia de Implementação do MVP)

> Fonte de verdade do projeto: `docs/INDEX.md` (portal).
> Este TODO é o **guia mestre de execução** (sequência, checklists, DoD, validações).
> Padrão do template "modelo": documentação canônica em `docs/`.

---

## 0) Contexto e objetivo (visão macro)

### O que é TechDados

TechDados é a aplicação de **análise e dashboards** para o ecossistema Techdengue, consumindo dados de uma **API Upstream** (Techdengue / API de Dados) e aplicando:

- **RBAC + escopo territorial** (por perfil e por território)
- **Auditoria** de acessos e exportações
- **Exports** seguros (CSV/Parquet, conforme MVP/roadmap)
- **Navegação dinâmica** (o menu reflete permissões do usuário)

### Objetivo do MVP (o "pronto")

Rodar localmente com:

- Login OIDC via Keycloak
- Web com sidebar baseada em `/api/v1/nav`
- BFF (FastAPI) com endpoints MVP reais + RBAC enforced
- Pelo menos **1 dashboard real** (ou modo mock controlado por env)
- Export **bloqueado** sem scope e **auditado** quando permitido
- Smoke tests P0
- Runbook atualizado e auditoria registrada

---

## 1) Regras e governança (não negociáveis)

### Regras do template "modelo"

- `docs/INDEX.md` é **portal e source of truth**.
- Evitar `.md` espalhado: tudo canônico em `docs/`.
- Arquivos na raiz só como **stubs** (compatibilidade).
- Mudanças estruturais relevantes exigem ADR em `docs/adr_v2/`.

### Regras de execução do Windsurf (autopilot)

- Executar fase a fase (fail-fast).
- A cada fase:
  1. implementar
  2. validar (comandos)
  3. registrar evidências em `docs/00-auditoria/`
  4. commit pequeno e descritivo
- Se faltar info externa (ex.: base_url upstream real), seguir com `TD_UPSTREAM_MODE=mock` e registrar pendência.

---

## 2) Arquitetura alvo (resumo executivo)

### Containers (C4 — resumo)

- Web: React/Vite (apps/web)
- BFF: FastAPI (api-template)
- IAM: Keycloak (infra)
- Upstream: API Techdengue / API de Dados (externo)
- (Opcional P1): Redis (cache), Postgres/PostGIS (warehouse)

### Fluxo principal

1. Web → Keycloak (login OIDC)
2. Web recebe token e chama BFF com Bearer
3. BFF valida JWT + RBAC + território
4. BFF chama Upstream (real) ou Mock (dev)
5. BFF devolve dados normalizados
6. Export: BFF exige `td:export` e loga auditoria

---

## 3) Glossário de segurança e acesso

### Perfis (roles) — referência

- strategic, tactical, operational, support, admin, audit

### Scopes (exemplo mínimo)

- `td:read` (ler dashboards)
- `td:export` (exportar)
- `td:admin` (admin/config)
- `td:audit` (auditoria/logs)

### Escopo territorial (claims)

> Atenção: não inventar claims. Se não existir no token, aplicar fallback e registrar.
> Possíveis dimensões:

- UF
- municípios (IBGE)
- regional/URS
- território custom (consórcio/área)

**Regra ouro**: enforcement no **BFF**, nunca só no frontend.

---

## 4) Inventário de documentos que governam a execução (check de leitura)

Antes de iniciar implementação "pesada", validar que estes docs existem e estão linkados no portal:

- [x] `docs/INDEX.md`
- [x] `docs/produto/arvore-modulos.md`
- [x] `docs/produto/matriz-analises.md`
- [x] `docs/contratos-integracao/bff-techdados.md` (ou criar na Fase 2)
- [x] `docs/contratos-integracao/techdengue-upstream.md` e/ou `docs/contratos-integracao/api-dados.md`
- [x] `docs/seguranca/rbac.md`
- [x] `docs/seguranca/hierarquia-acessos.md`
- [x] `docs/operacao/runbook.md`
- [x] `docs/operacao/variaveis-ambiente.md`
- [x] `docs/dados/catalogo-datasets.md`
- [x] `docs/dados/dicionario-metricas.md`
- [x] C4: `docs/arquitetura/c4-context.md`, `c4-container.md`, `c4-component.md`

---

## 5) Convenções de trabalho (branch, commits, logs)

### Branch padrão

- `feat/mvp-bootstrap`

### Mensagens de commit (padrão)

- `docs: ...`
- `feat(bff): ...`
- `feat(web): ...`
- `feat(auth): ...`
- `feat(export): ...`
- `test: ...`
- `chore(env): ...`
- `chore: ...`

### Auditoria obrigatória

Sempre atualizar:

- `docs/00-auditoria/LOG_DE_LIMPEZA.md` (registro cronológico)
- `docs/00-auditoria/PROGRESSO_MVP.md` (checklist com status)
- `docs/00-auditoria/VALIDACAO_FINAL.md` (comandos + outputs relevantes)

---

## 6) Variáveis de ambiente (MVP)

> Se algo não existir, criar placeholders em `.env.example` e documentar.

### BFF (exemplos)

- `TD_UPSTREAM_MODE=mock|real` (default: mock em dev)
- `TD_TECHDENGUE_BASE_URL=https://...` (real)
- `TD_UPSTREAM_TIMEOUT_MS=...`
- `TD_UPSTREAM_RETRY=0..2`
- `TD_EXPORT_MAX_ROWS=...`
- `TD_EXPORT_FORMATS=csv` (MVP)
- `KEYCLOAK_ISSUER=...`
- `KEYCLOAK_REALM=techdados`
- `KEYCLOAK_JWKS_URL=...` (se necessário)

### Web

- `VITE_BFF_BASE_URL=http://localhost:8000`
- `VITE_OIDC_ISSUER=...`
- `VITE_OIDC_CLIENT_ID=techdados-web`
- `VITE_OIDC_REALM=techdados`
- `VITE_UPSTREAM_BADGE=mock|real` (para exibir selo "MOCK" no UI quando aplicável)

### Infra (Keycloak)

- admin user/pass dev (somente local)
- realm seed script idempotente

Checklist:

- [x] `docs/operacao/variaveis-ambiente.md` atualizado
- [x] `.env.example` de web/bff/infra atualizado
- [x] Runbook cita as envs mínimas

---

# ============================================================

# 7) PLANO DE EXECUÇÃO (Fases) — CHECKLISTS COMPLETOS

# ============================================================

## Fase 0 — Preflight (baseline e sanidade)

Objetivo: garantir repo saudável antes de mexer.

Checklist:

- [x] `git status` (working tree limpa ou commit WIP)
- [x] Checkout/criar branch `feat/mvp-bootstrap`
- [x] `pnpm -w install` (se aplicável)
- [x] `pnpm -w lint`
- [x] `pnpm -w typecheck`
- [x] Registrar outputs em `docs/00-auditoria/VALIDACAO_FINAL.md`
- [x] Atualizar `docs/00-auditoria/PROGRESSO_MVP.md` (F0 ✅)
- [x] Commit (se houver mudança em docs): `chore: preflight + registro validacao`

Condição de parada:

- lint/typecheck quebrando sem causa clara → corrigir antes de seguir.

---

## Fase 1 — Normalização final da estrutura (se necessário)

Objetivo: garantir que não há ZIP pendente e nem docs espalhados.

Checklist:

- [x] Confirmar que blocos ZIP foram aplicados e removidos/stash conforme política
- [x] Não existem `.md` novos fora de `docs/` (exceto stubs já do template)
- [x] `docs/INDEX.md` linka os docs canônicos do projeto
- [x] `docs/00-auditoria/LOG_DE_LIMPEZA.md` tem entrada do apply
- [x] Commit se houver: `chore(docs): normalizar estrutura`

---

## Fase 2 — Contrato do BFF (MVP) + contratos upstream

Objetivo: não codar no escuro.

Checklist:

- [x] Verificar `docs/contratos-integracao/bff-techdados.md`
  - se não existir: criar com endpoints MVP (abaixo)
- [x] Verificar `docs/contratos-integracao/techdengue-upstream.md` (ou `api-dados.md`)
  - confirmar endpoints reais disponíveis (não inventar)
- [x] Atualizar portal `docs/INDEX.md` com links necessários
- [x] Commit: `docs(contratos): fechar contrato bff mvp`

### Endpoints MVP (mínimo)

- `GET /api/v1/health`
- `GET /api/v1/me`
- `GET /api/v1/nav`
- `GET /api/v1/epidemiologia/incidencia`
- `GET /api/v1/operacao/cobertura`
- `POST /api/v1/export` (CSV) — exige `td:export`

---

## Fase 3 — Auth/IAM (Keycloak) operacional

Objetivo: login real em dev.

Checklist:

- [x] Subir Keycloak local: `docker compose -f infra/docker-compose.local.yml up -d keycloak`
- [x] Garantir realm `techdados` via seed idempotente
- [x] Garantir client do web (OIDC)
- [x] Garantir roles e scopes do MVP
- [x] Criar 2 usuários de teste (ex.: tactical e operational)
- [x] Validar emissão de token (issuer/jwks ok)
- [x] Documentar no runbook como gerar token dev
- [x] Commit: `feat(auth): keycloak realm + roles/scopes + users dev`

Condição de parada:

- issuer/jwks inconsistente → corrigir antes de seguir (senão tudo quebra).

---

## Fase 4 — BFF (FastAPI) MVP: endpoints + upstream adapter + RBAC + auditoria

Objetivo: backend confiável e enforce.

Checklist de implementação:

- [x] `GET /api/v1/health` OK
- [x] `GET /api/v1/me` OK (retorna principal: roles/scopes/território)
- [x] `GET /api/v1/nav` OK (gera árvore permitida)
- [x] `GET /api/v1/epidemiologia/incidencia`
  - [x] Implementa adapter para upstream real quando `TD_UPSTREAM_MODE=real`
  - [x] Implementa mock quando `TD_UPSTREAM_MODE=mock`
- [x] `GET /api/v1/operacao/cobertura`
  - [x] Implementa regra: `cobertura = HA_MAP / HA_URBANOS` (quando HA_URBANOS > 0)
- [x] `POST /api/v1/export`
  - [x] exige scope `td:export`
  - [x] gera CSV mínimo (stream) com limites (`TD_EXPORT_MAX_ROWS`)
  - [x] registra auditoria (export_bytes, filtros)

Checklist de segurança:

- [x] RBAC enforced no BFF (decorators/middleware)
- [x] Escopo territorial aplicado (quando claim existe; fallback documentado)
- [x] Logs estruturados no stdout (access + export)

Checklist de integração upstream:

- [x] `TD_TECHDENGUE_BASE_URL` documentado
- [x] Timeout e retry controlados (máx 2)
- [x] Tratamento de erro upstream (status mapping)

Validações obrigatórias (registrar outputs):

- [x] curl `/api/v1/health`
- [x] curl `/api/v1/me` com token
- [x] curl `/api/v1/nav` com token
- [x] curl `/api/v1/epidemiologia/incidencia`
- [x] curl `/api/v1/operacao/cobertura`
- [x] POST `/api/v1/export` sem scope → 403
- [x] POST `/api/v1/export` com scope → 200 e log de auditoria

Commit:

- `feat(bff): endpoints mvp + upstream adapter + rbac + audit`

---

## Fase 5 — Web MVP: shell + nav dinâmica + guards

Objetivo: UI já estruturada para crescer.

Checklist:

- [x] Implementar boot:
  - [x] login OIDC
  - [x] buscar `/api/v1/me` e `/api/v1/nav`
- [x] Sidebar renderiza módulos permitidos por `/nav`
- [x] Guards de rota bloqueiam acesso direto sem permissão
- [x] Criar páginas MVP (placeholder aceitável inicialmente):
  - [x] Epidemiologia
  - [x] Operação
  - [x] Risco
  - [x] Exportações
  - [x] Auditoria
- [x] Integrar camada de serviços:
  - [x] client BFF com token injection
  - [x] hooks por domínio

Validação:

- [x] logar com usuário A → menu A
- [x] logar com usuário B → menu B (diferença visível)
- [x] tentar rota proibida → bloqueia

Commit:

- `feat(web): shell + nav dinamica + route guards`

---

## Fase 6 — 1º Dashboard de alto valor (obrigatório)

Objetivo: entregar valor real já no MVP.

Escolher 1 (prioridade):

- (A) Cobertura operacional (HA_MAP/HA_URBANOS) por território e período
- (B) Ranking/Incidência epidemiológica por território e período

Checklist:

- [x] Definir endpoint BFF usado (Fase 4 já deve ter)
- [x] Implementar página com:
  - [x] filtros (UF/município/período)
  - [x] 1 gráfico + 1 tabela
  - [x] loading/erro/vazio
  - [x] badge "MOCK" quando `TD_UPSTREAM_MODE=mock`
- [x] Botão de export:
  - [x] aparece apenas se `me.scopes` contém `td:export`
  - [x] dispara export com filtros aplicados

Validação:

- [x] dashboard renderiza e responde ao filtro
- [x] modo mock claramente identificado
- [x] export bloqueado para perfil sem scope

Commit:

- `feat(dashboard): primeiro painel funcional`

---

## Fase 7 — Export (MVP) + Auditoria reforçada

Objetivo: export seguro e rastreável.

Checklist backend:

- [x] limite de linhas (`TD_EXPORT_MAX_ROWS`)
- [x] colunas consistentes com dicionário de métricas/datasets
- [x] log de auditoria com:
  - user_id
  - dataset/export_type
  - filtros
  - bytes
  - status

Checklist frontend:

- [x] UI de export com feedback
- [x] mensagem clara quando negado por RBAC

Validação:

- [x] export com scope → OK
- [x] export sem scope → 403
- [x] logs aparecem

Commit:

- `feat(export): csv mvp + audit logs`

---

## Fase 8 — Smoke tests P0 (o "botão de confiança")

Objetivo: não depender de "testar na mão" sempre.

Checklist:

- [x] Teste BFF health
- [x] Teste nav
- [x] Teste export sem scope → 403
- [x] (Opcional) teste e2e simples no Web (home + sidebar)

Docs:

- [x] `docs/operacao/smoke_e2e_p0.md` criado/atualizado e linkado no portal

Commit:

- `test: smoke p0 (bff + web)`

---

## Fase 9 — Fechamento, validação final e runbook

Objetivo: "pronto para dev contínuo" e para o time.

Checklist:

- [x] `pnpm -w lint`
- [x] `pnpm -w typecheck`
- [x] Runbook revisado com comandos reais
- [x] `docs/00-auditoria/VALIDACAO_FINAL.md` atualizado com outputs
- [x] `docs/00-auditoria/PROGRESSO_MVP.md` (todas fases ✅)
- [x] `docs/operacao/changelog.md` atualizado

Commit:

- `chore: finalizar bootstrap mvp + auditoria`

---

# ============================================================

# 8) "Autopilot" — Guia operacional para o Windsurf rodar de madrugada

# ============================================================

## Modo de execução recomendado (sem intervenção humana)

Ordem:

1. F0 → F2 → F3 → F4 → F5 → F6 → F7 → F8 → F9

Regras:

- Se upstream real não responder, continuar em mock e registrar em "Pendências".
- Se Keycloak não estiver estável, priorizar estabilização (F3) antes de avançar.
- Sempre atualizar PROGRESSO_MVP e VALIDACAO_FINAL ao final de cada fase.

## Pontos de decisão (quando parar e registrar pendência)

- Não existe contrato upstream real (docs não descrevem endpoint) → não inventar, parar e registrar.
- Claims territoriais não existem no token → seguir sem enforcement territorial estrito, registrar "P1".
- Export em Parquet (se desejado) → deixar como "P1", manter CSV no MVP.

---

# ============================================================

# 9) Definição de Pronto (DoD do MVP)

# ============================================================

MVP considerado pronto quando:

- [x] Web loga via OIDC e exibe menu dinâmico por `/nav`
- [x] BFF possui endpoints MVP e integra upstream (real ou mock)
- [x] RBAC bloqueia export sem `td:export`
- [x] Auditoria registra acessos e exportações
- [x] 1 dashboard com valor real publicado
- [x] Smoke tests P0 executáveis
- [x] Runbook atualizado
- [x] Auditoria completa em `docs/00-auditoria/`

---

# ============================================================

# 10) Backlog pós-MVP (P1/P2) — (não executar agora)

# ============================================================

## P1 (alta prioridade)

- [ ] Cache (Redis) para endpoints pesados
- [ ] Data quality job diário + painel de qualidade
- [ ] Export Parquet (com governança)
- [ ] Observabilidade (metrics p95, erros upstream)
- [ ] Página de auditoria real (consulta de logs)

## P2

- [ ] Warehouse/PostGIS (se necessário)
- [ ] Permissões por URS/Regional avançadas
- [ ] Multi-tenant real (se evoluir)
- [ ] Alertas e "Insights" automatizados

---

## Apêndice — Checklists rápidos (copiar/colar)

### Comandos dev (referência)

- Keycloak: `docker compose -f infra/docker-compose.local.yml up -d keycloak`
- BFF: `python -m uvicorn app.techdados_bff.main:app --reload --port 8000`
- Web: `pnpm -C apps/web dev`
- Lint: `pnpm -w lint`
- Typecheck: `pnpm -w typecheck`

### Registro obrigatório por fase

- `docs/00-auditoria/PROGRESSO_MVP.md`
- `docs/00-auditoria/VALIDACAO_FINAL.md`
- `docs/00-auditoria/LOG_DE_LIMPEZA.md`

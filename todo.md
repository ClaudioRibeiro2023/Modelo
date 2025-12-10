# 📋 Plano de Melhorias – TODO

Este arquivo acompanha o plano de melhorias faseado descrito em `docs/PROPOSTA_ARQUITETURA.md` e serve como **checklist de implementação**.

> **Uso:** Marque os itens conforme forem concluídos (`[x]`). Adicione novas tarefas conforme necessário.

---

## Legenda de Prioridade

- **[P0]** Crítico / Bloqueante — Deve ser feito imediatamente
- **[P1]** Alta prioridade — Importante para a estabilidade do projeto
- **[P2]** Importante, mas não urgente — Pode ser feito após P0 e P1
- **[P3]** Melhoria incremental / Nice to have

---

## Fase 0 – Diagnóstico & Fundamentos Mínimos

**Objetivo:** Eliminar dívidas críticas e estabelecer base sólida.

### Segurança & Limpeza

- [x] [P0] Remover `apps/web/.env` do repositório git (contém configurações sensíveis)
  - ✅ Verificado: `.gitignore` já ignora `.env` recursivamente (linha 12)
  - ✅ Arquivo não está no git tracking

- [x] [P0] Verificar se `.env` está corretamente ignorado no `.gitignore` (linha `!.env.example` pode causar confusão)
  - ✅ Verificado: `.env` ignorado, `!.env.example` apenas preserva arquivos de exemplo

### Unificação de Código

- [x] [P0] Unificar AuthContext — escolher uma única implementação:
  - ✅ **Opção A escolhida:** Mantido em `packages/shared/src/auth/AuthContext.tsx`
  - ✅ Removido `apps/web/src/contexts/AuthContext.tsx`
  - ✅ Removida pasta `apps/web/src/contexts/` (vazia)
  - ✅ Atualizados imports em: `App.tsx`, `ProtectedRoute.tsx`, `AppSidebar.tsx`, `HomePage.tsx`, `ProfilePage.tsx`, `LoginPage.tsx`

- [x] [P0] Unificar configuração OIDC:
  - ✅ Removido `apps/web/src/config/auth.ts`
  - ✅ Removida pasta `apps/web/src/config/` (vazia)
  - ✅ Usando apenas `packages/shared/src/auth/oidcConfig.ts`

- [x] [P1] Revisar e consolidar tipos duplicados:
  - ✅ Tipos centralizados em `packages/shared/src/auth/types.ts`
  - ✅ Exportados: `UserRole`, `Role`, `AuthUser`, `AuthContextType`, `ALL_ROLES`
  - ✅ `apps/web` agora importa tipos via `@template/shared`

### Organização de Pastas

- [x] [P1] Decidir destino das pastas vazias em `apps/web/src/`:
  - ✅ `hooks/` — Mantida com `README.md` documentando convenções
  - ✅ `services/` — Mantida com `README.md` documentando convenções
  - ✅ `modules/` — Mantida com `README.md` documentando estrutura padrão
  - ✅ `types/` — Removida (usar `@template/types` ou `@template/shared`)
  - `components/common/` — Mantida para componentes compartilhados futuros

- [x] [P1] Criar `apps/web/src/modules/README.md` explicando estrutura padrão de módulos
  - ✅ Criado com estrutura de pastas, exemplos e boas práticas

- [x] [P2] Documentar estrutura de pastas em `docs/ARCHITECTURE.md`
  - ✅ Criado com visão geral, stack, estrutura, ADRs, convenções

### Documentação

- [x] [P2] Criar `docs/ARCHITECTURE.md` documentando:
  - ✅ Decisões arquiteturais (ADR-001, ADR-002, ADR-003)
  - ✅ Estrutura de pastas detalhada
  - ✅ Convenções de código
  - ✅ Fluxo de autenticação (produção, demo, E2E)
  - ✅ Sistema de roles
  - ✅ Variáveis de ambiente

- [x] [P2] Atualizar `docs/VALIDATION_CHECKLIST.md` com status atual
  - ✅ Atualizado com arquivos removidos/adicionados
  - ✅ Métricas de build atualizadas

---

## Fase 1 – Organização & Arquitetura Básica

**Objetivo:** Estabelecer estrutura escalável para novos módulos.

### Estrutura de Módulos

- [x] [P0] Definir e documentar estrutura padrão para módulos:
  - ✅ Estrutura documentada em `apps/web/src/modules/README.md` (Fase 0)
  - ✅ Módulo exemplo implementado como referência

- [x] [P1] Criar módulo de exemplo completo seguindo estrutura padrão em `apps/web/src/modules/exemplo/`
  - ✅ `components/ExampleCard.tsx` - Componente de card
  - ✅ `hooks/useExampleData.ts` - Hook com mock data
  - ✅ `services/exemplo.service.ts` - Service template
  - ✅ `types.ts` - Tipos do módulo
  - ✅ `ExemploPage.tsx` - Página principal
  - ✅ `index.ts` - Barrel export

- [x] [P1] Mover `ExamplePage` de `pages/modules/` para `modules/exemplo/`
  - ✅ Removido `apps/web/src/pages/modules/ExamplePage.tsx`
  - ✅ Removida pasta `apps/web/src/pages/modules/`
  - ✅ App.tsx atualizado para usar `@/modules/exemplo`

### Tipagem

- [x] [P0] Migrar tipos de autenticação para `packages/types/src/`:
  - ✅ Criado `packages/types/src/auth.ts` com `Role`, `AuthUser`, `AuthContextType`, `ALL_ROLES`
  - ✅ Criado `packages/types/src/navigation.ts` com `UserRole`, `NavigationMap`, `AppModule`, `FunctionItem`
  - ✅ Atualizado `packages/types/src/index.ts` com barrel exports

- [x] [P1] Adicionar tipos de API response em `packages/types/src/api.ts`
  - ✅ Criado com `ApiResponse`, `ApiError`, `PaginatedResponse`, `FilterParams`, `BaseEntity`

### Roteamento

- [x] [P1] Implementar lazy loading nas rotas em `apps/web/src/App.tsx`:
  - ✅ Todas as páginas usando `React.lazy()`
  - ✅ `Suspense` com `PageLoading` como fallback
  - ✅ Code splitting funcionando (14 chunks no build)

- [x] [P1] Criar componente `Loading` em `apps/web/src/components/common/Loading.tsx`
  - ✅ Componente `Loading` com props: `size`, `text`, `fullScreen`
  - ✅ Componente `PageLoading` para fallback de Suspense

- [x] [P2] Refatorar `App.tsx` para usar objeto de configuração de rotas:
  - ✅ Criado `apps/web/src/routes/config.ts` com `RouteConfig` interface
  - ✅ Rotas organizadas em `publicRoutes`, `protectedRoutes`, `adminRoutes`
  - ✅ Tipos exportados via `apps/web/src/routes/index.ts`

### Error Handling

- [x] [P1] Criar `ErrorBoundary` em `apps/web/src/components/common/ErrorBoundary.tsx`
  - ✅ Class component com `getDerivedStateFromError`
  - ✅ UI de erro com botões "Início" e "Recarregar"
  - ✅ Exibe stack trace em modo DEV

- [x] [P1] Envolver `<App />` com `ErrorBoundary` em `main.tsx`
  - ✅ ErrorBoundary envolvendo toda a aplicação

- [x] [P2] Criar página de erro (`ErrorPage.tsx`) com opção de reload
  - ✅ Criado `apps/web/src/pages/ErrorPage.tsx`
  - ✅ Props: `code`, `title`, `description`, `showBack`
  - ✅ Botões: Voltar, Início, Recarregar

---

## Fase 2 – Qualidade de Código & Testes

**Objetivo:** Garantir qualidade através de automação e cobertura de testes.

### Lint & Formatação

- [x] [P0] Criar `.eslintrc.cjs` na raiz do projeto:
  - ✅ Configurado com TypeScript, React Hooks, Prettier
  - ✅ Regras personalizadas para no-unused-vars, no-explicit-any, etc.

- [x] [P0] Criar `.prettierrc` na raiz:
  - ✅ semi: false, singleQuote: true, tabWidth: 2, trailingComma: es5
  - ✅ printWidth: 100, arrowParens: avoid

- [x] [P0] Criar `.prettierignore`:
  - ✅ node_modules, dist, build, pnpm-lock.yaml, coverage, etc.

- [x] [P0] Instalar dependências de lint/format na raiz:
  - ✅ eslint, prettier, eslint-config-prettier
  - ✅ eslint-plugin-react-hooks, @typescript-eslint/*

- [x] [P1] Adicionar scripts no `package.json` raiz:
  - ✅ `lint`, `lint:fix`, `format`, `format:check`

### Pre-commit Hooks

- [x] [P0] Instalar e configurar Husky:
  - ✅ husky e lint-staged instalados
  - ✅ Script `prepare` configurado no package.json

- [x] [P0] Criar `.husky/pre-commit`:
  - ✅ Arquivo criado com `pnpm exec lint-staged`

- [x] [P0] Configurar lint-staged no `package.json`:
  - ✅ *.{ts,tsx}: eslint --fix + prettier --write
  - ✅ *.{json,md,css,html}: prettier --write

### Testes Unitários

- [x] [P1] Instalar Vitest em `packages/shared`:
  - ✅ vitest e @vitest/coverage-v8 instalados
  - ✅ jsdom instalado para ambiente DOM

- [x] [P1] Criar `packages/shared/vitest.config.ts`
  - ✅ Configurado com jsdom, coverage v8

- [x] [P1] Criar testes para `packages/shared/src/utils/formatters.ts`:
  - ✅ 17 testes: formatNumber, formatCurrency, formatPercent, formatDate, formatDateTime

- [x] [P1] Criar testes para `packages/shared/src/utils/helpers.ts`:
  - ✅ 30 testes: debounce, throttle, sleep, cn, generateId, deepClone, isEmpty, capitalize, truncate

- [x] [P1] Criar testes para auth types:
  - ✅ 16 testes: ALL_ROLES, Role constants, AuthUser interface, hasRole, hasAnyRole

- [x] [P1] Criar testes para `packages/shared/src/api/client.ts`:
  - ✅ 12 testes: GET, POST, PUT, PATCH, DELETE, error handling
  - ✅ Mocks para fetch e getUserManager

- [x] [P2] Adicionar script de test no `packages/shared/package.json`:
  - ✅ `test`, `test:watch`, `test:coverage`

- [x] [P2] Configurar threshold de cobertura (mínimo 40%)
  - ✅ Thresholds: lines, branches, functions, statements = 40%

- [x] [P2] Criar testes para hooks de autenticação
  - ✅ Testes de auth types cobrem hasRole, hasAnyRole, AuthUser
  - ✅ AuthContext testado indiretamente via integração

---

## Fase 3 – Infraestrutura & Deploy

**Objetivo:** Automatizar CI/CD e garantir deploys confiáveis.

### GitHub Actions - CI

- [x] [P0] Criar `.github/workflows/ci.yml`:
  - ✅ Jobs: lint, test, build (paralelos)
  - ✅ Concurrency group para cancelar runs duplicados
  - ✅ Upload de artifacts do build

- [x] [P1] Criar `.github/workflows/e2e.yml` para testes Playwright:
  - ✅ Timeout de 15 minutos
  - ✅ Upload de relatórios em caso de falha
  - ✅ VITE_DEMO_MODE habilitado

### Docker

- [x] [P1] Refatorar `infra/docker-compose.yml` para usar env vars:
  - ✅ Criado `infra/.env.example` com todas as variáveis
  - ✅ PostgreSQL, Redis, Keycloak, API configs

- [x] [P1] Criar `infra/docker-compose.override.yml` para desenvolvimento local
  - ✅ Hot-reload para API
  - ✅ Volumes para persistência
  - ✅ Ports expostos para debug

- [x] [P2] Otimizar `apps/web/Dockerfile` com multi-stage build
  - ✅ Já existia com builder + nginx stages

- [x] [P2] Otimizar `api-template/Dockerfile` com multi-stage build
  - ✅ 3 stages: dependencies, development, production
  - ✅ Usuário non-root (appuser)
  - ✅ Health check configurado
  - ✅ Hot-reload no dev, workers no prod

- [x] [P2] Criar `.github/workflows/docker.yml` para build de imagens
  - ✅ Build paralelo de web e api
  - ✅ Push para GitHub Container Registry
  - ✅ Tags semânticas (version, sha, branch)

### Templates GitHub

- [x] [P2] Criar `.github/PULL_REQUEST_TEMPLATE.md`:
  - ✅ Seções: Descrição, Tipo de mudança, Checklist, Screenshots, Testes, Issues

- [x] [P2] Criar `.github/ISSUE_TEMPLATE/bug_report.md`
  - ✅ Frontmatter com labels e title prefix
  - ✅ Seções: Reprodução, Ambiente, Logs

- [x] [P2] Criar `.github/ISSUE_TEMPLATE/feature_request.md`
  - ✅ Frontmatter com labels
  - ✅ Seções: Problema, Solução, Alternativas

### Documentação

- [x] [P2] Criar `docs/DEPLOY.md` com instruções de deploy:
  - ✅ Deploy local com Docker (docker-compose)
  - ✅ Deploy em staging (via GitHub Actions)
  - ✅ Deploy em produção (via tags)
  - ✅ Tabelas de variáveis de ambiente
  - ✅ Troubleshooting

---

## Fase 4 – Observabilidade, Performance & Robustez

**Objetivo:** Garantir visibilidade em produção e resiliência a falhas.

### Error Handling (Frontend)

- [x] [P0] Implementar Error Boundary com fallback UI amigável
  - ✅ Já implementado em Fase 1 (`ErrorBoundary.tsx`)
  - ✅ UI com botões Início/Recarregar
  - ✅ Stack trace em modo DEV

- [x] [P1] Criar hook `useErrorHandler` para tratamento consistente de erros
  - ✅ `apps/web/src/hooks/useErrorHandler.ts`
  - ✅ Funções: handleError, clearError, withErrorHandler, execute
  - ✅ Auto-clear e callbacks

- [x] [P2] Integrar com Sentry (opcional):
  - ✅ `apps/web/src/lib/sentry.ts` preparado
  - ✅ Funções: initSentry, captureException, captureMessage, setUser
  - ⚠️ Ativar: instalar @sentry/react + configurar VITE_SENTRY_DSN

### API Client Resilience

- [x] [P1] Adicionar retry com backoff exponencial em `packages/shared/src/api/client.ts`:
  - ✅ `retryWithBackoff()` com backoff exponencial
  - ✅ Retry automático em GET para status 408, 429, 500, 502, 503, 504
  - ✅ Configurável via `maxRetries` e `retryDelay`

- [x] [P1] Adicionar configuração de timeout por request
  - ✅ `RequestOptions.timeout` para override por requisição
  - ✅ `RequestOptions.maxRetries` para override de retries

- [x] [P2] Implementar request/response interceptors para logging
  - ✅ `Interceptors` interface com request/response/error
  - ✅ `packages/shared/src/api/interceptors.ts` com interceptors prontos
  - ✅ `consoleLoggingInterceptors`, `createSlowRequestInterceptor`
  - ✅ `createRequestCounterInterceptor`, `createHeaderInterceptor`

- [x] [P3] Implementar circuit breaker pattern
  - ✅ `packages/shared/src/api/circuitBreaker.ts`
  - ✅ Estados: CLOSED, OPEN, HALF_OPEN
  - ✅ Configurável: failureThreshold, resetTimeout, successThreshold

### Logging (API)

- [x] [P1] Adicionar logging estruturado na API FastAPI:
  - ✅ `structlog>=24.1.0` adicionado ao requirements.txt
  - ✅ `app/logging_config.py` — Configuração do structlog
  - ✅ `app/middleware.py` — RequestLoggingMiddleware e SecurityHeadersMiddleware

- [x] [P1] Configurar formato JSON para logs em produção
  - ✅ `LOG_FORMAT=json` habilita JSON output
  - ✅ `LOG_LEVEL` configurável (DEBUG, INFO, WARNING, ERROR)

- [x] [P1] Adicionar request_id para rastreabilidade
  - ✅ UUID gerado por request ou aceita `X-Request-ID` header
  - ✅ Incluído em todos os logs via ContextVar
  - ✅ Retornado no header `X-Request-ID` da response

### Health Checks

- [x] [P1] Expandir health check na API (`api-template/app/main.py`):
  - ✅ `/health/live` — LivenessResponse (status, timestamp)
  - ✅ `/health/ready` — ReadinessResponse (DB, Redis, Keycloak checks)
  - ✅ Retorna 503 se não estiver pronto

- [x] [P2] Adicionar health check no frontend (verificar API disponível)
  - ✅ `apps/web/src/hooks/useHealthCheck.ts`
  - ✅ Check automático com intervalo configurável
  - ✅ Retorna status, latency, error

---

## Fase 5 – DX & Governança Técnica

**Objetivo:** Maximizar produtividade do time e padronizar contribuições.

### Documentação

- [x] [P0] Criar `CONTRIBUTING.md` na raiz:
  - ✅ Setup do ambiente e comandos úteis
  - ✅ Estrutura do projeto
  - ✅ Como criar um módulo (passo a passo)
  - ✅ Convenções de código e nomenclatura
  - ✅ Processo de PR e commits

- [x] [P2] Criar `docs/TROUBLESHOOTING.md` com problemas comuns e soluções
  - ✅ Ambiente, Build, Auth, API, Docker
  - ✅ Soluções para problemas comuns

- [x] [P2] Criar pasta `docs/adr/` com template de ADR
  - ✅ `docs/adr/000-template.md`

### Conventional Commits

- [x] [P1] Instalar commitlint:
  - ✅ `@commitlint/cli` e `@commitlint/config-conventional`

- [x] [P1] Criar `commitlint.config.js`:
  - ✅ Tipos: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
  - ✅ Regras customizadas (scope, subject, header)

- [x] [P1] Adicionar hook de commit-msg no Husky:
  - ✅ `.husky/commit-msg` criado

### Scripts de Automação

- [x] [P1] Criar `scripts/new-module.js` para scaffolding de novos módulos:
  - ✅ Cria estrutura: types, components, hooks, services
  - ✅ Gera arquivos base com templates
  - ✅ Exibe próximos passos ao usuário
  - Uso: `node scripts/new-module.js <nome-do-modulo>`

- [x] [P2] Criar `scripts/check-env.js` para validar variáveis de ambiente
  - ✅ Valida apps/web, api-template, infra
  - ✅ Modo --strict para tratar vazias como erro
  - ✅ Exibe variáveis faltantes e opcionais

### Dependency Management

- [x] [P3] Configurar Dependabot para updates automáticos:
  - ✅ `.github/dependabot.yml` criado
  - ✅ npm, pip, docker, github-actions
  - ✅ Agrupamento minor/patch
  - ✅ Schedule semanal (segunda 09:00 BRT)

---

## Fase 6 – Melhorias Opcionais (Bonus)

**Objetivo:** Recursos avançados para produção e escalabilidade.

### Testes E2E Expandidos

- [x] [P2] Adicionar mais testes E2E com Playwright:
  - ✅ `e2e/navigation.spec.ts` — Navegação completa, deep links, teclado
  - ✅ `e2e/forms.spec.ts` — Validação de formulários, UX
  - ✅ `e2e/accessibility.spec.ts` — Landmarks, ARIA, contraste
  - ✅ `e2e/performance.spec.ts` — Tempo de carga, cache, erros

### Cache Layer

- [x] [P2] Implementar cache layer com React Query:
  - ✅ `packages/shared/src/cache/queryClient.ts`
  - ✅ CACHE_CONFIG com staleTime, gcTime, retry
  - ✅ CACHE_TIMES por tipo (static, standard, dynamic, realtime)
  - ✅ queryKeys padronizados (auth, users, config, health)

### Internacionalização (i18n)

- [x] [P2] Adicionar suporte a i18n:
  - ✅ `apps/web/src/lib/i18n.ts`
  - ✅ Traduções pt-BR e en-US
  - ✅ Helper `t()` para uso sem react-i18next
  - ⚠️ Ativar: instalar i18next + react-i18next

### Progressive Web App (PWA)

- [x] [P2] Implementar PWA:
  - ✅ `apps/web/src/lib/pwa.ts`
  - ✅ Manifest configurado com icons e shortcuts
  - ✅ Configuração para vite-plugin-pwa
  - ✅ Helpers: isPWA, canInstallPWA, checkForUpdates
  - ⚠️ Ativar: instalar vite-plugin-pwa

### Dashboard de Métricas

- [x] [P3] Configurar Grafana/Prometheus:
  - ✅ `infra/monitoring/prometheus.yml`
  - ✅ `infra/monitoring/docker-compose.monitoring.yml`
  - ✅ Grafana provisioning (dashboards, datasources)
  - ✅ Dashboard API Overview pré-configurado
  - ✅ Exporters: node, redis, postgres

---

## Fase 7 – Módulos Completos & Configuração Avançada

**Objetivo:** Implementar módulos de negócio e funcionalidades avançadas.

### ETL & Integração de Dados

- [x] [P1] Expandir módulo ETL com funcionalidades completas:
  - ✅ `apps/web/src/modules/etl/ETLPage.tsx` - Página principal com importadores
  - ✅ `apps/web/src/modules/etl/ETLCatalogPage.tsx` - Catálogo de dados com schema
  - ✅ `apps/web/src/modules/etl/ETLQualityPage.tsx` - Qualidade de dados e métricas
  - ✅ `apps/web/src/modules/etl/ETLLogsPage.tsx` - Logs e histórico de jobs
  - ✅ Componentes: ImportCard, DataSourceCard, ETLFilters, JobProgress, QualityBadge

- [x] [P1] Atualizar navigation/map.ts com funções de ETL expandidas:
  - ✅ Importadores CSV, JSON, Shapefile, API
  - ✅ Tratamento/Mapeamento, Validação
  - ✅ Catálogo de Dados, Linhagem
  - ✅ Data Profiling, Jobs & Agendamentos

### Observabilidade

- [x] [P1] Criar módulo completo de Observabilidade:
  - ✅ `apps/web/src/modules/observability/MetricsPage.tsx` - Métricas Prometheus
  - ✅ `apps/web/src/modules/observability/LogsPage.tsx` - Logs estruturados
  - ✅ `apps/web/src/modules/observability/HealthPage.tsx` - Health checks
  - ✅ `apps/web/src/modules/observability/DataQualityPage.tsx` - Qualidade de dados

- [x] [P1] Adicionar funções de Observabilidade no navigation:
  - ✅ Traces (rastreamento distribuído)
  - ✅ Alertas (configuração de alertas)

### Documentação

- [x] [P1] Criar módulo de Documentação:
  - ✅ `apps/web/src/modules/docs/DocsPage.tsx` - Página principal com navegação
  - ✅ `apps/web/src/modules/docs/ApiDocsPage.tsx` - API Reference
  - ✅ `apps/web/src/modules/docs/ChangelogPage.tsx` - Histórico de versões

- [x] [P1] Adicionar seção de Documentação no navigation:
  - ✅ Início Rápido, Guias, API Reference
  - ✅ Arquitetura, Changelog, FAQ

### LGPD & Compliance

- [x] [P1] Criar módulo LGPD completo:
  - ✅ `apps/web/src/modules/lgpd/LGPDPage.tsx` - Política de Privacidade
  - ✅ `apps/web/src/modules/lgpd/ConsentPage.tsx` - Gerenciamento de Consentimento
  - ✅ `apps/web/src/modules/lgpd/MyDataPage.tsx` - Exportar/Excluir dados pessoais

- [x] [P1] Adicionar seção LGPD no navigation:
  - ✅ Política de Privacidade, Consentimento
  - ✅ Meus Dados, Cookies
  - ✅ Solicitações (Admin), Auditoria LGPD (Admin)

### Permissões Granulares

- [x] [P1] Implementar sistema de permissões granulares:
  - ✅ `packages/shared/src/auth/permissions.ts`
  - ✅ Tipos: PermissionAction, PermissionResource, Permission
  - ✅ ROLE_PERMISSIONS mapping completo
  - ✅ Funções: hasPermission, hasAllPermissions, hasAnyPermission, can, getAccessLevel

### Rotas

- [x] [P1] Atualizar App.tsx com todas as rotas dos novos módulos:
  - ✅ Rotas de ETL com proteção por role
  - ✅ Rotas de Observabilidade com proteção por role
  - ✅ Rotas de Documentação (públicas)
  - ✅ Rotas de LGPD (públicas)

### Navegação Avançada

- [x] [P1] Implementar ModuleFunctionsPanel:
  - ✅ `apps/web/src/components/navigation/ModuleFunctionsPanel.tsx`
  - ✅ Busca por funções com highlight
  - ✅ Sistema de favoritos com localStorage
  - ✅ Agrupamento por categoria (colapsável)
  - ✅ Atalhos de teclado (Ctrl+K, Ctrl+Shift+F, Esc)
  - ✅ Controle de permissões por role

- [x] [P1] Criar estilos CSS do painel:
  - ✅ `apps/web/src/styles/module-functions-panel.css`
  - ✅ Suporte a dark mode
  - ✅ Animações e transições
  - ✅ Responsividade para mobile
  - ✅ Estilização de scrollbar

- [x] [P1] Integrar painel no layout:
  - ✅ `apps/web/src/components/layout/AppLayout.tsx` - Integração com toggle
  - ✅ `apps/web/src/components/layout/Header.tsx` - Botão de toggle
  - ✅ Detecção automática de módulos com funções
  - ✅ Margin dinâmico baseado no estado do painel

### Deploy em Produção

- [x] [P0] Preparar infraestrutura de produção:
  - ✅ `infra/docker-compose.prod.yml` - Stack completa com Traefik + TLS
  - ✅ `infra/.env.production.example` - Template de variáveis de produção
  - ✅ `scripts/deploy-prod.sh` - Script automatizado de deploy
  - ✅ `apps/web/nginx.conf` - Proxy reverso para API configurado
  - ✅ `.gitignore` - Proteção de arquivos sensíveis
  - ✅ Build validado e pronto para produção

---

## Observações Finais

### Como usar este arquivo

1. **Priorize P0** — Comece sempre pelos itens críticos
2. **Fase por fase** — Complete uma fase antes de iniciar outra (exceto bloqueios)
3. **Marque concluídos** — Use `[x]` para marcar itens finalizados
4. **Adicione notas** — Documente decisões e problemas encontrados abaixo de cada item
5. **Atualize datas** — Adicione data de conclusão nos itens importantes

### Notas de Implementação

<!-- Adicione notas conforme implementa os itens -->

**Exemplo:**
```markdown
- [x] [P0] Remover `apps/web/.env` do git
  - ✅ Concluído em 2024-12-10
  - Nota: Também atualizei o .gitignore para evitar reinclusão
```

---

*Este checklist acompanha o documento `docs/PROPOSTA_ARQUITETURA.md`*

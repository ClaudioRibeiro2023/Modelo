# 📊 Progresso MVP TechDados

> **Atualizado em**: 2024-12-18
> **Branch**: `main`

---

## Resumo Executivo

| Fase             | Status       | Data       |
| ---------------- | ------------ | ---------- |
| A1 - Guia Mestre | ✅ Concluído | 2024-12-17 |
| A2 - INDEX.md    | ✅ Concluído | 2024-12-17 |
| A3 - Auditoria   | ✅ Concluído | 2024-12-17 |
| F0 - Preflight   | ✅ Concluído | 2024-12-17 |
| F1 - Env vars    | ✅ Concluído | 2024-12-17 |
| F2 - Keycloak    | ✅ Concluído | 2024-12-17 |
| F3 - BFF         | ✅ Concluído | 2024-12-17 |
| F4 - Web Shell   | ✅ Concluído | 2024-12-17 |
| F5 - Dashboard   | ✅ Concluído | 2024-12-17 |
| F6 - Export      | ✅ Concluído | 2024-12-17 |
| F7 - Smoke       | ✅ Concluído | 2024-12-17 |
| F8 - Fechamento  | ✅ Concluído | 2024-12-17 |

---

## Detalhamento por Fase

### A - Preparação

#### A1 - Guia Mestre ✅

- [x] Criar `docs/_backlog/GUIA_MESTRE_MVP.md`
- [x] Definir visão, escopo, fases F0-F8
- [x] Documentar RBAC, ABAC, upstream, export
- [x] Critérios de sucesso (DoD)

#### A2 - Portal ✅

- [x] Atualizar `docs/INDEX.md` com link para Guia Mestre

#### A3 - Auditoria ✅

- [x] Criar `PROGRESSO_MVP.md`
- [x] Criar `VALIDACAO_FINAL.md`
- [x] Atualizar `LOG_DE_LIMPEZA.md`
- [x] Criar `PLANO_DE_ACAO.md`

---

### F0 - Preflight & Baseline ✅

- [x] `git status` — working tree clean
- [x] `pnpm -w install`
- [x] `pnpm -w lint` — 0 erros
- [x] `pnpm -w typecheck` — 0 erros
- [x] Registrar em VALIDACAO_FINAL.md

---

### F1 - Variáveis de Ambiente ✅

- [x] Atualizar `docs/operacao/variaveis-ambiente.md`
- [x] Atualizar `.env.example` em infra/web/api-template

---

### F2 - Keycloak ✅

- [x] Seed realm techdados
- [x] Roles: admin, estrategico, tatico, operacional, apoio_indireto, auditoria
- [x] Scopes: td:read, td:export, td:admin, td:audit
- [x] Claims de território

---

### F3 - BFF FastAPI ✅

- [x] GET /api/v1/health
- [x] GET /api/v1/me
- [x] GET /api/v1/nav
- [x] GET /api/v1/epidemiologia/ranking
- [x] GET /api/v1/operacao/cobertura
- [x] POST /api/v1/export
- [x] Enforcement RBAC
- [x] Auditoria estruturada

---

### F4 - Web Shell ✅

- [x] Consumir /me e /nav
- [x] Sidebar dinâmica
- [x] Route guards
- [x] Páginas placeholder

---

### F5 - Dashboard ✅

- [x] Filtros UF/Município
- [x] Gráfico de barras
- [x] Tabela ranking
- [x] Estados loading/erro/vazio
- [x] Indicador MOCK/REAL

---

### F6 - Export ✅

- [x] Backend: limite + auditoria
- [x] Frontend: modal + download

---

### F7 - Smoke Tests ✅

- [x] BFF health
- [x] Nav endpoint
- [x] Export 403 sem scope
- [x] Web home carrega

---

### F8 - Fechamento ✅

- [x] Lint final
- [x] Typecheck final
- [x] Documentação atualizada
- [x] Merge para main

---

## Métricas

| Métrica          | Alvo | Atual |
| ---------------- | ---- | ----- |
| Lint errors      | 0    | 0     |
| Typecheck errors | 0    | 0     |
| Smoke tests      | 100% | ✅    |
| Cobertura        | ≥60% | -     |

---

## Pendências P1/P2

### P1 (Bloqueantes)

- ~~**Router BFF não exposto**~~: ✅ **RESOLVIDO** (2024-12-18)
  - **Causa**: Endpoints não estavam implementados em `apps/api/app/api/v1/endpoints/`
  - **Solução**: Criados endpoints `epidemiologia.py`, `operacao.py`, `risco.py`, `nav.py`
  - **Verificado**: Todos endpoints respondendo corretamente via curl/Invoke-WebRequest

### P2 (Importantes)

- Conectar upstream real (Techdengue API) quando disponível
- Deploy Keycloak em staging

---

## Log de Atualizações

| Data       | Fase | Ação                                   |
| ---------- | ---- | -------------------------------------- |
| 2024-12-17 | A1   | Guia Mestre criado                     |
| 2024-12-17 | A2   | INDEX.md atualizado                    |
| 2024-12-17 | A3   | Arquivos de auditoria criados          |
| 2024-12-18 | P1   | Endpoints BFF corrigidos e verificados |

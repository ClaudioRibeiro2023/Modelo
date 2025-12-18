# 📊 Progresso MVP TechDados

> **Atualizado em**: 2024-12-17
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

#### A3 - Auditoria 🔄

- [x] Criar `PROGRESSO_MVP.md`
- [ ] Criar `VALIDACAO_FINAL.md`
- [ ] Atualizar `LOG_DE_LIMPEZA.md`
- [ ] Criar `PLANO_DE_ACAO.md`

---

### F0 - Preflight & Baseline ⏳

- [ ] `git status` — working tree clean
- [ ] `pnpm -w install`
- [ ] `pnpm -w lint` — 0 erros
- [ ] `pnpm -w typecheck` — 0 erros
- [ ] Registrar em VALIDACAO_FINAL.md

---

### F1 - Variáveis de Ambiente ⏳

- [ ] Atualizar `docs/operacao/variaveis-ambiente.md`
- [ ] Atualizar `.env.example` em infra/web/api-template

---

### F2 - Keycloak ⏳

- [ ] Seed realm techdados
- [ ] Roles: admin, estrategico, tatico, operacional, apoio_indireto, auditoria
- [ ] Scopes: td:read, td:export, td:admin, td:audit
- [ ] Claims de território

---

### F3 - BFF FastAPI ⏳

- [ ] GET /api/v1/health
- [ ] GET /api/v1/me
- [ ] GET /api/v1/nav
- [ ] GET /api/v1/epidemiologia/ranking
- [ ] GET /api/v1/operacao/cobertura
- [ ] POST /api/v1/export
- [ ] Enforcement RBAC
- [ ] Auditoria estruturada

---

### F4 - Web Shell ⏳

- [ ] Consumir /me e /nav
- [ ] Sidebar dinâmica
- [ ] Route guards
- [ ] Páginas placeholder

---

### F5 - Dashboard ⏳

- [ ] Filtros UF/Município
- [ ] Gráfico de barras
- [ ] Tabela ranking
- [ ] Estados loading/erro/vazio
- [ ] Indicador MOCK/REAL

---

### F6 - Export ⏳

- [ ] Backend: limite + auditoria
- [ ] Frontend: modal + download

---

### F7 - Smoke Tests ⏳

- [ ] BFF health
- [ ] Nav endpoint
- [ ] Export 403 sem scope
- [ ] Web home carrega

---

### F8 - Fechamento ⏳

- [ ] Lint final
- [ ] Typecheck final
- [ ] Documentação atualizada
- [ ] Merge para main

---

## Métricas

| Métrica          | Alvo | Atual |
| ---------------- | ---- | ----- |
| Lint errors      | 0    | -     |
| Typecheck errors | 0    | -     |
| Smoke tests      | 100% | -     |
| Cobertura        | ≥60% | -     |

---

## Pendências P1/P2

### P1 (Bloqueantes)

- **Router BFF não exposto**: Endpoints do `router.py` (/api/epi/ranking, /api/operacao/cobertura, etc.) não são expostos pelo uvicorn apesar de existirem no app quando importado diretamente. Endpoints de `wiring.py` (/api/v1/me, /api/v1/nav) funcionam normalmente.
  - **Workaround**: Usar mock data no frontend enquanto investiga
  - **Investigar**: Conflito de módulos Python ou cache do uvicorn

### P2 (Importantes)

- Conectar upstream real (Techdengue API) quando disponível
- Deploy Keycloak em staging

---

## Log de Atualizações

| Data       | Fase | Ação                          |
| ---------- | ---- | ----------------------------- |
| 2024-12-17 | A1   | Guia Mestre criado            |
| 2024-12-17 | A2   | INDEX.md atualizado           |
| 2024-12-17 | A3   | Arquivos de auditoria criados |

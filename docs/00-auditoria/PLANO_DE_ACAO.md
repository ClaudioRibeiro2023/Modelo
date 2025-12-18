# Plano de Ação - Documentação

> **Data:** 2024-12-16  
> **Status:** Consolidação concluída

---

## Ações Concluídas

### Estrutura ✅

- [x] Criar estrutura canônica em docs/
  - arquitetura/, contratos-integracao/, operacao/, seguranca/, adr_v2/
- [x] Estabelecer INDEX.md como portal mestre
- [x] Criar \_archive/2024-12-16/ com MOTIVO.md
- [x] Criar \_backlog/ para itens de backlog

### Consolidação ✅

- [x] Arquivar docs legados (ARCHITECTURE.md, GETTING_STARTED.md, etc.)
- [x] Arquivar pasta adr/ legada (substituída por adr_v2/)
- [x] Mover todo.md da raiz para \_backlog/
- [x] Mover UI_UX_IMPROVEMENTS.md para \_backlog/

### Stubs ✅

- [x] Criar stubs de compatibilidade para docs movidos:
  - ARCHITECTURE.md → arquitetura/ + adr_v2/
  - GETTING_STARTED.md → operacao/setup-local.md
  - DEPLOY.md → operacao/deploy.md
  - ROLES_E_ACESSO.md → seguranca/rbac.md
  - PROPOSTA_ARQUITETURA.md → \_archive/
  - VALIDATION_CHECKLIST.md → 00-auditoria/VALIDACAO_FINAL.md

### Links ✅

- [x] Corrigir links quebrados em TROUBLESHOOTING.md
- [x] Corrigir links quebrados em adr_v2/template_v2.md
- [x] Atualizar README.md (raiz) com links para docs/
- [x] Atualizar CONTRIBUTING.md com link para INDEX.md

### Limpeza ✅

- [x] Eliminar relatórios temporários (\_report/)
- [x] Consolidar entregáveis em 00-auditoria/

---

## Ações Pendentes

### P1 - Alta Prioridade

| Tarefa                             | Responsável | Prazo    |
| ---------------------------------- | ----------- | -------- |
| Commit e push das mudanças         | Dev         | Imediato |
| Revisar [TODO: confirmar] nos ADRs | Equipe      | 1 semana |

### P2 - Média Prioridade

| Tarefa                              | Responsável | Prazo     |
| ----------------------------------- | ----------- | --------- |
| Criar pasta exemplos/ em contratos/ | Dev         | 2 semanas |
| Adicionar mais exemplos de código   | Dev         | 2 semanas |

### P3 - Baixa Prioridade

| Tarefa                             | Responsável | Prazo              |
| ---------------------------------- | ----------- | ------------------ |
| Resolver lint warnings em .md      | Dev         | Quando conveniente |
| Traduzir termos técnicos restantes | Dev         | Quando conveniente |

---

## Manutenção Contínua

### Ao Criar Novo Documento

1. Adicionar à pasta canônica apropriada
2. Atualizar INDEX.md
3. Seguir template existente (especialmente ADRs)

### Ao Deprecar Documento

1. Mover para \_archive/YYYY-MM-DD/
2. Atualizar MOTIVO.md na pasta
3. Criar stub no local original (se havia links externos)

### Ao Modificar Estrutura

1. Atualizar INDEX.md
2. Verificar links internos
3. Atualizar README.md se necessário

---

_Gerado em 2024-12-16 por auditoria automatizada_

---

## MVP Bootstrap — 2025-12-17

> **Branch:** `feat/mvp-bootstrap`  
> **Objetivo:** Inicializar construção do produto MVP

### Checklist de Fases

- [x] **Fase 0:** Pré-flight (diagnóstico e baseline)
  - [x] `git status` limpo
  - [x] pnpm v9.15.9 instalado
  - [x] Branch `feat/mvp-bootstrap` criada
  - [x] Auditoria inicial atualizada
  - [x] Documentação de entrada lida

- [ ] **Fase 1:** Contratos MVP (BFF ↔ Web ↔ Upstream)
  - [ ] Criar `docs/contratos-integracao/bff-techdados.md`
  - [ ] Definir endpoints MVP (health, me, nav, epi, ops, export)

- [ ] **Fase 2:** Implementar BFF MVP (FastAPI)
  - [ ] Routers: health, me, nav, epidemiologia, operacao, export
  - [ ] Client upstream com timeout/retry
  - [ ] Recorte territorial por claims
  - [ ] Auditoria JSON (stdout)

- [ ] **Fase 3:** Web MVP (rotas + módulos + UI)
  - [ ] Sidebar com módulos de `arvore-modulos.md`
  - [ ] Páginas placeholder MVP
  - [ ] Data fetch layer (`services/bff.ts`)
  - [ ] 1 gráfico real mínimo

- [ ] **Fase 4:** Auth OIDC + RBAC Frontend
  - [ ] Login/callback Keycloak
  - [ ] `/me` e `/nav` no boot
  - [ ] Guardas de rota por permissão

- [ ] **Fase 5:** Smoke Tests P0
  - [ ] Health check
  - [ ] Login mock
  - [ ] Nav retorna
  - [ ] Export bloqueado sem scope

- [ ] **Fase 6:** Fechamento
  - [ ] `pnpm lint` ✅
  - [ ] `pnpm typecheck` ✅
  - [ ] Commits em blocos
  - [ ] VALIDACAO_FINAL.md atualizado

# Log de Limpeza - Documentação

> **Data:** 2024-12-16  
> **Operação:** Consolidação e limpeza de documentação

---

## Resumo da Operação

| Ação                        | Quantidade |
| --------------------------- | ---------- |
| Arquivos movidos p/ archive | 17         |
| Stubs criados               | 6          |
| Arquivos deletados          | 3          |
| Pastas eliminadas           | 1          |

---

## Arquivos Movidos para \_archive/2024-12-16/

### Documentos Legados

| Arquivo Original        | Motivo                                |
| ----------------------- | ------------------------------------- |
| ARCHITECTURE.md         | Consolidado em arquitetura/ + adr_v2/ |
| GETTING_STARTED.md      | Duplicado por operacao/setup-local.md |
| ROLES_E_ACESSO.md       | Duplicado por seguranca/rbac.md       |
| PROPOSTA_ARQUITETURA.md | Histórico - proposta inicial          |
| VALIDATION_CHECKLIST.md | Substituído por VALIDACAO_FINAL.md    |

### ADRs Legados (pasta adr/)

| Arquivo             | Motivo                         |
| ------------------- | ------------------------------ |
| adr/README.md       | Substituído por adr_v2/        |
| adr/000-template    | Substituído por template_v2.md |
| adr/001-stack       | Substituído por adr_v2/001     |
| adr/002-arquitetura | Substituído por adr_v2/002     |
| adr/003-auth        | Substituído por adr_v2/003     |

### Relatórios Intermediários

| Arquivo            | Motivo                         |
| ------------------ | ------------------------------ |
| inventario.md      | Consolidado em VALIDACAO_FINAL |
| duplicidades.md    | Consolidado em VALIDACAO_FINAL |
| validacao-final.md | Renomeado para 00-auditoria/   |

### Auditoria Anterior

| Arquivo                         | Motivo                    |
| ------------------------------- | ------------------------- |
| 00-auditoria/VALIDACAO_FINAL.md | Versão anterior arquivada |
| 00-auditoria/PLANO_DE_ACAO.md   | Versão anterior arquivada |
| 00-auditoria/LOG_DE_LIMPEZA.md  | Versão anterior arquivada |

---

## Arquivos Deletados Definitivamente

| Arquivo                          | Motivo                   |
| -------------------------------- | ------------------------ |
| docs/\_report/inventario.md      | Temporário - consolidado |
| docs/\_report/duplicidades.md    | Temporário - consolidado |
| docs/\_report/validacao-final.md | Temporário - consolidado |

**Critérios atendidos para deleção:**

- ✅ Não referenciados (sem inlinks ativos)
- ✅ Conteúdo consolidado em entregáveis finais
- ✅ Não necessários para compliance/traceabilidade

---

## Pasta Eliminada

| Pasta          | Motivo                                   |
| -------------- | ---------------------------------------- |
| docs/\_report/ | Temporária - criada durante consolidação |

---

## Stubs Criados

| Stub                         | Aponta Para                     |
| ---------------------------- | ------------------------------- |
| docs/ARCHITECTURE.md         | arquitetura/ + adr_v2/          |
| docs/GETTING_STARTED.md      | operacao/setup-local.md         |
| docs/DEPLOY.md               | operacao/deploy.md              |
| docs/ROLES_E_ACESSO.md       | seguranca/rbac.md               |
| docs/PROPOSTA_ARQUITETURA.md | \_archive/ + \_backlog/         |
| docs/VALIDATION_CHECKLIST.md | 00-auditoria/VALIDACAO_FINAL.md |

---

## Verificação de Integridade

| Check                              | Resultado |
| ---------------------------------- | --------- |
| Links internos validados           | ✅ OK     |
| Nenhum doc canônico removido       | ✅ OK     |
| Archive com MOTIVO.md              | ✅ OK     |
| Stubs apontam para docs existentes | ✅ OK     |
| INDEX.md navegável                 | ✅ OK     |

---

## Estrutura Final

```
docs/
├── 00-auditoria/           ← Entregáveis de auditoria
│   ├── VALIDACAO_FINAL.md
│   ├── PLANO_DE_ACAO.md
│   └── LOG_DE_LIMPEZA.md
├── INDEX.md                ← Portal canônico
├── arquitetura/            ← C4 diagrams
├── contratos-integracao/   ← API contracts
├── operacao/               ← DevOps guides
├── seguranca/              ← Security docs
├── adr_v2/                 ← ADRs oficiais
├── _archive/               ← Histórico
│   └── 2024-12-16/
│       └── MOTIVO.md
└── _backlog/               ← Ideias/backlog
```

---

_Gerado em 2024-12-16 por auditoria automatizada_

---

## Operação: Rebranding Template → TechDados

> **Data:** 2024-12-17  
> **Operação:** Transformação do template "modelo" para produto TechDados

### Arquivos Modificados (Rebranding)

| Arquivo                               | Alteração                                              |
| ------------------------------------- | ------------------------------------------------------ |
| `README.md`                           | Título e descrição → TechDados                         |
| `docs/INDEX.md`                       | Portal canônico → TechDados                            |
| `package.json` (root)                 | `@template/platform` → `@techdados/platform`           |
| `apps/web/package.json`               | `@template/web` → `@techdados/web`                     |
| `packages/design-system/package.json` | `@template/design-system` → `@techdados/design-system` |
| `packages/shared/package.json`        | `@template/shared` → `@techdados/shared`               |
| `packages/types/package.json`         | `@template/types` → `@techdados/types`                 |
| `infra/.env.example`                  | Nomes de projeto → techdados                           |
| `infra/.env.production.example`       | Imagens Docker → techdados                             |
| `apps/web/.env.example`               | Realm/client → techdados                               |
| `docs/operacao/setup-local.md`        | URLs e referências → TechDados                         |
| `docs/TROUBLESHOOTING.md`             | Links GitHub atualizados                               |

### Referências Mantidas (Histórico)

| Local                        | Motivo                                                                   |
| ---------------------------- | ------------------------------------------------------------------------ |
| `docs/seguranca/rbac.md:216` | "Modelo Atual (Flat)" refere-se ao modelo de hierarquia, não ao template |
| `docs/_archive/`             | Referências históricas preservadas                                       |

### Novos Arquivos Criados

| Arquivo                                  | Descrição                               |
| ---------------------------------------- | --------------------------------------- |
| `docs/seguranca/RBAC.md`                 | Baseline RBAC do TechDados (atualizado) |
| `docs/contratos-integracao/api-dados.md` | Placeholder do contrato da API de Dados |
| `docs/operacao/variaveis-ambiente.md`    | Referência de variáveis de ambiente     |
| `docs/00-auditoria/VALIDACAO_FINAL.md`   | Resultado da validação final            |

_Atualizado em 2024-12-17 - Fundação TechDados_

---

## Normalização da Documentação (2025-12-17)

**Operação:** Eliminação de duplicidade e consolidação de stubs  
**Motivo:** Garantir que `docs/INDEX.md` seja o portal canônico e que arquivos na raiz de `docs/` sejam apenas stubs

### Arquivos Movidos para Archive

| Arquivo Original          | Destino Archive                               | Motivo                 |
| ------------------------- | --------------------------------------------- | ---------------------- |
| `docs/BOOK_OF_TESTS.md`   | `docs/_archive/2025-12-17/BOOK_OF_TESTS.md`   | Long-form (268 linhas) |
| `docs/DESIGN_SYSTEM.md`   | `docs/_archive/2025-12-17/DESIGN_SYSTEM.md`   | Long-form (706 linhas) |
| `docs/TROUBLESHOOTING.md` | `docs/_archive/2025-12-17/TROUBLESHOOTING.md` | Long-form (329 linhas) |
| `docs/99-mapa-do-repo.md` | `docs/_archive/2025-12-17/99-mapa-do-repo.md` | Long-form (326 linhas) |

### Arquivos Movidos para Locais Canônicos

| Conteúdo Original    | Novo Local Canônico                |
| -------------------- | ---------------------------------- |
| `BOOK_OF_TESTS.md`   | `docs/operacao/testes.md`          |
| `DESIGN_SYSTEM.md`   | `docs/produto/design-system.md`    |
| `TROUBLESHOOTING.md` | `docs/operacao/troubleshooting.md` |
| `99-mapa-do-repo.md` | `docs/arquitetura/mapa-repo.md`    |

### Stubs Criados/Atualizados

| Stub                      | Aponta Para                        |
| ------------------------- | ---------------------------------- |
| `docs/BOOK_OF_TESTS.md`   | `docs/operacao/testes.md`          |
| `docs/DESIGN_SYSTEM.md`   | `docs/produto/design-system.md`    |
| `docs/TROUBLESHOOTING.md` | `docs/operacao/troubleshooting.md` |
| `docs/99-mapa-do-repo.md` | `docs/arquitetura/mapa-repo.md`    |

### Stubs Já Existentes (Mantidos)

| Stub                           | Target Canônico                        |
| ------------------------------ | -------------------------------------- |
| `docs/ARCHITECTURE.md`         | `docs/arquitetura/` + `docs/adr_v2/`   |
| `docs/GETTING_STARTED.md`      | `docs/operacao/setup-local.md`         |
| `docs/DEPLOY.md`               | `docs/operacao/deploy.md`              |
| `docs/ROLES_E_ACESSO.md`       | `docs/seguranca/rbac.md`               |
| `docs/PROPOSTA_ARQUITETURA.md` | `docs/_archive/` (histórico)           |
| `docs/VALIDATION_CHECKLIST.md` | `docs/00-auditoria/VALIDACAO_FINAL.md` |

### Novos Arquivos/Pastas Criados

| Arquivo/Pasta                    | Descrição                                     |
| -------------------------------- | --------------------------------------------- |
| `docs/seguranca/_refs/`          | Pasta para referências normativas externas    |
| `docs/seguranca/_refs/README.md` | Placeholder para PDF de Hierarquia de Acessos |
| `docs/_archive/2025-12-17/`      | Pasta de archive para esta operação           |

### Atualizações em Arquivos Canônicos

| Arquivo                  | Alteração                                                                    |
| ------------------------ | ---------------------------------------------------------------------------- |
| `docs/INDEX.md`          | Corrigido conteúdo corrompido; atualizado link para troubleshooting canônico |
| `docs/seguranca/rbac.md` | Adicionado link para `_refs/README.md`                                       |

_Atualizado em 2025-12-17 - Normalização da Documentação TechDados_

---

## [2025-12-17 22:11:52] AplicaÃ§Ã£o de Estrutura Docs

- **Branch:** chore/apply-estrutura-docs
- **ZIPs processados:** 17
  - techdados_bloco_01, techdados_bloco_02_bff_fastapi, techdados_bloco_03_bff_integracao_upstream, techdados_bloco_04_rbac_escopo_exportacao, techdados_bloco_05_export_filter_csv, techdados_bloco_06_export_filter_parquet_audit, techdados_bloco_07_keycloak_jwt_auth, techdados_bloco_08_keycloak_seed_realm_client_scopes, techdados_bloco_09_frontend_oidc_rbac_nav, techdados_bloco_10_bff_me_frontend, techdados_bloco_11_produto_planejamento, techdados_bloco_12_upstream_techdengue_api, techdados_bloco_13_wiring_definitivo_p0, techdados_bloco_14_bff_rbac_policies_nav_audit, techdados_bloco_15_catalogo_dados_matriz_analises_modulos, techdados_bloco_16_documentacao_mvp_finalizacao_c4_runbook_quality_governanca, techdados_bloco_17_refs_pdf_hierarquia_acessos_links
- **Resumo numérico:**
  - Analisados: 233
  - Copiados: 161
  - Skip: 2
  - Pendentes: 53
  - Meta: 17

---

## [2025-12-17 22:16] MVP Bootstrap Iniciado

- **Branch:** `feat/mvp-bootstrap`
- **Operação:** Inicialização da construção do MVP TechDados
- **Objetivo:** Sair de "documentação pronta" para "produto rodando"

### Escopo do MVP Bootstrap

1. **BFF FastAPI** com endpoints MVP (health, me, nav, epidemiologia, operacao, export)
2. **Web** com módulos MVP (sidebar, rotas, páginas)
3. **Auth OIDC** (Keycloak) funcionando end-to-end
4. **RBAC/território** aplicado no BFF e refletido na navegação
5. **Auditoria básica** (acessos + exports)
6. **Smoke tests P0** automatizados

### Documentação de entrada

- `docs/produto/arvore-modulos.md` — estrutura de módulos
- `docs/produto/matriz-analises.md` — KPIs e análises
- `docs/contratos-integracao/techdengue-upstream.md` — endpoints upstream
- `docs/seguranca/rbac.md` + `hierarquia-acessos.md` — RBAC/ABAC
- `docs/dados/catalogo-datasets.md` — datasets disponíveis

### Fases planejadas

- [x] Fase 0: Pré-flight (diagnóstico e baseline)
- [x] Fase 1: Contratos MVP (BFF ↔ Web ↔ Upstream)
- [x] Fase 2: Implementar BFF MVP
- [x] Fase 3: Web MVP (rotas + módulos + UI base)
- [x] Fase 4: Auth OIDC + RBAC no Frontend
- [x] Fase 5: Smoke Tests P0
- [x] Fase 6: Fechamento e Commit

---

## 2025-12-17 — MVP Bootstrap Concluído

**Operação:** Fechamento do MVP Bootstrap  
**Branch:** `feat/mvp-bootstrap`  
**Status:** ✅ Concluído

### Commits realizados

1. `f8080b2` - feat(mvp): bootstrap inicial do produto techdados
2. `627a164` - feat(web): conectar modulos ao bff com hooks e tabelas
3. `41a70c2` - feat(web): adicionar filtro territorial e grafico de barras

### Arquivos criados/modificados

**BFF:**

- `api-template/app/techdados_bff/main.py` — wiring adicional
- `api-template/app/techdados_bff/wiring.py` — /me e /nav routers
- `api-template/.env.example` — variáveis de ambiente

**Web:**

- `apps/web/src/modules/epi/index.tsx` — Módulo Epidemiologia
- `apps/web/src/modules/ops/index.tsx` — Módulo Operação
- `apps/web/src/modules/risk/index.tsx` — Módulo Risco
- `apps/web/src/modules/exports/index.tsx` — Módulo Exportações
- `apps/web/src/modules/audit/index.tsx` — Módulo Auditoria
- `apps/web/src/hooks/useBff.ts` — Hooks para comunicação BFF
- `apps/web/src/components/filters/TerritoryFilter.tsx` — Filtro territorial
- `apps/web/src/components/charts/SimpleBarChart.tsx` — Gráfico de barras
- `apps/web/src/config/navigation-default.ts` — Navegação MVP

**Docs:**

- `docs/contratos-integracao/bff-techdados.md` — Contrato BFF MVP

### Validações

- `pnpm lint`: ✅ 0 erros (12 warnings de `any` types)
- `pnpm typecheck`: ✅ Passando

---

## 2025-12-22 — Limpeza de temporários (docs/\_estrutura.docs)

### Ações

- Movidos (preservando histórico via `git mv`):
  - `docs/_estrutura.docs/*.zip` → `docs/_archive/2025-12-22/_zips/*.zip`
  - Criado: `docs/_archive/2025-12-22/_zips/MOTIVO.md`

- Removidos (artefatos temporários recriáveis a partir dos ZIPs):
  - Diretórios extraídos em `docs/_estrutura.docs/techdados_bloco_*/`

### Motivo

- Os `.zip` são artefatos de importação/distribuição e não são documentação canônica.
- As pastas extraídas eram resíduos de unzip e não devem ser versionadas.

# 🎯 Guia Mestre de Implementação — TechDados MVP

> **Documento Canônico**: Este arquivo é a fonte de verdade para execução do MVP.
> **Última atualização**: 2024-12-17
> **Branch de trabalho**: `feat/mvp-bootstrap`

---

## 1. Visão do MVP

### 1.1 Objetivo

Construir o MVP funcional do TechDados — plataforma de inteligência epidemiológica para controle de arboviroses — com:

- Autenticação via Keycloak (OIDC)
- RBAC/ABAC por território
- Dashboards com dados do Techdengue (upstream) ou mock
- Exportação auditada
- Auditoria completa de ações

### 1.2 Escopo MVP

| Incluído                      | Fora do Escopo              |
| ----------------------------- | --------------------------- |
| Login OIDC Keycloak           | SSO federado                |
| 3 dashboards (Epi, Ops, Risk) | ML/previsões                |
| Export CSV                    | Export Parquet/Excel        |
| Filtros UF/Município          | Drill-down multi-nível      |
| RBAC 6 roles                  | Fluxos de aprovação         |
| Auditoria em log              | Dashboard de auditoria      |
| Mock mode                     | Integração real obrigatória |

### 1.3 Usuários-alvo

- **Estratégico**: Visão estadual, exporta dados agregados
- **Tático**: Visão regional, gerencia operações
- **Operacional**: Visão municipal, executa campo
- **Apoio**: Acesso limitado, consulta
- **Auditoria**: Acesso a logs, não modifica
- **Admin**: Acesso total, configura sistema

---

## 2. Definições Técnicas

### 2.1 RBAC (Role-Based Access Control)

```
Roles:
- admin          → Acesso total
- estrategico    → Visão estadual + export
- tatico         → Visão regional + operações
- operacional    → Visão municipal + execução
- apoio_indireto → Consulta limitada
- auditoria      → Logs read-only
```

### 2.2 ABAC (Attribute-Based Access Control)

```
Território (claims no JWT):
- td_scopes: ["STATE:MG", "CITY:3106200"]
- Formato: {TIPO}:{CODIGO_IBGE}

Regras:
- STATE:XX → acesso a todo o estado
- REGION:XXXX → acesso à regional
- CITY:XXXXXXX → acesso apenas ao município
```

### 2.3 Upstream (Techdengue API)

```
Modo: TD_UPSTREAM_MODE=mock|real

Endpoints consumidos:
- GET /api/v1/epidemiologia/ranking
- GET /api/v1/operacao/cobertura
- GET /api/v1/risco/dashboard

Fallback:
- Se upstream indisponível → mock data
- UI indica claramente: "[MOCK]" ou "[REAL]"
```

### 2.4 Export

```
Formatos MVP: CSV (UTF-8 BOM)
Limite: TD_EXPORT_MAX_ROWS=50000
Auditoria: user_id, filtros, timestamp, bytes, rows
Scope necessário: td:export
```

### 2.5 Auditoria

```
Eventos obrigatórios:
- AUTH_LOGIN_SUCCESS / AUTH_LOGIN_FAILURE
- DATA_QUERY_EXECUTED
- DATA_VIEW_OPENED
- EXPORT_REQUESTED / EXPORT_COMPLETED
- ADMIN_ACTION_PERFORMED

Formato: JSON estruturado para stdout
Campos: timestamp, event, user_id, request_id, metadata
```

---

## 3. Fases de Execução

### F0 — Preflight & Baseline

**Objetivo**: Garantir repo limpa e validações passando.

- [ ] `git status` — working tree clean
- [ ] `pnpm -w install` — dependências OK
- [ ] `pnpm -w lint` — 0 erros (warnings OK)
- [ ] `pnpm -w typecheck` — 0 erros
- [ ] Registrar em `VALIDACAO_FINAL.md`

**Commit**: `chore: preflight + registro validacao`

---

### F1 — Variáveis de Ambiente

**Objetivo**: Padronizar envs para BFF/Web/Keycloak.

- [ ] Atualizar `docs/operacao/variaveis-ambiente.md`:
  - `TD_UPSTREAM_MODE=mock|real`
  - `TD_TECHDENGUE_BASE_URL`
  - `KEYCLOAK_ISSUER`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`
  - `TD_EXPORT_MAX_ROWS`, `TD_EXPORT_FORMATS`
  - `TD_AUTH_MODE=mock|keycloak`

- [ ] Atualizar `.env.example`:
  - `infra/.env.example`
  - `apps/web/.env.example`
  - `api-template/.env.example`

**Commit**: `chore(env): padronizar variaveis + upstream mode`

---

### F2 — Keycloak Setup

**Objetivo**: Realm "techdados" com roles/scopes mínimos.

- [ ] Verificar/criar seed idempotente
- [ ] Roles: `admin`, `estrategico`, `tatico`, `operacional`, `apoio_indireto`, `auditoria`
- [ ] Scopes: `td:read`, `td:export`, `td:admin`, `td:audit`
- [ ] Claims de território: `td_scopes`
- [ ] Usuários de teste (1 por role)
- [ ] Validar emissão de token

**Commit**: `feat(auth): seed keycloak realm techdados + roles/scopes`

---

### F3 — BFF FastAPI (MVP Endpoints)

**Objetivo**: Endpoints mínimos com RBAC e auditoria.

Endpoints:

- [ ] `GET /api/v1/health` — público
- [ ] `GET /api/v1/me` — autenticado
- [ ] `GET /api/v1/nav` — menu por role
- [ ] `GET /api/v1/epidemiologia/ranking` — RBAC + território
- [ ] `GET /api/v1/operacao/cobertura` — RBAC + território
- [ ] `GET /api/v1/risco/dashboard` — RBAC + território
- [ ] `POST /api/v1/export` — requer `td:export`

Features:

- [ ] Enforcement RBAC no middleware
- [ ] Enforcement território (ABAC)
- [ ] Auditoria estruturada (stdout JSON)
- [ ] Mock mode quando upstream indisponível

**Validação**:

- curl com token → 200
- export sem scope → 403

**Commit**: `feat(bff): endpoints mvp + rbac + audit`

---

### F4 — Web Shell + Nav Dinâmica

**Objetivo**: UI inicial com menu baseado em permissões.

- [ ] Consumir `/api/v1/me` no boot
- [ ] Consumir `/api/v1/nav` para menu
- [ ] Sidebar dinâmica por role
- [ ] Route guards (sem permissão = redirect)
- [ ] Páginas placeholder:
  - `/epidemiologia`
  - `/operacao`
  - `/risco`
  - `/exportacoes`
  - `/auditoria` (se role)
  - `/admin` (se role)

**Validação**:

- Login → menu aparece
- Trocar perfil → menu muda

**Commit**: `feat(web): shell + nav dinamica + guards`

---

### F5 — Primeiro Dashboard Real

**Objetivo**: 1 dashboard com dado real/mock.

Escolher: **Epidemiologia - Ranking de Incidência**

- [ ] Filtros: UF, Município, Período
- [ ] 1 gráfico de barras (top 10)
- [ ] 1 tabela com ranking
- [ ] Estados: loading, erro, vazio
- [ ] Indicador `[MOCK]` ou `[REAL]`
- [ ] Botão export (visível só com `td:export`)

**Commit**: `feat(dashboard): primeiro painel funcional (mvp)`

---

### F6 — Export CSV + Auditoria

**Objetivo**: Exportar com segurança e rastreabilidade.

Backend:

- [ ] Limite de linhas (TD_EXPORT_MAX_ROWS)
- [ ] Gerar CSV UTF-8 BOM
- [ ] Registrar auditoria: user, filtros, bytes, rows

Frontend:

- [ ] Modal de export
- [ ] Progress feedback
- [ ] Download automático

**Validação**:

- Sem scope → 403
- Com scope → download + log

**Commit**: `feat(export): csv mvp + audit`

---

### F7 — Smoke Tests P0

**Objetivo**: Testes mínimos de confiança.

- [ ] BFF: health retorna 200
- [ ] BFF: nav retorna menu
- [ ] BFF: export sem scope → 403
- [ ] Web: home carrega
- [ ] Web: sidebar renderiza

Documentar em `docs/operacao/smoke_e2e_p0.md`

**Commit**: `test: smoke p0 (bff + web)`

---

### F8 — Fechamento

**Objetivo**: Validação final e documentação.

- [ ] `pnpm -w lint` — 0 erros
- [ ] `pnpm -w typecheck` — 0 erros
- [ ] Atualizar `VALIDACAO_FINAL.md`
- [ ] Atualizar `PROGRESSO_MVP.md`
- [ ] Atualizar `runbook.md` se necessário
- [ ] Merge para main (se branch)

**Commit**: `chore: finalizar bootstrap mvp + auditoria`

---

## 4. Critérios de Sucesso (DoD)

### MVP Done When:

- [ ] Login OIDC funciona (ou mock mode)
- [ ] Menu dinâmico por role
- [ ] 1+ dashboard com dados
- [ ] Export funciona com auditoria
- [ ] Smoke tests passam
- [ ] Lint/typecheck sem erros
- [ ] Documentação atualizada

### Métricas:

- Cobertura de código: ≥60%
- Lint errors: 0
- Typecheck errors: 0
- Smoke tests: 100% pass

---

## 5. Comandos de Validação

```bash
# F0 - Baseline
git status
pnpm -w install
pnpm -w lint
pnpm -w typecheck

# F3 - BFF
cd api-template
python -m pytest tests/ -v
curl http://localhost:8000/api/v1/health

# F4/F5 - Web
cd apps/web
pnpm dev
# Abrir http://localhost:13000

# F7 - Smoke
pnpm -w test:e2e -- --grep "smoke"

# F8 - Final
pnpm -w lint
pnpm -w typecheck
pnpm -w build
```

---

## 6. Convenções de Commit

```
Formato: <type>(<scope>): <description>

Types:
- feat     → Nova funcionalidade
- fix      → Correção de bug
- docs     → Documentação
- chore    → Manutenção
- test     → Testes
- refactor → Refatoração

Scopes:
- web      → Frontend
- bff      → Backend
- auth     → Autenticação
- env      → Variáveis de ambiente
- infra    → Infraestrutura

Exemplos:
- feat(bff): endpoints mvp + rbac + audit
- feat(web): shell + nav dinamica + guards
- chore(env): padronizar variaveis + upstream mode
- docs: criar guia mestre mvp
```

---

## 7. Planos de Fallback

### Upstream Indisponível

```
Situação: TD_TECHDENGUE_BASE_URL não responde
Ação: Ativar TD_UPSTREAM_MODE=mock
Resultado: Dados mock, UI indica "[MOCK]"
Pendência: Registrar em PROGRESSO_MVP.md
```

### Keycloak Indisponível

```
Situação: Keycloak não inicia ou token inválido
Ação: Ativar TD_AUTH_MODE=mock
Resultado: Usuário mock com roles configuráveis
Pendência: Registrar e testar com Keycloak depois
```

### Build Falha

```
Situação: pnpm build falha
Ação: Corrigir antes de avançar (fail-fast)
Resultado: Não avançar fase até resolver
```

---

## 8. Condições de Parada

**Parar e aguardar input humano se:**

1. ❌ Base URL upstream não disponível E precisa testar real
2. ❌ Credenciais Keycloak inconsistentes
3. ❌ Lint/typecheck falha persistente fora do escopo MVP
4. ❌ Dependência crítica não instala
5. ❌ Conflito de merge não trivial

**Registrar pendência e continuar se:**

1. ⚠️ Upstream indisponível → usar mock
2. ⚠️ Keycloak indisponível → usar auth mock
3. ⚠️ Warnings de lint (não erros)

---

## 9. Arquivos de Auditoria

| Arquivo                                | Propósito                       |
| -------------------------------------- | ------------------------------- |
| `docs/00-auditoria/PROGRESSO_MVP.md`   | Checklist por fase              |
| `docs/00-auditoria/VALIDACAO_FINAL.md` | Resultados lint/typecheck/build |
| `docs/00-auditoria/LOG_DE_LIMPEZA.md`  | Log cronológico de mudanças     |
| `docs/00-auditoria/PLANO_DE_ACAO.md`   | Roadmap com datas               |

---

## 10. Referências

- `docs/INDEX.md` — Portal canônico
- `docs/contratos-integracao/bff-techdados.md` — Contrato API
- `docs/seguranca/rbac-abac.md` — Modelo de acesso
- `docs/operacao/variaveis-ambiente.md` — Configuração

---

**Fim do Guia Mestre**

# Bloco 13 — Wiring definitivo (P0)

Data: 2025-12-17

## Contexto

Você já tem:

- Keycloak + JWT/RBAC (Blocos 07–08)
- Frontend OIDC + páginas login/callback (Bloco 09)
- Endpoint `/api/me` (Bloco 10)
- Planejamento do produto (Bloco 11)
- Cliente upstream + router proxy (Bloco 12)

O que ainda costuma faltar na prática é a **amarração**:

- app BFF não incluiu routers
- router upstream com DI incorreto (Depends)
- rotas do frontend não foram conectadas ao roteador real
- chamadas do frontend não mandam Authorization

Este bloco resolve esses pontos.

---

## A) BFF — Wiring de routers (1 edição)

### A1) Adicionar `wire_techdados_app(app)` no main do BFF

Abra o arquivo do app (geralmente):

- `api-template/app/techdados_bff/main.py`

Adicione:

```py
from app.techdados_bff.wiring import wire_techdados_app
wire_techdados_app(app)
```

> Se você já inclui routers manualmente, pode manter como está e só conferir o prefix/tag.

### A2) Router upstream corrigido

Este bloco entrega uma versão corrigida de:

- `api-template/app/techdados_bff/routers/techdengue_api.py`

Ela usa `Depends(get_techdengue_client)` corretamente.

---

## B) Frontend — Wiring de rotas + auth (2 edições)

### B1) Plugar rotas OIDC

No arquivo de rotas do seu app (tipicamente algo como):

- `apps/web/src/routes/config.ts`
- `apps/web/src/routes/index.ts`

Inclua `techdadosRouteObjects`:

```ts
import { techdadosRouteObjects } from './techdadosRouteObjects'
```

E concatene/spread (dependendo do seu padrão):

```ts
const routes = [...existingRoutes, ...techdadosRouteObjects]
```

### B2) Proteger rotas privadas com `RequireAuth`

Você pode envolver o layout/rotas privadas usando o componente:

- `apps/web/src/components/auth/RequireAuth.tsx`

---

## C) Frontend — Client BFF com Authorization (0–1 edição)

Este bloco adiciona:

- `apps/web/src/lib/api/bffFetch.ts`

Use esse helper sempre que chamar o BFF (inclusive `/api/me`).

---

## D) Smoke test end-to-end

Siga:

- `docs/operacao/smoke_e2e_p0.md`

---

## Notas

- UI gating é apenas UX; enforcement real é no BFF.
- Se o patch não aplicar 100% por divergência de paths, use os `.patch` como referência de “onde colar”.

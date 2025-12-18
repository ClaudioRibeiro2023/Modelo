# C4 — Component (TechDados)

## Web (apps/web)

- **routes/**: rotas públicas/privadas; callback OIDC
- **components/auth**: RequireAuth, ProtectedRoute
- **lib/api**: bffFetch (token injection)
- **modules/**:
  - epidemiologia
  - operacao
  - geoespacial
  - risco
  - export
  - admin/audit

## BFF (api-template/app/techdados_bff)

- **wiring.py**: include routers canônicos
- **routers/**:
  - techdengue_api (proxy upstream)
  - me (perfil)
  - nav (árvore permitida)
- **security/**:
  - principal (roles/scopes/território)
  - authorize (require_roles/scopes)
- **audit/**:
  - access (log estruturado)
  - middleware (opcional)
- **integrations/techdengue_api/**:
  - client (timeouts/retry/cache)
  - models (payloads)

## Observação

Os componentes evoluem por módulos, mas contratos e RBAC precisam permanecer canônicos.

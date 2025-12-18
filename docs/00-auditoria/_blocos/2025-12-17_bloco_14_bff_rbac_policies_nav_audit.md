# Bloco 14 — BFF: Políticas RBAC/Scopes + /nav + Auditoria

Data: 2025-12-17

## Objetivo

Consolidar uma camada **canônica** de autorização no BFF:

- `Principal` (quem é o usuário)
- `require_roles()` e `require_scopes()`
- `/api/v1/nav` (navegação derivada do perfil)
- Auditoria mínima de acesso (data-access logs)

---

## A) Variáveis de ambiente

Adicionar ao ambiente do BFF:

```bash
# Se seu middleware já valida JWT, deixe false
TD_AUTH_FALLBACK_UNVERIFIED_JWT=false

# Claims (Keycloak)
TD_JWT_CLIENT_ID=techdados
TD_JWT_SCOPES_CLAIM=td_scopes
TD_JWT_TERRITORY_CLAIM=td_territory   # opcional, se existir
```

---

## B) Wiring (2 passos)

### B1) Incluir router `/nav`

No `main.py` do BFF, inclua:

```py
from app.techdados_bff.routers.nav import router as nav_router
app.include_router(nav_router, prefix="/api/v1", tags=["nav"])
```

### B2) (Opcional) Auditoria como middleware

Se você tiver um middleware chain, pode incluir o `access_audit_middleware`:

- `app.techdados_bff.audit.middleware`

> Se preferir, use apenas a função `audit_access()` dentro de cada endpoint.

---

## C) Aplicar policies nos endpoints (patch)

Você pode começar protegendo o proxy upstream (`/api/v1/techdengue/*`) com policies.

Exemplo (proteger facts):

```py
from app.techdados_bff.security.authorize import require_scopes

@router.get("/facts", dependencies=[Depends(require_scopes(["td:read"]))])
async def facts(...)
```

Um patch de referência está em:

- `PATCHES/techdengue_router_add_policies.patch`

---

## DoD

- `/api/v1/nav` retorna itens conforme roles
- Chamadas a endpoints de dados geram log de auditoria
- 403 quando roles/scopes insuficientes (após aplicar patch)

# TechDados — Bloco 13: Wiring definitivo (P0) — Front + BFF + Keycloak + Upstream

Data: 2025-12-17

## Objetivo deste bloco

Fechar o “P0” (rodar ponta a ponta) com um **wiring consistente**:

1. **BFF**: inclusão de routers canônicos no app (inclui `/api/v1/techdengue/*`)
2. **Correção do DI** no router upstream do Bloco 12 (FastAPI Depends)
3. **Frontend**: rota de login/callback + helper de rotas (RouteObject) + `RequireAuth`
4. **Frontend**: client mínimo que injeta `Authorization: Bearer <token>` (OIDC)
5. **Smoke test end-to-end** (roteiro único)

> Este bloco evita sobrescrever arquivos do template onde você pode já ter customizações.
> Em vez disso, ele cria **módulos de “plug”** e fornece **patches**/passos curtos para colar.

## Como aplicar

1. Extraia o ZIP na raiz do repo (mantendo os paths).
2. Siga o guia canônico:

- `docs/00-auditoria/_blocos/2025-12-17_bloco_13_wiring_definitivo_p0.md`

## Resultado esperado (DoD)

- Login via Keycloak funciona
- Front obtém token e chama BFF com Authorization
- `GET /api/v1/techdengue/health` responde 200 via BFF
- `GET /api/v1/techdengue/facts` responde JSON via BFF

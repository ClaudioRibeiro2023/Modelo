# TechDados — Bloco 14: BFF — Políticas RBAC/Scopes + /nav + Auditoria (acesso a dados)

Data: 2025-12-17

## O que este bloco entrega

1. **Principal** (usuário) padronizado no BFF (roles/scopes/território)
2. **Helpers de autorização** (require_roles / require_scopes)
3. **Endpoint `/api/v1/nav`**: backend retorna a árvore de navegação permitida para o usuário
4. **Auditoria**: log estruturado de acesso a endpoints de dados (para rastreabilidade)
5. Documentação canônica (segurança + contrato + operação)

## Como aplicar

1. Extraia o ZIP na raiz da repo (mantendo os paths).
2. Siga o guia canônico:

- `docs/00-auditoria/_blocos/2025-12-17_bloco_14_bff_rbac_policies_nav_audit.md`

## Importante (segurança)

- O bloco assume que a **validação do JWT** já acontece (Keycloak/JWT) via seu middleware atual.
- Ele tenta ler o principal em `request.state.principal`.
- Para facilitar dev, existe um modo **fallback** (decodifica JWT sem validar assinatura) controlado por env:
  - `TD_AUTH_FALLBACK_UNVERIFIED_JWT=true`
    Use isso apenas em dev.

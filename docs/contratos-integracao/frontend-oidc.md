# Frontend OIDC — Contrato de autenticação (TechDados)

## Objetivo

Padronizar como o frontend se autentica via Keycloak e envia token ao BFF.

## Endpoints OIDC

Authority:

- `VITE_OIDC_AUTHORITY` = issuer do realm
  Ex.: `http://localhost:8080/realms/techdados`

Client:

- `VITE_OIDC_CLIENT_ID` = `techdados`

Redirect URIs:

- `VITE_OIDC_REDIRECT_URI`
- `VITE_OIDC_POST_LOGOUT_REDIRECT_URI`

## Fluxo

1. Front chama `signinRedirect()`
2. Keycloak autentica e redireciona para `/auth/callback`
3. Front processa callback e armazena sessão (oidc-client-ts)
4. Front chama APIs do BFF com header:
   - `Authorization: Bearer <access_token>`

## Roles/Scopes no UI

O frontend pode decodificar JWT **sem validar assinatura** apenas para UX:

- esconder módulos não permitidos
- exibir filtros/labels

A segurança real é sempre aplicada pelo BFF.

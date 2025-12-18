# ADR 004 — Autenticação JWT via Keycloak no BFF TechDados

Data: 2025-12-17  
Status: Aceito (proposto no Bloco 07)

## Contexto

O TechDados precisa aplicar RBAC e escopo territorial (STATE/MUNICIPIO) para consumo seguro de dados do upstream.
No MVP inicial, usamos `TD_AUTH_MODE=mock` para desenvolvimento.

## Decisão

Adotar autenticação baseada em JWT (OIDC) emitido por Keycloak, com:

- validação de assinatura via JWKS
- validação de claims (`iss`, `aud`, `exp`)
- extração de roles e scopes via claims padronizados

## Alternativas consideradas

1. Mock/disabled permanente (rejeitado por segurança)
2. Validar JWT sem verificar assinatura (rejeitado)
3. Delegar tudo ao upstream (rejeitado, o BFF é a camada de enforcement)

## Consequências

- Dependência adicional: `python-jose[cryptography]`
- Necessidade de configurar realm/client e claim `td_scopes` no Keycloak
- Padronização do contrato de auth e smoke tests

## Notas de implementação

- `TD_AUTH_MODE=jwt`
- `TD_JWT_JWKS_URL` e cache TTL para evitar fetch a cada request
- `TD_JWT_SCOPES_CLAIM=td_scopes` como padrão

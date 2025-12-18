# Keycloak (local) — Seed realm techdados

## Objetivo

Padronizar o ambiente local com:

- realm `techdados`
- client `techdados`
- roles e claim `td_scopes`

## Arquivos

- `infra/keycloak/techdados-realm.json`
- `infra/keycloak/seed-techdados.py`
- `infra/keycloak/README-techdados.md`
- `infra/docker-compose.local.yml.patch` (instruções de merge)

## Claim `td_scopes`

Usado pelo BFF (Bloco 07) via `TD_JWT_SCOPES_CLAIM=td_scopes`.

## Usuário dev

- `dev@techdados.local` / `dev`
- role: `tactical`
- td_scopes: `MUNICIPIO:3106200`

> Ajuste o código IBGE para seu cenário (ex.: BH, Contagem etc.)

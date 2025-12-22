# TechDados — Onboarding Rápido

## Quickstart (3 comandos)

1. Instalar dependências

- `pnpm install`

2. Subir dev server (web)

- `pnpm dev`

3. Validar

- `pnpm -w lint`
- `pnpm -w typecheck`

## Como rodar Keycloak local

- Ver:
  - `infra/docker-compose.yml`
  - `docs/operacao/e2e-auth-keycloak-local.md`

## Como rodar BFF

- Ver:
  - `docs/operacao/bff-run-local.md`
  - `docs/arquitetura/trilha-b-bff-skeleton.md`

## Como rodar Web

- Ver:
  - `docs/operacao/setup-local.md`

## Onde estão as docs

- Portal: `docs/INDEX.md`
- Context Pack: `docs/projeto/CONTEXT_PACK.md`

## Como validar (lint/typecheck/smoke)

- Lint: `pnpm -w lint`
- Typecheck: `pnpm -w typecheck`
- Smoke (docs): ver `docs/operacao/testes.md` e `docs/operacao/bff-smoke.md`

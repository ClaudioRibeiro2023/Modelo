# Governança — Versionamento (MVP)

## O que precisa versionar

1. **Contratos de integração** (Upstream/BFF)
2. **Métricas** (definições/fórmulas)
3. **Exports** (colunas, formatos, paginação)
4. **RBAC** (roles/scopes)

## Regra prática (sem burocracia)

- Mudança **breaking** → incrementa versão MAJOR do contrato (`v1` → `v2`)
- Mudança compatível → MINOR
- Correção → PATCH

## Onde documentar

- Contratos: `docs/contratos-integracao/`
- Métricas: `docs/dados/dicionario-metricas.md`
- RBAC: `docs/seguranca/`
- Mudanças importantes: ADR (`docs/adr_v2/`)

## Changelog

Manter `docs/operacao/changelog.md` (ou seção no portal) com:

- data
- resumo
- impacto

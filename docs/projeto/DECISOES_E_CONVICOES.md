# TechDados — Decisões e Convicções (ADR-lite)

## Stack aprovada

- Web: React 18 + Vite + TailwindCSS (monorepo pnpm)
- Backend/BFF: FastAPI
- IAM: Keycloak (OIDC/JWT)

Referências:

- ADRs: `docs/adr_v2/`

## Docs canônicas em `docs/INDEX.md`

- O portal canônico é `docs/INDEX.md`.
- Documentação canônica vive em `docs/`.
- Raiz do repo só pode conter stubs (ex.: `README.md`, `todo.md`).

## Política de exportação/auditoria

- Export é capability governada (RBAC) e deve ser auditável.
- Safe-by-default em filtros e recortes territoriais.

Links:

- Política de exportação: `docs/seguranca/politica-exportacao.md`
- Contrato export-filter: `docs/contratos-integracao/export-filter-contract.md`

## Política de arquivamento (`docs/_archive`)

- Nada é apagado “na raça”.
- Duplicidades e legados vão para `docs/_archive/YYYY-MM-DD/...`.
- Sempre criar `MOTIVO.md` explicando a decisão quando houver escolha de canônico.

## Contrato-first (não inventar endpoints upstream)

- Integrações são guiadas por contrato:
  - upstream: `docs/contratos-integracao/upstream-techdengue-api.md`
  - mapeamento: `docs/contratos-integracao/api-dados-upstream-mapeamento.md`
- Se o upstream mudar, primeiro atualizar contrato e só depois ajustar código.

## RBAC/ABAC como responsabilidade do backend

- O frontend não é autoridade de segurança.
- RBAC/ABAC e auditoria devem acontecer no BFF.

Links:

- RBAC: `docs/seguranca/rbac.md`
- Policies BFF: `docs/seguranca/rbac_policies_bff.md`

# Relatório de Ajustes de Documentação

> **Data:** 2025-12-22
>
> **Branch:** `chore/docs-audit-cleanup-context-pack`

## Resumo

Esta operação normalizou a documentação canônica em `docs/`, preservou histórico via `git mv`, removeu duplicidades com arquivamento rastreável e organizou artefatos temporários (ZIPs) em `docs/_archive/`.

## Arquivos movidos (realocação para estrutura canônica)

- `docs/backend/bff-arquitetura-e-modulos.md` → `docs/arquitetura/bff-arquitetura-e-modulos.md`
- `docs/backend/trilha-b-bff-skeleton.md` → `docs/arquitetura/trilha-b-bff-skeleton.md`
- `docs/backend/bff-contratos-e-rotas.md` → `docs/contratos-integracao/bff-contratos-e-rotas.md`
- `docs/backend/trilha-b-bff-checklist.md` → `docs/operacao/trilha-b-bff-checklist.md`

## Arquivos arquivados (duplicados / legados)

### Duplicado — Upstream

- Arquivado:
  - `docs/contratos-integracao/techdengue-upstream.md` → `docs/_archive/2025-12-22/_duplicados/contratos-integracao/upstream/techdengue-upstream.md`
- Canônico mantido:
  - `docs/contratos-integracao/upstream-techdengue-api.md`
- Motivo:
  - `docs/_archive/2025-12-22/_duplicados/contratos-integracao/upstream/MOTIVO.md`

### Duplicado — PDF Hierarquia

- Arquivado:
  - `docs/seguranca/_refs/Hierarquia de acessos.pdf` → `docs/_archive/2025-12-22/_duplicados/seguranca/_refs/Hierarquia de acessos.pdf`
- Canônico mantido:
  - `docs/seguranca/_refs/Hierarquia_de_acessos_Sistema_Techdengue_v1.0.pdf`
- Motivo:
  - `docs/_archive/2025-12-22/_duplicados/seguranca/_refs/MOTIVO.md`

## Temporários / tooling

### ZIPs (artefatos de importação)

- Movidos (via `git mv`) de:
  - `docs/_estrutura.docs/*.zip`
- Para:
  - `docs/_archive/2025-12-22/_zips/*.zip`
- Motivo:
  - `docs/_archive/2025-12-22/_zips/MOTIVO.md`

### Remoções (recriáveis)

- Removidos diretórios extraídos (não versionados) em:
  - `docs/_estrutura.docs/techdados_bloco_*/`

## Arquivos removidos definitivamente

- Nenhum arquivo versionado foi removido definitivamente nesta operação.

## Entregáveis criados/atualizados

- Criado:
  - `docs/00-auditoria/INVENTARIO_DOCS.md`
  - `docs/projeto/CONTEXT_PACK.md`
  - `docs/projeto/DECISOES_E_CONVICOES.md`
  - `docs/projeto/ONBOARDING_RAPIDO.md`

- Atualizado:
  - `docs/INDEX.md`
  - `docs/00-auditoria/LOG_DE_LIMPEZA.md`

## Commits desta operação

- `147a7b9` chore(docs): realocar docs para estrutura canonica + arquivar duplicados
- `9a60756` chore(docs): limpar temporarios e organizar zips/staging
- `6362b41` docs: atualizar portal index + ajustar stubs
- `e3eed25` docs(projeto): criar context pack + onboarding + decisoes

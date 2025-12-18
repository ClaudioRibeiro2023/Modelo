# TechDados — Bloco 04 (RBAC + Escopo Territorial + Exportação) — Guia de Aplicação

Este pacote adiciona um **MVP de controle de acesso** no BFF (FastAPI), alinhado à referência **"Hierarquia de acessos – Sistema Techdengue (v1.0)"**.

## Objetivo do bloco

1. Padronizar **roles** (perfis) e **scopes** (escopo territorial) no BFF
2. Aplicar restrições mínimas por endpoint (RBAC)
3. Aplicar **limites e bloqueios de exportação** (CSV/Parquet) de forma segura (MVP)
4. Registrar documentação canônica + auditoria

---

## Como aplicar no repositório (passo a passo)

### 1) Copiar arquivos

Copie o conteúdo deste ZIP para a raiz da repo **TechDados** (mantendo os paths).

### 2) Garantir referência do PDF

Este bloco inclui o PDF em:

- `docs/seguranca/_refs/Hierarquia de acessos.pdf`

Se você já possui uma versão mais nova, **substitua** este arquivo mantendo o mesmo path.

### 3) Variáveis de ambiente (local)

Para desenvolvimento local, recomendo começar com:

- `TD_AUTH_MODE=mock` _(ou `disabled` para liberar tudo rapidamente)_
- `TD_MOCK_USER_ID=dev`
- `TD_MOCK_ROLES=admin` _(ou: strategic,tactical,operational,support,audit)_
- `TD_MOCK_SCOPES=STATE:MG` _(ou: MUNICIPIO:3106200, MUNICIPIO:3129707, ...)_

> Observação: O enforcement territorial por MUNICIPIO em **CSV/Parquet** está **bloqueado no MVP**, por segurança (ver docs).

### 4) Rodar smoke

- Suba a API (como você já faz hoje no template)
- Execute os testes manuais de smoke em: `docs/operacao/bff-rbac-smoke.md`

---

## O que foi adicionado / alterado

### Código (BFF)

- `api-template/app/techdados_bff/security/policy.py` (novos helpers: RBAC, export policy, caps)
- `api-template/app/techdados_bff/security/scope_filters.py` (MVP: escopo municipal)
- Atualização das rotas:
  - `api-template/app/techdados_bff/api/routes/facts.py`
  - `api-template/app/techdados_bff/api/routes/dengue.py`
  - `api-template/app/techdados_bff/api/routes/municipios.py`
  - `api-template/app/techdados_bff/api/routes/gold.py`
  - `api-template/app/techdados_bff/api/routes/risk.py`
  - `api-template/app/techdados_bff/api/routes/monitor.py`

### Docs canônicas

- `docs/seguranca/hierarquia-acessos-resumo.md`
- `docs/seguranca/politica-exportacao.md`
- `docs/contratos-integracao/claims-roles-scopes.md`
- `docs/operacao/bff-rbac-smoke.md`
- Auditoria do bloco:
  - `docs/00-auditoria/_blocos/2025-12-17_bloco_04_rbac_escopo_exportacao.md`

---

## Nota importante (MVP)

- O upstream entrega `/facts` e `/gold` em CSV/Parquet.
- Para aplicar escopo territorial em CSV/Parquet com segurança, o BFF precisaria:
  1. **Parsear CSV** e filtrar linhas por município; e/ou
  2. **Ler/filtrar Parquet** (pyarrow) e re-serializar.
- **Neste MVP**: exportação com escopo municipal **é bloqueada**, evitando vazamento de dados.

Próximo passo recomendado: implementar `export_filter_csv()` (e opcional `export_filter_parquet()`) com cache de mapeamento de município.

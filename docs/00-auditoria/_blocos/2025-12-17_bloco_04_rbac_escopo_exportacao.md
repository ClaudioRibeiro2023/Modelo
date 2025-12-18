# Bloco 04 — RBAC + Escopo Territorial + Exportação (MVP)

Data: 2025-12-17

## Contexto

Este bloco dá continuidade à **Trilha B (BFF FastAPI)**, adicionando:

- Política mínima de **roles** (RBAC)
- Política mínima de **escopos territoriais** (ABAC/escopo)
- Política mínima de **exportação** (CSV/Parquet) para reduzir risco de exfiltração

Referência normativa interna:

- `docs/seguranca/_refs/Hierarquia de acessos.pdf`

## Decisões tomadas (MVP)

1. **Roles canônicas (internas)**
   - `admin`, `audit`, `strategic`, `tactical`, `operational`, `support`
   - Aceita sinônimos comuns (ex.: `estrategico`, `tatico`, `apoio_indireto`, etc.)

2. **Scopes**
   - Padrão: `STATE:MG` cobre tudo (regra já existente no ABAC).
   - Escopo municipal: `MUNICIPIO:<codigo_ibge>`

3. **Exportação**
   - `format=csv|parquet` é tratado como exportação (alto risco).
   - Somente `admin/audit/strategic/tactical` podem exportar.
   - Exportação com `MUNICIPIO:*` está **bloqueada** no MVP (falta de filtro seguro em CSV/Parquet).

4. **Caps por perfil**
   - O BFF reduz `limit` máximo em alguns endpoints para perfis não-admin.

## Arquivos adicionados/alterados

Veja `MANIFEST.json` no root deste ZIP.

## Próximos passos (P1)

- Implementar filtro de exportação CSV (linha a linha) com cache de município.
- Implementar filtro Parquet (pyarrow) opcional.
- Formalizar claims no Keycloak (`td_scopes`) e roles no realm `techdados`.

# Política de exportação (TechDados) — atualização (Bloco 05)

## O que é exportação?

No TechDados, exportação é qualquer resposta em:

- `format=csv` ou `format=parquet`

## Regras (atual)

1. Somente roles: `admin`, `audit`, `strategic`, `tactical` podem exportar.
2. Para usuários com escopo municipal (`MUNICIPIO:*`):
   - CSV: **permitido** apenas se `TD_EXPORT_FILTER_CSV_ENABLED=true` (BFF filtra por escopo antes de retornar).
   - Parquet: **bloqueado** no MVP.

## Caps de segurança (MVP)

- `TD_EXPORT_MAX_BYTES` (default: 30MB)
- `TD_EXPORT_MAX_LINES` (default: 200k)

Se o export exceder caps, o BFF deve retornar **403/400** (conforme caso) para evitar exfiltração acidental.

## Justificativa

O upstream entrega export serializado (CSV/Parquet). Para respeitar escopo territorial, o BFF precisa filtrar o arquivo.
Este bloco implementa filtro CSV (linha a linha) seguro por município.

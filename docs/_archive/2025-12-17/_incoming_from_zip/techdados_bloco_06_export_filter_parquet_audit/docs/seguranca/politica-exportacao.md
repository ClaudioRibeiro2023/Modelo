# Política de exportação (TechDados) — atualização (Bloco 06)

## Exportação = formatos de arquivo

No TechDados, exportação é qualquer resposta em:

- `format=csv`
- `format=parquet`

## Regras (atual)

1. Somente roles: `admin`, `audit`, `strategic`, `tactical` podem exportar.
2. Para usuários com escopo municipal (`MUNICIPIO:*`):
   - CSV: permitido se `TD_EXPORT_FILTER_CSV_ENABLED=true` (BFF filtra).
   - Parquet: permitido se `TD_EXPORT_FILTER_PARQUET_ENABLED=true` **e** existir coluna IBGE reconhecida no dataset.

## Dependências

- Parquet filtering requer `pyarrow`.

## Auditoria

Toda exportação deve gerar evento de auditoria com:

- endpoint, user_id, roles, scopes, format, bytes_out, status.

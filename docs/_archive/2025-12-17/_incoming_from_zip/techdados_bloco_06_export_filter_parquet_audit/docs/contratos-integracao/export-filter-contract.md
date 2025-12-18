# Contrato — Export Filter por Escopo (CSV + Parquet)

## Objetivo

Garantir que exportações respeitem o escopo territorial do usuário.

## Escopo municipal

- `MUNICIPIO:<codigo_ibge>`

## CSV

- Implementado: filtro linha a linha.
- Se não conseguir identificar município (código ou nome resolvível), descarta a linha.

## Parquet

- Implementado: filtro por coluna IBGE (pyarrow).
- Sem fallback por nome no MVP.
- Se não existir coluna IBGE reconhecida, o export é bloqueado.

## Colunas reconhecidas (IBGE)

- `codigo_ibge`, `cod_ibge`, `ibge`, `cd_ibge`, `codigo_municipio`, `cd_municipio`, `municipio_ibge`

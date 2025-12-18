# Contrato — Filtro de Export CSV por Escopo

## Objetivo

Garantir que exportações CSV respeitem o escopo territorial do usuário.

## Entradas

- `user.scopes` (ex.: `["MUNICIPIO:3106200"]`)
- `csv_bytes` (conteúdo recebido do upstream)
- `caps` (`TD_EXPORT_MAX_BYTES`, `TD_EXPORT_MAX_LINES`)

## Saída

- `filtered_csv_bytes` contendo:
  - header original
  - apenas linhas cujo município (via `codigo_ibge` ou nome) está no escopo
  - linhas sem município resolvível são descartadas (safe-by-default)

## Colunas reconhecidas (tentativas)

### Código IBGE

- `codigo_ibge`, `cod_ibge`, `ibge`, `cd_ibge`, `codigo_municipio`, `cd_municipio`, `municipio_ibge`

### Nome do município

- `municipio`, `nome_municipio`, `cidade`, `localidade`

## Fallback de resolução nome→código

Quando não há `codigo_ibge`, o filtro tenta resolver por nome via cache obtido do endpoint upstream:

- `GET /municipios`

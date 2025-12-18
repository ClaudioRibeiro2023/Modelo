# Política de exportação (TechDados)

## Objetivo

Reduzir risco de vazamento/exfiltração e garantir conformidade (LGPD e governança interna) ao exportar dados do TechDados.

## Regras (MVP)

1. **Exportação** = qualquer resposta em `format=csv|parquet`.
2. Somente roles: `admin`, `audit`, `strategic`, `tactical` podem exportar.
3. Se o usuário possui escopo municipal (`MUNICIPIO:*`), exportação é **bloqueada** no MVP.

## Justificativa (por que bloquear com MUNICIPIO:\* no MVP?)

O upstream entrega CSV/Parquet já serializado. Para filtrar com segurança por escopo, o BFF precisa:

- Parsear CSV linha a linha e filtrar por `codigo_ibge` (ou similar), e reemitir
- OU ler Parquet (pyarrow) e re-serializar

Sem isso, a exportação poderia vazar dados fora do território permitido.

## Roadmap recomendado

P1:

- Implementar `export_filter_csv()` com:
  - identificação do campo `codigo_ibge` e equivalentes
  - cache de mapeamento de municípios
  - limites de tamanho (MB) por perfil

P2 (opcional):

- Implementar `export_filter_parquet()` (pyarrow)
- Assinatura de downloads + auditoria (evento de export)

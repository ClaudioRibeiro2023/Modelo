# Dados — Portal TechDados

Este portal organiza **o que existe de dados** e **como usamos** para gerar análises.

## Documentos canônicos

- [Catálogo de datasets](catalogo-datasets.md)
- [Dicionário de dimensões](dicionario-dimensoes.md)
- [Dicionário de métricas](dicionario-metricas.md)
- [Modelo dimensional sugerido](modelo-dimensional.md)

## Fonte de verdade

- A origem operacional dos dados é o ecossistema Techdengue (bases internas + GIS).
- No TechDados, a **fonte de ingestão preferencial** é a **API de Dados** (Upstream), com cache e auditoria no BFF.

## Regra prática

Se um número aparecer em um gráfico, ele precisa existir em **dicionário de métricas**:

- definição
- fórmula
- unidade
- granularidade
- dimensões permitidas

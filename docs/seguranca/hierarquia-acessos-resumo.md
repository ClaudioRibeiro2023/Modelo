# Hierarquia de acessos (Techdengue) — resumo operacional para TechDados

Este documento resume, em formato **operacional**, a referência:

- `docs/seguranca/_refs/Hierarquia de acessos.pdf`

## 1) Objetivo

Padronizar o controle de acesso do **TechDados** para:

- Garantir **mínimo privilégio**
- Respeitar **escopo territorial**
- Controlar **exportações**
- Garantir **rastreabilidade/auditoria**

## 2) Perfis (camadas)

No TechDados, trabalharemos com 4 camadas principais de usuário (alinhadas à referência):

- **Estratégico** (`strategic`)
  - Visão consolidada, painéis executivos, indicadores agregados
- **Tático** (`tactical`)
  - Gestão de planos e execução, relatórios e drill-down controlado
- **Operacional** (`operational`)
  - Execução no território, listas e painéis orientados a ação
- **Apoio indireto** (`support`)
  - Acesso pontual, consulta, suporte administrativo

Perfis internos adicionais (recomendados):

- **Admin** (`admin`)
- **Auditoria** (`audit`)

## 3) Classificação de dados (níveis)

Recomendação de 4 níveis para TechDados:

1. **Público**
2. **Restrito**
3. **Confidencial**
4. **Sensível** (inclui dados com potencial de reidentificação / riscos legais)

> O MVP do BFF assume que **exportação** é sempre operação de risco alto.

## 4) Escopo territorial (scopes)

Padrão de scope recomendado (string):

- `STATE:MG` _(cobre tudo — regra MVP já implementada)_
- `MUNICIPIO:<codigo_ibge>`
- Futuro: `URS:<id>`, `CONSORCIO:<id>`, `MICRO:<id>`, `MACRO:<id>`

## 5) Exportação

A referência sugere um controle progressivo:

- Exportação **agregada** (baixo risco)
- Exportação sem dados pessoais (risco médio)
- Exportação completa (risco alto)

No MVP do TechDados:

- CSV/Parquet = exportação (alto risco)
- Se houver escopo municipal (`MUNICIPIO:*`), exportação fica bloqueada até existir filtro seguro.

## 6) O que falta para o enforcement completo (P1/P2)

- Formalizar roles/scopes no Keycloak (`td_scopes`)
- Implementar filtro robusto de exportação CSV/Parquet por escopo
- Implementar mapeamentos URS/consórcio ↔ municípios para enforcement indireto

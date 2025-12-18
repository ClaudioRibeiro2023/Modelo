# C4 — Context (TechDados)

## Objetivo

TechDados é a aplicação de **análises e dashboards** do ecossistema Techdengue, com foco em:

- epidemiologia (casos, incidência)
- operação (cobertura, produtividade, POIs)
- geoespacial (hotspots/camadas)
- risco/clima (quando disponível via upstream)

## Atores

- **Gestores (Estratégico)**: visão macro, comparação UF/regionais, risco, ROI (futuro)
- **Coordenação (Tático)**: performance operacional, cobertura, produtividade, qualidade
- **Operacional**: execução, devolutivas, priorização diária, evidências
- **Auditoria/Compliance**: rastreabilidade e exportações
- **Admin**: usuários, perfis, parametrizações, feature flags

## Sistemas externos

- **Keycloak** (IAM): autenticação OIDC e emissão de JWT
- **Upstream API (Techdengue)**: dados e insights disponíveis via HTTP
- **Banco/Geodados** (futuro/optional): PostGIS/warehouse se necessário

## Regras de confiança

- O frontend NÃO é fonte de verdade.
- O enforcement de acesso ocorre no **BFF** (RBAC + território + auditoria).

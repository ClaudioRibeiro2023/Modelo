# Navegação por perfil (RBAC) — TechDados

## Objetivo

Organizar a aplicação em módulos e submódulos e exibir/habilitar itens conforme perfil:

- admin
- audit
- strategic
- tactical
- operational
- support

## Princípio

- UI gating melhora experiência, mas **não garante segurança**
- Todas as APIs passam por RBAC + escopo no BFF

## Modelo de navegação (MVP)

A navegação é construída a partir de um catálogo:

- `moduleId`
- `label`
- `path`
- `allowedRoles`

O builder do bloco 09 produz um array filtrado por roles.

## Recomendação de módulos (iniciais)

- Visão Geral (strategic/tactical/admin)
- Epidemiologia (strategic/tactical/operational)
- Operação (tactical/operational)
- Qualidade/ETL (admin/audit)
- Auditoria (audit/admin)
- Configurações (admin)

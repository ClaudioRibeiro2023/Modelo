# Governança — Processo de mudança (MVP)

## Quando abrir ADR

- alteração de stack
- alteração de auth/RBAC
- mudança de contrato com impacto
- decisão que afeta domínios/módulos do produto

## Fluxo mínimo

1. Propor (issue/PR)
2. Atualizar docs canônicos (catálogo/métricas/contratos)
3. Se necessário, ADR
4. Validar (smoke tests + typecheck/lint)
5. Merge + registrar no changelog

## Anti-padrões

- “mexer no frontend” sem atualizar métricas/contratos
- criar docs soltas fora do portal
- export sem auditoria

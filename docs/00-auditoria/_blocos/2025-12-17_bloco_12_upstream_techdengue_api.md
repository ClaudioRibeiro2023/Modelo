# Bloco 12 — Integração Upstream (Techdengue API)

Data: 2025-12-17
Commit: (a preencher após aplicar)

## Objetivo

Adicionar um adaptador de integração (cliente + cache + router proxy) para consumir a API upstream de dados
do Techdengue, mantendo o TechDados com uma camada BFF estável.

## Entregas

- Cliente HTTP assíncrono com timeout/retry
- Cache in-memory com TTL
- Router FastAPI (proxy) com endpoints do MVP
- Contrato canônico de integração em `docs/contratos-integracao/`

## Notas

- RBAC não é imposto aqui por padrão; deve ser aplicado via middleware/Depends já existentes.
- Em produção, evoluir cache para Redis e registrar métricas (Prometheus).

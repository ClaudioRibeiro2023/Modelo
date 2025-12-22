# Trilha B — Checklist de Implementação (DoD)

## DoD do Skeleton (P0)

- [ ] Router montado em `api-template/app/main.py` (prefixo `/api/v1`)
- [ ] `TD_AUTH_MODE=mock` funcionando localmente
- [ ] Rotas P0 respondendo (mesmo que com stub quando provider disabled)
- [ ] RBAC bloqueia rota sem role mínima
- [ ] ABAC bloqueia rota quando `scope_type/scope_id` fora do permitido
- [ ] Cache TTL funcionando por rota (habilitado/desabilitado)
- [ ] Auditoria emitindo eventos por rota (logs)
- [ ] Erros padronizados (JSON) + request_id presente

## DoD de Integração com Provedor (P1)

- [ ] `TD_PROVIDER_ENABLED=1` + base_url configurada
- [ ] `provider_client` com timeout + retry
- [ ] Mapeamento provedor → contratos canônicos do BFF
- [ ] Testes mínimos (smoke) para as rotas críticas

## DoD de Produção (P2)

- [ ] `TD_AUTH_MODE=keycloak` com verificação de JWT
- [ ] Política de export (RBAC + auditoria) aplicada
- [ ] Observabilidade: métricas/trace (quando adotado)

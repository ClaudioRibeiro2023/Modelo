# BFF (FastAPI) — Arquitetura e Módulos | TechDados

**Versão:** v1.0  
**Última atualização:** 2025-12-17

---

## Estrutura recomendada

```
api-template/app/
  api/routers/
  services/
  clients/
  security/
  cache/
  audit/
  middleware/
  schemas/
  core/
```

---

## Princípios

- contract-first (docs antes de código)
- RBAC/ABAC sempre no backend
- normalizações e KPIs no backend (não no frontend)
- cache por rota + escopo efetivo
- auditoria por rota
- resiliência (timeout/retry/circuit breaker)

---

## Checklist DoD do skeleton

- [ ] routers + services + client do provedor
- [ ] request_id + error handler
- [ ] RBAC/ABAC funcionando (modo demo/local via feature flag)
- [ ] cache memory pronto para Redis
- [ ] auditoria (log sink) emitindo eventos mínimos

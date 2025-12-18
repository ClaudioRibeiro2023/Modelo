# TechDados — Bloco 12: Integração Upstream (API de Dados Techdengue)

Este bloco adiciona um **adaptador de integração** no BFF (FastAPI) para consumir a API upstream de dados
(**techdengue-api**) e expor endpoints internos (proxy) prontos para serem protegidos por RBAC/escopo.

---

## 1) Onde colocar cada arquivo

Copie **mantendo os paths** abaixo (relativos à raiz da repo):

- `api-template/app/techdados_bff/...` → código do BFF e integração upstream
- `docs/contratos-integracao/...` → contrato e mapa de endpoints
- `docs/operacao/...` → smoke test e checklist operacional
- `docs/00-auditoria/_blocos/...` → registro do bloco (rastreabilidade)

---

## 2) Variáveis de ambiente (adicionar no seu .env do backend)

> **Sugestão**: colocar no `.env` usado pelo container do backend (ou no `infra/.env.*` conforme seu setup).

- `TD_TECHDENGUE_BASE_URL=https://techdengue-api.railway.app`
- `TD_TECHDENGUE_API_KEY=` _(opcional — necessário apenas para endpoints protegidos)_
- `TD_TECHDENGUE_TIMEOUT_S=15`
- `TD_TECHDENGUE_RETRIES=2`
- `TD_TECHDENGUE_CACHE_DEFAULT_TTL_S=60`

---

## 3) Wiring no BFF (2 edições rápidas)

### 3.1 Incluir o router no app

No seu `app` principal do BFF (ex.: `api-template/app/techdados_bff/main.py`), inclua:

```py
from app.techdados_bff.routers.techdengue_api import router as techdengue_router
app.include_router(techdengue_router, prefix="/api/v1/techdengue", tags=["techdengue-upstream"])
```

### 3.2 Garantir que Settings carrega o upstream

Se você já tem um `Settings` central, carregue as envs definidas em:
`app.techdados_bff.config.upstream.TechDengueUpstreamSettings`.

Se preferir, você pode instanciar direto no dependency `get_techdengue_client()` (já pronto).

---

## 4) Smoke test (local)

1. Suba o backend.
2. Acesse:

- `GET /api/v1/techdengue/health`
- `GET /api/v1/techdengue/facts`
- `GET /api/v1/techdengue/municipios?q=contagem&limit=5`

Opcional:

- `POST /api/v1/techdengue/risk/analyze` (body do exemplo no contrato)

---

## 5) Observações (importantes)

- Este bloco **não impõe RBAC** diretamente (para evitar conflito com seu middleware/estratégia atual).
  Ele foi desenhado para você plugar com a camada de auth que já existe (Blocos RBAC/Keycloak).
- O cache TTL é **in-memory (processo)**: ótimo para dev e para reduzir carga do upstream.
  Em produção, podemos migrar para Redis (depois, num bloco específico).

---

## 6) DoD do bloco

- [ ] Backend inicia sem erros
- [ ] `GET /api/v1/techdengue/health` responde 200
- [ ] `GET /api/v1/techdengue/facts` retorna JSON
- [ ] Documentação do contrato upstream adicionada em `docs/contratos-integracao/`

---

Bloco: bloco_12_upstream_techdengue_api | Data: 2025-12-17

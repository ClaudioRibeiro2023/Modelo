# TechDados — Bloco 02 (Trilha B) — BFF FastAPI Skeleton

Este bloco adiciona um **skeleton funcional** de BFF (FastAPI) para o TechDados, com:

- rotas P0 do BFF (status, ref, home, epi, risk, weather, export)
- RBAC + ABAC (modo **mock** para desenvolvimento local)
- cache TTL em memória (interface pronta para Redis depois)
- auditoria de eventos (via logs estruturados)
- client do provedor (API de dados) com timeout/retry + circuito simples
- modelos Pydantic e padrão de erros

> **Importante:** este bloco foi desenhado para **minimizar conflitos** com o template.
> Ele cria um pacote novo em `api-template/app/techdados_bff/`.
> A única integração necessária é **montar o router** no seu `api-template/app/main.py`.

---

## 1) Aplicação do bloco (PowerShell)

```powershell
cd E:\.ai\TechDados
$stamp = Get-Date -Format "yyyy-MM-dd__HHmm"
New-Item -ItemType Directory -Force -Path ".\_stash" | Out-Null
Copy-Item -Recurse -Force .\api-template\app ".\_stash\api_app_backup__$stamp" | Out-Null

# extraia o ZIP na raiz do repo (mesclando as pastas)
git status
```

---

## 2) Integração no FastAPI (passo obrigatório)

Abra `api-template/app/main.py` e faça:

1. **Importe** o router do BFF:

```python
from app.techdados_bff.api.router import router as techdados_bff_router
```

2. **Inclua** no app:

```python
app.include_router(techdados_bff_router, prefix="/api/v1")
```

> Se você já usa `/api/v1` no template, mantenha o prefixo existente e monte sem prefixo duplicado.

---

## 3) Rodar local (modo mock)

Defina (em `infra/.env.example` ou `.env.local` do serviço API):

- `TD_AUTH_MODE=mock`
- `TD_MOCK_ROLES=admin,estrategico`
- `TD_MOCK_SCOPES=STATE:MG,URS:URS-SJDR`

E rode o serviço API como você já roda no template (docker-compose ou uvicorn).

---

## 4) Rodar com Keycloak (P2)

Quando for ligar Keycloak de verdade:

- `TD_AUTH_MODE=keycloak`
- `TD_KEYCLOAK_ISSUER_URL=https://<keycloak>/realms/<realm>`
- `TD_KEYCLOAK_AUDIENCE=<client-id>`

---

## 5) Onde estão os docs desse bloco?

- `docs/backend/trilha-b-bff-skeleton.md`
- `docs/backend/trilha-b-bff-checklist.md`

---

## 6) Depois de aplicar

```powershell
git add api-template/app/techdados_bff docs/backend
git commit -m "feat(bff): adiciona skeleton fastapi (trilha B)"
```

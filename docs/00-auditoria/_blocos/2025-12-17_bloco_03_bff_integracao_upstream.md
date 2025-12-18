# Bloco 03 — Trilha B (BFF FastAPI) — Integração com API de Dados (Upstream)

**Objetivo do bloco**  
Fazer o BFF do TechDados **consumir de fato** a API de dados do Techdengue (upstream), mantendo:

- contrato explícito (mapeamento endpoint → upstream),
- configuração por variáveis de ambiente (sem credenciais no repo),
- base pronta para evoluir para RBAC/escopo territorial depois.

> Este bloco **não** mexe no Keycloak/RBAC do TechDados ainda. Ele foca em “consumir dados” de forma limpa.
> O RBAC/escopo territorial será o Bloco 04.

---

## 0) Como aplicar este ZIP

1. Extraia **na raiz do repositório** (ex.: `E:\.ai\TechDados`) mantendo os paths.
2. Confira se os arquivos foram mesclados em:
   - `api-template/app/techdados_bff/...`
   - `docs/contratos-integracao/...`
   - `docs/operacao/...`
   - `docs/00-auditoria/_blocos/...`

---

## 1) Variáveis de ambiente (obrigatório)

Defina as variáveis **no seu ambiente local** (ou no `.env` usado pelo container do `api-template`):

- `TECHDENGUE_API_BASE_URL`  
  Ex.: `https://techdengue-api.railway.app`

- `TECHDENGUE_API_KEY` _(opcional, porém recomendado)_  
  Será enviado como `X-API-Key` quando presente.  
  Ajuda a evitar rate limit e libera endpoints protegidos (cache/audit), quando você decidir expô-los internamente.

- `TECHDENGUE_API_TIMEOUT_SECONDS` _(opcional; default: 20)_

---

## 2) Wire do router no FastAPI (se ainda não fez)

No `api-template/app/main.py`, inclua:

```py
from app.techdados_bff.api.router import router as techdados_bff_router

# ...
app.include_router(techdados_bff_router, prefix="/api/v1")
```

> Se você já fez no Bloco 02, ignore.

---

## 3) Como testar (smoke)

Depois de subir o `api-template` (local ou docker), rode:

- Health do BFF:  
  `GET http://localhost:8000/api/v1/monitor/health`

- Dados de atividades (facts):  
  `GET http://localhost:8000/api/v1/facts?limit=10&format=json`

- Casos de dengue:  
  `GET http://localhost:8000/api/v1/dengue?limit=10&ano=2024`

- Municípios:  
  `GET http://localhost:8000/api/v1/municipios?limit=10&q=Belo`

- Clima:  
  `GET http://localhost:8000/api/v1/weather/Belo%20Horizonte`

Documentação de smoke/cURLs (mais completa):

- `docs/operacao/bff-smoke.md`

---

## 4) O que este bloco NÃO faz (intencional)

- Não impõe escopo territorial (URS/município) no retorno.
- Não aplica perfis do PDF de hierarquia de acessos.
- Não implementa cache interno no BFF.

Isso entra no **Bloco 04**:

- escopo territorial (claims → filtros),
- política de exportação,
- trilhas de módulos (dashboards por perfil).

---

## 5) Notas de implementação

- Para `format=csv|parquet` em `/facts` e `/gold`, o BFF retorna **stream** com `Content-Type` apropriado.
- Para respostas JSON do upstream, o BFF faz “normalização leve”:
  - Se upstream retorna **lista**, o BFF encapsula em `{items, limit, offset, count}`.
  - Se upstream retorna **objeto**, o BFF retorna como veio.

---

## 6) Próximo bloco (Bloco 04)

- RBAC/claims → escopo territorial (UF/URS/municípios).
- Matriz de permissão por módulo (estratégico/tático/operacional/apoio).
- Política de exportação (CSV/PDF) por perfil.

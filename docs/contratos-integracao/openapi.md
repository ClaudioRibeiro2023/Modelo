# OpenAPI / Swagger

> Documentação automática da API REST gerada pelo FastAPI.

---

## Acesso à Documentação

### Swagger UI (Interativo)

```
http://localhost:8000/docs
```

Interface interativa para testar endpoints diretamente no browser.

### ReDoc (Leitura)

```
http://localhost:8000/redoc
```

Documentação mais limpa para leitura e referência.

### OpenAPI Schema (JSON)

```
http://localhost:8000/openapi.json
```

Schema OpenAPI 3.0 para geração de clientes ou importação em ferramentas.

---

## Configuração do FastAPI

**Fonte:** `api-template/app/main.py:24-30`

```python
app = FastAPI(
    title="Template API",
    description="API Template with authentication and basic endpoints",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)
```

---

## Gerar Cliente a partir do OpenAPI

### TypeScript (openapi-typescript)

```bash
# Instalar
npm install -D openapi-typescript

# Gerar tipos
npx openapi-typescript http://localhost:8000/openapi.json -o src/types/api.d.ts
```

### Python (openapi-python-client)

```bash
# Instalar
pip install openapi-python-client

# Gerar cliente
openapi-python-client generate --url http://localhost:8000/openapi.json
```

### Outras Ferramentas

| Ferramenta        | Linguagem  | Link                                      |
| ----------------- | ---------- | ----------------------------------------- |
| openapi-generator | Multi      | https://openapi-generator.tech/           |
| swagger-codegen   | Multi      | https://swagger.io/tools/swagger-codegen/ |
| orval             | TypeScript | https://orval.dev/                        |

---

## Validar Schema

### Usando openapi-spec-validator

```bash
pip install openapi-spec-validator
openapi-spec-validator openapi.json
```

### Usando Spectral (Lint)

```bash
npm install -g @stoplight/spectral-cli
spectral lint openapi.json
```

---

## Schema Atual (Resumo)

### Info

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "Template API",
    "description": "API Template with authentication and basic endpoints",
    "version": "0.1.0"
  }
}
```

### Paths Documentados

| Path            | Methods | Descrição          |
| --------------- | ------- | ------------------ |
| `/`             | GET     | Root health check  |
| `/health`       | GET     | Basic health check |
| `/health/live`  | GET     | Liveness probe     |
| `/health/ready` | GET     | Readiness probe    |
| `/api/me`       | GET     | Current user info  |
| `/api/config`   | GET     | Frontend config    |

### Schemas

```json
{
  "HealthResponse": {
    "type": "object",
    "properties": {
      "status": { "type": "string" },
      "version": { "type": "string" }
    },
    "required": ["status", "version"]
  },
  "UserInfo": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "email": { "type": "string" },
      "name": { "type": "string" },
      "roles": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": ["id", "email", "name", "roles"]
  }
}
```

---

## Exportar para Postman

1. Acesse `http://localhost:8000/openapi.json`
2. Copie o conteúdo
3. No Postman: **Import** → **Raw text** → Cole o JSON
4. A collection será criada automaticamente

---

## Customização

### Adicionar Descrições aos Endpoints

```python
@app.get(
    "/api/resource",
    summary="Get Resource",
    description="Detailed description of what this endpoint does",
    response_description="The resource data",
    tags=["Resources"],
    responses={
        200: {"description": "Successful response"},
        404: {"description": "Resource not found"},
    }
)
async def get_resource():
    ...
```

### Adicionar Exemplos

```python
from pydantic import BaseModel, Field

class ResourceCreate(BaseModel):
    name: str = Field(..., example="My Resource")
    value: int = Field(..., example=42, ge=0)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"name": "Example 1", "value": 100},
                {"name": "Example 2", "value": 200}
            ]
        }
    }
```

---

## CI/CD: Validação Automática

### GitHub Action

```yaml
# .github/workflows/openapi.yml
name: Validate OpenAPI

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start API
        run: |
          cd api-template
          pip install -r requirements.txt
          uvicorn app.main:app &
          sleep 5

      - name: Download schema
        run: curl http://localhost:8000/openapi.json -o openapi.json

      - name: Validate schema
        run: |
          pip install openapi-spec-validator
          openapi-spec-validator openapi.json
```

---

## [TODO: confirmar]

- [ ] Verificar se há schemas Pydantic adicionais em `api-template/app/schemas/`
- [ ] Confirmar se todos os endpoints estão documentados
- [ ] Adicionar security schemes para autenticação JWT no OpenAPI

---

**Arquivos relacionados:**

- `api-template/app/main.py` - Configuração do FastAPI
- `http://localhost:8000/openapi.json` - Schema gerado

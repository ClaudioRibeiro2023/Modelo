# Variáveis de Ambiente

> Referência completa de todas as variáveis de ambiente do **TechDados**.

**Fonte:** `infra/.env.example`, `infra/.env.production.example`

---

## TechDados BFF (Variáveis Específicas)

| Variável                 | Tipo   | Default | Descrição                                            |
| ------------------------ | ------ | ------- | ---------------------------------------------------- |
| `TD_AUTH_MODE`           | string | `mock`  | Modo de autenticação: `mock`, `keycloak`, `disabled` |
| `TD_UPSTREAM_MODE`       | string | `mock`  | Modo upstream: `mock`, `real`                        |
| `TD_TECHDENGUE_BASE_URL` | string | -       | URL base da API Techdengue                           |
| `TD_EXPORT_MAX_ROWS`     | int    | `50000` | Limite de linhas para export                         |
| `TD_EXPORT_FORMATS`      | string | `csv`   | Formatos permitidos (csv,xlsx,parquet)               |
| `TD_CACHE_ENABLED`       | bool   | `true`  | Habilita cache de dados                              |
| `TD_CACHE_TTL_SECONDS`   | int    | `300`   | TTL do cache em segundos                             |
| `TD_AUDIT_ENABLED`       | bool   | `true`  | Habilita auditoria                                   |

### Variáveis de Mock (quando TD_AUTH_MODE=mock)

| Variável          | Tipo   | Default             | Descrição                      |
| ----------------- | ------ | ------------------- | ------------------------------ |
| `TD_MOCK_USER_ID` | string | `mock-user`         | ID do usuário mock             |
| `TD_MOCK_ROLES`   | string | `admin,estrategico` | Roles do usuário mock (CSV)    |
| `TD_MOCK_SCOPES`  | string | `STATE:MG`          | Scopes territoriais mock (CSV) |

### Exemplo `.env` BFF

```bash
# Modo de operação
TD_AUTH_MODE=mock
TD_UPSTREAM_MODE=mock

# Upstream (quando TD_UPSTREAM_MODE=real)
TD_TECHDENGUE_BASE_URL=https://api.techdengue.com.br

# Export
TD_EXPORT_MAX_ROWS=50000
TD_EXPORT_FORMATS=csv

# Cache
TD_CACHE_ENABLED=true
TD_CACHE_TTL_SECONDS=300

# Mock user (quando TD_AUTH_MODE=mock)
TD_MOCK_USER_ID=dev-user
TD_MOCK_ROLES=admin,estrategico,tatico
TD_MOCK_SCOPES=STATE:MG
```

---

## Frontend (Vite)

Prefixo obrigatório: `VITE_`

| Variável                  | Tipo    | Default                     | Descrição                    |
| ------------------------- | ------- | --------------------------- | ---------------------------- |
| `VITE_API_URL`            | string  | `http://localhost:8000/api` | URL base da API              |
| `VITE_KEYCLOAK_URL`       | string  | `http://localhost:8080`     | URL do Keycloak              |
| `VITE_KEYCLOAK_REALM`     | string  | `techdados`                 | Realm do Keycloak            |
| `VITE_KEYCLOAK_CLIENT_ID` | string  | `techdados-web`             | Client ID OIDC               |
| `VITE_APP_URL`            | string  | `window.location.origin`    | URL da aplicação             |
| `VITE_DEMO_MODE`          | boolean | `false`                     | Ativa bypass de autenticação |

### Exemplo `.env.local`

```bash
VITE_API_URL=http://localhost:8000/api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=template
VITE_KEYCLOAK_CLIENT_ID=template-web
VITE_DEMO_MODE=true
```

### Modos do Vite

| Modo        | Arquivo            | Uso             |
| ----------- | ------------------ | --------------- |
| development | `.env.development` | `pnpm dev`      |
| production  | `.env.production`  | `pnpm build`    |
| demo        | `.env.demo`        | `pnpm dev:demo` |
| e2e         | `.env.e2e`         | `pnpm dev:e2e`  |

---

## Backend (FastAPI)

| Variável         | Tipo   | Default       | Obrigatório | Descrição                    |
| ---------------- | ------ | ------------- | ----------- | ---------------------------- |
| `DATABASE_URL`   | string | -             | Sim (prod)  | PostgreSQL connection string |
| `REDIS_URL`      | string | -             | Não         | Redis connection string      |
| `API_SECRET_KEY` | string | -             | Sim (prod)  | Chave para assinaturas       |
| `ENVIRONMENT`    | string | `development` | Não         | Ambiente atual               |

### Rate Limiting

| Variável             | Default      | Descrição                  |
| -------------------- | ------------ | -------------------------- |
| `RATE_LIMIT_DEFAULT` | `100/minute` | Limite padrão              |
| `RATE_LIMIT_AUTH`    | `10/minute`  | Limite para auth endpoints |
| `RATE_LIMIT_API`     | `60/minute`  | Limite para API endpoints  |
| `RATE_LIMIT_HEALTH`  | `300/minute` | Limite para health checks  |

### Exemplo `.env`

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/template

# Redis (opcional - usa memória se não configurado)
REDIS_URL=redis://localhost:6379

# Security
API_SECRET_KEY=your-secret-key-min-32-chars

# Environment
ENVIRONMENT=development

# Rate Limiting
RATE_LIMIT_DEFAULT=100/minute
```

---

## Infraestrutura (Docker Compose)

**Fonte:** `infra/.env.example`

### PostgreSQL

| Variável            | Default            | Descrição        |
| ------------------- | ------------------ | ---------------- |
| `POSTGRES_USER`     | `techdados`        | Usuário do banco |
| `POSTGRES_PASSWORD` | `techdados_secret` | Senha do banco   |
| `POSTGRES_DB`       | `techdados_db`     | Nome do database |
| `POSTGRES_PORT`     | `5432`             | Porta exposta    |

### Redis

| Variável         | Default | Descrição        |
| ---------------- | ------- | ---------------- |
| `REDIS_PORT`     | `6379`  | Porta exposta    |
| `REDIS_PASSWORD` | -       | Senha (opcional) |

### Keycloak

| Variável                  | Default        | Descrição                       |
| ------------------------- | -------------- | ------------------------------- |
| `KEYCLOAK_ADMIN`          | `admin`        | Admin username                  |
| `KEYCLOAK_ADMIN_PASSWORD` | `admin_secret` | Admin password                  |
| `KEYCLOAK_HTTP_PORT`      | `8080`         | Porta HTTP                      |
| `KEYCLOAK_REALM`          | `template`     | Realm name                      |
| `KEYCLOAK_CLIENT_ID`      | `template-web` | Client ID                       |
| `KEYCLOAK_CLIENT_SECRET`  | -              | Client secret (se confidential) |

### Compose

| Variável               | Default             | Descrição              |
| ---------------------- | ------------------- | ---------------------- |
| `COMPOSE_PROJECT_NAME` | `template-platform` | Nome do projeto Docker |

---

## Produção

**Fonte:** `infra/.env.production.example`

### Variáveis Críticas

```bash
# ⚠️ OBRIGATÓRIAS EM PRODUÇÃO

# API
API_SECRET_KEY=<random-64-char-string>
DATABASE_URL=postgresql://user:pass@db-host:5432/prod_db
REDIS_URL=redis://:password@redis-host:6379

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_KEYCLOAK_URL=https://auth.yourdomain.com
VITE_APP_URL=https://app.yourdomain.com
VITE_DEMO_MODE=false

# Keycloak
KEYCLOAK_ADMIN_PASSWORD=<strong-password>
```

### Checklist de Segurança

- [ ] `API_SECRET_KEY` com pelo menos 32 caracteres aleatórios
- [ ] `VITE_DEMO_MODE=false`
- [ ] `KEYCLOAK_ADMIN_PASSWORD` forte
- [ ] `DATABASE_URL` com SSL (`?sslmode=require`)
- [ ] Variáveis sensíveis em secrets manager (não em arquivos)

---

## Kubernetes

### ConfigMap (não sensível)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: template-config
data:
  ENVIRONMENT: 'production'
  VITE_KEYCLOAK_REALM: 'template'
  VITE_KEYCLOAK_CLIENT_ID: 'template-web'
```

### Secret (sensível)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: template-secrets
type: Opaque
stringData:
  API_SECRET_KEY: '<secret>'
  DATABASE_URL: 'postgresql://...'
  REDIS_URL: 'redis://...'
```

### Uso no Deployment

```yaml
spec:
  containers:
    - name: api
      envFrom:
        - configMapRef:
            name: template-config
        - secretRef:
            name: template-secrets
```

---

## Validação

### Script de Verificação

```bash
#!/bin/bash
# check-env.sh

required_vars=(
  "DATABASE_URL"
  "API_SECRET_KEY"
  "VITE_API_URL"
  "VITE_KEYCLOAK_URL"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing: $var"
    exit 1
  fi
done

echo "✅ All required variables set"
```

### Python (FastAPI startup)

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_url: str | None = None
    api_secret_key: str
    environment: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()  # Falha se variáveis obrigatórias faltarem
```

---

## Referência Rápida por Serviço

### API precisa de:

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...        # Opcional
API_SECRET_KEY=...           # Obrigatório em prod
ENVIRONMENT=production
```

### Frontend precisa de:

```bash
VITE_API_URL=https://api...
VITE_KEYCLOAK_URL=https://auth...
VITE_KEYCLOAK_REALM=template
VITE_KEYCLOAK_CLIENT_ID=template-web
```

### Docker Compose precisa de:

```bash
POSTGRES_USER=...
POSTGRES_PASSWORD=...
KEYCLOAK_ADMIN_PASSWORD=...
```

---

**Arquivos relacionados:**

- `infra/.env.example`
- `infra/.env.production.example`
- `packages/shared/src/auth/oidcConfig.ts`
- `api-template/app/main.py`

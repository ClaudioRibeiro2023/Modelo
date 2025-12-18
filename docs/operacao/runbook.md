# Runbook — TechDados (Dev → Prod)

## 1) Setup local (dev)

### Pré-requisitos

- Node + pnpm
- Python 3.12+
- Docker Desktop

### Subir Keycloak

```bash
docker compose -f infra/docker-compose.local.yml up -d keycloak
```

### Subir BFF

```bash
cd api-template
python -m uvicorn app.techdados_bff.main:app --reload --port 8000
```

### Subir Web

```bash
pnpm -C apps/web dev
```

## 2) Smoke tests

- ver `docs/operacao/smoke_e2e_p0.md`
- ver `docs/operacao/nav_and_rbac_smoke.md`

## 3) Observabilidade mínima

- Logs estruturados no stdout do BFF (auditoria de acesso)
- Recomenda-se coletor (Loki/ELK) em produção

## 4) Incidentes (guia rápido)

1. Identificar: web indisponível? bff? keycloak? upstream?
2. Ver logs do BFF (status codes, timeouts, upstream errors)
3. Validar JWKS/issuer do Keycloak
4. Validar base URL do upstream
5. Se export travar: conferir escopo `td:export` e limites

## 5) Produção (padrão)

- Reverse proxy (NGINX/Traefik)
- TLS
- Variáveis de ambiente via secret manager
- (Opcional) Redis para cache distribuído

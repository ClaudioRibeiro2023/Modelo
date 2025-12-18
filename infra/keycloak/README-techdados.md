# Keycloak — TechDados (local)

Este diretório contém o seed para criar um ambiente local completo.

## O que é criado

- Realm: `techdados`
- Client: `techdados`
- Roles:
  - admin, audit, strategic, tactical, operational, support
- Claim territorial: `td_scopes`
- Usuário dev:
  - email/username: `dev@techdados.local`
  - senha: `dev`
  - roles: `tactical`
  - td_scopes: `MUNICIPIO:3106200` (exemplo)

## Subir Keycloak

```bash
docker compose -f infra/docker-compose.local.yml up -d keycloak
```

Admin:

- user: `admin`
- pass: `admin`

## Rodar seed

### Opção A — manual

```bash
python infra/keycloak/seed-techdados.py
```

### Opção B — via container (opcional)

Se você preferir, pode criar um service `keycloak-seed` no compose (não incluímos por padrão).

## Obter token (password grant — apenas dev)

```bash
curl -sS -X POST "http://localhost:8080/realms/techdados/protocol/openid-connect/token"   -H "Content-Type: application/x-www-form-urlencoded"   -d "grant_type=password"   -d "client_id=techdados"   -d "username=dev@techdados.local"   -d "password=dev"
```

## Claim `td_scopes`

O `seed-techdados.py` configura um **User Attribute**:

- `td_scopes = MUNICIPIO:3106200`

E cria um mapper para expor em `access_token`.

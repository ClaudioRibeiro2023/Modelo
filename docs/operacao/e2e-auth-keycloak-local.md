# E2E — Auth Keycloak local (Bloco 08)

## 1) Subir Keycloak

```bash
docker compose -f infra/docker-compose.local.yml up -d keycloak
```

Acesse:

- http://localhost:8080/admin (admin/admin)

## 2) Obter token (password grant — apenas dev)

```bash
REALM=techdados
CLIENT=techdados
USER="dev@techdados.local"
PASS="dev"

curl -sS -X POST "http://localhost:8080/realms/$REALM/protocol/openid-connect/token"   -H "Content-Type: application/x-www-form-urlencoded"   -d "grant_type=password"   -d "client_id=$CLIENT"   -d "username=$USER"   -d "password=$PASS"
```

Copie o `access_token`.

## 3) Testar BFF em modo JWT

Env:

- `TD_AUTH_MODE=jwt`
- `TD_JWT_ISSUER=http://localhost:8080/realms/techdados`
- `TD_JWT_AUDIENCE=techdados`
- `TD_JWT_JWKS_URL=http://localhost:8080/realms/techdados/protocol/openid-connect/certs`
- `TD_JWT_CLIENT_ID=techdados`
- `TD_JWT_SCOPES_CLAIM=td_scopes`

Chame:

```bash
TOKEN="<access_token>"
curl -sS "http://localhost:8000/api/v1/facts?limit=10" -H "Authorization: Bearer $TOKEN"
```

Esperado:

- 200 e dados (ou erro upstream, se não configurado)

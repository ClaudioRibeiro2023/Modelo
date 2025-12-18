# Smoke — Auth JWT (Keycloak) no BFF (Bloco 07)

## Pré-requisitos

- Keycloak acessível (local ou remoto)
- Token válido emitido pelo realm `techdados`
- Dependência instalada: `python-jose[cryptography]`

## Variáveis mínimas (exemplo)

```bash
export TD_AUTH_MODE=jwt
export TD_JWT_ISSUER="https://<host>/realms/techdados"
export TD_JWT_AUDIENCE="techdados"
export TD_JWT_JWKS_URL="https://<host>/realms/techdados/protocol/openid-connect/certs"
export TD_JWT_CLIENT_ID="techdados"
export TD_JWT_SCOPES_CLAIM="td_scopes"
```

## 1) Teste de health (sem auth)

```bash
curl -sS "http://localhost:8000/api/v1/health"
```

## 2) Teste de rota protegida (com token)

```bash
TOKEN="<cole-seu-jwt>"
curl -sS "http://localhost:8000/api/v1/facts?limit=10" -H "Authorization: Bearer $TOKEN"
```

Esperado:

- status 200
- resposta inclui `scope`/metadados quando JSON

## 3) Teste de bloqueio (token sem role)

Use um token sem roles permitidas e chame `/facts`.
Esperado: 403.

## 4) Teste de escopo municipal

Use token com `td_scopes=["MUNICIPIO:3106200"]` e export CSV:

```bash
curl -sS "http://localhost:8000/api/v1/facts?limit=5000&format=csv" -H "Authorization: Bearer $TOKEN" -o facts.csv
```

Esperado:

- CSV filtrado (se Bloco 05 aplicado e habilitado)

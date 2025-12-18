# Bloco 08 — Seed Keycloak (realm + client + roles + mapper td_scopes) + compose local

Data: 2025-12-17

## Objetivo

Tornar o Keycloak **plug-and-play** no ambiente local do TechDados, criando:

- Realm: `techdados`
- Client: `techdados` (public/confidential configurável)
- Roles: `admin`, `audit`, `strategic`, `tactical`, `operational`, `support`
- Claim territorial: `td_scopes` (via Attribute Mapper)
- Usuário dev: `dev@techdados.local` com roles e `td_scopes`

Além disso:

- Atualiza `infra/docker-compose.local.yml` para subir Keycloak com realm importado.

---

## 1) Arquivos adicionados/alterados

- `infra/keycloak/techdados-realm.json` (novo)
- `infra/keycloak/seed-techdados.py` (novo)
- `infra/keycloak/README-techdados.md` (novo)
- `infra/docker-compose.local.yml` (patch para import/seed)

---

## 2) Como usar (local)

1. Extraia o ZIP na raiz do repo.
2. Ajuste `.env` (se necessário):
   - `KEYCLOAK_ADMIN=admin`
   - `KEYCLOAK_ADMIN_PASSWORD=admin`
3. Suba o compose local:
   - `docker compose -f infra/docker-compose.local.yml up -d keycloak`
4. Rode seed (opcional; já roda automático se você ativar o service seed):
   - `python infra/keycloak/seed-techdados.py`

---

## 3) Padrões do token (compatível com Bloco 07)

Issuer (local):

- `http://localhost:8080/realms/techdados`

JWKS:

- `http://localhost:8080/realms/techdados/protocol/openid-connect/certs`

Audience/client:

- `techdados`

Claim de scopes:

- `td_scopes`

---

## 4) Como obter token

No Keycloak:

- Realm: techdados
- Usuário: dev@techdados.local
- Senha: dev

Você pode usar o grant `password` em ambiente local (apenas dev):
Ver `infra/keycloak/README-techdados.md`.

---

## 5) Smoke end-to-end

Ver:

- `docs/operacao/e2e-auth-keycloak-local.md`

---

## 6) Próximo bloco sugerido (Bloco 09)

- Frontend: login OIDC + refresh token + roteamento por módulos conforme roles.
- Navegação dinâmica com base no RBAC.

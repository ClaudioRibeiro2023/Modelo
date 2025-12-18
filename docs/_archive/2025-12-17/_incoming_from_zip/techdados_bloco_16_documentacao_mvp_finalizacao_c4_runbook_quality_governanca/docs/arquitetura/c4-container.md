# C4 — Container (TechDados)

## Containers

1. **Web App (React/Vite)**

- UI, filtros, visualizações
- OIDC login/callback
- Consome apenas o BFF

2. **BFF (FastAPI)**

- API para o Web
- Proxy/Adapter do Upstream
- RBAC/Scopes e recorte territorial
- Exportações + auditoria

3. **Keycloak**

- Realm techdados
- Client techdados (public/confidential conforme estratégia)
- Roles/scopes via claims

4. **Upstream API (Techdengue)**

- Endpoints de dados (dengue, weather, risk etc.)
- Pode ser público, mas TechDados impõe controle de acesso

5. **Infra**

- Docker compose local
- (Opcional) Redis para cache distribuído
- (Opcional) Postgres/warehouse no futuro

## Fluxos

### Login

Web → Keycloak (OIDC) → Web recebe token → Web chama BFF com `Authorization: Bearer`

### Dados

Web → BFF → (cache/RBAC/auditoria) → Upstream → BFF → Web

### Export

Web → BFF (scope td:export) → gera arquivo/stream → auditoria de export

# techdados_bff

Pacote do BFF (FastAPI) para o TechDados.

Criado para **minimizar conflitos** com o template e permitir evolução rápida:

- auth mock local
- integração com Keycloak (P2)
- RBAC + ABAC (escopo territorial)
- cache TTL em memória
- client do provedor de dados
- auditoria via logs estruturados

Integração no FastAPI:

- importe `app.techdados_bff.api.router.router`
- inclua no `FastAPI()` via `include_router(...)`

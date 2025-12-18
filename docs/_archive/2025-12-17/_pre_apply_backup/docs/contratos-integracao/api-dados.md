# Contrato da API de Dados — TechDados

> **Status:** Placeholder — aguardando integração com API de Dados do Techdengue
>
> **Última atualização:** 2024-12-17

---

## Visão Geral

Este documento define o contrato de integração entre o **TechDados** (dashboard/analytics) e a **API de Dados** do ecossistema Techdengue.

> ⚠️ **Nota:** Os endpoints específicos serão definidos quando a integração for implementada. Este documento estabelece os padrões e requisitos.

---

## Padrões de Autenticação

### Método

- **OAuth 2.0 / OIDC** via Keycloak
- **Bearer Token** no header `Authorization`
- Tokens JWT com claims de roles e escopo territorial

### Headers Obrigatórios

```http
Authorization: Bearer <access_token>
X-Request-ID: <uuid>
X-Tenant-ID: <territory_id>
```

### Validação de Token

A API deve validar:

1. Assinatura JWT (via JWKS do Keycloak)
2. Expiração (`exp` claim)
3. Audience (`aud` deve incluir `techdados-api`)
4. Roles no `realm_access.roles`

---

## Rate Limiting

| Tier        | Limite       | Janela    | Aplicação               |
| ----------- | ------------ | --------- | ----------------------- |
| **Default** | 100 requests | 1 minuto  | Por usuário autenticado |
| **Burst**   | 20 requests  | 1 segundo | Anti-abuse              |
| **Export**  | 10 requests  | 1 hora    | Operações de exportação |

### Headers de Resposta

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702828800
```

---

## Cache

### Estratégia

| Tipo de Dado    | TTL       | Invalidação |
| --------------- | --------- | ----------- |
| Dados agregados | 5 minutos | Por evento  |
| Metadados       | 1 hora    | Manual      |
| Configurações   | 24 horas  | Deploy      |

### Headers

```http
Cache-Control: private, max-age=300
ETag: "abc123"
```

Clientes devem implementar `If-None-Match` para otimizar requests.

---

## Paginação

### Padrão: Cursor-based

```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "has_next": true,
    "has_prev": false,
    "total_count": 1500
  }
}
```

### Parâmetros

| Parâmetro   | Tipo    | Default | Máximo         |
| ----------- | ------- | ------- | -------------- |
| `limit`     | integer | 50      | 200            |
| `cursor`    | string  | null    | -              |
| `direction` | enum    | `next`  | `next`, `prev` |

---

## Classificação dos Datasets

| Dataset             | Nível      | Descrição           | Roles Permitidas |
| ------------------- | ---------- | ------------------- | ---------------- |
| `dashboard/summary` | PUBLIC     | Métricas agregadas  | VIEWER+          |
| `reports/regional`  | RESTRICTED | Dados por região    | OPERADOR+        |
| `reports/detailed`  | RESTRICTED | Dados detalhados    | GESTOR+          |
| `export/full`       | SENSITIVE  | Exportação completa | ADMIN            |

---

## Mascaramento e Anonimização

### Regras por Nível de Acesso

| Campo       | VIEWER | OPERADOR        | GESTOR           | ADMIN    |
| ----------- | ------ | --------------- | ---------------- | -------- |
| Nome        | `***`  | `J*** S***`     | `João S***`      | Completo |
| CPF         | `***`  | `***`           | `***.456.***-**` | Completo |
| Endereço    | Cidade | Bairro          | Rua (sem número) | Completo |
| Coordenadas | Região | Bairro centroid | ±100m            | Exato    |

### Implementação

- Anonimização aplicada na API antes da resposta
- Logs de acesso a dados sensíveis
- Campo `_masked: true` indica dados mascarados

---

## Formato de Erros

```json
{
  "error": {
    "code": "FORBIDDEN_TERRITORY",
    "message": "Usuário não tem acesso a este território",
    "details": {
      "requested_territory": "SP",
      "user_territory": "RJ"
    },
    "request_id": "abc-123-def"
  }
}
```

### Códigos de Erro

| HTTP | Código                | Descrição                   |
| ---- | --------------------- | --------------------------- |
| 400  | `INVALID_REQUEST`     | Parâmetros inválidos        |
| 401  | `UNAUTHORIZED`        | Token ausente ou inválido   |
| 403  | `FORBIDDEN_ROLE`      | Role insuficiente           |
| 403  | `FORBIDDEN_TERRITORY` | Fora do escopo territorial  |
| 404  | `NOT_FOUND`           | Recurso não existe          |
| 429  | `RATE_LIMITED`        | Limite de requests excedido |
| 500  | `INTERNAL_ERROR`      | Erro interno                |

---

## Endpoints (Placeholder)

> ⚠️ **A definir:** Os endpoints serão documentados quando a API estiver disponível.

### Previstos

```
GET  /api/v1/dashboard/summary
GET  /api/v1/reports/regional
GET  /api/v1/reports/detailed
POST /api/v1/export/request
GET  /api/v1/export/{id}/status
GET  /api/v1/export/{id}/download
```

---

## Versionamento

- Versão no path: `/api/v1/...`
- Deprecation header: `Sunset: <date>`
- Mínimo 6 meses de suporte após deprecation

---

## Referências

- [RBAC do TechDados](../seguranca/rbac.md)
- [Autenticação OIDC](./auth.md)
- [API REST (padrões gerais)](./api.md)

---

_Documento criado em 2024-12-17 — Fundação TechDados_

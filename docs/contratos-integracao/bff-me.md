# Contrato — BFF `GET /api/me`

## Finalidade

Endpoint para retornar o **contexto do usuário autenticado** (identidade + autorização) para consumo do frontend e para depuração operacional.

> Importante: não deve conter dados sensíveis além do necessário para autorização (roles/scopes).

## Requisição

- **Método:** GET
- **Path:** `/api/me`
- **Headers:**
  - `Authorization: Bearer <access_token>` (obrigatório em modo `jwt`)
  - `x-request-id: <uuid>` (opcional; se não vier, o BFF gera)

## Resposta 200 (JSON)

```json
{
  "user_id": "claudio.ribeiro@empresa.com",
  "roles": ["admin", "tactical"],
  "scopes": ["STATE:MG", "MUNICIPIO:3106200"],
  "scope": {
    "has_state_mg": true,
    "municipios": ["3106200"],
    "scopes": ["STATE:MG", "MUNICIPIO:3106200"]
  },
  "auth_mode": "jwt",
  "request_id": "c2b0280d-7d6c-4c2c-99e5-ec6a1d3b1d10"
}
```

## Erros

- **401**: token ausente/ inválido (modo `jwt`)
- **500**: falha inesperada (problema de JWKS, rede, configuração)

## Notas de implementação

- O endpoint usa a dependency `user_ctx` para obter `UserContext`.
- `scope` é derivado por `scope_metadata(user)`.

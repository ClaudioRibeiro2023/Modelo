# Contrato — Endpoint /nav (TechDados)

## Objetivo

Permitir que o frontend obtenha do backend a **árvore de navegação** permitida para o usuário autenticado.

## Endpoint

- `GET /api/v1/nav`

## Resposta (MVP)

```json
{
  "user": {
    "id": "dev@techdados.local",
    "roles": ["admin"],
    "scopes": ["td:read", "td:export"]
  },
  "nav": [
    {
      "id": "home",
      "label": "Visão geral",
      "path": "/",
      "allowedRoles": ["admin", "strategic", "tactical"]
    },
    {
      "id": "epi",
      "label": "Epidemiologia",
      "path": "/epi",
      "allowedRoles": ["admin", "strategic", "tactical", "operational"]
    }
  ]
}
```

## Observações

- O frontend pode usar este retorno para montar sidebar/menu.
- O backend continua aplicando RBAC em cada endpoint.

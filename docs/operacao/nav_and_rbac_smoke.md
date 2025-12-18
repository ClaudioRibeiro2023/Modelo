# Smoke — /nav + RBAC policies (BFF)

## 1) Validar /nav

Com token válido, faça:

- `GET http://localhost:8000/api/v1/nav`

Esperado:

- 200 e JSON com `user` e `nav`.

## 2) Validar bloqueio (após aplicar policies)

Exemplo: sem scope `td:read`, chamar:

- `GET http://localhost:8000/api/v1/techdengue/facts`

Esperado:

- 403

## 3) Validar auditoria

Verifique logs do BFF:

- deve registrar `principal`, `path`, `method`, `status`, `duration_ms`.

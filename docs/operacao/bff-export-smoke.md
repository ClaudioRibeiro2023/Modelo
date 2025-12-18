# Smoke — Exportação CSV com escopo municipal (Bloco 05)

## Pré-requisitos

Env:

- `TD_AUTH_MODE=mock`
- `TD_MOCK_ROLES=tactical`
- `TD_MOCK_SCOPES=MUNICIPIO:3106200`
- `TD_EXPORT_FILTER_CSV_ENABLED=true`
- `TECHDENGUE_API_BASE_URL=...` (apontando para o upstream)

## 1) facts CSV filtrado

```bash
curl -sS "http://localhost:8000/api/v1/facts?limit=5000&format=csv" -o facts.csv
```

Validação:

- Abrir o CSV e conferir se linhas pertencem ao município permitido.
- Se não houver como validar por coluna, reduza `fields=` para forçar colunas de município/código (se o upstream suportar).

## 2) gold CSV filtrado

```bash
curl -sS "http://localhost:8000/api/v1/gold?limit=20000&format=csv" -o gold.csv
```

## 3) comportamento esperado ao exceder caps

Defina:

- `TD_EXPORT_MAX_BYTES=1000`

E repita um export:

- Deve falhar com erro informando que excedeu o limite.

# Smoke — Exportação Parquet com escopo municipal (Bloco 06)

## Pré-requisitos

Env:

- `TD_AUTH_MODE=mock`
- `TD_MOCK_ROLES=tactical`
- `TD_MOCK_SCOPES=MUNICIPIO:3106200`
- `TD_EXPORT_FILTER_PARQUET_ENABLED=true`
- `TECHDENGUE_API_BASE_URL=...`

Dependência:

- `pip install pyarrow`

## 1) facts Parquet filtrado

```bash
curl -sS "http://localhost:8000/api/v1/facts?limit=5000&format=parquet" -o facts.parquet
```

Validação (exemplo em Python):

```python
import pyarrow.parquet as pq
t = pq.read_table("facts.parquet")
print(t.num_rows, t.column_names)
```

Esperado:

- rows apenas do município permitido (se houver coluna IBGE no dataset)

## 2) gold Parquet filtrado

```bash
curl -sS "http://localhost:8000/api/v1/gold?limit=20000&format=parquet" -o gold.parquet
```

## 3) comportamento esperado sem coluna IBGE

Se o dataset não tiver coluna equivalente a IBGE:

- BFF deve negar com erro explicando falta de coluna (safe-by-default).

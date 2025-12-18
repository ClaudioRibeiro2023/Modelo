# Rodar o BFF localmente (isolado)

Este BFF foi desenhado para ser executado de forma independente do `api-template/app/main.py`, usando o entrypoint:

- `app.techdados_bff.main:app`

## Pré-requisitos

- Python 3.12+ recomendado (alinhado ao template)
- Dependências do `api-template` instaladas

## Passos

1. Abra um terminal na pasta `api-template/`
2. Instale deps (exemplo):

```bash
pip install -r requirements.txt
```

3. Execute:

```bash
uvicorn app.techdados_bff.main:app --reload --port 8000
```

4. Teste:

- Health: `GET http://localhost:8000/health`
- Swagger: `http://localhost:8000/docs`

## CORS

Por padrão, libera:

- `http://localhost:13000`
- `http://127.0.0.1:13000`

Ajuste em `TD_CORS_ORIGINS` (CSV) se necessário.

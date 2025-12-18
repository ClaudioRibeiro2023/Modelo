# Bloco 06 — Export Filter Parquet por escopo municipal + Auditoria de export (MVP)

Data: 2025-12-17

## Objetivo

1. Liberar exportação **Parquet** com escopo municipal (`MUNICIPIO:*`) para `/facts` e `/gold`, com filtro seguro no BFF.
2. Registrar **evento de exportação** (auditoria) com metadados mínimos.

---

## 1) O que entra neste bloco

### 1.1 Export filter Parquet

- Implementação baseada em **pyarrow**:
  - lê bytes Parquet
  - identifica coluna de código do município (IBGE)
  - filtra as linhas pelo conjunto `allowed_codes`
  - re-serializa para Parquet

**MVP (seguro)**

- Se não existir coluna reconhecida de código IBGE, o export Parquet é **bloqueado** (sem fallback por nome).
- Se `pyarrow` não estiver disponível, o export Parquet é bloqueado com erro explicativo.

### 1.2 Auditoria de export

- Todo export (`format=csv|parquet`) dispara `audit_export_event()` com:
  - endpoint
  - user_id
  - roles
  - scopes
  - format
  - bytes_out (após filtro)
  - count_hint (se disponível)
  - status (success/blocked/error)

Destino:

- stdout (log estruturado) e opcional arquivo JSONL se `TD_AUDIT_LOG_PATH` estiver definido.

---

## 2) Como aplicar

1. Extraia este ZIP na raiz do repo.
2. Instale dependência (se ainda não estiver):
   - `pip install pyarrow`
   - (opcional) adicionar ao `api-template/requirements.txt` — este bloco já inclui a linha.

---

## 3) Variáveis de ambiente

### Para liberar Parquet com escopo municipal

- `TD_EXPORT_FILTER_PARQUET_ENABLED=true`

### Auditoria

- `TD_AUDIT_LOG_PATH=./.local/audit-export.jsonl` _(opcional)_

---

## 4) Smoke tests

- `docs/operacao/bff-export-parquet-smoke.md`

---

## 5) Próximo bloco sugerido (Bloco 07)

- Integração real com Keycloak (JWT): extrair roles/scopes de claims (`td_scopes`) com validação.
- Auditoria persistida em banco (opcional) + dashboards de auditoria.

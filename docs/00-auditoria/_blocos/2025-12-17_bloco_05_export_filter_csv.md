# Bloco 05 — Export Filter CSV por escopo municipal (MVP seguro)

Data: 2025-12-17

## Objetivo

Liberar exportação **CSV** em `/facts` e `/gold` **mesmo quando o usuário tiver escopo municipal** (`MUNICIPIO:*`),
aplicando um filtro seguro no BFF, para evitar vazamento de dados fora do território.

> Parquet permanece bloqueado no MVP (opcional no Bloco 06), por depender de `pyarrow` e re-serialização.

---

## 1) O que muda neste bloco (resumo)

### 1.1 Código (BFF)

- Introduz **UserContext** e **deps** (mock/disabled) para padronizar RBAC/escopo.
- Implementa **MunicipioCache** para mapear `nome ↔ código IBGE` via upstream `/municipios`.
- Implementa filtro **CSV linha a linha**:
  - identifica coluna de `codigo_ibge` (ou equivalentes)
  - se não existir, tenta resolver pelo nome do município (coluna `municipio`, `nome_municipio`, etc.)
  - se não conseguir resolver, **descarta a linha** (safe-by-default)
- Atualiza rotas `/facts` e `/gold` para:
  - permitir export CSV com escopo municipal **se** `TD_EXPORT_FILTER_CSV_ENABLED=true`
  - aplicar o filtro antes de retornar o CSV ao usuário

### 1.2 Docs

- Atualiza política de exportação e inclui smoke dedicado.

---

## 2) Como aplicar este bloco

1. Extraia o ZIP na raiz do repo TechDados.
2. Garanta que o BFF está incluído no `main.py` (Bloco 02).
3. Defina as variáveis abaixo.

---

## 3) Variáveis de ambiente (obrigatório para liberar export CSV com MUNICIPIO:\*)

### Auth (dev)

- `TD_AUTH_MODE=mock`
- `TD_MOCK_ROLES=tactical` (ou strategic/audit/admin)
- `TD_MOCK_SCOPES=MUNICIPIO:3106200` (ex.: BH)

### Export filter

- `TD_EXPORT_FILTER_CSV_ENABLED=true`
- `TD_EXPORT_MAX_BYTES=30000000` _(30MB default; recomendo manter)_
- `TD_EXPORT_MAX_LINES=200000` _(default; evita export muito grande no MVP)_

---

## 4) Smoke tests

Use o documento:

- `docs/operacao/bff-export-smoke.md`

---

## 5) Limitações assumidas (MVP)

- CSV muito grande pode ser bloqueado por caps (bytes/linhas).
- Se o upstream não fornece `codigo_ibge` nem `municipio` por linha, o filtro retornará vazio.
- Parquet segue bloqueado quando `MUNICIPIO:*` (próximo bloco).

---

## 6) Próximo bloco (Bloco 06)

- Export filter para **Parquet** (pyarrow) + StreamingResponse opcional.
- Auditoria de export (evento) + trilha de logs.

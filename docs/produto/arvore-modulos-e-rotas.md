# Árvore de Módulos e Rotas — TechDados (Navegação + Visibilidade por Perfil)

**Versão:** v1.0  
**Última atualização:** 2025-12-17  
**Objetivo:** definir árvore de módulos, rotas do frontend e visibilidade por perfil (RBAC+ABAC).

Documentos relacionados:

- `docs/produto/matriz-analises.md`
- `docs/seguranca/rbac.md`

---

## 1) Filtros globais

- **Território:** `STATE|URS|MUNICIPIO` (conforme escopo do usuário)
- **Período:** `8w|12w|16w|custom` + suporte a `SE|MES`

---

## 2) Rotas (P0)

### Home

- `/app/home/panorama`
- `/app/home/alertas`

Perfis: admin, estratégico, tático, operacional, auditoria (com recortes por escopo).

### Epidemiologia

- `/app/epidemiologia/ranking`
- `/app/epidemiologia/tendencia`
- `/app/epidemiologia/comparativos`
- `/app/epidemiologia/sazonalidade`

Perfis: estratégico, tático, auditoria (operacional apenas no município).

### Risco

- `/app/risco/dashboard`
- `/app/risco/municipio/:codigo_ibge`
- `/app/risco/priorizacao`

Perfis: estratégico, tático, operacional (restrito), auditoria.

### Clima

- `/app/clima/atual`
- `/app/clima/forecast`
- `/app/clima/risco` (se provedor suportar)

Perfis: estratégico, tático, operacional, auditoria.

### Governança

- `/app/governanca/status`
- `/app/governanca/auditoria/stats`
- `/app/governanca/auditoria/logs`

Perfis: admin e auditoria (suporte opcional).

---

## 3) Checklist DoD

- [ ] rotas P0 definidas e amarradas aos IDs da matriz
- [ ] visibilidade por perfil definida
- [ ] filtros globais definidos

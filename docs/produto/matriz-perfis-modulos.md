# Matriz Perfil × Módulo × Ações — TechDados

> Este documento é o “mapa de permissões do produto”.  
> Ele complementa o RBAC técnico (docs/seguranca/rbac.md) com uma visão prática de UX.

## 1. Perfis (macro)

Baseado no documento de referência “Hierarquia de acessos – Sistema Techdengue (v1.0)”:

- **Estratégico**: visão macro, indicadores e relatórios consolidados.
- **Tático**: gestão regional/municipal, acompanhamento operacional e priorização.
- **Operacional**: execução em campo, acompanhamento do próprio território e rotinas diárias.
- **Apoio indireto** (auditoria/controle/consultoria): leitura e evidências; geralmente sem poder de exportação irrestrita.

> **Admin** é perfil técnico do sistema (não necessariamente um “usuário final”).

## 2. Ações (capabilities)

- **Ver dashboards**
- **Ver detalhe (drill-down)**
- **Exportar (CSV/Parquet/PDF)**
- **Configurar filtros avançados**
- **Gerir tenants/usuários/escopos**
- **Ver auditoria e logs**
- **Executar ações administrativas upstream** (cache clear, chaves, etc.)

## 3. Matriz resumida

| Módulo          |  Estratégico |                  Tático | Operacional | Apoio indireto (Audit) | Admin |
| --------------- | -----------: | ----------------------: | ----------: | ---------------------: | ----: |
| Visão geral     |          Ver |                     Ver |           — |                      — |   Ver |
| Epidemiologia   | Ver + Export |            Ver + Export |         Ver |  Ver (somente leitura) |   Ver |
| Operação        |            — | Ver + Export (restrito) |         Ver |                      — |   Ver |
| Clima           |          Ver |                     Ver |         Ver |                      — |   Ver |
| Risco (IA)      |          Ver |                     Ver |         Ver |                      — |   Ver |
| ETL / Qualidade |            — |                       — |           — |                    Ver |   Ver |
| Auditoria       |            — |                       — |           — |                    Ver |   Ver |
| Admin           |            — |                       — |           — |                      — |   Ver |

## 4. Regras de exportação (política prática)

1. Exportação é **por dataset** e **por escopo** (território/tempo).
2. Exportações devem gerar:
   - um **registro de auditoria** (user, dataset, filtros, timestamp)
   - um “hash”/assinatura de payload (quando aplicável)
3. Perfis **Estratégico** e **Tático** podem exportar, mas:
   - Estratégico: escopo macro; sensível sob governança
   - Tático: escopo do território/consórcio/região
4. Operacional: exportação **limitada** (ex.: apenas tabelas de rotina do próprio município)
5. Apoio indireto: preferencialmente **sem exportação**; acesso “read-only” e com justificativa

## 5. Próximo passo

Ao implementar UI, usar esta matriz para:

- esconder itens de menu
- habilitar/desabilitar botões de export
- restringir filtros (escopo territorial)
- definir quais telas ficam “somente leitura”

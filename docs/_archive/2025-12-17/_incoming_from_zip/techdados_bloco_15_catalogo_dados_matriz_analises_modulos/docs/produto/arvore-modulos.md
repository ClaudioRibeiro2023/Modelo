# Árvore de Módulos (MVP) — TechDados

Esta árvore é a base do **menu lateral** e do planejamento de telas.

## 1) Visão Geral

- KPI cards (incidência, cobertura, produtividade, conversão)
- Alertas rápidos (top municípios em risco)
- Última atualização / saúde do sistema

## 2) Epidemiologia

- Mapa de calor (incidência / 100k)
- Ranking (Top N municípios)
- Séries temporais (UF/município)
- Comparativos (2024 vs 2025)

## 3) Operação

- Cobertura territorial (HA_MAP vs HA_URBANOS)
- Produtividade (POIs/ha por contratante/analista)
- Categorias críticas (Top classes de POIs)
- Devolutivas e conversão

## 4) Geoespacial

- Hotspots (clusterização)
- Mapas temáticos por camada
- (futuro) Análise por quadra/bairro (se existir shape)

## 5) Risco e Previsão

- Dashboard de risco (upstream)
- Análise “risk/analyze” (simulador)
- Clima e risco (weather/\*)

## 6) Exportações

- CSV/Parquet por módulo (controlado por `td:export`)
- Trilhas de auditoria de export (quem/quanto/quando)

## 7) Auditoria

- Logs de acesso a dados
- Estatísticas de uso
- Alertas de segurança (padrões anômalos)

## 8) Administração

- Usuários e perfis
- Configuração de módulos
- Feature flags

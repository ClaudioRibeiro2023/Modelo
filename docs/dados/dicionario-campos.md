# Dicionário de Campos — TechDados (Canônico)

**Versão:** v1.0  
**Última atualização:** 2025-12-17  
**Objetivo:** definir o dicionário canônico de campos usados no TechDados, por dataset, incluindo:

- nome canônico
- origem (campo do provedor)
- tipo (técnico)
- semântica (negócio)
- regras de validação
- transformações derivadas (ex.: incidência/100k)
- exemplos
- observações (vazios, enums, limites)

Documentos relacionados:

- Catálogo de datasets: `docs/dados/catalogo-datasets.md`
- NFRs: `docs/produto/nfrs.md`
- RBAC/ABAC: `docs/seguranca/rbac.md`
- Matriz perfis x ações: `docs/seguranca/matriz-perfis-acoes.md`
- Auditoria de eventos: `docs/seguranca/auditoria-eventos.md`
- Contratos de integração: `docs/contratos-integracao/api-dados.md`

---

## 1) Convenções (padrão TechDados)

### 1.1 Nomes e estilo

- Nomes de campos canônicos: `snake_case`
- IDs e códigos estáveis: sufixo `_id` quando for identificador interno
- Código IBGE: `codigo_ibge` (sempre string para não perder zeros à esquerda)
- Datas:
  - `timestamp` em ISO-8601
  - `date` em `YYYY-MM-DD`
- Períodos epidemiológicos:
  - semana epidemiológica: `se` (inteiro 1..53)
  - mês: `mes` (1..12)
  - ano: `ano` (YYYY)

### 1.2 Tipos canônicos

- `string`, `int`, `float`, `bool`
- `date`, `datetime`
- `enum:<NOME_ENUM>`
- `object`, `array<object>`

### 1.3 Regras de compatibilidade

- O TechDados não deve depender de nomes “voláteis” do provedor.
- Sempre mapear campo do provedor → campo canônico no BFF.

---

## 2) Enums canônicos (P0)

### 2.1 `enum:risk_level`

Valores sugeridos:

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

> Se o provedor usa valores diferentes (ex.: “Baixo/Médio/Alto”), mapear no BFF para o enum canônico.

### 2.2 `enum:export_policy`

- `none`
- `aggregated`
- `deidentified`
- `full_controlled`

### 2.3 `enum:data_class`

- `public`
- `restricted`
- `sensitive`

---

## 3) Dicionário por dataset (P0)

> Os datasets abaixo são os P0 do catálogo.  
> Campos “origem_provedor” podem ser placeholders até termos o OpenAPI real.

---

### 3.1 TD_DS_001 — `municipios_ref`

| Campo canônico      | Origem provedor |   Tipo | Obrigatório | Semântica                          | Validação             | Exemplo              | Observações              |
| ------------------- | --------------- | -----: | :---------: | ---------------------------------- | --------------------- | -------------------- | ------------------------ |
| `codigo_ibge`       | `codigo_ibge`   | string |     ✅      | Identificador oficial do município | regex `^\d{7}$`       | `"3106200"`          | sempre string            |
| `nome_municipio`    | `nome`          | string |     ✅      | Nome do município                  | não vazio             | `"Belo Horizonte"`   |                          |
| `uf`                | `uf`            | string |     ✅      | Unidade federativa                 | regex `^[A-Z]{2}$`    | `"MG"`               |                          |
| `urs_id`            | `urs`           | string |     ❌      | Identificador da URS               | não vazio se presente | `"URS-SJDR"`         | opcional no MVP          |
| `urs_nome`          | `urs_nome`      | string |     ❌      | Nome URS                           | não vazio se presente | `"São João del-Rei"` | opcional                 |
| `consorcio_id`      | `consorcio`     | string |     ❌      | Identificador do consórcio         | —                     | `"ICISMEP-BH"`       | opcional                 |
| `populacao`         | `populacao`     |    int |     ❌      | População (ano ref definido)       | > 0                   | `2521564`            | pode vir de TD_DS_003    |
| `ano_populacao_ref` | `ano_ref`       |    int |     ❌      | Ano referência da população        | 1900..2100            | `2024`               | importante p/ incidência |

**Checks recomendados:**

- unicidade de `codigo_ibge`
- `uf` coerente (pode cruzar com tabela oficial posteriormente)

---

### 3.2 TD_DS_002 — `dengue_series`

| Campo canônico    | Origem provedor   |      Tipo | Obrigatório | Semântica                               | Validação       | Exemplo                  | Observações                      |
| ----------------- | ----------------- | --------: | :---------: | --------------------------------------- | --------------- | ------------------------ | -------------------------------- | -------------------- |
| `codigo_ibge`     | `codigo_ibge`     |    string |     ✅      | Município                               | regex `^\d{7}$` | `"3106200"`              | join com `municipios_ref`        |
| `ano`             | `ano`             |       int |     ✅      | Ano do período                          | 2000..2100      | `2025`                   |                                  |
| `se`              | `se`              |       int |     ⚠️      | Semana epidemiológica                   | 1..53           | `20`                     | obrigatório se granularidade=SE  |
| `mes`             | `mes`             |       int |     ⚠️      | Mês do ano                              | 1..12           | `5`                      | obrigatório se granularidade=mês |
| `periodo_tipo`    | `periodo_tipo`    | enum: `SE |    MES`     | ✅                                      | Tipo de período | em enum                  | `"SE"`                           | usado para validação |
| `casos`           | `casos`           |       int |     ✅      | Casos notificados/confirmados (definir) | >= 0            | `120`                    | especificar no contrato          |
| `incidencia_100k` | `incidencia_100k` |     float |     ❌      | Casos por 100 mil hab.                  | >= 0            | `4.76`                   | pode ser derivado                |
| `fonte_dado`      | `fonte`           |    string |     ❌      | Fonte do dado                           | —               | `"SES-MG"`               | opcional                         |
| `atualizado_em`   | `updated_at`      |  datetime |     ❌      | Timestamp de atualização do registro    | ISO-8601        | `"2025-12-17T10:00:00Z"` | útil p/ cache                    |

#### Transformações derivadas (canônicas)

**T1 — Incidência por 100k (quando provedor não entrega)**

- Fórmula:
  - `incidencia_100k = (casos / populacao) * 100000`
- Dependência:
  - `populacao` do `municipios_ref` (ou `populacao_ref`)
- Regras:
  - se `populacao` ausente ou 0 → retornar `null` e registrar warning de qualidade
- Arredondamento:
  - manter `float` com 2 casas na UI (não truncar no backend)

---

### 3.3 TD_DS_003 — `populacao_ref`

| Campo canônico | Origem provedor |   Tipo | Obrigatório | Semântica         | Validação       | Exemplo     | Observações |
| -------------- | --------------- | -----: | :---------: | ----------------- | --------------- | ----------- | ----------- |
| `codigo_ibge`  | `codigo_ibge`   | string |     ✅      | Município         | regex `^\d{7}$` | `"3106200"` |             |
| `ano_ref`      | `ano_ref`       |    int |     ✅      | Ano de referência | 1900..2100      | `2024`      |             |
| `populacao`    | `populacao`     |    int |     ✅      | População         | > 0             | `2521564`   |             |

---

### 3.4 TD_DS_004 — `risk_dashboard`

| Campo canônico  | Origem provedor |            Tipo | Obrigatório | Semântica               | Validação       | Exemplo                  | Observações                       |
| --------------- | --------------- | --------------: | :---------: | ----------------------- | --------------- | ------------------------ | --------------------------------- |
| `codigo_ibge`   | `codigo_ibge`   |          string |     ✅      | Município               | regex `^\d{7}$` | `"3106200"`              |                                   |
| `risk_score`    | `score`         |           float |     ✅      | Score contínuo de risco | faixa definida  | `0.82`                   | documentar faixa (0..1 ou 0..100) |
| `risk_level`    | `nivel`         | enum:risk_level |     ✅      | Categoria de risco      | em enum         | `"HIGH"`                 | mapear no BFF                     |
| `drivers`       | `drivers`       |   array<object> |     ❌      | Fatores explicativos    | —               | `[{...}]`                | opcional                          |
| `timestamp_ref` | `timestamp_ref` |        datetime |     ❌      | referência do cálculo   | ISO             | `"2025-12-17T12:00:00Z"` | útil p/ cache                     |

---

### 3.5 TD_DS_005 — `risk_municipio`

| Campo canônico    | Origem provedor   |            Tipo | Obrigatório | Semântica                 | Validação       | Exemplo                              | Observações |
| ----------------- | ----------------- | --------------: | :---------: | ------------------------- | --------------- | ------------------------------------ | ----------- |
| `codigo_ibge`     | `codigo_ibge`     |          string |     ✅      | Município                 | regex `^\d{7}$` | `"3106200"`                          |             |
| `risk_score`      | `score`           |           float |     ✅      | Score                     | faixa definida  | `0.75`                               |             |
| `risk_level`      | `nivel`           | enum:risk_level |     ✅      | Nível                     | em enum         | `"MEDIUM"`                           |             |
| `drivers`         | `drivers`         |   array<object> |     ⚠️      | Drivers (explicabilidade) | —               | `[{ "name": "...", "weight": 0.2 }]` | desejável   |
| `recommendations` | `recommendations` |   array<string> |     ❌      | recomendações táticas     | —               | `["Aumentar inspeções..."]`          | opcional    |
| `timestamp_ref`   | `timestamp_ref`   |        datetime |     ❌      | referência                | ISO             | `"2025-12-17T12:00:00Z"`             |             |

---

### 3.6 TD_DS_006 — `weather_city`

| Campo canônico | Origem provedor |          Tipo | Obrigatório | Semântica         | Validação       | Exemplo                  | Observações           |
| -------------- | --------------- | ------------: | :---------: | ----------------- | --------------- | ------------------------ | --------------------- |
| `city_name`    | `city`          |        string |     ✅      | Nome cidade       | não vazio       | `"Contagem"`             |                       |
| `codigo_ibge`  | `codigo_ibge`   |        string |     ❌      | Município mapeado | regex `^\d{7}$` | `"3118601"`              | depende do mapeamento |
| `timestamp`    | `timestamp`     |      datetime |     ✅      | referência        | ISO             | `"2025-12-17T14:00:00Z"` |                       |
| `temp_c`       | `temp_c`        |         float |     ❌      | temperatura       | plausível       | `26.4`                   |                       |
| `humidity_pct` | `humidity`      |         float |     ❌      | umidade (%)       | 0..100          | `62`                     |                       |
| `rain_mm`      | `rain_mm`       |         float |     ❌      | precipitação      | >=0             | `3.2`                    |                       |
| `forecast`     | `forecast`      | array<object> |     ❌      | previsão          | —               | `[{...}]`                | opcional              |

---

### 3.7 TD_DS_007 — `observability_status` (interno TechDados)

| Campo canônico | Origem |     Tipo | Obrigatório | Semântica       | Exemplo                                              |
| -------------- | ------ | -------: | :---------: | --------------- | ---------------------------------------------------- |
| `app_name`     | bff    |   string |     ✅      | nome do app     | `"techdados-api"`                                    |
| `version`      | bff    |   string |     ✅      | versão          | `"0.1.0"`                                            |
| `env`          | bff    |   string |     ✅      | ambiente        | `"local"`                                            |
| `keycloak`     | bff    |   object |     ✅      | status auth     | `{ "url": "...", "realm": "techdados", "ok": true }` |
| `provider`     | bff    |   object |     ✅      | status provedor | `{ "base_url": "...", "ok": false }`                 |
| `cache`        | bff    |   object |     ✅      | cache stats     | `{ "enabled": true, "ttl_p0": 3600 }`                |
| `timestamp`    | bff    | datetime |     ✅      | referência      | `"2025-12-17T14:00:00Z"`                             |

---

## 4) Campos transversais (cross-cutting)

### 4.1 `territory` (padrão)

- `territory_type`: enum (`STATE|URS|CONSORCIO|MUNICIPIO|AREA`)
- `territory_id`: string
- `territory_name`: string opcional

### 4.2 `time_range` (padrão)

- `from`: `YYYY-MM-DD`
- `to`: `YYYY-MM-DD`
- `period_type`: `SE|MES|CUSTOM`

---

## 5) Regras de validação e qualidade (mínimas)

- `codigo_ibge`: string com 7 dígitos
- `casos`: inteiro >= 0
- `populacao`: inteiro > 0
- `incidencia_100k`: float >= 0 ou null (se não calculável)
- `se`: 1..53
- `mes`: 1..12
- enums: mapear ou rejeitar (registrar warning)

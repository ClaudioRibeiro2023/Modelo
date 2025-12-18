# Contrato de Integração — API de Dados TechDengue (Upstream)

> **Contexto:** o TechDados consome dados do **TechDengue API Gateway** (FastAPI) para compor dashboards, análises e exportações.  
> Este documento descreve o contrato **do ponto de vista do TechDados** (consumidor), incluindo endpoints, parâmetros e recomendações de uso.

## 1. Ambientes e Base URLs

A documentação upstream indica mais de uma URL em uso (histórico de deploys). **No TechDados, a base URL deve ser configurável via variável de ambiente**:

- `TD_UPSTREAM_BASE_URL` (ex.: `https://techdengue-api.railway.app`)
- Alternativa (conforme docs de “Ambientes”): `https://banco-dados-techdengue-production.up.railway.app`

**Recomendação:** usar **uma** base URL canônica por ambiente e padronizar no `.env` do BFF.

## 2. Autenticação

### 2.1 Endpoints públicos (sem API Key)

Conforme guia upstream:

- `GET /health`
- `GET /docs`
- `GET /redoc`
- `GET /facts` _(rate limit)_
- `GET /dengue` _(rate limit)_
- `GET /municipios` _(rate limit)_
- `GET /api/v1/weather/{cidade}`
- `GET /api/v1/audit/stats`

### 2.2 Endpoints protegidos (requerem API Key)

- `POST /api/v1/cache/clear`
- `GET  /api/v1/keys`
- `DELETE /api/v1/keys/{id}`
- `GET  /api/v1/audit/logs`

**Header padrão:**

- `X-API-Key: <token>`

> **Boa prática no TechDados:** guardar a API Key **somente no backend** (BFF). O frontend nunca vê o token upstream.

## 3. Endpoints principais (dados)

### 3.1 Health & Status

- `GET /health` — status básico
- `GET /api/v1/status` — status detalhado (cache, features, rate limits)

### 3.2 Dengue (epidemiologia)

- `GET /dengue?limit=100&ano=2024`

Parâmetros conhecidos (docs upstream):

- `limit` (int) — máximo de registros
- `offset` (int)
- `ano` (int) — filtra ano
- `q` (string) — busca por município

**Resposta esperada (shape sugerido):**

```json
{
  "data": [
    {
      "codmun": "3106200",
      "municipio": "Belo Horizonte",
      "ano": 2024,
      "total": 12345,
      "incidencia_100k": 456.7
    }
  ],
  "meta": { "limit": 100, "offset": 0, "count": 853 }
}
```

> **Observação:** campos exatos podem variar. O BFF deve “normalizar” o payload em um DTO estável para o frontend.

### 3.3 Municípios (dimensão)

- `GET /municipios?limit=100&q=Belo`

Uso no TechDados:

- typeahead / busca
- dimensionamento de filtros (UF, município, microrregião/macrorregião se disponível)

### 3.4 Facts (operacional / atividades)

- `GET /facts`

Os docs upstream não detalham todos os parâmetros; recomenda-se suportar no TechDados:

- `limit`, `offset`
- `format` (`json|csv|parquet`) quando aplicável
- filtros por `codigo_ibge`, `data_inicio`, `data_fim`, `contratante`, `status` (se suportado)

**O que o TechDados precisa extrair (mínimo viável)**

- total de atividades
- hectares mapeados
- quantidade de POIs (total e por categoria)
- devolutivas (quando existirem)
- produtividade (POIs/ha)

### 3.5 Weather (clima)

- `GET /api/v1/weather/{cidade}`
- `GET /api/v1/weather` — principais cidades
- `GET /api/v1/weather/{cidade}/risk` — risco por clima

Campos observados na resposta (docs upstream):

- `cidade`, `estado`
- `descricao`
- `indice_favorabilidade_dengue`
- `timestamp`

### 3.6 Risk (IA)

- `POST /api/v1/risk/analyze`
- `GET  /api/v1/risk/municipio/{codigo_ibge}`
- `GET  /api/v1/risk/dashboard`

Payload de entrada (exemplo docs upstream):

```json
{
  "municipio": "Uberlândia",
  "codigo_ibge": "3170206",
  "casos_recentes": 150,
  "casos_ano_anterior": 80,
  "temperatura_media": 28.5,
  "umidade_media": 75,
  "populacao": 700000,
  "cobertura_saneamento": 92.5,
  "acoes_recentes": ["Mutirão de limpeza", "Nebulização"]
}
```

Resposta inclui (exemplo):

- `risco` (nível)
- `recomendacoes`
- `confianca`
- `modelo_usado`
- `timestamp`

### 3.7 Gold (dataset para BI)

- `GET /gold?format=csv&limit=10000`

Uso recomendado:

- extrações programadas
- integração com Power BI/Tableau
- geração de datamarts internos

## 4. Rate limiting & cache

Tiers (conforme docs upstream):

- `free`: 60/min
- `standard`: 300/min
- `premium`: 1000/min
- `admin`: ilimitado

Cache TTLs (conforme docs upstream):

- `/api/v1/weather/{cidade}`: 30 min
- `/api/v1/risk/analyze`: 1 hora
- `/facts`, `/dengue`: 1 hora
- `/municipios`: 24 horas

## 5. Responsabilidades do TechDados (BFF)

O BFF do TechDados deve:

1. centralizar credenciais upstream (API Key)
2. aplicar **escopo territorial** (RBAC) antes de responder ao frontend
3. normalizar DTOs e versões (resiliência a mudanças upstream)
4. manter cache local (opcional) para UX e proteção de rate limit
5. registrar auditoria (quem acessou, quando, o quê, e se exportou)

## 6. Próximos anexos (quando upstream ficar mais detalhado)

- OpenAPI upstream exportado e versionado
- mapeamento de campos “facts” (operacional) com dicionário de dados
- testes de contrato (contract tests) no BFF

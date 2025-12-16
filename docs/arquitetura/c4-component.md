# C4 Model - Nível 3: Component Diagram

> Visão dos componentes internos dos principais containers.

## Frontend SPA - Components

```mermaid
C4Component
    title Component Diagram - Frontend SPA

    Container_Boundary(spa, "Frontend SPA") {
        Component(router, "Router", "React Router", "Roteamento e navegação")
        Component(authProvider, "AuthProvider", "oidc-client-ts", "Contexto de autenticação OIDC")
        Component(queryProvider, "QueryProvider", "TanStack Query", "Cache e data fetching")
        Component(pages, "Pages", "React Components", "Páginas da aplicação")
        Component(modules, "Modules", "React Components", "Módulos de features")
        Component(designSystem, "Design System", "@template/design-system", "Componentes UI reutilizáveis")
        Component(apiClient, "API Client", "Axios", "Comunicação com backend")
    }

    System_Ext(api, "API Backend", "FastAPI")
    System_Ext(keycloak, "Keycloak", "OIDC Provider")

    Rel(router, pages, "Renderiza")
    Rel(pages, modules, "Usa")
    Rel(pages, designSystem, "Usa")
    Rel(authProvider, keycloak, "Autentica", "OIDC/PKCE")
    Rel(apiClient, api, "Requisições", "REST/JSON")
    Rel(queryProvider, apiClient, "Data fetching")
```

### Estrutura de Componentes Frontend

```
apps/web/src/
├── components/              # Componentes específicos da app
│   ├── analytics/          # Dashboard de analytics
│   ├── common/             # Loading, ErrorBoundary
│   └── filters/            # FilterSelect, etc.
│
├── pages/                   # Páginas (rotas)
│   ├── HomePage.tsx
│   ├── ProfilePage.tsx
│   ├── ConfigPage.tsx      # Requer role ADMIN
│   └── ...
│
├── modules/                 # Módulos de features
│   ├── etl/                # ETL management
│   ├── users/              # User management
│   └── lgpd/               # LGPD compliance
│
├── hooks/                   # Custom hooks
│   ├── useImageOptimization.ts
│   └── ...
│
├── lib/                     # Utilitários
│   ├── cdn.ts              # CDN integration
│   └── sentry.ts           # Error tracking
│
└── config/                  # Configurações
    └── routes.ts
```

### Packages Compartilhados

```
packages/
├── shared/src/
│   ├── auth/
│   │   ├── AuthContext.tsx      # Provider principal
│   │   ├── oidcConfig.ts        # Configuração OIDC
│   │   ├── types.ts             # UserRole, AuthUser
│   │   └── index.ts             # Exports
│   │
│   ├── api/
│   │   ├── client.ts            # Axios instance configurado
│   │   └── interceptors.ts      # Auth interceptor
│   │
│   ├── cache/
│   │   └── queryClient.ts       # React Query config
│   │
│   └── utils/
│       ├── logger.ts            # Structured logging
│       ├── formatters.ts        # Date, currency, etc.
│       └── helpers.ts           # Utilidades gerais
│
├── design-system/src/
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Card/
│   │   ├── Table/
│   │   └── ...
│   │
│   ├── tokens/
│   │   └── colors.ts, spacing.ts, typography.ts
│   │
│   └── styles/
│       └── base.css
│
└── types/src/
    ├── api.ts                   # API response types
    ├── auth.ts                  # Auth types
    └── common.ts                # Generic types
```

---

## API Backend - Components

```mermaid
C4Component
    title Component Diagram - API Backend

    Container_Boundary(api, "API Backend") {
        Component(routes, "Routes", "FastAPI Routers", "Endpoints REST")
        Component(middleware, "Middleware", "Starlette", "Request/Response processing")
        Component(auth, "Auth", "python-jose", "JWT validation")
        Component(rateLimit, "Rate Limiter", "slowapi", "Request throttling")
        Component(models, "Models", "SQLAlchemy", "ORM models")
        Component(schemas, "Schemas", "Pydantic", "Request/Response validation")
        Component(services, "Services", "Python", "Business logic")
    }

    ContainerDb(db, "PostgreSQL", "Database")
    ContainerDb(redis, "Redis", "Cache")
    System_Ext(keycloak, "Keycloak", "JWKS")

    Rel(routes, middleware, "Processa")
    Rel(middleware, auth, "Valida token")
    Rel(middleware, rateLimit, "Throttle")
    Rel(auth, keycloak, "Busca JWKS")
    Rel(routes, services, "Chama")
    Rel(services, models, "Usa")
    Rel(models, db, "Persiste")
    Rel(rateLimit, redis, "Contadores")
```

### Estrutura de Componentes Backend

```
api-template/app/
├── main.py                  # 🎯 Entry point, app config
├── middleware.py            # RequestLogging, SecurityHeaders
├── logging_config.py        # Structlog configuration
│
├── # === Segurança ===
├── rate_limit.py            # Rate limiting (slowapi)
├── csrf.py                  # CSRF protection
├── security.py              # CSP headers, security config
├── audit.py                 # Audit logging
│
├── # === Multi-tenancy ===
├── tenant.py                # Tenant context, middleware
├── rls.py                   # Row-Level Security
├── session.py               # Redis session store
│
├── # === Features ===
├── analytics.py             # Event tracking
├── websocket.py             # WebSocket support
│
└── # === Database ===
    # [TODO: confirmar] models/ e schemas/ não encontrados
    # Estrutura esperada:
    # ├── models/            # SQLAlchemy models
    # ├── schemas/           # Pydantic schemas
    # └── services/          # Business logic

alembic/
├── env.py                   # Migration environment
├── versions/                # Migration files
└── script.py.mako           # Migration template
```

---

## Fluxo de Request (API)

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Middleware Stack
    participant RL as Rate Limiter
    participant A as Auth
    participant R as Route Handler
    participant S as Service
    participant DB as Database

    C->>M: HTTP Request
    M->>M: Add X-Request-ID
    M->>M: Log request start
    M->>RL: Check rate limit

    alt Rate limit exceeded
        RL-->>C: 429 Too Many Requests
    end

    M->>A: Validate JWT

    alt Invalid token
        A-->>C: 401 Unauthorized
    end

    A->>A: Extract roles
    M->>R: Forward request
    R->>R: Check required roles

    alt Insufficient permissions
        R-->>C: 403 Forbidden
    end

    R->>S: Business logic
    S->>DB: Query/Persist
    DB-->>S: Result
    S-->>R: Response data
    R-->>M: Response
    M->>M: Add security headers
    M->>M: Log request end
    M-->>C: HTTP Response
```

---

## Decisões de Design

### Frontend

| Decisão                  | Razão                                |
| ------------------------ | ------------------------------------ |
| Context API para Auth    | Simples, suficiente para auth global |
| TanStack Query para data | Cache automático, refetch, mutations |
| Workspace packages       | Reutilização, versionamento único    |
| Tailwind + Design Tokens | Consistência, customização fácil     |

### Backend

| Decisão        | Razão                              |
| -------------- | ---------------------------------- |
| FastAPI        | Async, tipagem, OpenAPI automático |
| Pydantic v2    | Validação rápida, coerção de tipos |
| SQLAlchemy 2.0 | Async support, type hints          |
| Structlog      | Logs estruturados, JSON em prod    |

---

**Referências:**

- [C4 Model](https://c4model.com/)
- [Mermaid C4](https://mermaid.js.org/syntax/c4.html)

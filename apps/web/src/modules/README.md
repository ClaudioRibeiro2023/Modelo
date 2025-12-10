# Modules

Esta pasta contém **módulos de funcionalidades** da aplicação, seguindo uma arquitetura baseada em features.

## Estrutura Padrão de um Módulo

Cada módulo deve seguir esta estrutura:

```
modules/
└── [nome-modulo]/
    ├── components/      # Componentes específicos do módulo
    │   ├── NomeComponente.tsx
    │   └── index.ts
    ├── hooks/           # Hooks específicos do módulo
    │   ├── useNomeHook.ts
    │   └── index.ts
    ├── services/        # Chamadas de API do módulo
    │   ├── nome.service.ts
    │   └── index.ts
    ├── types.ts         # Tipos TypeScript do módulo
    ├── routes.tsx       # Rotas do módulo (opcional)
    └── index.ts         # Barrel export principal
```

## Exemplo: Módulo de Produtos

```
modules/
└── produtos/
    ├── components/
    │   ├── ProdutoCard.tsx
    │   ├── ProdutoForm.tsx
    │   ├── ProdutosList.tsx
    │   └── index.ts
    ├── hooks/
    │   ├── useProdutos.ts
    │   └── index.ts
    ├── services/
    │   ├── produtos.service.ts
    │   └── index.ts
    ├── types.ts
    ├── routes.tsx
    └── index.ts
```

## Arquivo index.ts (Barrel Export)

```typescript
// modules/produtos/index.ts
export * from './components'
export * from './hooks'
export * from './types'
export { ProdutosRoutes } from './routes'
```

## Arquivo routes.tsx

```typescript
// modules/produtos/routes.tsx
import { Routes, Route } from 'react-router-dom'
import { ProdutosList, ProdutoForm } from './components'

export function ProdutosRoutes() {
  return (
    <Routes>
      <Route index element={<ProdutosList />} />
      <Route path="novo" element={<ProdutoForm />} />
      <Route path=":id" element={<ProdutoForm />} />
    </Routes>
  )
}
```

## Registrando o Módulo no App.tsx

```typescript
// App.tsx
import { ProdutosRoutes } from '@/modules/produtos'

// Dentro das rotas protegidas:
<Route path="/produtos/*" element={<ProdutosRoutes />} />
```

## Adicionando ao Menu (AppSidebar.tsx)

```typescript
const navItems = [
  // ... outros itens
  { 
    label: 'Produtos', 
    path: '/produtos', 
    icon: <Package size={20} />, 
    group: 'Módulos' 
  },
]
```

## Boas Práticas

1. **Isolamento**: Cada módulo deve ser o mais independente possível
2. **Tipos locais**: Defina tipos específicos do módulo em `types.ts`
3. **Serviços dedicados**: Agrupe chamadas de API relacionadas
4. **Hooks reutilizáveis**: Extraia lógica complexa para hooks
5. **Barrel exports**: Use `index.ts` para facilitar imports

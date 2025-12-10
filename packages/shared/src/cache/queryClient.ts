/**
 * React Query Client Configuration
 * 
 * Centraliza configuração de cache e retry para toda a aplicação.
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Configurações padrão de cache
 */
export const CACHE_CONFIG = {
  /** Tempo que dados são considerados "frescos" (não refetch) */
  staleTime: 5 * 60 * 1000, // 5 minutos
  
  /** Tempo que dados ficam em cache após componente desmontar */
  gcTime: 30 * 60 * 1000, // 30 minutos (antigo cacheTime)
  
  /** Número de tentativas em caso de erro */
  retry: 3,
  
  /** Delay entre tentativas (exponencial) */
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  
  /** Refetch quando janela ganha foco */
  refetchOnWindowFocus: true,
  
  /** Refetch quando reconecta à internet */
  refetchOnReconnect: true,
} as const

/**
 * Cache times predefinidos por tipo de dado
 */
export const CACHE_TIMES = {
  /** Dados que mudam raramente (configurações, permissões) */
  static: {
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
  },
  
  /** Dados que mudam com frequência moderada (listas, dashboards) */
  standard: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  },
  
  /** Dados que mudam frequentemente (notificações, status) */
  dynamic: {
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  },
  
  /** Dados em tempo real (deve usar WebSocket, mas fallback para polling) */
  realtime: {
    staleTime: 0, // Sempre refetch
    gcTime: 60 * 1000, // 1 minuto
  },
} as const

/**
 * Query Keys padronizados
 */
export const queryKeys = {
  // Autenticação
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    permissions: () => [...queryKeys.auth.all, 'permissions'] as const,
  },
  
  // Usuários
  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.users.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
  
  // Configurações
  config: {
    all: ['config'] as const,
    app: () => [...queryKeys.config.all, 'app'] as const,
    feature: (name: string) => [...queryKeys.config.all, 'feature', name] as const,
  },
  
  // Health
  health: {
    all: ['health'] as const,
    api: () => [...queryKeys.health.all, 'api'] as const,
  },
} as const

/**
 * Cria QueryClient com configurações otimizadas
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_CONFIG.staleTime,
        gcTime: CACHE_CONFIG.gcTime,
        retry: CACHE_CONFIG.retry,
        retryDelay: CACHE_CONFIG.retryDelay,
        refetchOnWindowFocus: CACHE_CONFIG.refetchOnWindowFocus,
        refetchOnReconnect: CACHE_CONFIG.refetchOnReconnect,
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  })
}

/**
 * QueryClient singleton para uso global
 */
export const queryClient = createQueryClient()

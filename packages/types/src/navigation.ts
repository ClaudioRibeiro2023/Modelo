// ============================================================================
// Navigation Types
// ============================================================================

import type { UserRole } from './auth'

/**
 * Categories for organizing navigation functions
 */
export type NavCategory = 'ANALISE' | 'MAPEAMENTO' | 'INDICADORES' | 'CONTROLE' | 'OPERACIONAL'

/**
 * Individual function/feature within a module
 */
export interface FunctionItem {
  id: string
  name: string
  path: string
  category?: NavCategory
  icon?: string
  subtitle?: string
  roles?: UserRole[]
}

/**
 * Application module definition
 */
export interface AppModule {
  id: string
  name: string
  description?: string
  path: string
  topNav?: boolean
  icon?: string
  badge?: string
  group?: string
  functions?: FunctionItem[]
  roles?: UserRole[]
}

/**
 * Complete navigation map structure
 */
export interface NavigationMap {
  modules: AppModule[]
}

/**
 * useBff - Hooks para comunicação com o BFF TechDados
 *
 * Padrão: cada hook retorna { data, isLoading, error, refetch }
 */

import { useState, useEffect, useCallback } from 'react'
import { bffFetch } from '@/lib/api/bffClient'

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

export interface BffHookResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export interface EpiRankingItem {
  codigo_ibge: string
  municipio: string
  uf: string
  casos: number
  incidencia_100k: number
  variacao_pct?: number
}

export interface EpiRankingResponse {
  data: EpiRankingItem[]
  meta: {
    total: number
    limit: number
    offset: number
    period_type?: string
    year?: number
  }
}

export interface OpsCoverageItem {
  codigo_ibge: string
  municipio: string
  uf: string
  ha_mapeados: number
  ha_urbanos: number
  cobertura_pct: number
  pois_total: number
  devolutivas: number
}

export interface OpsCoverageResponse {
  data: OpsCoverageItem[]
  meta: {
    total: number
    limit: number
    offset: number
  }
}

export interface RiskSummary {
  alto: number
  medio: number
  baixo: number
  total_municipios: number
}

export interface RiskMunicipio {
  codigo_ibge: string
  municipio: string
  risk_score: number
  risk_level: 'alto' | 'medio' | 'baixo'
  drivers: string[]
}

export interface RiskDashboardResponse {
  summary: RiskSummary
  top_risco: RiskMunicipio[]
  updated_at: string
}

// ═══════════════════════════════════════════════════════════════
// HOOK GENÉRICO
// ═══════════════════════════════════════════════════════════════

function useBffQuery<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): BffHookResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const buildUrl = useCallback(() => {
    if (!params) return path
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })
    const qs = searchParams.toString()
    return qs ? `${path}?${qs}` : path
  }, [path, params])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const url = buildUrl()
      const result = await bffFetch(url)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [buildUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}

// ═══════════════════════════════════════════════════════════════
// HOOKS ESPECÍFICOS
// ═══════════════════════════════════════════════════════════════

export interface UseEpiRankingParams {
  scope_type?: string
  scope_id?: string
  period_type?: string
  year?: number
  limit?: number
}

export function useEpiRanking(params: UseEpiRankingParams = {}) {
  const { scope_type = 'STATE', scope_id = 'MG', period_type = 'SE', year, limit = 20 } = params
  return useBffQuery<EpiRankingResponse>('/api/epi/ranking', {
    scope_type,
    scope_id,
    period_type,
    year,
    limit,
  })
}

export interface UseOpsCoverageParams {
  scope_type?: string
  scope_id?: string
  periodo?: string
  limit?: number
}

export function useOpsCoverage(params: UseOpsCoverageParams = {}) {
  const { scope_type = 'STATE', scope_id = 'MG', periodo = 'month', limit = 20 } = params
  return useBffQuery<OpsCoverageResponse>('/api/operacao/cobertura', {
    scope_type,
    scope_id,
    periodo,
    limit,
  })
}

export interface UseRiskDashboardParams {
  scope_type?: string
  scope_id?: string
}

export function useRiskDashboard(params: UseRiskDashboardParams = {}) {
  const { scope_type = 'STATE', scope_id = 'MG' } = params
  return useBffQuery<RiskDashboardResponse>('/api/risk/dashboard', {
    scope_type,
    scope_id,
  })
}

// ═══════════════════════════════════════════════════════════════
// HOOK DE HEALTH
// ═══════════════════════════════════════════════════════════════

export interface HealthResponse {
  status: string
  version: string
  timestamp: string
}

export function useBffHealth() {
  return useBffQuery<HealthResponse>('/health')
}

// ═══════════════════════════════════════════════════════════════
// HOOK DE ME (USUÁRIO)
// ═══════════════════════════════════════════════════════════════

export interface MeResponse {
  user_id: string
  roles: string[]
  scopes: string[]
  scope: {
    type: string
    id: string
    name?: string
  }
  auth_mode: string
}

export function useMe() {
  return useBffQuery<MeResponse>('/api/v1/me')
}

// ═══════════════════════════════════════════════════════════════
// HOOK DE NAV (MENU DINÂMICO)
// ═══════════════════════════════════════════════════════════════

export interface NavItem {
  id: string
  label: string
  path: string
  allowedRoles?: string[]
}

export interface NavResponse {
  user: {
    id: string
    roles: string[]
    scopes: string[]
  }
  nav: NavItem[]
}

export function useNav() {
  return useBffQuery<NavResponse>('/api/v1/nav')
}

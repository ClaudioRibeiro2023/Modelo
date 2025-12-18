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
// MOCK DATA (fallback quando BFF não disponível)
// ═══════════════════════════════════════════════════════════════

const MOCK_DATA: Record<string, unknown> = {
  '/api/epi/ranking': {
    data: [
      {
        codigo_ibge: '3106200',
        municipio: 'Belo Horizonte',
        uf: 'MG',
        casos: 1250,
        incidencia_100k: 48.2,
        variacao_pct: 12.5,
      },
      {
        codigo_ibge: '3118601',
        municipio: 'Contagem',
        uf: 'MG',
        casos: 890,
        incidencia_100k: 42.1,
        variacao_pct: -5.3,
      },
      {
        codigo_ibge: '3170206',
        municipio: 'Uberlândia',
        uf: 'MG',
        casos: 720,
        incidencia_100k: 38.9,
        variacao_pct: 8.2,
      },
      {
        codigo_ibge: '3136702',
        municipio: 'Juiz de Fora',
        uf: 'MG',
        casos: 580,
        incidencia_100k: 35.4,
        variacao_pct: -2.1,
      },
      {
        codigo_ibge: '3106705',
        municipio: 'Betim',
        uf: 'MG',
        casos: 450,
        incidencia_100k: 32.8,
        variacao_pct: 15.7,
      },
    ],
    meta: { total: 5, limit: 20, offset: 0, period_type: 'SE', year: 2024 },
  },
  '/api/operacao/cobertura': {
    data: [
      {
        codigo_ibge: '3106200',
        municipio: 'Belo Horizonte',
        uf: 'MG',
        ha_mapeados: 12500,
        ha_urbanos: 15000,
        cobertura_pct: 83.3,
        pois_total: 4200,
        devolutivas: 3800,
      },
      {
        codigo_ibge: '3118601',
        municipio: 'Contagem',
        uf: 'MG',
        ha_mapeados: 8200,
        ha_urbanos: 10000,
        cobertura_pct: 82.0,
        pois_total: 2800,
        devolutivas: 2500,
      },
      {
        codigo_ibge: '3170206',
        municipio: 'Uberlândia',
        uf: 'MG',
        ha_mapeados: 7500,
        ha_urbanos: 11000,
        cobertura_pct: 68.2,
        pois_total: 3100,
        devolutivas: 2200,
      },
      {
        codigo_ibge: '3136702',
        municipio: 'Juiz de Fora',
        uf: 'MG',
        ha_mapeados: 5800,
        ha_urbanos: 8500,
        cobertura_pct: 68.2,
        pois_total: 2400,
        devolutivas: 1900,
      },
      {
        codigo_ibge: '3106705',
        municipio: 'Betim',
        uf: 'MG',
        ha_mapeados: 4200,
        ha_urbanos: 9000,
        cobertura_pct: 46.7,
        pois_total: 1800,
        devolutivas: 1200,
      },
    ],
    meta: { total: 5, limit: 20, offset: 0 },
  },
  '/api/risk/dashboard': {
    summary: { alto: 12, medio: 45, baixo: 156, total_municipios: 213 },
    top_risco: [
      {
        codigo_ibge: '3106200',
        municipio: 'Belo Horizonte',
        risk_score: 0.87,
        risk_level: 'alto',
        drivers: ['clima', 'densidade'],
      },
      {
        codigo_ibge: '3118601',
        municipio: 'Contagem',
        risk_score: 0.82,
        risk_level: 'alto',
        drivers: ['cobertura', 'historico'],
      },
      {
        codigo_ibge: '3170206',
        municipio: 'Uberlândia',
        risk_score: 0.71,
        risk_level: 'medio',
        drivers: ['clima'],
      },
      {
        codigo_ibge: '3136702',
        municipio: 'Juiz de Fora',
        risk_score: 0.65,
        risk_level: 'medio',
        drivers: ['densidade'],
      },
      {
        codigo_ibge: '3106705',
        municipio: 'Betim',
        risk_score: 0.58,
        risk_level: 'medio',
        drivers: ['historico'],
      },
    ],
    updated_at: new Date().toISOString(),
  },
}

function getMockData<T>(path: string): T | null {
  const basePath = path.split('?')[0]
  return (MOCK_DATA[basePath] as T) || null
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
      // Fallback to mock data if BFF returns error
      const mockData = getMockData<T>(path)
      if (mockData) {
        console.warn(`[useBff] Using mock data for ${path}`)
        setData(mockData)
      } else {
        setError(err instanceof Error ? err : new Error(String(err)))
      }
    } finally {
      setIsLoading(false)
    }
  }, [buildUrl, path])

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

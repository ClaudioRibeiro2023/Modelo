import { useState } from 'react'
import { AlertTriangle, TrendingUp, MapPin, RefreshCw, AlertCircle } from 'lucide-react'
import { useRiskDashboard } from '@/hooks/useBff'
import { TerritoryFilter, type TerritoryScope } from '@/components/filters/TerritoryFilter'
import { SimpleBarChart } from '@/components/charts/SimpleBarChart'

export default function RiskPage() {
  const [scope, setScope] = useState<TerritoryScope>({
    type: 'STATE',
    id: 'MG',
    name: 'Minas Gerais',
  })
  const { data, isLoading, error, refetch } = useRiskDashboard({
    scope_type: scope.type,
    scope_id: scope.id,
  })

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-brand-primary" />
            Risco
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Dashboard de risco e priorização</p>
        </div>
        <div className="flex items-center gap-2">
          <TerritoryFilter value={scope} onChange={setScope} />
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 dark:text-red-300 text-sm">
            Erro ao carregar dados: {error.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Risco Alto</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {isLoading ? '...' : (data?.summary?.alto ?? 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">municípios</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Risco Médio</h3>
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {isLoading ? '...' : (data?.summary?.medio ?? 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">municípios</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Risco Baixo</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {isLoading ? '...' : (data?.summary?.baixo ?? 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">municípios</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Municípios em Risco
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : data?.top_risco?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    #
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Município
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Score
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Nível
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Drivers
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.top_risco.map((item, idx) => (
                  <tr
                    key={item.codigo_ibge}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                      {item.municipio}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-900 dark:text-white">
                      {(item.risk_score * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.risk_level === 'alto'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : item.risk_level === 'medio'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                      >
                        {item.risk_level.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-sm">
                      {item.drivers?.join(', ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Nenhum dado disponível. Verifique a conexão com o BFF.
          </p>
        )}

        {data?.updated_at && (
          <p className="text-xs text-gray-400 mt-4 text-right">
            Atualizado em: {new Date(data.updated_at).toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {data?.top_risco?.length ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Score de Risco (Top 5)
          </h2>
          <SimpleBarChart
            data={data.top_risco.slice(0, 5).map(item => ({
              label: item.municipio.substring(0, 10),
              value: item.risk_score * 100,
              color:
                item.risk_level === 'alto'
                  ? 'bg-red-500'
                  : item.risk_level === 'medio'
                    ? 'bg-amber-500'
                    : 'bg-green-500',
            }))}
            maxValue={100}
            height={180}
          />
        </div>
      ) : null}
    </div>
  )
}

export { RiskPage }

import { Activity, TrendingUp, BarChart2, RefreshCw, AlertCircle } from 'lucide-react'
import { useEpiRanking } from '@/hooks/useBff'

export default function EpiPage() {
  const { data, isLoading, error, refetch } = useEpiRanking({ limit: 10 })

  const totalCasos = data?.data?.reduce((acc, item) => acc + item.casos, 0) ?? 0
  const avgIncidencia = data?.data?.length
    ? data.data.reduce((acc, item) => acc + item.incidencia_100k, 0) / data.data.length
    : 0

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-primary" />
            Epidemiologia
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Incidência, rankings, séries temporais e comparativos
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Atualizar dados"
        >
          <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
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
              <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Incidência Média</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? '...' : avgIncidencia.toFixed(1)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">casos/100k hab</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <BarChart2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Total Casos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? '...' : totalCasos.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">no período selecionado</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Municípios</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? '...' : (data?.meta?.total ?? data?.data?.length ?? 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">com dados disponíveis</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ranking de Municípios (Top 10)
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : data?.data?.length ? (
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
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    UF
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Casos
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Incidência
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item, idx) => (
                  <tr
                    key={item.codigo_ibge}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                      {item.municipio}
                    </td>
                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400">{item.uf}</td>
                    <td className="py-3 px-2 text-right text-gray-900 dark:text-white">
                      {item.casos.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`font-medium ${item.incidencia_100k > 100 ? 'text-red-600' : item.incidencia_100k > 50 ? 'text-amber-600' : 'text-green-600'}`}
                      >
                        {item.incidencia_100k.toFixed(1)}
                      </span>
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
      </div>
    </div>
  )
}

export { EpiPage }

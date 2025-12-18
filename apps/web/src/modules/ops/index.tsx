import { Clipboard, MapPin, Users, RefreshCw, AlertCircle } from 'lucide-react'
import { useOpsCoverage } from '@/hooks/useBff'

export default function OpsPage() {
  const { data, isLoading, error, refetch } = useOpsCoverage({ limit: 10 })

  const totalPois = data?.data?.reduce((acc, item) => acc + item.pois_total, 0) ?? 0
  const avgCobertura = data?.data?.length
    ? data.data.reduce((acc, item) => acc + item.cobertura_pct, 0) / data.data.length
    : 0
  const avgProdutividade = data?.data?.length
    ? data.data.reduce(
        (acc, item) => acc + (item.ha_mapeados > 0 ? item.pois_total / item.ha_mapeados : 0),
        0
      ) / data.data.length
    : 0

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clipboard className="w-6 h-6 text-brand-primary" />
            Operação
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Cobertura, POIs, produtividade e devolutivas
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
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Cobertura Média</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? '...' : `${avgCobertura.toFixed(1)}%`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">área urbana</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Total POIs</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? '...' : totalPois.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">pontos identificados</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Produtividade</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? '...' : avgProdutividade.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">POIs/HA</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cobertura por Município (Top 10)
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
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    HA Map.
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    POIs
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Cobertura
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
                    <td className="py-3 px-2 text-right text-gray-900 dark:text-white">
                      {item.ha_mapeados.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-900 dark:text-white">
                      {item.pois_total.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`font-medium ${item.cobertura_pct >= 80 ? 'text-green-600' : item.cobertura_pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}
                      >
                        {item.cobertura_pct.toFixed(1)}%
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

export { OpsPage }

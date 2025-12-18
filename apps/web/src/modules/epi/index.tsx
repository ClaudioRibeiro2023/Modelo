import { Activity, TrendingUp, BarChart2 } from 'lucide-react'

export default function EpiPage() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-brand-primary" />
          Epidemiologia
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Incidência, rankings, séries temporais e comparativos
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Incidência</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">casos/100k hab</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <BarChart2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Total Casos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">no período selecionado</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Variação</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">vs semana anterior</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ranking de Municípios
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Conecte ao BFF para visualizar dados reais
        </p>
      </div>
    </div>
  )
}

export { EpiPage }

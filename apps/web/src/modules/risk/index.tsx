import { AlertTriangle, TrendingUp, MapPin } from 'lucide-react'

export default function RiskPage() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-brand-primary" />
          Risco
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Dashboard de risco e priorização</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Risco Alto</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">municípios</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Risco Médio</h3>
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">municípios</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Risco Baixo</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">municípios</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Municípios em Risco
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Conecte ao BFF para visualizar dados reais
        </p>
      </div>
    </div>
  )
}

export { RiskPage }

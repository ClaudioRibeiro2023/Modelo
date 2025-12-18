import { Clipboard, MapPin, Users } from 'lucide-react'

export default function OpsPage() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clipboard className="w-6 h-6 text-brand-primary" />
          Operação
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Cobertura, POIs, produtividade e devolutivas
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Cobertura</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">% área urbana</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">POIs</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">pontos identificados</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Produtividade</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">POIs/HA</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cobertura por Município
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Conecte ao BFF para visualizar dados reais
        </p>
      </div>
    </div>
  )
}

export { OpsPage }

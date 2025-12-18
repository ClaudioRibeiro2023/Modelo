import { Shield, User, Download } from 'lucide-react'

export default function AuditPage() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-primary" />
          Auditoria
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Logs de acesso e exportações</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Acessos Hoje</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">usuários únicos</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Exports Hoje</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">--</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">exportações realizadas</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Logs Recentes</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Conecte ao BFF para visualizar logs de auditoria
        </p>
      </div>
    </div>
  )
}

export { AuditPage }

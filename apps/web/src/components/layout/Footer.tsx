import { Database, Settings, Activity, FileText, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const APP_NAME = 'Template'
const APP_VERSION = '0.1.0'
const APP_YEAR = new Date().getFullYear()

interface FooterProps {
  showTechnicalServices?: boolean
}

export function Footer({ showTechnicalServices = true }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 mt-auto">
      {showTechnicalServices && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Serviços Técnicos
          </h3>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/etl"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              title="ETL & Dados"
            >
              <Database className="w-5 h-5" />
            </Link>
            <Link
              to="/admin/config"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <Link
              to="/admin/observability"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              title="Observabilidade"
            >
              <Activity className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      <div className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{APP_NAME}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              v{APP_VERSION} · © {APP_YEAR}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Todos os direitos reservados
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Link
              to="/docs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Documentação
            </Link>
            <Link
              to="/lgpd"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              LGPD
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

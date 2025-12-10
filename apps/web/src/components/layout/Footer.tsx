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
    <footer className="border-t border-border-default bg-surface-base mt-auto">
      {showTechnicalServices && (
        <div className="px-6 py-4 border-b border-border-default">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Serviços Técnicos
          </h3>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/etl"
              className="p-2 rounded-lg hover:bg-surface-muted text-text-secondary transition-colors"
              title="ETL & Dados"
            >
              <Database className="w-5 h-5" />
            </Link>
            <Link
              to="/admin/config"
              className="p-2 rounded-lg hover:bg-surface-muted text-text-secondary transition-colors"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <Link
              to="/admin/observability"
              className="p-2 rounded-lg hover:bg-surface-muted text-text-secondary transition-colors"
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
            <h4 className="font-semibold text-text-primary">{APP_NAME}</h4>
            <p className="text-xs text-text-muted">
              v{APP_VERSION} · © {APP_YEAR}
            </p>
            <p className="text-xs text-text-muted">
              Todos os direitos reservados
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Link
              to="/docs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface-muted rounded-md hover:bg-surface-elevated transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Documentação
            </Link>
            <Link
              to="/lgpd"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface-muted rounded-md hover:bg-surface-elevated transition-colors"
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

import { Database, FileSpreadsheet, FileJson, Map, Plug, MoreVertical, Settings, Trash2, Play } from 'lucide-react'
import type { DataSource, DataSourceType } from '../types'

interface DataSourceCardProps {
  source: DataSource
  onRun?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const TYPE_ICONS: Record<DataSourceType, typeof Database> = {
  csv: FileSpreadsheet,
  json: FileJson,
  shapefile: Map,
  api: Plug,
  database: Database,
}

const TYPE_LABELS: Record<DataSourceType, string> = {
  csv: 'CSV / Planilha',
  json: 'JSON / API',
  shapefile: 'Shapefile',
  api: 'Conector API',
  database: 'Banco de Dados',
}

export default function DataSourceCard({ source, onRun, onEdit, onDelete }: DataSourceCardProps) {
  const Icon = TYPE_ICONS[source.type]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{source.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{TYPE_LABELS[source.type]}</p>
          {source.description && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
              {source.description}
            </p>
          )}
        </div>
        <div className="relative group">
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Mais opções"
            aria-label="Mais opções"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[140px]">
            {onRun && (
              <button
                type="button"
                onClick={onRun}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <Play size={14} /> Executar
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <Settings size={14} /> Configurar
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-left text-red-600"
              >
                <Trash2 size={14} /> Excluir
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
        <span>Atualizado: {new Date(source.updatedAt).toLocaleDateString('pt-BR')}</span>
      </div>
    </div>
  )
}

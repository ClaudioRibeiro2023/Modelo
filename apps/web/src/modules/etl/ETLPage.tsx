import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Database, Upload, Plus, RefreshCw } from 'lucide-react'
import { ImportCard, ETLFilters, JobProgress, DataSourceCard } from './components'
import type { ETLFilter, DataSource, ImportJob, DataSourceType } from './types'

// Mock data - replace with API calls
const MOCK_SOURCES: DataSource[] = [
  { id: '1', name: 'Planilha Vendas Q1', type: 'csv', description: 'Dados de vendas do primeiro trimestre', config: {}, createdAt: '2024-01-15', updatedAt: '2024-03-01' },
  { id: '2', name: 'API CRM', type: 'api', description: 'Integração com sistema CRM', config: {}, createdAt: '2024-02-01', updatedAt: '2024-03-10' },
  { id: '3', name: 'Dados Geográficos', type: 'shapefile', description: 'Shapefiles de municípios', config: {}, createdAt: '2024-01-20', updatedAt: '2024-02-15' },
  { id: '4', name: 'Eventos JSON', type: 'json', description: 'Log de eventos do sistema', config: {}, createdAt: '2024-03-01', updatedAt: '2024-03-12' },
]

const MOCK_JOBS: ImportJob[] = [
  { id: '1', sourceId: '1', sourceName: 'Planilha Vendas Q1', type: 'csv', status: 'completed', progress: 100, recordsTotal: 5000, recordsProcessed: 5000, recordsSuccess: 4985, recordsError: 15, startedAt: '2024-03-12T10:00:00', completedAt: '2024-03-12T10:05:30', logs: [] },
  { id: '2', sourceId: '2', sourceName: 'API CRM', type: 'api', status: 'running', progress: 65, recordsTotal: 10000, recordsProcessed: 6500, startedAt: '2024-03-12T14:00:00', logs: [] },
  { id: '3', sourceId: '4', sourceName: 'Eventos JSON', type: 'json', status: 'failed', progress: 30, recordsTotal: 2000, recordsProcessed: 600, errorMessage: 'Formato inválido na linha 601', startedAt: '2024-03-12T09:00:00', completedAt: '2024-03-12T09:02:15', logs: [] },
]

const IMPORT_OPTIONS: Array<{ type: DataSourceType; title: string; subtitle: string }> = [
  { type: 'csv', title: 'Importar CSV', subtitle: 'Arquivos CSV e planilhas' },
  { type: 'json', title: 'Importar JSON', subtitle: 'Arquivos JSON e APIs' },
  { type: 'shapefile', title: 'Importar Shapefile', subtitle: 'Dados geoespaciais' },
  { type: 'api', title: 'Conectores API', subtitle: 'Integrações externas' },
]

export default function ETLPage() {
  const [searchParams] = useSearchParams()
  const srcFilter = searchParams.get('src') as DataSourceType | null
  
  const [filters, setFilters] = useState<ETLFilter>({
    search: '',
    type: srcFilter || 'all',
    status: 'all',
  })

  const [activeTab, setActiveTab] = useState<'sources' | 'jobs'>('sources')

  const filteredSources = useMemo(() => {
    return MOCK_SOURCES.filter(source => {
      if (filters.type && filters.type !== 'all' && source.type !== filters.type) return false
      if (filters.search && !source.name.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [filters])

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      if (filters.type && filters.type !== 'all' && job.type !== filters.type) return false
      if (filters.status && filters.status !== 'all' && job.status !== filters.status) return false
      if (filters.search && !job.sourceName.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [filters])

  const runningJobs = MOCK_JOBS.filter(j => j.status === 'running')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Database size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ETL & Integração</h1>
                <p className="text-gray-500 dark:text-gray-400">Importação, tratamento e catálogo de dados</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw size={18} />
                Atualizar
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                Nova Fonte
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Import Options */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Importação Rápida</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {IMPORT_OPTIONS.map(opt => (
              <ImportCard
                key={opt.type}
                title={opt.title}
                subtitle={opt.subtitle}
                type={opt.type}
                onClick={() => setFilters({ ...filters, type: opt.type })}
              />
            ))}
          </div>
        </div>

        {/* Running Jobs */}
        {runningJobs.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Em Execução ({runningJobs.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {runningJobs.map(job => (
                <JobProgress key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'sources'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Fontes de Dados ({MOCK_SOURCES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Histórico de Jobs ({MOCK_JOBS.length})
          </button>
        </div>

        {/* Filters */}
        <ETLFilters
          filters={filters}
          onChange={setFilters}
          showStatus={activeTab === 'jobs'}
        />

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'sources' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSources.map(source => (
                <DataSourceCard
                  key={source.id}
                  source={source}
                  onRun={() => { /* TODO: implementar run */ }}
                  onEdit={() => { /* TODO: implementar edit */ }}
                  onDelete={() => { /* TODO: implementar delete */ }}
                />
              ))}
              {filteredSources.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Upload size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Nenhuma fonte de dados encontrada</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <JobProgress key={job.id} job={job} />
              ))}
              {filteredJobs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Database size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Nenhum job encontrado</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

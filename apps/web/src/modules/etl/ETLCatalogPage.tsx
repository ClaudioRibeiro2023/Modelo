import { useState, useMemo } from 'react'
import { BookMarked, Search, Table, Eye, FileJson, Plug, Database, Tag, User, Calendar } from 'lucide-react'
import type { DataCatalogItem } from './types'

// Mock data
const MOCK_CATALOG: DataCatalogItem[] = [
  {
    id: '1',
    name: 'vendas',
    description: 'Tabela de vendas com transações diárias',
    type: 'table',
    schema: [
      { name: 'id', type: 'integer', nullable: false, description: 'Identificador único' },
      { name: 'data', type: 'date', nullable: false, description: 'Data da venda' },
      { name: 'valor', type: 'decimal', nullable: false, description: 'Valor total' },
      { name: 'cliente_id', type: 'integer', nullable: true, description: 'FK para clientes' },
    ],
    tags: ['vendas', 'financeiro', 'diário'],
    owner: 'equipe-dados',
    lastUpdated: '2024-03-12T10:00:00',
    recordCount: 150000,
    size: '25 MB',
  },
  {
    id: '2',
    name: 'clientes',
    description: 'Cadastro de clientes ativos e inativos',
    type: 'table',
    schema: [
      { name: 'id', type: 'integer', nullable: false },
      { name: 'nome', type: 'varchar(255)', nullable: false },
      { name: 'email', type: 'varchar(255)', nullable: true },
      { name: 'ativo', type: 'boolean', nullable: false },
    ],
    tags: ['clientes', 'cadastro'],
    owner: 'equipe-crm',
    lastUpdated: '2024-03-11T14:30:00',
    recordCount: 45000,
    size: '8 MB',
  },
  {
    id: '3',
    name: 'api_eventos',
    description: 'Endpoint de eventos do sistema',
    type: 'api',
    schema: [
      { name: 'event_id', type: 'string', nullable: false },
      { name: 'type', type: 'string', nullable: false },
      { name: 'payload', type: 'json', nullable: true },
      { name: 'timestamp', type: 'datetime', nullable: false },
    ],
    tags: ['eventos', 'api', 'logs'],
    owner: 'equipe-eng',
    lastUpdated: '2024-03-12T12:00:00',
  },
]

const TYPE_ICONS = {
  table: Table,
  view: Eye,
  file: FileJson,
  api: Plug,
}

export default function ETLCatalogPage() {
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<DataCatalogItem | null>(null)

  const filteredItems = useMemo(() => {
    if (!search) return MOCK_CATALOG
    const q = search.toLowerCase()
    return MOCK_CATALOG.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [search])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <BookMarked size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catálogo de Dados</h1>
              <p className="text-gray-500 dark:text-gray-400">Metadados, esquemas e dicionário de dados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tabelas, campos, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catalog List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredItems.map(item => {
              const Icon = TYPE_ICONS[item.type]
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedItem?.id === item.id
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-gray-100 dark:bg-gray-700">
                      <Icon size={18} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Database size={40} className="mx-auto mb-2 opacity-50" />
                <p>Nenhum item encontrado</p>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedItem ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedItem.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{selectedItem.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium">
                    {selectedItem.type}
                  </span>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <User size={12} /> Owner
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">{selectedItem.owner}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Calendar size={12} /> Atualizado
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedItem.lastUpdated).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  {selectedItem.recordCount && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <Table size={12} /> Registros
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedItem.recordCount.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {selectedItem.size && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <Database size={12} /> Tamanho
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">{selectedItem.size}</div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag size={14} /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Schema */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Schema</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Campo</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Tipo</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Nullable</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-500">Descrição</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedItem.schema.map(field => (
                          <tr key={field.name} className="border-b border-gray-100 dark:border-gray-700/50">
                            <td className="py-2 px-3 font-mono text-primary">{field.name}</td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{field.type}</td>
                            <td className="py-2 px-3">
                              <span className={field.nullable ? 'text-yellow-600' : 'text-green-600'}>
                                {field.nullable ? 'Sim' : 'Não'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-500">{field.description || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <BookMarked size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500">Selecione um item para ver detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

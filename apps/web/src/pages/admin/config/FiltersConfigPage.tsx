/**
 * FiltersConfigPage
 * 
 * Página de administração para gerenciar filtros da aplicação.
 * Permite:
 * - Visualizar todos os filtros
 * - Criar/editar/excluir filtros
 * - Configurar onde cada filtro aparece
 * - Definir opções de filtros
 */

import { useState, useMemo } from 'react'
import {
  Filter,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Search,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Globe,
  Folder,
} from 'lucide-react'
import clsx from 'clsx'
import { DEFAULT_FILTERS } from '@/config/navigation-default'
import type { FilterConfig, FilterType } from '@/config/navigation-schema'

// ═══════════════════════════════════════════════════════════════
// TIPOS LOCAIS
// ═══════════════════════════════════════════════════════════════

interface FilterWithMeta extends FilterConfig {
  _isExpanded?: boolean
}

const FILTER_TYPE_LABELS: Record<FilterType, string> = {
  select: 'Seleção única',
  multiselect: 'Seleção múltipla',
  search: 'Busca texto',
  date: 'Data',
  daterange: 'Período',
  toggle: 'Toggle',
  number: 'Número',
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function FiltersConfigPage() {
  const [filters, setFilters] = useState<FilterWithMeta[]>(
    DEFAULT_FILTERS.map(f => ({ ...f, _isExpanded: false }))
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [editingFilter, setEditingFilter] = useState<string | null>(null)

  // Filtrar por busca
  const filteredFilters = useMemo(() => {
    if (!searchTerm.trim()) return filters
    const term = searchTerm.toLowerCase()
    return filters.filter(f => 
      f.name.toLowerCase().includes(term) ||
      f.id.toLowerCase().includes(term) ||
      f.type.toLowerCase().includes(term)
    )
  }, [filters, searchTerm])

  // Stats
  const stats = useMemo(() => ({
    total: filters.length,
    enabled: filters.filter(f => f.enabled).length,
    global: filters.filter(f => f.appliesTo.global).length,
  }), [filters])

  // Handlers
  const handleToggleEnabled = (filterId: string) => {
    setFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, enabled: !f.enabled } : f
    ))
    setHasChanges(true)
  }

  const handleToggleExpanded = (filterId: string) => {
    setFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, _isExpanded: !f._isExpanded } : f
    ))
  }

  const handleMoveUp = (filterId: string) => {
    const index = filters.findIndex(f => f.id === filterId)
    if (index <= 0) return
    
    const newFilters = [...filters]
    const temp = newFilters[index]
    newFilters[index] = newFilters[index - 1]
    newFilters[index - 1] = temp
    newFilters.forEach((f, i) => { f.order = i })
    
    setFilters(newFilters)
    setHasChanges(true)
  }

  const handleMoveDown = (filterId: string) => {
    const index = filters.findIndex(f => f.id === filterId)
    if (index < 0 || index >= filters.length - 1) return
    
    const newFilters = [...filters]
    const temp = newFilters[index]
    newFilters[index] = newFilters[index + 1]
    newFilters[index + 1] = temp
    newFilters.forEach((f, i) => { f.order = i })
    
    setFilters(newFilters)
    setHasChanges(true)
  }

  const handleDelete = (filterId: string) => {
    if (!confirm('Tem certeza que deseja excluir este filtro?')) return
    setFilters(prev => prev.filter(f => f.id !== filterId))
    setHasChanges(true)
  }

  const handleSave = async () => {
    // TODO: Implementar salvamento via API
    // eslint-disable-next-line no-console
    console.info('[FiltersConfig] Salvando:', filters.length, 'filtros')
    setHasChanges(false)
    alert('Configuração salva! (Em dev: implementar API)')
  }

  const handleAddFilter = () => {
    const newFilter: FilterWithMeta = {
      id: `filter-${Date.now()}`,
      name: 'Novo Filtro',
      type: 'select',
      placeholder: 'Selecione...',
      order: filters.length,
      enabled: true,
      appliesTo: { global: false },
      _isExpanded: true,
    }
    setFilters(prev => [...prev, newFilter])
    setEditingFilter(newFilter.id)
    setHasChanges(true)
  }

  return (
    <div className="filters-config-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-title">
            <Filter className="header-icon" size={24} />
            <div>
              <h1>Configuração de Filtros</h1>
              <p>Gerencie filtros disponíveis para módulos e funções</p>
            </div>
          </div>
          
          <div className="header-actions">
            {hasChanges && (
              <span className="unsaved-badge">Alterações não salvas</span>
            )}
            <button 
              onClick={handleSave}
              className={clsx('btn btn-primary', !hasChanges && 'btn-disabled')}
              disabled={!hasChanges}
            >
              <Save size={16} />
              Salvar
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Filtros</span>
        </div>
        <div className="stat-item">
          <span className="stat-value text-success">{stats.enabled}</span>
          <span className="stat-label">Ativos</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.global}</span>
          <span className="stat-label">Globais</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar filtros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="search-clear" title="Limpar busca">
              <X size={14} />
            </button>
          )}
        </div>
        
        <button onClick={handleAddFilter} className="btn btn-primary" title="Criar novo filtro">
          <Plus size={16} />
          Novo Filtro
        </button>
      </div>

      {/* Filters List */}
      <div className="filters-list">
        {filteredFilters.length === 0 ? (
          <div className="empty-state">
            <Filter size={48} />
            <p>Nenhum filtro encontrado</p>
            <button onClick={handleAddFilter} className="btn btn-primary">
              <Plus size={16} />
              Criar primeiro filtro
            </button>
          </div>
        ) : (
          filteredFilters.map((filter, index) => (
            <FilterCard
              key={filter.id}
              filter={filter}
              index={index}
              isFirst={index === 0}
              isLast={index === filteredFilters.length - 1}
              isEditing={editingFilter === filter.id}
              onToggleEnabled={() => handleToggleEnabled(filter.id)}
              onToggleExpanded={() => handleToggleExpanded(filter.id)}
              onMoveUp={() => handleMoveUp(filter.id)}
              onMoveDown={() => handleMoveDown(filter.id)}
              onEdit={() => setEditingFilter(filter.id)}
              onCancelEdit={() => setEditingFilter(null)}
              onDelete={() => handleDelete(filter.id)}
              onUpdate={(updates) => {
                setFilters(prev => prev.map(f => 
                  f.id === filter.id ? { ...f, ...updates } : f
                ))
                setHasChanges(true)
              }}
            />
          ))
        )}
      </div>

      {/* Page Styles */}
      <style>{`
        .filters-config-page {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header { margin-bottom: 1.5rem; }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .header-title {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .header-icon {
          color: var(--brand-primary, #3b82f6);
          margin-top: 0.25rem;
        }
        
        .header-title h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        
        .header-title p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0.25rem 0 0;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .unsaved-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background: #fef3c7;
          color: #92400e;
          border-radius: 0.25rem;
        }
        
        .stats-bar {
          display: flex;
          gap: 1.5rem;
          padding: 1rem 1.25rem;
          background: var(--surface-secondary);
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .stat-item { display: flex; flex-direction: column; gap: 0.125rem; }
        .stat-value { font-size: 1.25rem; font-weight: 600; }
        .stat-value.text-success { color: #10b981; }
        .stat-label { font-size: 0.75rem; color: var(--text-secondary); }
        
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 320px;
        }
        
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }
        
        .search-input {
          width: 100%;
          padding: 0.5rem 2rem 0.5rem 2.25rem;
          border: 1px solid var(--border-primary);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: var(--surface-primary);
        }
        
        .search-clear {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          padding: 0.25rem;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary {
          background: var(--brand-primary, #3b82f6);
          color: white;
        }
        
        .btn-primary:hover { background: var(--brand-primary-dark, #2563eb); }
        .btn-primary.btn-disabled { opacity: 0.5; cursor: not-allowed; }
        
        .filters-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem;
          color: var(--text-secondary);
        }
        
        .empty-state svg { opacity: 0.3; margin-bottom: 1rem; }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: FilterCard
// ═══════════════════════════════════════════════════════════════

interface FilterCardProps {
  filter: FilterWithMeta
  index: number
  isFirst: boolean
  isLast: boolean
  isEditing: boolean
  onToggleEnabled: () => void
  onToggleExpanded: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<FilterConfig>) => void
}

function FilterCard({
  filter,
  index,
  isFirst,
  isLast,
  isEditing,
  onToggleEnabled,
  onToggleExpanded: _onToggleExpanded,
  onMoveUp,
  onMoveDown,
  onEdit,
  onCancelEdit,
  onDelete,
  onUpdate,
}: FilterCardProps) {
  return (
    <div className={clsx('filter-card', !filter.enabled && 'disabled', isEditing && 'editing')}>
      <div className="filter-header">
        <div className="filter-drag" title="Arrastar para reordenar">
          <GripVertical size={16} />
        </div>
        
        <div className="filter-order">{index + 1}</div>
        
        <div className="filter-info">
          <div className="filter-name">{filter.name}</div>
          <div className="filter-meta">
            <span className="filter-type">{FILTER_TYPE_LABELS[filter.type]}</span>
            {filter.appliesTo.global && (
              <span className="filter-scope global">
                <Globe size={12} />
                Global
              </span>
            )}
            {filter.appliesTo.modules && filter.appliesTo.modules.length > 0 && (
              <span className="filter-scope modules">
                <Folder size={12} />
                {filter.appliesTo.modules.length} módulos
              </span>
            )}
          </div>
        </div>
        
        <div className="filter-actions">
          <button
            onClick={onToggleEnabled}
            className={clsx('action-btn', filter.enabled ? 'enabled' : 'disabled')}
            title={filter.enabled ? 'Desabilitar' : 'Habilitar'}
          >
            {filter.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          
          <button onClick={onMoveUp} className="action-btn" disabled={isFirst} title="Mover para cima">
            <ChevronUp size={16} />
          </button>
          
          <button onClick={onMoveDown} className="action-btn" disabled={isLast} title="Mover para baixo">
            <ChevronDown size={16} />
          </button>
          
          <button onClick={onEdit} className="action-btn" title="Editar filtro">
            <Pencil size={16} />
          </button>
          
          <button onClick={onDelete} className="action-btn danger" title="Excluir filtro">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Edit Form */}
      {isEditing && (
        <div className="filter-edit">
          <div className="edit-row">
            <label htmlFor={`filter-name-${filter.id}`}>Nome</label>
            <input
              id={`filter-name-${filter.id}`}
              type="text"
              value={filter.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Nome do filtro"
            />
          </div>
          
          <div className="edit-row">
            <label>Tipo</label>
            <select
              value={filter.type}
              onChange={(e) => onUpdate({ type: e.target.value as FilterType })}
              title="Tipo do filtro"
            >
              {Object.entries(FILTER_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="edit-row">
            <label htmlFor={`filter-placeholder-${filter.id}`}>Placeholder</label>
            <input
              id={`filter-placeholder-${filter.id}`}
              type="text"
              value={filter.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Texto de placeholder"
            />
          </div>
          
          <div className="edit-row">
            <label>
              <input
                type="checkbox"
                checked={filter.appliesTo.global}
                onChange={(e) => onUpdate({ 
                  appliesTo: { ...filter.appliesTo, global: e.target.checked } 
                })}
              />
              Aplicar globalmente
            </label>
          </div>
          
          <div className="edit-actions">
            <button onClick={onCancelEdit} className="btn btn-secondary">
              <X size={14} />
              Fechar
            </button>
          </div>
        </div>
      )}
      
      {/* Card Styles */}
      <style>{`
        .filter-card {
          background: var(--surface-primary);
          border: 1px solid var(--border-primary);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .filter-card:hover { border-color: var(--brand-primary); }
        .filter-card.disabled { opacity: 0.6; }
        .filter-card.editing { border-color: var(--brand-primary); }
        
        .filter-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
        }
        
        .filter-drag { cursor: grab; color: var(--text-tertiary); }
        
        .filter-order {
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--surface-secondary);
          border-radius: 0.25rem;
        }
        
        .filter-info { flex: 1; min-width: 0; }
        .filter-name { font-weight: 500; }
        
        .filter-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }
        
        .filter-type {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .filter-scope {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }
        
        .filter-scope.global {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .filter-scope.modules {
          background: #f3e8ff;
          color: #6b21a8;
        }
        
        .filter-actions {
          display: flex;
          gap: 0.25rem;
        }
        
        .action-btn {
          padding: 0.375rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 0.25rem;
        }
        
        .action-btn:hover { background: var(--surface-hover); }
        .action-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .action-btn.enabled { color: #10b981; }
        .action-btn.danger:hover { background: #fee2e2; color: #dc2626; }
        
        .filter-edit {
          padding: 1rem;
          background: var(--surface-secondary);
          border-top: 1px solid var(--border-primary);
        }
        
        .edit-row {
          margin-bottom: 0.75rem;
        }
        
        .edit-row label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .edit-row input[type="text"],
        .edit-row select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border-primary);
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        .edit-row input[type="checkbox"] {
          margin-right: 0.5rem;
        }
        
        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .btn-secondary {
          background: var(--surface-primary);
          color: var(--text-primary);
          border: 1px solid var(--border-primary);
        }
      `}</style>
    </div>
  )
}

export default FiltersConfigPage

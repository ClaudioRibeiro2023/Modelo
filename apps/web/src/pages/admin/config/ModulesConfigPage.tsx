/**
 * ModulesConfigPage
 * 
 * Página de administração para gerenciar módulos da aplicação.
 * Permite:
 * - Visualizar todos os módulos
 * - Reordenar módulos (drag & drop)
 * - Habilitar/desabilitar módulos
 * - Editar configurações de módulo
 * - Gerenciar funções de cada módulo
 */

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings,
  GripVertical,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
} from 'lucide-react'
import clsx from 'clsx'
import { DEFAULT_MODULES } from '@/config/navigation-default'
import type { ModuleConfig, FunctionConfig } from '@/config/navigation-schema'

// ═══════════════════════════════════════════════════════════════
// TIPOS LOCAIS
// ═══════════════════════════════════════════════════════════════

type ViewMode = 'grid' | 'list'

interface ModuleWithMeta extends ModuleConfig {
  _isExpanded?: boolean
  _isDragging?: boolean
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function ModulesConfigPage() {
  // Estados
  const [modules, setModules] = useState<ModuleWithMeta[]>(
    DEFAULT_MODULES.map(m => ({ ...m, _isExpanded: false }))
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [_selectedModule, _setSelectedModule] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [draggedModule, setDraggedModule] = useState<string | null>(null)

  // Filtrar módulos por busca
  const filteredModules = useMemo(() => {
    if (!searchTerm.trim()) return modules
    const term = searchTerm.toLowerCase()
    return modules.filter(m => 
      m.name.toLowerCase().includes(term) ||
      m.description?.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term)
    )
  }, [modules, searchTerm])

  // Estatísticas
  const stats = useMemo(() => ({
    total: modules.length,
    enabled: modules.filter(m => m.enabled).length,
    disabled: modules.filter(m => !m.enabled).length,
    totalFunctions: modules.reduce((acc, m) => acc + m.functions.length, 0),
  }), [modules])

  // ─────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────

  const handleToggleEnabled = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, enabled: !m.enabled } : m
    ))
    setHasChanges(true)
  }

  const handleToggleExpanded = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, _isExpanded: !m._isExpanded } : m
    ))
  }

  const handleMoveUp = (moduleId: string) => {
    const index = modules.findIndex(m => m.id === moduleId)
    if (index <= 0) return
    
    const newModules = [...modules]
    const temp = newModules[index]
    newModules[index] = newModules[index - 1]
    newModules[index - 1] = temp
    
    // Atualizar ordem
    newModules.forEach((m, i) => { m.order = i })
    setModules(newModules)
    setHasChanges(true)
  }

  const handleMoveDown = (moduleId: string) => {
    const index = modules.findIndex(m => m.id === moduleId)
    if (index < 0 || index >= modules.length - 1) return
    
    const newModules = [...modules]
    const temp = newModules[index]
    newModules[index] = newModules[index + 1]
    newModules[index + 1] = temp
    
    // Atualizar ordem
    newModules.forEach((m, i) => { m.order = i })
    setModules(newModules)
    setHasChanges(true)
  }

  const handleDragStart = (moduleId: string) => {
    setDraggedModule(moduleId)
  }

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedModule || draggedModule === targetId) return
    
    const dragIndex = modules.findIndex(m => m.id === draggedModule)
    const targetIndex = modules.findIndex(m => m.id === targetId)
    
    if (dragIndex < 0 || targetIndex < 0) return
    
    const newModules = [...modules]
    const [dragged] = newModules.splice(dragIndex, 1)
    newModules.splice(targetIndex, 0, dragged)
    
    newModules.forEach((m, i) => { m.order = i })
    setModules(newModules)
  }

  const handleDragEnd = () => {
    setDraggedModule(null)
    setHasChanges(true)
  }

  const handleSave = async () => {
    // TODO: Salvar na API
    // TODO: Implementar salvamento via API
    // eslint-disable-next-line no-console
    console.info('[ModulesConfig] Salvando:', modules.length, 'módulos')
    setHasChanges(false)
    alert('Configuração salva! (Em dev: implementar API)')
  }

  const handleExport = () => {
    const data = JSON.stringify(modules, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modules-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDuplicateModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) return
    
    const newModule: ModuleWithMeta = {
      ...module,
      id: `${module.id}-copy-${Date.now()}`,
      name: `${module.name} (Cópia)`,
      order: modules.length,
      functions: module.functions.map(f => ({
        ...f,
        id: `${f.id}-copy-${Date.now()}`,
        moduleId: `${module.id}-copy-${Date.now()}`,
      })),
    }
    
    setModules(prev => [...prev, newModule])
    setHasChanges(true)
  }

  const handleDeleteModule = (moduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return
    setModules(prev => prev.filter(m => m.id !== moduleId))
    setHasChanges(true)
  }

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="modules-config-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-title">
            <Settings className="header-icon" size={24} />
            <div>
              <h1>Configuração de Módulos</h1>
              <p>Gerencie módulos, funções e permissões da aplicação</p>
            </div>
          </div>
          
          <div className="header-actions">
            {hasChanges && (
              <span className="unsaved-badge">Alterações não salvas</span>
            )}
            <button 
              onClick={handleExport}
              className="btn btn-secondary"
              title="Exportar configuração"
            >
              <Download size={16} />
              Exportar
            </button>
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

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Módulos</span>
        </div>
        <div className="stat-item">
          <span className="stat-value text-success">{stats.enabled}</span>
          <span className="stat-label">Ativos</span>
        </div>
        <div className="stat-item">
          <span className="stat-value text-muted">{stats.disabled}</span>
          <span className="stat-label">Inativos</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.totalFunctions}</span>
          <span className="stat-label">Funções</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar módulos..."
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
        
        <div className="toolbar-actions">
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('list')}
              className={clsx('view-btn', viewMode === 'list' && 'active')}
              title="Visualização em lista"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={clsx('view-btn', viewMode === 'grid' && 'active')}
              title="Visualização em grid"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
          
          <button className="btn btn-primary" title="Criar novo módulo">
            <Plus size={16} />
            Novo Módulo
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className={clsx('modules-container', `view-${viewMode}`)}>
        {filteredModules.length === 0 ? (
          <div className="empty-state">
            <Filter size={48} />
            <p>Nenhum módulo encontrado</p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="btn btn-link">
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          filteredModules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              isFirst={index === 0}
              isLast={index === filteredModules.length - 1}
              isDragging={draggedModule === module.id}
              onToggleEnabled={() => handleToggleEnabled(module.id)}
              onToggleExpanded={() => handleToggleExpanded(module.id)}
              onMoveUp={() => handleMoveUp(module.id)}
              onMoveDown={() => handleMoveDown(module.id)}
              onDragStart={() => handleDragStart(module.id)}
              onDragOver={(e) => handleDragOver(e, module.id)}
              onDragEnd={handleDragEnd}
              onDuplicate={() => handleDuplicateModule(module.id)}
              onDelete={() => handleDeleteModule(module.id)}
            />
          ))
        )}
      </div>

      {/* Styles */}
      <style>{`
        .modules-config-page {
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: 1.5rem;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
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
          color: var(--text-primary);
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
        
        .dark .unsaved-badge {
          background: #78350f;
          color: #fcd34d;
        }
        
        .stats-bar {
          display: flex;
          gap: 1.5rem;
          padding: 1rem 1.25rem;
          background: var(--surface-secondary);
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        
        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .stat-value.text-success { color: #10b981; }
        .stat-value.text-muted { color: var(--text-secondary); }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
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
          color: var(--text-primary);
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .search-clear {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          padding: 0.25rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 0.25rem;
        }
        
        .search-clear:hover {
          background: var(--surface-hover);
        }
        
        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .view-toggle {
          display: flex;
          border: 1px solid var(--border-primary);
          border-radius: 0.375rem;
          overflow: hidden;
        }
        
        .view-btn {
          padding: 0.5rem;
          border: none;
          background: var(--surface-primary);
          color: var(--text-secondary);
          cursor: pointer;
        }
        
        .view-btn:hover {
          background: var(--surface-hover);
        }
        
        .view-btn.active {
          background: var(--brand-primary);
          color: white;
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
          transition: all 0.15s ease;
        }
        
        .btn-primary {
          background: var(--brand-primary, #3b82f6);
          color: white;
        }
        
        .btn-primary:hover {
          background: var(--brand-primary-dark, #2563eb);
        }
        
        .btn-primary.btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: var(--surface-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-primary);
        }
        
        .btn-secondary:hover {
          background: var(--surface-hover);
        }
        
        .btn-link {
          background: transparent;
          color: var(--brand-primary);
          padding: 0;
        }
        
        .modules-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .modules-container.view-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1rem;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: var(--text-secondary);
          text-align: center;
        }
        
        .empty-state svg {
          opacity: 0.3;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: ModuleCard
// ═══════════════════════════════════════════════════════════════

interface ModuleCardProps {
  module: ModuleWithMeta
  index: number
  isFirst: boolean
  isLast: boolean
  isDragging: boolean
  onToggleEnabled: () => void
  onToggleExpanded: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function ModuleCard({
  module,
  index,
  isFirst,
  isLast,
  isDragging,
  onToggleEnabled,
  onToggleExpanded,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDuplicate,
  onDelete,
}: ModuleCardProps) {
  return (
    <div
      className={clsx(
        'module-card',
        !module.enabled && 'disabled',
        isDragging && 'dragging',
        module._isExpanded && 'expanded'
      )}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {/* Header */}
      <div className="module-header">
        <div className="module-drag" title="Arrastar para reordenar">
          <GripVertical size={16} />
        </div>
        
        <div className="module-order">{index + 1}</div>
        
        <div className="module-info">
          <div className="module-name">
            <span>{module.name}</span>
            {typeof module.metadata?.badge === 'string' && (
              <span className="module-badge">{module.metadata.badge}</span>
            )}
          </div>
          <div className="module-path">{module.path}</div>
        </div>
        
        <div className="module-meta">
          <span className="module-functions-count">
            {module.functions.length} funções
          </span>
          {module.roles.length > 0 && (
            <span className="module-roles">
              {module.roles.join(', ')}
            </span>
          )}
        </div>
        
        <div className="module-actions">
          <button
            onClick={onToggleEnabled}
            className={clsx('action-btn', module.enabled ? 'enabled' : 'disabled')}
            title={module.enabled ? 'Desabilitar' : 'Habilitar'}
          >
            {module.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          
          <button
            onClick={onMoveUp}
            className="action-btn"
            disabled={isFirst}
            title="Mover para cima"
          >
            <ChevronUp size={16} />
          </button>
          
          <button
            onClick={onMoveDown}
            className="action-btn"
            disabled={isLast}
            title="Mover para baixo"
          >
            <ChevronDown size={16} />
          </button>
          
          <Link
            to={`/admin/config/modules/${module.id}`}
            className="action-btn"
            title="Editar módulo"
          >
            <Pencil size={16} />
          </Link>
          
          <button
            onClick={onDuplicate}
            className="action-btn"
            title="Duplicar módulo"
          >
            <Copy size={16} />
          </button>
          
          <button
            onClick={onDelete}
            className="action-btn danger"
            title="Excluir módulo"
          >
            <Trash2 size={16} />
          </button>
          
          <button
            onClick={onToggleExpanded}
            className="action-btn expand-btn"
            title={module._isExpanded ? 'Recolher' : 'Expandir'}
          >
            <ChevronRight 
              size={16} 
              className={clsx('expand-icon', module._isExpanded && 'expanded')} 
            />
          </button>
        </div>
      </div>
      
      {/* Expanded Content - Functions List */}
      {module._isExpanded && (
        <div className="module-content">
          <div className="functions-header">
            <h4>Funções ({module.functions.length})</h4>
            <Link 
              to={`/admin/config/modules/${module.id}/functions`}
              className="btn btn-sm"
            >
              <Plus size={14} />
              Adicionar
            </Link>
          </div>
          
          <div className="functions-list">
            {module.functions.length === 0 ? (
              <p className="no-functions">Nenhuma função cadastrada</p>
            ) : (
              module.functions.map(func => (
                <FunctionRow key={func.id} func={func} moduleId={module.id} />
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Card Styles */}
      <style>{`
        .module-card {
          background: var(--surface-primary);
          border: 1px solid var(--border-primary);
          border-radius: 0.5rem;
          overflow: hidden;
          transition: all 0.15s ease;
        }
        
        .module-card:hover {
          border-color: var(--brand-primary);
        }
        
        .module-card.disabled {
          opacity: 0.6;
        }
        
        .module-card.dragging {
          opacity: 0.5;
          transform: scale(0.98);
        }
        
        .module-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
        }
        
        .module-drag {
          cursor: grab;
          color: var(--text-tertiary);
          padding: 0.25rem;
        }
        
        .module-drag:hover {
          color: var(--text-secondary);
        }
        
        .module-order {
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--surface-secondary);
          color: var(--text-secondary);
          border-radius: 0.25rem;
        }
        
        .module-info {
          flex: 1;
          min-width: 0;
        }
        
        .module-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .module-badge {
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          background: var(--brand-primary);
          color: white;
          border-radius: 0.25rem;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .module-path {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-family: monospace;
        }
        
        .module-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem;
        }
        
        .module-functions-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .module-roles {
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          background: #fef3c7;
          color: #92400e;
          border-radius: 0.25rem;
        }
        
        .dark .module-roles {
          background: #78350f;
          color: #fcd34d;
        }
        
        .module-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .action-btn {
          padding: 0.375rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        
        .action-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
        
        .action-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .action-btn.enabled {
          color: #10b981;
        }
        
        .action-btn.disabled {
          color: var(--text-tertiary);
        }
        
        .action-btn.danger:hover {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .dark .action-btn.danger:hover {
          background: #7f1d1d;
          color: #fca5a5;
        }
        
        .expand-icon {
          transition: transform 0.2s ease;
        }
        
        .expand-icon.expanded {
          transform: rotate(90deg);
        }
        
        .module-content {
          border-top: 1px solid var(--border-primary);
          padding: 1rem;
          background: var(--surface-secondary);
        }
        
        .functions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .functions-header h4 {
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
          color: var(--text-primary);
        }
        
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }
        
        .functions-list {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        
        .no-functions {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-align: center;
          padding: 1rem;
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: FunctionRow
// ═══════════════════════════════════════════════════════════════

interface FunctionRowProps {
  func: FunctionConfig
  moduleId: string
}

function FunctionRow({ func, moduleId }: FunctionRowProps) {
  return (
    <div className={clsx('function-row', !func.enabled && 'disabled')}>
      <div className="function-info">
        <span className="function-name">{func.name}</span>
        <span className="function-path">{func.path}</span>
      </div>
      
      <div className="function-category">{func.category}</div>
      
      <div className="function-actions">
        <Link 
          to={`/admin/config/modules/${moduleId}/functions/${func.id}`}
          className="action-btn"
          title="Editar função"
        >
          <Pencil size={14} />
        </Link>
      </div>
      
      <style>{`
        .function-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: var(--surface-primary);
          border-radius: 0.375rem;
          font-size: 0.8125rem;
        }
        
        .function-row.disabled {
          opacity: 0.5;
        }
        
        .function-row:hover {
          background: var(--surface-hover);
        }
        
        .function-info {
          flex: 1;
          min-width: 0;
        }
        
        .function-name {
          display: block;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .function-path {
          display: block;
          font-size: 0.6875rem;
          color: var(--text-secondary);
          font-family: monospace;
        }
        
        .function-category {
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          background: var(--surface-secondary);
          color: var(--text-secondary);
          border-radius: 0.25rem;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}

export default ModulesConfigPage

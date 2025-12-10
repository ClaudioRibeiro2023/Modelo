/**
 * ModuleFunctionsPanel
 * 
 * Painel lateral que exibe as funções do módulo ativo.
 * Inclui busca, favoritos e agrupamento por categoria.
 * 
 * Refatorado para usar configuração dinâmica via useNavigationConfig.
 */
import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Search, 
  Star, 
  ChevronRight, 
  ChevronDown,
  X,
  Keyboard
} from 'lucide-react'
import clsx from 'clsx'
import { useNavigationConfig } from '@/hooks/useNavigationConfig'
import type { FunctionConfig, FunctionCategory } from '@/config/navigation-schema'

// Nomes das categorias para exibição
const CATEGORY_LABELS: Record<FunctionCategory, string> = {
  ANALISE: 'Análise',
  MAPEAMENTO: 'Mapeamento',
  INDICADORES: 'Indicadores',
  CONTROLE: 'Controle',
  OPERACIONAL: 'Operacional',
  CONFIG: 'Configuração',
  OTHER: 'Outros',
}

// Ordem das categorias
const CATEGORY_ORDER: FunctionCategory[] = ['ANALISE', 'MAPEAMENTO', 'INDICADORES', 'CONTROLE', 'OPERACIONAL', 'CONFIG']

// Storage key para favoritos
const FAVORITES_KEY = 'module-favorites'

interface ModuleFunctionsPanelProps {
  isOpen?: boolean
  onClose?: () => void
}

export function ModuleFunctionsPanel({ isOpen = true, onClose }: ModuleFunctionsPanelProps) {
  const location = useLocation()
  
  // Usar configuração dinâmica
  const { getModuleByPath, getModuleFunctions } = useNavigationConfig()
  
  // Estados
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [expandedCategories, setExpandedCategories] = useState<FunctionCategory[]>(CATEGORY_ORDER)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Resolver módulo ativo baseado na URL usando hook de config
  const activeModule = useMemo(() => {
    return getModuleByPath(location.pathname)
  }, [location.pathname, getModuleByPath])

  // Obter funções autorizadas do módulo ativo (já filtradas por permissão)
  const authorizedFunctions = useMemo(() => {
    if (!activeModule) return []
    return getModuleFunctions(activeModule.id)
  }, [activeModule, getModuleFunctions])

  // Filtrar funções por busca e favoritos
  const filteredFunctions = useMemo(() => {
    let functions = authorizedFunctions

    // Filtrar por favoritos
    if (showFavoritesOnly) {
      functions = functions.filter(f => favorites.includes(f.id))
    }

    // Filtrar por busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      functions = functions.filter(f => 
        f.name.toLowerCase().includes(term) ||
        f.subtitle?.toLowerCase().includes(term)
      )
    }

    return functions
  }, [authorizedFunctions, searchTerm, showFavoritesOnly, favorites])

  // Agrupar funções por categoria
  const groupedFunctions = useMemo(() => {
    const groups: Record<FunctionCategory, FunctionConfig[]> = {
      ANALISE: [],
      MAPEAMENTO: [],
      INDICADORES: [],
      CONTROLE: [],
      OPERACIONAL: [],
      CONFIG: [],
      OTHER: [],
    }

    filteredFunctions.forEach(func => {
      const category = func.category || 'OTHER'
      if (groups[category]) {
        groups[category].push(func)
      } else {
        groups.OTHER.push(func)
      }
    })

    return groups
  }, [filteredFunctions])

  // Toggle favorito
  const toggleFavorite = useCallback((funcId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(funcId)
        ? prev.filter(id => id !== funcId)
        : [...prev, funcId]
      
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      return newFavorites
    })
  }, [])

  // Toggle categoria expandida
  const toggleCategory = useCallback((category: FunctionCategory) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }, [])

  // Verificar se função está ativa
  const isActive = useCallback((funcPath: string) => {
    return location.pathname === funcPath || location.pathname.startsWith(funcPath + '/')
  }, [location.pathname])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K para focar na busca
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById('functions-search')
        searchInput?.focus()
      }
      
      // Cmd/Ctrl + F para toggle favoritos
      if ((e.metaKey || e.ctrlKey) && e.key === 'f' && e.shiftKey) {
        e.preventDefault()
        setShowFavoritesOnly(prev => !prev)
      }
      
      // Escape para limpar busca
      if (e.key === 'Escape') {
        setSearchTerm('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Se não há módulo ativo, não renderizar
  if (!activeModule) {
    return null
  }

  // Se painel está fechado
  if (!isOpen) {
    return null
  }

  const hasAnyFunction = filteredFunctions.length > 0

  return (
    <aside className="module-functions-panel">
      {/* Header do painel */}
      <div className="panel-header">
        <div className="panel-title">
          <h2>{activeModule.name}</h2>
          {activeModule.description && (
            <p className="panel-subtitle">{activeModule.description}</p>
          )}
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="panel-close"
            title="Fechar painel"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Barra de busca */}
      <div className="panel-search">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            id="functions-search"
            type="text"
            placeholder="Buscar função... (Ctrl+K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="search-clear"
              title="Limpar busca"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        {/* Filtro de favoritos */}
        <button
          onClick={() => setShowFavoritesOnly(prev => !prev)}
          className={clsx(
            'favorites-toggle',
            showFavoritesOnly && 'active'
          )}
          title={showFavoritesOnly ? 'Mostrar todas' : 'Mostrar favoritos (Ctrl+Shift+F)'}
        >
          <Star size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Lista de funções */}
      <div className="panel-content">
        {!hasAnyFunction ? (
          <div className="empty-state">
            {showFavoritesOnly ? (
              <>
                <Star size={32} className="empty-icon" />
                <p>Nenhum favorito</p>
                <span>Clique na estrela para favoritar funções</span>
              </>
            ) : searchTerm ? (
              <>
                <Search size={32} className="empty-icon" />
                <p>Nenhum resultado</p>
                <span>Tente outro termo de busca</span>
              </>
            ) : (
              <>
                <ChevronRight size={32} className="empty-icon" />
                <p>Sem funções</p>
                <span>Este módulo não possui funções disponíveis</span>
              </>
            )}
          </div>
        ) : (
          <nav className="functions-nav">
            {/* Funções sem categoria primeiro */}
            {groupedFunctions.OTHER.length > 0 && (
              <div className="functions-group">
                {groupedFunctions.OTHER.map(func => (
                  <FunctionLink
                    key={func.id}
                    func={func}
                    isActive={isActive(func.path)}
                    isFavorite={favorites.includes(func.id)}
                    onToggleFavorite={() => toggleFavorite(func.id)}
                  />
                ))}
              </div>
            )}

            {/* Funções agrupadas por categoria */}
            {CATEGORY_ORDER.map(category => {
              const functions = groupedFunctions[category]
              if (!functions || functions.length === 0) return null

              const isExpanded = expandedCategories.includes(category)

              return (
                <div key={category} className="functions-group">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="category-header"
                  >
                    <span className="category-name">{CATEGORY_LABELS[category]}</span>
                    <span className="category-count">{functions.length}</span>
                    <ChevronDown 
                      size={14} 
                      className={clsx('category-chevron', isExpanded && 'expanded')} 
                    />
                  </button>

                  {isExpanded && (
                    <div className="category-content">
                      {functions.map(func => (
                        <FunctionLink
                          key={func.id}
                          func={func}
                          isActive={isActive(func.path)}
                          isFavorite={favorites.includes(func.id)}
                          onToggleFavorite={() => toggleFavorite(func.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        )}
      </div>

      {/* Footer com atalhos */}
      <div className="panel-footer">
        <button
          onClick={() => setShowShortcuts(prev => !prev)}
          className="shortcuts-toggle"
        >
          <Keyboard size={14} />
          <span>Atalhos</span>
        </button>

        {showShortcuts && (
          <div className="shortcuts-list">
            <div className="shortcut">
              <kbd>Ctrl</kbd> + <kbd>K</kbd>
              <span>Buscar</span>
            </div>
            <div className="shortcut">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd>
              <span>Favoritos</span>
            </div>
            <div className="shortcut">
              <kbd>Esc</kbd>
              <span>Limpar</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// Componente de link para função
interface FunctionLinkProps {
  func: FunctionConfig
  isActive: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
}

function FunctionLink({ func, isActive, isFavorite, onToggleFavorite }: FunctionLinkProps) {
  return (
    <div className={clsx('function-item', isActive && 'active')}>
      <Link to={func.path} className="function-link">
        <div className="function-info">
          <span className="function-name">{func.name}</span>
          {func.subtitle && (
            <span className="function-subtitle">{func.subtitle}</span>
          )}
        </div>
        <ChevronRight size={14} className="function-chevron" />
      </Link>
      
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggleFavorite()
        }}
        className={clsx('favorite-btn', isFavorite && 'active')}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}

export default ModuleFunctionsPanel

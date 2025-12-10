import { useLocation } from 'react-router-dom'
import { Bell, Search, Moon, Sun, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  showPanelToggle?: boolean
  isPanelOpen?: boolean
  onTogglePanel?: () => void
}

export function Header({ showPanelToggle, isPanelOpen, onTogglePanel }: HeaderProps) {
  const location = useLocation()
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  // Generate breadcrumb from path
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumb = pathSegments.length > 0 
    ? pathSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' > ')
    : 'Início'

  return (
    <header className="h-16 bg-surface-elevated border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Panel toggle */}
        {showPanelToggle && (
          <button 
            onClick={onTogglePanel}
            className="p-2 rounded-lg hover:bg-surface-muted transition-colors"
            title={isPanelOpen ? 'Fechar painel de funções' : 'Abrir painel de funções'}
          >
            {isPanelOpen ? (
              <PanelLeftClose size={20} className="text-text-secondary" />
            ) : (
              <PanelLeft size={20} className="text-text-secondary" />
            )}
          </button>
        )}

        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary">
          <span className="text-text-muted">Template</span>
          <span className="mx-2 text-text-muted">/</span>
          <span className="text-text-primary font-medium">{breadcrumb}</span>
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="p-2 rounded-lg hover:bg-surface-muted transition-colors" title="Buscar">
          <Search size={20} className="text-text-secondary" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-surface-muted transition-colors relative" title="Notificações">
          <Bell size={20} className="text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Theme toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-surface-muted transition-colors"
          title={isDark ? 'Modo claro' : 'Modo escuro'}
        >
          {isDark ? (
            <Sun size={20} className="text-text-secondary" />
          ) : (
            <Moon size={20} className="text-text-secondary" />
          )}
        </button>
      </div>
    </header>
  )
}

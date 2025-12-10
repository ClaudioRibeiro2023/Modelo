import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { ModuleFunctionsPanel } from '@/components/navigation'
import { NAVIGATION } from '@/navigation/map'

export function AppLayout() {
  const location = useLocation()
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  // Verificar se o módulo atual tem funções para mostrar o painel
  const hasModuleFunctions = NAVIGATION.modules.some(module => {
    const isModuleActive = location.pathname === module.path || 
                          location.pathname.startsWith(module.path + '/')
    
    // Verificar também pelas funções
    const isFunctionActive = module.functions?.some(
      func => location.pathname === func.path || location.pathname.startsWith(func.path + '/')
    )
    
    return (isModuleActive || isFunctionActive) && module.functions && module.functions.length > 0
  })

  // Calcular margin-left dinâmico baseado no painel
  const contentMargin = hasModuleFunctions && isPanelOpen 
    ? 'ml-[calc(var(--sidebar-width)+var(--functions-panel-width,280px))]' 
    : 'ml-[var(--sidebar-width)]'

  return (
    <div className="flex min-h-screen bg-surface-base">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Functions Panel */}
      {hasModuleFunctions && (
        <ModuleFunctionsPanel 
          isOpen={isPanelOpen} 
          onClose={() => setIsPanelOpen(false)} 
        />
      )}
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col ${contentMargin} transition-all duration-300`}>
        <Header 
          showPanelToggle={hasModuleFunctions}
          isPanelOpen={isPanelOpen}
          onTogglePanel={() => setIsPanelOpen(prev => !prev)}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Info, Code, Folder, FileText, Plus } from 'lucide-react'
import { ExampleCard } from './components'
import { useExampleData } from './hooks'

export function ExemploPage() {
  const { items, isLoading } = useExampleData()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Info className="text-blue-500 mt-1 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Este é um módulo de exemplo
            </h2>
            <p className="text-blue-600 dark:text-blue-400">
              Substitua este conteúdo pelo seu próprio módulo. Este arquivo serve como 
              referência de estrutura e pode ser removido após criar seus módulos.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Exemplo de Módulo</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors">
          <Plus size={20} />
          Novo Item
        </button>
      </div>

      {/* Example Items */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {items.map(item => (
            <ExampleCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-elevated rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
              <Folder className="text-brand-primary" size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Estrutura de Módulos</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            Cada módulo deve ter sua própria pasta em <code className="bg-surface-muted px-1 rounded">src/modules/</code>
          </p>
          <pre className="bg-surface-muted p-3 rounded-lg text-xs overflow-x-auto">
{`modules/exemplo/
├── components/
├── hooks/
├── services/
├── types.ts
└── index.ts`}
          </pre>
        </div>

        <div className="bg-surface-elevated rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
              <Code className="text-brand-primary" size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Adicionando Rotas</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            Adicione suas rotas no arquivo <code className="bg-surface-muted px-1 rounded">App.tsx</code>
          </p>
          <pre className="bg-surface-muted p-3 rounded-lg text-xs overflow-x-auto">
{`<Route 
  path="/meu-modulo/*" 
  element={<MeuModuloRoutes />} 
/>`}
          </pre>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-surface-elevated rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
            <FileText className="text-brand-primary" size={20} />
          </div>
          <h3 className="font-semibold text-text-primary">Checklist para novos módulos</h3>
        </div>
        <ul className="space-y-2 text-text-secondary">
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded" readOnly />
            <span>Criar pasta do módulo em <code className="bg-surface-muted px-1 rounded">src/modules/</code></span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded" readOnly />
            <span>Adicionar rota no <code className="bg-surface-muted px-1 rounded">App.tsx</code></span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded" readOnly />
            <span>Adicionar item no menu em <code className="bg-surface-muted px-1 rounded">AppSidebar.tsx</code></span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded" readOnly />
            <span>Definir permissões/roles se necessário</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded" readOnly />
            <span>Criar testes E2E básicos</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

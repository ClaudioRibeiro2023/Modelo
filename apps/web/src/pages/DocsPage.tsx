import { FileText, Book, Code, ExternalLink, Github } from 'lucide-react'

export function DocsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
          <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documentação</h1>
          <p className="text-gray-500 dark:text-gray-400">Guias e referências do sistema</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Quick Start */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Book className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Início Rápido</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Este template fornece uma estrutura completa para desenvolvimento de aplicações web modernas.
            </p>
            <h3 className="text-base font-medium mt-4 mb-2">Tecnologias</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
              <li>React 18 + TypeScript</li>
              <li>Vite para build e dev server</li>
              <li>TailwindCSS para estilos</li>
              <li>React Router para navegação</li>
              <li>TanStack Query para data fetching</li>
              <li>Keycloak/OIDC para autenticação</li>
            </ul>
          </div>
        </section>

        {/* Structure */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Estrutura do Projeto</h2>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`├── apps/
│   └── web/                 # Aplicação React principal
│       ├── src/
│       │   ├── components/  # Componentes reutilizáveis
│       │   ├── contexts/    # Contextos React (Auth, Theme)
│       │   ├── navigation/  # Mapa de navegação
│       │   ├── pages/       # Páginas da aplicação
│       │   └── styles/      # Estilos globais
│       └── e2e/             # Testes E2E (Playwright)
│
├── packages/
│   ├── design-system/       # Componentes UI compartilhados
│   ├── shared/              # Lógica compartilhada (auth, api)
│   └── types/               # Tipos TypeScript
│
├── infra/
│   ├── docker-compose.yml   # Stack de desenvolvimento
│   └── keycloak/            # Configuração Keycloak
│
└── docs/                    # Documentação`}
          </pre>
        </section>

        {/* Links */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Links Úteis</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'React Docs', url: 'https://react.dev', icon: ExternalLink },
              { name: 'TailwindCSS', url: 'https://tailwindcss.com', icon: ExternalLink },
              { name: 'Vite', url: 'https://vitejs.dev', icon: ExternalLink },
              { name: 'GitHub', url: 'https://github.com', icon: Github },
            ].map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <link.icon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900 dark:text-white">{link.name}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default DocsPage

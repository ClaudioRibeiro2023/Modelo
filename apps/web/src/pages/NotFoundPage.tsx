import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-brand-primary/20">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mt-4">Página não encontrada</h2>
        <p className="text-text-secondary mt-2 mb-8">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text-primary hover:bg-surface-muted transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
          >
            <Home size={18} />
            Início
          </Link>
        </div>
      </div>
    </div>
  )
}

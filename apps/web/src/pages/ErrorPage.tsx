import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ErrorPageProps {
  /** Error code (e.g., 404, 500) */
  code?: number | string
  /** Error title */
  title?: string
  /** Error description */
  description?: string
  /** Show back button */
  showBack?: boolean
}

export function ErrorPage({
  code = '500',
  title = 'Algo deu errado',
  description = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  showBack = true,
}: ErrorPageProps) {
  const navigate = useNavigate()

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Code */}
        <div className="mb-6">
          <span className="text-8xl font-bold text-brand-primary/20">{code}</span>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>

        {/* Description */}
        <p className="text-text-secondary mb-8">{description}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBack && (
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface-muted transition-colors border border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
          )}
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface-muted transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Home size={18} />
            Início
          </button>
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
          >
            <RefreshCw size={18} />
            Recarregar
          </button>
        </div>
      </div>
    </div>
  )
}

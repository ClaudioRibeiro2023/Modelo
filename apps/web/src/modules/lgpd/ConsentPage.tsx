import { useState } from 'react'
import { CheckSquare, Save, Info, ToggleLeft, ToggleRight } from 'lucide-react'

interface ConsentItem {
  id: string
  title: string
  description: string
  required: boolean
  enabled: boolean
}

const INITIAL_CONSENTS: ConsentItem[] = [
  {
    id: 'essential',
    title: 'Dados Essenciais',
    description: 'Necessários para o funcionamento básico do sistema (autenticação, segurança)',
    required: true,
    enabled: true,
  },
  {
    id: 'analytics',
    title: 'Análise de Uso',
    description: 'Coleta de dados anônimos para melhoria do sistema',
    required: false,
    enabled: true,
  },
  {
    id: 'marketing',
    title: 'Comunicações de Marketing',
    description: 'Receber novidades, atualizações e ofertas por email',
    required: false,
    enabled: false,
  },
  {
    id: 'thirdparty',
    title: 'Compartilhamento com Terceiros',
    description: 'Compartilhar dados com parceiros para serviços complementares',
    required: false,
    enabled: false,
  },
  {
    id: 'profiling',
    title: 'Personalização',
    description: 'Usar dados para personalizar sua experiência no sistema',
    required: false,
    enabled: true,
  },
]

export default function ConsentPage() {
  const [consents, setConsents] = useState(INITIAL_CONSENTS)
  const [saved, setSaved] = useState(false)

  const toggleConsent = (id: string) => {
    setConsents(prev => prev.map(c => 
      c.id === id && !c.required ? { ...c, enabled: !c.enabled } : c
    ))
    setSaved(false)
  }

  const handleSave = () => {
    // API call to save consents
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckSquare size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Consentimento</h1>
              <p className="text-gray-500 dark:text-gray-400">Controle como seus dados são utilizados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
          <Info size={20} className="text-blue-500 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Você pode alterar suas preferências a qualquer momento. Algumas opções são obrigatórias 
            para o funcionamento do sistema.
          </p>
        </div>

        {/* Consent Items */}
        <div className="space-y-4">
          {consents.map(consent => (
            <div
              key={consent.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{consent.title}</h3>
                    {consent.required && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{consent.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleConsent(consent.id)}
                  disabled={consent.required}
                  className={`flex-shrink-0 ${consent.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={consent.enabled ? 'Desativar' : 'Ativar'}
                >
                  {consent.enabled ? (
                    <ToggleRight size={36} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={36} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Alterações serão aplicadas imediatamente
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save size={18} />
            {saved ? 'Salvo!' : 'Salvar Preferências'}
          </button>
        </div>

        {/* History */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Histórico de Consentimento</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="text-gray-600 dark:text-gray-400">Consentimento inicial aceito</span>
              <span className="text-gray-500">15/01/2024 10:30</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="text-gray-600 dark:text-gray-400">Marketing desativado</span>
              <span className="text-gray-500">20/02/2024 14:15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

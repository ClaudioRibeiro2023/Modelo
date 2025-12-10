import { ShieldCheck, CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw, Play } from 'lucide-react'
import { Button } from '@template/design-system'

type CheckStatus = 'passed' | 'warning' | 'failed' | 'pending'

interface QualityCheck {
  id: string
  name: string
  description: string
  schedule: string
  lastRun?: string
  status: CheckStatus
  affectedRecords?: number
  duration?: string
}

// Mock quality checks
const MOCK_CHECKS: QualityCheck[] = [
  { id: '1', name: 'Duplicatas de Email', description: 'Verifica emails duplicados na tabela de usuários', schedule: 'Diário 00:00', lastRun: '2024-03-12T00:00:00', status: 'passed', affectedRecords: 0, duration: '2.3s' },
  { id: '2', name: 'Integridade Referencial', description: 'Valida FKs entre tabelas principais', schedule: 'Diário 01:00', lastRun: '2024-03-12T01:00:00', status: 'passed', affectedRecords: 0, duration: '15.8s' },
  { id: '3', name: 'Campos Obrigatórios', description: 'Verifica preenchimento de campos NOT NULL', schedule: 'A cada 6h', lastRun: '2024-03-12T12:00:00', status: 'warning', affectedRecords: 45, duration: '5.1s' },
  { id: '4', name: 'Formato de CPF/CNPJ', description: 'Valida formato de documentos', schedule: 'Semanal', lastRun: '2024-03-10T00:00:00', status: 'failed', affectedRecords: 230, duration: '8.2s' },
  { id: '5', name: 'Dados Desatualizados', description: 'Identifica registros sem atualização há 90+ dias', schedule: 'Semanal', lastRun: '2024-03-10T00:00:00', status: 'warning', affectedRecords: 1500, duration: '12.0s' },
  { id: '6', name: 'Consistência de Datas', description: 'Verifica datas futuras indevidas', schedule: 'Diário 02:00', status: 'pending' },
]

const STATUS_CONFIG: Record<CheckStatus, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  passed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Aprovado' },
  warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Atenção' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Falhou' },
  pending: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-700/50', label: 'Pendente' },
}

export default function DataQualityPage() {
  const passed = MOCK_CHECKS.filter(c => c.status === 'passed').length
  const warnings = MOCK_CHECKS.filter(c => c.status === 'warning').length
  const failed = MOCK_CHECKS.filter(c => c.status === 'failed').length

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Header */}
      <div className="bg-surface-elevated border-b border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-accent/20 text-brand-primary">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Qualidade de Dados</h1>
                <p className="text-text-secondary">Checks recorrentes e painéis de qualidade</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" leftIcon={<RefreshCw size={18} />}>
                Atualizar
              </Button>
              <Button variant="primary" leftIcon={<Play size={18} />}>
                Executar Todos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-elevated rounded-lg border border-border-default p-4 text-center">
            <div className="text-2xl font-bold text-text-primary">{MOCK_CHECKS.length}</div>
            <div className="text-sm text-text-secondary">Total de Checks</div>
          </div>
          <div className="status-card status-card--success p-4 text-center">
            <div className="text-2xl font-bold text-color-success">{passed}</div>
            <div className="text-sm text-color-success">Aprovados</div>
          </div>
          <div className="status-card status-card--warning p-4 text-center">
            <div className="text-2xl font-bold text-color-warning">{warnings}</div>
            <div className="text-sm text-color-warning">Alertas</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{failed}</div>
            <div className="text-sm text-red-600">Falhas</div>
          </div>
        </div>

        {/* Checks List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Check</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Agendamento</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Última Execução</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Afetados</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CHECKS.map(check => {
                const config = STATUS_CONFIG[check.status]
                const StatusIcon = config.icon
                return (
                  <tr key={check.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{check.name}</div>
                      <div className="text-sm text-gray-500">{check.description}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{check.schedule}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {check.lastRun ? (
                        <div>
                          <div>{new Date(check.lastRun).toLocaleDateString('pt-BR')}</div>
                          <div className="text-xs text-gray-400">{check.duration}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Nunca</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon size={12} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {check.affectedRecords !== undefined ? (
                        <span className={check.affectedRecords > 0 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
                          {check.affectedRecords.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Play size={14} />
                        Executar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ShieldCheck, FileText, CheckSquare, User, Cookie } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Política de Privacidade',
    description: 'Termos e condições de uso dos dados',
    icon: FileText,
    path: '/lgpd',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Consentimento',
    description: 'Gerenciar suas permissões de dados',
    icon: CheckSquare,
    path: '/lgpd/consentimento',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    title: 'Meus Dados',
    description: 'Exportar ou excluir seus dados pessoais',
    icon: User,
    path: '/lgpd/meus-dados',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    title: 'Cookies',
    description: 'Preferências de cookies e rastreamento',
    icon: Cookie,
    path: '/lgpd/cookies',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
]

export default function LGPDPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">LGPD & Privacidade</h1>
              <p className="text-gray-500 dark:text-gray-400">Proteção de dados pessoais</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {SECTIONS.map(section => {
            const Icon = section.icon
            return (
              <Link
                key={section.path}
                to={section.path}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-primary/50 transition-all text-center"
              >
                <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">{section.title}</h3>
              </Link>
            )
          })}
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Política de Privacidade</h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais 
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">1. Dados Coletados</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Coletamos os seguintes tipos de dados pessoais:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-1">
              <li>Dados de identificação (nome, email, CPF)</li>
              <li>Dados de contato (telefone, endereço)</li>
              <li>Dados de acesso (logs, IP, navegador)</li>
              <li>Dados de uso (funcionalidades utilizadas, preferências)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">2. Finalidade do Tratamento</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Seus dados são tratados para as seguintes finalidades:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-1">
              <li>Prestação dos serviços contratados</li>
              <li>Autenticação e segurança</li>
              <li>Comunicações sobre o serviço</li>
              <li>Cumprimento de obrigações legais</li>
              <li>Melhoria contínua do sistema</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">3. Base Legal</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              O tratamento de dados é realizado com base no consentimento do titular, execução de contrato, 
              cumprimento de obrigação legal e legítimo interesse, conforme aplicável.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">4. Seus Direitos</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Conforme a LGPD, você tem direito a:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-1">
              <li>Confirmação da existência de tratamento</li>
              <li>Acesso aos dados</li>
              <li>Correção de dados incompletos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação</li>
              <li>Portabilidade dos dados</li>
              <li>Revogação do consentimento</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">5. Contato do Encarregado (DPO)</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados, 
              entre em contato com nosso Encarregado de Proteção de Dados:
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Email: dpo@empresa.com.br</p>
              <p className="text-gray-600 dark:text-gray-400">Telefone: (65) 3333-0000</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

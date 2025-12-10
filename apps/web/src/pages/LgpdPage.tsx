import { Shield, Lock, Eye, FileText, AlertCircle } from 'lucide-react'

export function LgpdPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
          <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LGPD</h1>
          <p className="text-gray-500 dark:text-gray-400">Lei Geral de Proteção de Dados</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-300">Conformidade com a LGPD</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Este sistema está em conformidade com a Lei nº 13.709/2018 (LGPD) e implementa 
                medidas técnicas e organizacionais para proteção de dados pessoais.
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Princípios Aplicados</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Lock, title: 'Segurança', desc: 'Dados protegidos com criptografia e controle de acesso' },
              { icon: Eye, title: 'Transparência', desc: 'Informações claras sobre coleta e uso de dados' },
              { icon: FileText, title: 'Finalidade', desc: 'Dados coletados apenas para fins específicos' },
              { icon: Shield, title: 'Minimização', desc: 'Coleta apenas dos dados estritamente necessários' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <item.icon className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rights */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seus Direitos</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Como titular de dados pessoais, você tem direito a:
          </p>
          <ul className="space-y-3">
            {[
              'Confirmação da existência de tratamento de dados',
              'Acesso aos seus dados pessoais',
              'Correção de dados incompletos, inexatos ou desatualizados',
              'Anonimização, bloqueio ou eliminação de dados desnecessários',
              'Portabilidade dos dados a outro fornecedor',
              'Eliminação dos dados tratados com consentimento',
              'Informação sobre compartilhamento de dados',
              'Revogação do consentimento',
            ].map((right, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                {right}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Encarregado de Dados (DPO)</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados pessoais, 
            entre em contato com nosso Encarregado de Dados:
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="font-medium text-gray-900 dark:text-white">Email: dpo@template.com</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Responderemos sua solicitação em até 15 dias úteis.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Política de Cookies</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Este sistema utiliza cookies estritamente necessários para seu funcionamento, 
            incluindo cookies de sessão para autenticação e preferências do usuário. 
            Não utilizamos cookies de rastreamento ou publicidade.
          </p>
        </section>
      </div>
    </div>
  )
}

export default LgpdPage

import { useState } from 'react'
import { Users, Plus, Search, MoreVertical, Shield, Mail, Calendar } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  roles: string[]
  status: 'active' | 'inactive'
  lastLogin: string
}

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@template.com', roles: ['ADMIN'], status: 'active', lastLogin: '2025-12-08' },
  { id: '2', name: 'Gestor Silva', email: 'gestor@template.com', roles: ['GESTOR'], status: 'active', lastLogin: '2025-12-07' },
  { id: '3', name: 'Operador Santos', email: 'operador@template.com', roles: ['OPERADOR'], status: 'active', lastLogin: '2025-12-06' },
  { id: '4', name: 'Viewer Costa', email: 'viewer@template.com', roles: ['VIEWER'], status: 'inactive', lastLogin: '2025-11-20' },
]

const roleColors: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  GESTOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  OPERADOR: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  VIEWER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
}

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [users] = useState<User[]>(mockUsers)

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
            <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usuários</h1>
            <p className="text-gray-500 dark:text-gray-400">Gerencie usuários e permissões</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Último Acesso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                      <span className="text-teal-600 dark:text-teal-400 font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <span
                        key={role}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[role]}`}
                      >
                        <Shield className="w-3 h-3" />
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Mais opções"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total', value: users.length, color: 'bg-gray-100 dark:bg-gray-800' },
          { label: 'Ativos', value: users.filter(u => u.status === 'active').length, color: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Admins', value: users.filter(u => u.roles.includes('ADMIN')).length, color: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Gestores', value: users.filter(u => u.roles.includes('GESTOR')).length, color: 'bg-blue-50 dark:bg-blue-900/20' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-4`}>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UsersPage

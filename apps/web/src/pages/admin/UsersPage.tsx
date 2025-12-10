import { useState } from 'react'
import { Users, Plus, Search, MoreVertical, Shield, Mail, Calendar } from 'lucide-react'
import { Button } from '@template/design-system'

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
  ADMIN: 'bg-color-error/10 text-color-error',
  GESTOR: 'bg-color-info/10 text-color-info',
  OPERADOR: 'bg-color-success/10 text-color-success',
  VIEWER: 'bg-surface-muted text-text-muted',
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
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Usuários</h1>
            <p className="text-text-secondary">Gerencie usuários e permissões</p>
          </div>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Novo Usuário
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="bg-surface-elevated rounded-xl shadow-sm border border-border-default overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Último Acesso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-surface-muted transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <span className="text-brand-primary font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{user.name}</p>
                      <p className="text-sm text-text-secondary flex items-center gap-1">
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
                      ? 'bg-color-success/10 text-color-success'
                      : 'bg-surface-muted text-text-muted'
                  }`}>
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    className="p-2 hover:bg-surface-muted rounded-lg transition-colors"
                    title="Mais opções"
                  >
                    <MoreVertical className="w-4 h-4 text-text-muted" />
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
          { label: 'Total', value: users.length, color: 'bg-surface-muted' },
          { label: 'Ativos', value: users.filter(u => u.status === 'active').length, color: 'bg-color-success/10' },
          { label: 'Admins', value: users.filter(u => u.roles.includes('ADMIN')).length, color: 'bg-color-error/10' },
          { label: 'Gestores', value: users.filter(u => u.roles.includes('GESTOR')).length, color: 'bg-color-info/10' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-4`}>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UsersPage

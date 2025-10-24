import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Plus,
  Filter,
  Download,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  UserPlus,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  Shield
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'

interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  phone?: string
  location?: string
  joinDate: string
  lastLogin?: string
  projects: number
  certifications: number
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const users: User[] = [
    {
      id: '1',
      name: 'Ana Costa',
      email: 'ana.costa@sms-sm.health',
      department: 'Enfermagem',
      role: 'Enfermeira Chefe',
      status: 'active',
      phone: '+55 (11) 98765-4321',
      location: 'São Paulo, SP',
      joinDate: '2023-01-15',
      lastLogin: '2025-01-15 14:30',
      projects: 8,
      certifications: 12
    },
    {
      id: '2',
      name: 'Dr. João Silva',
      email: 'joao.silva@sms-sm.health',
      department: 'Medicina',
      role: 'Médico Cardiologista',
      status: 'active',
      phone: '+55 (11) 97654-3210',
      location: 'São Paulo, SP',
      joinDate: '2022-08-20',
      lastLogin: '2025-01-15 16:15',
      projects: 12,
      certifications: 18
    },
    {
      id: '3',
      name: 'Carlos Lima',
      email: 'carlos.lima@sms-sm.health',
      department: 'TI',
      role: 'Desenvolvedor Senior',
      status: 'active',
      phone: '+55 (11) 96543-2109',
      location: 'São Paulo, SP',
      joinDate: '2023-03-10',
      lastLogin: '2025-01-15 17:45',
      projects: 15,
      certifications: 8
    },
    {
      id: '4',
      name: 'Maria Santos',
      email: 'maria.santos@sms-sm.health',
      department: 'Administração',
      role: 'Gerente Administrativo',
      status: 'active',
      phone: '+55 (11) 95432-1098',
      location: 'São Paulo, SP',
      joinDate: '2021-11-05',
      lastLogin: '2025-01-15 13:20',
      projects: 6,
      certifications: 10
    },
    {
      id: '5',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@sms-sm.health',
      department: 'Enfermagem',
      role: 'Enfermeiro',
      status: 'pending',
      phone: '+55 (11) 94321-0987',
      location: 'São Paulo, SP',
      joinDate: '2025-01-10',
      projects: 0,
      certifications: 3
    }
  ]

  const departments = ['Enfermagem', 'Medicina', 'Administração', 'TI', 'Farmácia', 'Laboratório']
  const roles = ['Enfermeira Chefe', 'Médico', 'Administrador', 'Desenvolvedor', 'Farmacêutico', 'Técnico']

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inativo</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>
    }
  }

  const statsCards = [
    { title: 'Total de Usuários', value: users.length.toString(), icon: Users, color: 'bg-blue-500' },
    { title: 'Usuários Ativos', value: users.filter(u => u.status === 'active').length.toString(), icon: Shield, color: 'bg-green-500' },
    { title: 'Pendentes', value: users.filter(u => u.status === 'pending').length.toString(), icon: UserPlus, color: 'bg-yellow-500' },
    { title: 'Departamentos', value: departments.length.toString(), icon: Building, color: 'bg-purple-500' }
  ]

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <p className="text-gray-600 mt-1">
            Gerencie usuários, permissões e acesso ao sistema
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Todos os Departamentos</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </select>
              
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Mais Filtros
              </Button>
            </div>
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedUsers.length} usuário(s) selecionado(s)
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Enviar Email</Button>
                <Button size="sm" variant="outline">Alterar Status</Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                  Desativar
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento/Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atividade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar name={user.name} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.department}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                      {user.location && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {user.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4 text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>{user.projects} projetos</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-blue-500 mr-1" />
                          <span>{user.certifications} cert.</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum usuário encontrado</p>
              <p className="text-gray-400">Tente ajustar os filtros ou busca</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Novo Usuário</h2>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                ×
              </Button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="usuario@sms-sm.health"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione o departamento</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione o cargo</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+55 (11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cidade, Estado"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <input
                  type="checkbox"
                  id="sendWelcome"
                  className="rounded border-gray-300"
                />
                <label htmlFor="sendWelcome" className="text-sm text-gray-700">
                  Enviar email de boas-vindas com instruções de acesso
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button>
                  Criar Usuário
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default UserManagement
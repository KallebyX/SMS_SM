import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FolderKanban,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  Target,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Progress } from '../components/ui/Progress'

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid')

  const projects = [
    {
      id: 1,
      title: 'Implementação ANVISA 2024',
      description: 'Adequação aos novos protocolos da ANVISA para estabelecimentos de saúde',
      status: 'in-progress',
      priority: 'high',
      progress: 65,
      startDate: '2025-09-01',
      endDate: '2025-12-15',
      team: [
        { id: 1, name: 'Dr. Maria Silva', avatar: '/avatars/maria.jpg', role: 'Project Manager' },
        { id: 2, name: 'Ana Costa', avatar: '/avatars/ana.jpg', role: 'Compliance Officer' },
        { id: 3, name: 'João Santos', avatar: '/avatars/joao.jpg', role: 'Developer' }
      ],
      tasks: {
        total: 24,
        completed: 16,
        pending: 8
      },
      category: 'compliance',
      budget: 150000,
      spent: 97500
    },
    {
      id: 2,
      title: 'Sistema de Telemedicina',
      description: 'Desenvolvimento de plataforma para consultas remotas',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      startDate: '2025-10-15',
      endDate: '2026-03-30',
      team: [
        { id: 4, name: 'Dr. Pedro Lima', avatar: '/avatars/pedro.jpg', role: 'Tech Lead' },
        { id: 5, name: 'Sofia Oliveira', avatar: '/avatars/sofia.jpg', role: 'UX Designer' }
      ],
      tasks: {
        total: 45,
        completed: 7,
        pending: 38
      },
      category: 'technology',
      budget: 300000,
      spent: 45000
    },
    {
      id: 3,
      title: 'Treinamento Segurança',
      description: 'Programa abrangente de treinamento em segurança do paciente',
      status: 'completed',
      priority: 'high',
      progress: 100,
      startDate: '2025-06-01',
      endDate: '2025-09-30',
      team: [
        { id: 1, name: 'Dr. Maria Silva', avatar: '/avatars/maria.jpg', role: 'Lead Trainer' },
        { id: 6, name: 'Carlos Santos', avatar: '/avatars/carlos.jpg', role: 'Content Creator' }
      ],
      tasks: {
        total: 18,
        completed: 18,
        pending: 0
      },
      category: 'training',
      budget: 80000,
      spent: 75000
    },
    {
      id: 4,
      title: 'Modernização Infraestrutura',
      description: 'Atualização da infraestrutura de TI do hospital',
      status: 'on-hold',
      priority: 'low',
      progress: 30,
      startDate: '2025-08-01',
      endDate: '2025-11-30',
      team: [
        { id: 3, name: 'João Santos', avatar: '/avatars/joao.jpg', role: 'Infrastructure Manager' }
      ],
      tasks: {
        total: 32,
        completed: 10,
        pending: 22
      },
      category: 'infrastructure',
      budget: 200000,
      spent: 60000
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'on-hold': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Clock className="w-4 h-4" />
      case 'in-progress': return <AlertCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'on-hold': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-maternar-green-600'
      default: return 'text-gray-600'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === 'all' || project.status === activeTab
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on-hold').length
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie e acompanhe todos os projetos da organização
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-maternar-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-maternar-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-maternar-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pausados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.onHold}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 md:mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maternar-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'planning', label: 'Planejamento' },
                { id: 'in-progress', label: 'Em Andamento' },
                { id: 'completed', label: 'Concluídos' },
                { id: 'on-hold', label: 'Pausados' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-maternar-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                Kanban
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                    </Badge>
                    <Star className={`w-4 h-4 ${getPriorityColor(project.priority)}`} />
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progresso</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    <span>{project.tasks.completed}/{project.tasks.total} tarefas</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member) => (
                      <Avatar
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        fallback={member.name}
                        size="sm"
                        className="border-2 border-white"
                      />
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Orçamento</p>
                    <p className="text-sm font-medium text-gray-900">
                      R$ {(project.spent / 1000).toFixed(0)}k / {(project.budget / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { id: 'planning', title: 'Planejamento', color: 'bg-blue-100' },
            { id: 'in-progress', title: 'Em Andamento', color: 'bg-yellow-100' },
            { id: 'completed', title: 'Concluídos', color: 'bg-green-100' },
            { id: 'on-hold', title: 'Pausados', color: 'bg-gray-100' }
          ].map((column) => (
            <div key={column.id} className="space-y-4">
              <div className={`p-4 rounded-lg ${column.color}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{column.title}</h3>
                <p className="text-sm text-gray-600">
                  {filteredProjects.filter(p => p.status === column.id).length} projetos
                </p>
              </div>
              
              <div className="space-y-3">
                {filteredProjects
                  .filter(project => project.status === column.id)
                  .map((project) => (
                    <Card key={project.id} className="p-4 cursor-pointer hover:shadow-md">
                      <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 2).map((member) => (
                            <Avatar
                              key={member.id}
                              src={member.avatar}
                              alt={member.name}
                              fallback={member.name}
                              size="xs"
                              className="border-2 border-white"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {project.progress}%
                        </span>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects
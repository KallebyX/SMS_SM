import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  Plus,
  Search,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useProjects } from '../hooks/useProjects'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const Projects: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { projects, loading } = useProjects()

  // Mapear status do backend para display
  const statusMap: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    'PLANNING': { label: 'Planejamento', color: 'bg-blue-100 text-blue-800', icon: Clock },
    'ACTIVE': { label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    'ON_HOLD': { label: 'Em Espera', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    'COMPLETED': { label: 'Concluído', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'CANCELLED': { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle }
  }

  // Mapear prioridade para cor
  const priorityMap: Record<string, { label: string; color: string }> = {
    'URGENT': { label: 'Urgente', color: 'text-red-600' },
    'HIGH': { label: 'Alta', color: 'text-orange-600' },
    'MEDIUM': { label: 'Média', color: 'text-yellow-600' },
    'LOW': { label: 'Baixa', color: 'text-green-600' }
  }

  // Filtrar projetos
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesTab = activeTab === 'all' || project.status === activeTab
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesTab && matchesSearch
    })
  }, [projects, activeTab, searchTerm])

  // Calcular estatísticas
  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    onHold: projects.filter(p => p.status === 'ON_HOLD').length
  }), [projects])

  // Calcular progresso do projeto baseado nas tarefas
  const getProjectProgress = (project: any) => {
    if (!project.tasks || project.tasks.length === 0) return 0
    const completed = project.tasks.filter((t: any) => t.status === 'DONE').length
    return Math.round((completed / project.tasks.length) * 100)
  }

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
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
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 bg-gradient-to-r from-maternar-blue-500 to-maternar-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total de Projetos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FolderKanban className="w-8 h-8 text-blue-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Em Andamento</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Concluídos</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100">Em Espera</p>
                <p className="text-2xl font-bold">{stats.onHold}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-200" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'PLANNING', label: 'Planejamento' },
            { id: 'ACTIVE', label: 'Em Andamento' },
            { id: 'COMPLETED', label: 'Concluídos' },
            { id: 'ON_HOLD', label: 'Em Espera' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-maternar-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maternar-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar projetos"
          />
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-maternar-blue-600" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProjects.length === 0 && (
        <Card className="p-12 text-center">
          <FolderKanban className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? 'Tente ajustar sua busca ou filtros'
              : 'Novos projetos serão adicionados em breve'}
          </p>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => {
          const status = statusMap[project.status] || statusMap['PLANNING']
          const priority = priorityMap[project.priority] || priorityMap['MEDIUM']
          const progress = getProjectProgress(project)
          const StatusIcon = status.icon
          const totalTasks = project.tasks?.length || 0
          const completedTasks = project.tasks?.filter((t: any) => t.status === 'DONE').length || 0
          const teamSize = project.members?.length || 0

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-6 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={status.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                    {project.priority && (
                      <span className={`text-xs font-semibold ${priority.color}`}>
                        {priority.label}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                  {project.description || 'Sem descrição'}
                </p>

                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progresso</span>
                      <span>{completedTasks}/{totalTasks} tarefas</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center text-xs text-gray-500 space-x-4 border-t border-gray-100 pt-4">
                  {project.startDate && project.dueDate && (
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(project.dueDate), 'dd/MM/yy', { locale: ptBR })}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {teamSize} {teamSize === 1 ? 'membro' : 'membros'}
                  </span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Projects

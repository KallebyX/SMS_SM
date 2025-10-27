import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Users,
  Calendar,
  Target,
  CheckCircle,
  Clock,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  BarChart3
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Progress } from '../components/ui/Progress'
import { useToast } from '../components/ui/Toast'

const ProjectDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock project data
  const project = {
    id: id || '1',
    title: 'Implementação do Protocolo de Sepse',
    description: 'Projeto para implementar o novo protocolo de identificação e tratamento de sepse em todas as unidades',
    status: 'ACTIVE',
    priority: 'HIGH',
    progress: 65,
    startDate: '2025-09-01',
    dueDate: '2025-12-15',
    budget: 150000,
    spent: 97500,
    team: [
      { id: '1', name: 'Dr. Maria Silva', role: 'OWNER', avatar: 'MS', email: 'maria@maternarsm.com.br' },
      { id: '2', name: 'João Santos', role: 'MEMBER', avatar: 'JS', email: 'joao@maternarsm.com.br' },
      { id: '3', name: 'Ana Costa', role: 'MEMBER', avatar: 'AC', email: 'ana@maternarsm.com.br' }
    ],
    tasks: [
      {
        id: '1',
        title: 'Revisar literatura sobre sepse',
        description: 'Fazer levantamento bibliográfico',
        status: 'DONE',
        priority: 'HIGH',
        assignee: 'João Santos',
        dueDate: '2025-11-01'
      },
      {
        id: '2',
        title: 'Definir critérios de diagnóstico',
        description: 'Estabelecer critérios claros',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignee: 'Dr. Maria Silva',
        dueDate: '2025-11-10'
      },
      {
        id: '3',
        title: 'Treinar equipe médica',
        description: 'Conduzir treinamento',
        status: 'TODO',
        priority: 'MEDIUM',
        assignee: 'Ana Costa',
        dueDate: '2025-11-20'
      }
    ]
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      TODO: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      REVIEW: 'bg-purple-100 text-purple-800',
      DONE: 'bg-green-100 text-green-800'
    }
    const labels = {
      TODO: 'A Fazer',
      IN_PROGRESS: 'Em Progresso',
      REVIEW: 'Revisão',
      DONE: 'Concluído'
    }
    return { style: styles[status as keyof typeof styles], label: labels[status as keyof typeof labels] }
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800'
    }
    return styles[priority as keyof typeof styles]
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/projects')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Projetos
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
            
            <div className="flex items-center space-x-3 mt-4">
              <Badge className={getPriorityBadge(project.priority)}>
                Prioridade: {project.priority}
              </Badge>
              <Badge className="bg-maternar-blue-100 text-maternar-blue-800">
                {project.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {project.startDate} - {project.dueDate}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Task
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Progress and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6">
          <p className="text-sm text-gray-600">Progresso Geral</p>
          <p className="text-3xl font-bold text-maternar-blue-600 mt-2">{project.progress}%</p>
          <Progress value={project.progress} className="mt-3" />
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600">Tasks Concluídas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {project.tasks.filter(t => t.status === 'DONE').length}/{project.tasks.length}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600">Membros da Equipe</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{project.team.length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600">Orçamento Utilizado</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {((project.spent / project.budget) * 100).toFixed(0)}%
          </p>
          <Progress value={(project.spent / project.budget) * 100} className="mt-3" />
        </Card>
      </motion.div>

      {/* Tabs */}
      <Card className="p-1">
        <nav className="flex space-x-1">
          {['overview', 'tasks', 'team', 'timeline'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-maternar-blue-100 text-maternar-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </Card>

      {/* Kanban Board */}
      {activeTab === 'tasks' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => (
            <Card key={status} className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                {getStatusBadge(status).label}
              </h3>
              <div className="space-y-3">
                {project.tasks
                  .filter(task => task.status === status)
                  .map(task => (
                    <Card key={task.id} className="p-4 bg-gray-50 hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityBadge(task.priority)} size="sm">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{task.dueDate}</span>
                      </div>
                    </Card>
                  ))}
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Membros da Equipe</h3>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Membro
              </Button>
            </div>

            <div className="space-y-3">
              {project.team.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar name={member.name} size="md" />
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge>{member.role}</Badge>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h3>
              <p className="text-gray-700">{project.description}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks Recentes</h3>
              <div className="space-y-3">
                {project.tasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{task.assignee}</p>
                    </div>
                    <Badge className={getStatusBadge(task.status).style}>
                      {getStatusBadge(task.status).label}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipe</h3>
              <div className="space-y-3">
                {project.team.map(member => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Avatar name={member.name} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orçamento</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">R$ {project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gasto</span>
                  <span className="font-semibold text-orange-600">R$ {project.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Restante</span>
                  <span className="font-semibold text-green-600">
                    R$ {(project.budget - project.spent).toLocaleString()}
                  </span>
                </div>
                <Progress value={(project.spent / project.budget) * 100} className="mt-2" />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail


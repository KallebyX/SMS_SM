import React from 'react'
import { motion } from 'framer-motion'
import { Clock, User, Calendar, CheckCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'

interface ActivityItem {
  id: string
  type: 'project' | 'training' | 'meeting' | 'task'
  title: string
  description: string
  user: string
  timestamp: string
  status?: 'completed' | 'in-progress' | 'pending'
}

export const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'project',
      title: 'Projeto UTI Digital',
      description: 'Marcos Silva atualizou o status para "Em Revisão"',
      user: 'Marcos Silva',
      timestamp: '5 min atrás',
      status: 'in-progress'
    },
    {
      id: '2',
      type: 'training',
      title: 'Curso de Segurança do Paciente',
      description: 'Ana Costa completou o módulo 3',
      user: 'Ana Costa',
      timestamp: '12 min atrás',
      status: 'completed'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Reunião Semanal',
      description: 'Reunião da equipe de enfermagem agendada para amanhã',
      user: 'Dr. João Santos',
      timestamp: '1 hora atrás',
      status: 'pending'
    },
    {
      id: '4',
      type: 'task',
      title: 'Relatório Mensal',
      description: 'Maria Santos finalizou o relatório de qualidade',
      user: 'Maria Santos',
      timestamp: '2 horas atrás',
      status: 'completed'
    },
    {
      id: '5',
      type: 'project',
      title: 'Sistema de Prontuários',
      description: 'Novo membro adicionado à equipe',
      user: 'Carlos Lima',
      timestamp: '3 horas atrás',
      status: 'in-progress'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'training':
        return <User className="w-5 h-5 text-green-500" />
      case 'meeting':
        return <Calendar className="w-5 h-5 text-purple-500" />
      case 'task':
        return <Clock className="w-5 h-5 text-orange-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Atividade Recente</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Ver todas
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                {activity.status && getStatusBadge(activity.status)}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              
              <div className="flex items-center mt-2 space-x-2">
                <Avatar name={activity.user} size="sm" />
                <span className="text-xs text-gray-500">
                  {activity.user} • {activity.timestamp}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
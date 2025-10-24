import React from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  BarChart3,
  UserPlus,
  Clock
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  action: () => void
}

export const QuickActions: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Novo Projeto',
      description: 'Criar um novo projeto',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => console.log('Novo projeto')
    },
    {
      id: '2',
      title: 'Agendar Reunião',
      description: 'Agendar nova reunião',
      icon: Calendar,
      color: 'bg-green-500',
      action: () => console.log('Agendar reunião')
    },
    {
      id: '3',
      title: 'Convidar Usuário',
      description: 'Adicionar novo membro',
      icon: UserPlus,
      color: 'bg-purple-500',
      action: () => console.log('Convidar usuário')
    },
    {
      id: '4',
      title: 'Relatório',
      description: 'Gerar relatório',
      icon: BarChart3,
      color: 'bg-orange-500',
      action: () => console.log('Gerar relatório')
    },
    {
      id: '5',
      title: 'Nova Política',
      description: 'Criar nova política',
      icon: FileText,
      color: 'bg-red-500',
      action: () => console.log('Nova política')
    },
    {
      id: '6',
      title: 'Configurações',
      description: 'Acessar configurações',
      icon: Settings,
      color: 'bg-gray-500',
      action: () => console.log('Configurações')
    }
  ]

  const recentTasks = [
    {
      title: 'Revisar Protocolo de Segurança',
      dueDate: 'Hoje',
      priority: 'alta'
    },
    {
      title: 'Atualizar Manual de Enfermagem',
      dueDate: 'Amanhã',
      priority: 'média'
    },
    {
      title: 'Reunião com Equipe de TI',
      dueDate: '2 dias',
      priority: 'baixa'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'text-red-600 bg-red-100'
      case 'média':
        return 'text-yellow-600 bg-yellow-100'
      case 'baixa':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
                onClick={action.action}
              >
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent Tasks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Tarefas Pendentes</h3>
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Ver Todas
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentTasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-gray-600">Prazo: {task.dueDate}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <Button size="sm" variant="outline">
                  Ver
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
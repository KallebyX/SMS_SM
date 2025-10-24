import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

export const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Política Expirando',
      message: 'A política de segurança do paciente expira em 5 dias',
      timestamp: '10 min atrás',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'success',
      title: 'Projeto Concluído',
      message: 'O projeto "Modernização UTI" foi finalizado com sucesso',
      timestamp: '1 hora atrás',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'info',
      title: 'Nova Atualização',
      message: 'Sistema atualizado para versão 2.1.0',
      timestamp: '2 horas atrás',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Treinamento Pendente',
      message: '15 funcionários ainda não completaram o treinamento obrigatório',
      timestamp: '3 horas atrás',
      read: false,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'error',
      title: 'Falha no Backup',
      message: 'Backup automático falhou. Verificação necessária.',
      timestamp: '5 horas atrás',
      read: false,
      priority: 'high'
    }
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>
      default:
        return null
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="w-6 h-6 text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-900">Notificações</h3>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
          )}
        </div>
        
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                notification.read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </p>
                      {getPriorityBadge(notification.priority)}
                    </div>
                    
                    <p className={`text-sm ${
                      notification.read ? 'text-gray-600' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center mt-2 space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {notification.timestamp}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeNotification(notification.id)
                  }}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            Ver Todas as Notificações
          </Button>
        </div>
      )}
    </Card>
  )
}
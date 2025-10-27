import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Search,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  ChevronLeft,
  ChevronRight,
  Bell,
  Edit,
  Trash2
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { CreateEventModal } from '../components/modals/CreateEventModal'

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const events = [
    {
      id: 1,
      title: 'Reunião Equipe UTI',
      description: 'Discussão sobre novos protocolos',
      start: new Date(2025, 9, 8, 9, 0),
      end: new Date(2025, 9, 8, 10, 0),
      type: 'meeting',
      location: 'Sala de Reuniões 1',
      attendees: ['Dr. Maria Silva', 'Ana Costa', 'João Santos'],
      priority: 'high',
      color: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Treinamento ANVISA',
      description: 'Atualização sobre novas regulamentações',
      start: new Date(2025, 9, 8, 14, 0),
      end: new Date(2025, 9, 8, 16, 0),
      type: 'training',
      location: 'Auditório Principal',
      attendees: ['Equipe Completa'],
      priority: 'medium',
      color: 'bg-maternar-blue-500'
    },
    {
      id: 3,
      title: 'Consulta Dr. Pedro',
      description: 'Consulta neurológica',
      start: new Date(2025, 9, 9, 10, 30),
      end: new Date(2025, 9, 9, 11, 30),
      type: 'appointment',
      location: 'Consultório 15',
      attendees: ['Dr. Pedro Lima', 'Paciente'],
      priority: 'high',
      color: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Revisão de Políticas',
      description: 'Revisão mensal das políticas internas',
      start: new Date(2025, 9, 10, 15, 0),
      end: new Date(2025, 9, 10, 17, 0),
      type: 'review',
      location: 'Online',
      attendees: ['Gerência', 'Coordenadores'],
      priority: 'medium',
      color: 'bg-purple-500'
    }
  ]

  const upcomingEvents = events
    .filter(event => event.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5)

  const todayEvents = events.filter(event => {
    const today = new Date()
    const eventDate = event.start
    return eventDate.toDateString() === today.toDateString()
  })

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />
      case 'training': return <CalendarIcon className="w-4 h-4" />
      case 'appointment': return <Clock className="w-4 h-4" />
      case 'review': return <Edit className="w-4 h-4" />
      default: return <CalendarIcon className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus compromissos e eventos
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-maternar-blue-600" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{todayEvents.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-maternar-blue-600" />
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
                <p className="text-sm text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
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
                <p className="text-sm text-gray-600">Reuniões</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-maternar-pink-600" />
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
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {formatDate(currentDate)}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {(['month', 'week', 'day'] as const).map((viewType) => (
                  <Button
                    key={viewType}
                    variant={view === viewType ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setView(viewType)}
                  >
                    {viewType === 'month' ? 'Mês' : viewType === 'week' ? 'Semana' : 'Dia'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(2025, 9, i - 6) // Adjust for October 2025
                const isToday = date.toDateString() === new Date().toDateString()
                const hasEvent = events.some(event => 
                  event.start.toDateString() === date.toDateString()
                )
                
                return (
                  <div
                    key={i}
                    className={`p-2 h-20 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      isToday ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className={`text-sm ${
                      isToday ? 'font-bold text-maternar-blue-600' : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </div>
                    {hasEvent && (
                      <div className="mt-1">
                        <div className="w-2 h-2 bg-maternar-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Eventos de Hoje
              </h3>
              {todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${event.color} mt-2`}></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatTime(event.start)} - {formatTime(event.end)}
                        </p>
                        <div className="flex items-center mt-2">
                          <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-600">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  Nenhum evento agendado para hoje
                </p>
              )}
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Próximos Eventos
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {event.start.toLocaleDateString('pt-BR')} às {formatTime(event.start)}
                      </p>
                    </div>
                    <Badge className={getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Reunião
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Videochamada
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Definir Lembrete
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        selectedDate={selectedDate}
        onSuccess={(newEvent) => {
          // TODO: Add new event to calendar via GraphQL mutation
        }}
      />
    </div>
  )
}

export default Calendar
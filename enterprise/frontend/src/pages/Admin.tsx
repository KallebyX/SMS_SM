import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  HardDrive,
  Cpu,
  Wifi
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const systemStats = [
    { title: 'Uptime', value: '99.9%', status: 'success', icon: Clock },
    { title: 'CPU Usage', value: '45%', status: 'success', icon: Cpu },
    { title: 'Memory', value: '68%', status: 'warning', icon: HardDrive },
    { title: 'Network', value: '12MB/s', status: 'success', icon: Wifi }
  ]

  const recentLogs = [
    { time: '14:30', level: 'INFO', message: 'User login successful: ana.costa@sms-sm.health' },
    { time: '14:25', level: 'WARNING', message: 'High memory usage detected on server-02' },
    { time: '14:20', level: 'INFO', message: 'Database backup completed successfully' },
    { time: '14:15', level: 'ERROR', message: 'Failed to send notification to user ID: 1234' },
    { time: '14:10', level: 'INFO', message: 'New user registered: joao.silva@sms-sm.health' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-100'
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-100'
      case 'INFO':
        return 'text-maternar-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'system', label: 'Sistema', icon: Server },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ]

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
          <p className="text-gray-600 mt-1">
            Painel administrativo do sistema Maternar Enterprise
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800">
            Sistema Online
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-1">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {systemStats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    stat.status === 'success' ? 'bg-green-500' :
                    stat.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Logs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Logs Recentes</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentLogs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-500 font-mono min-w-0 flex-shrink-0">
                        {log.time}
                      </span>
                      <Badge className={`text-xs ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </Badge>
                      <p className="text-sm text-gray-700 flex-1 min-w-0">
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="w-4 h-4 mr-3" />
                    Backup do Banco de Dados
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-3" />
                    Gerenciar Usuários
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="w-4 h-4 mr-3" />
                    Verificar Segurança
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="w-4 h-4 mr-3" />
                    Monitorar Performance
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-3" />
                    Configurações Avançadas
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      )}

      {/* Other tabs content would go here */}
      {activeTab !== 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              {tabs.find(tab => tab.id === activeTab)?.icon && (() => {
                const IconComponent = tabs.find(tab => tab.id === activeTab)!.icon
                return <IconComponent className="w-8 h-8 text-gray-400" />
              })()}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">
              Esta seção está em desenvolvimento. Em breve teremos mais funcionalidades disponíveis.
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default Admin
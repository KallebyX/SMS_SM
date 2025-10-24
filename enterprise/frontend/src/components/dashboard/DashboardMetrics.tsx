import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Calendar, Target, Award } from 'lucide-react'
import { Card } from '../ui/Card'

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<any>
  color: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon: Icon, color }) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <div className="flex items-center mt-2">
          <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs. mês anterior</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
)

export const DashboardMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Usuários Ativos',
      value: '1,247',
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Projetos Ativos',
      value: '89',
      change: '+8%',
      trend: 'up' as const,
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Eventos Hoje',
      value: '24',
      change: '+15%',
      trend: 'up' as const,
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Taxa de Conclusão',
      value: '94.5%',
      change: '+3.2%',
      trend: 'up' as const,
      icon: Award,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MetricCard {...metric} />
        </motion.div>
      ))}
    </div>
  )
}
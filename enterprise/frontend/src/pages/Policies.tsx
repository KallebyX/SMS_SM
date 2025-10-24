import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Clock,
  Users,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'

const Policies: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'Todas', count: 24 },
    { id: 'safety', name: 'Segurança', count: 8 },
    { id: 'compliance', name: 'Compliance', count: 6 },
    { id: 'clinical', name: 'Clínicas', count: 7 },
    { id: 'administrative', name: 'Administrativas', count: 3 }
  ]

  const policies = [
    {
      id: 1,
      title: 'Protocolo de Segurança do Paciente',
      description: 'Diretrizes completas para garantir a segurança do paciente em todos os procedimentos',
      category: 'safety',
      version: '2.1',
      status: 'active',
      lastUpdated: '2025-09-15',
      author: 'Dr. Maria Silva',
      approver: 'Diretoria Médica',
      effectiveDate: '2025-10-01',
      nextReview: '2026-10-01',
      priority: 'high',
      downloads: 234,
      views: 1567,
      tags: ['ANVISA', 'Segurança', 'Protocolo']
    },
    {
      id: 2,
      title: 'Política de Controle de Infecção',
      description: 'Medidas preventivas e protocolos para controle de infecção hospitalar',
      category: 'safety',
      version: '3.0',
      status: 'active',
      lastUpdated: '2025-08-20',
      author: 'Ana Costa',
      approver: 'Comitê de Infecção',
      effectiveDate: '2025-09-01',
      nextReview: '2026-09-01',
      priority: 'high',
      downloads: 456,
      views: 2134,
      tags: ['Infecção', 'Prevenção', 'Higiene']
    },
    {
      id: 3,
      title: 'Regulamento LGPD - Dados de Pacientes',
      description: 'Diretrizes para tratamento e proteção de dados pessoais conforme LGPD',
      category: 'compliance',
      version: '1.5',
      status: 'review',
      lastUpdated: '2025-09-30',
      author: 'João Santos',
      approver: 'Jurídico',
      effectiveDate: '2025-11-01',
      nextReview: '2026-11-01',
      priority: 'medium',
      downloads: 123,
      views: 789,
      tags: ['LGPD', 'Privacidade', 'Dados']
    },
    {
      id: 4,
      title: 'Protocolo de Medicação Segura',
      description: 'Procedimentos para prescrição, dispensação e administração segura de medicamentos',
      category: 'clinical',
      version: '4.2',
      status: 'active',
      lastUpdated: '2025-07-10',
      author: 'Dr. Pedro Lima',
      approver: 'Farmácia Clínica',
      effectiveDate: '2025-08-01',
      nextReview: '2026-08-01',
      priority: 'high',
      downloads: 678,
      views: 3456,
      tags: ['Medicação', 'Farmácia', 'Segurança']
    },
    {
      id: 5,
      title: 'Política de Recursos Humanos',
      description: 'Diretrizes para gestão de pessoal e desenvolvimento profissional',
      category: 'administrative',
      version: '2.0',
      status: 'draft',
      lastUpdated: '2025-10-05',
      author: 'Sofia Oliveira',
      approver: 'RH',
      effectiveDate: '2025-12-01',
      nextReview: '2026-12-01',
      priority: 'medium',
      downloads: 45,
      views: 234,
      tags: ['RH', 'Pessoal', 'Desenvolvimento']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'review': return <AlertCircle className="w-4 h-4" />
      case 'draft': return <Edit className="w-4 h-4" />
      case 'archived': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const filteredPolicies = policies.filter(policy => {
    const matchesCategory = activeCategory === 'all' || policy.category === activeCategory
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    review: policies.filter(p => p.status === 'review').length,
    draft: policies.filter(p => p.status === 'draft').length
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Políticas e Procedimentos</h1>
          <p className="text-gray-600 mt-1">
            Acesse e gerencie todas as políticas organizacionais
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros Avançados
          </Button>
          <Button className="bg-maternar-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Política
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
                <FileText className="w-6 h-6 text-maternar-blue-600" />
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
                <p className="text-sm text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
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
                <p className="text-sm text-gray-600">Em Revisão</p>
                <p className="text-2xl font-bold text-gray-900">{stats.review}</p>
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
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rascunhos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Edit className="w-6 h-6 text-maternar-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 md:mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar políticas, procedimentos ou tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maternar-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-maternar-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Policies List */}
      <div className="space-y-4">
        {filteredPolicies.map((policy, index) => (
          <motion.div
            key={policy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {policy.title}
                    </h3>
                    <Badge className={getStatusColor(policy.status)}>
                      {getStatusIcon(policy.status)}
                      <span className="ml-1 capitalize">{policy.status}</span>
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(policy.priority)}`} />
                  </div>
                  
                  <p className="text-gray-600 mb-4">{policy.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Autor: {policy.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Aprovador: {policy.approver}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Versão: {policy.version}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Última Atualização</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(policy.lastUpdated).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Vigência</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(policy.effectiveDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Próxima Revisão</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(policy.nextReview).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Download className="w-4 h-4 mr-1" />
                      <span>{policy.downloads} downloads</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{policy.views} visualizações</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {policy.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} className="bg-gray-100 text-gray-700 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  <Button size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Policies
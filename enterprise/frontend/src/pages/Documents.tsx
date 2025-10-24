import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus,
  Search,
  Filter,
  FileText,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Building,
  Tag,
  Edit,
  Trash2,
  Eye,
  Share2,
  Archive
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'

interface Document {
  id: string
  title: string
  description: string
  type: 'policy' | 'procedure' | 'guideline' | 'form' | 'manual'
  category: string
  status: 'draft' | 'review' | 'approved' | 'archived'
  version: string
  author: string
  department: string
  createdDate: string
  lastModified: string
  expiryDate?: string
  fileSize: string
  downloads: number
  views: number
  tags: string[]
}

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const documents: Document[] = [
    {
      id: '1',
      title: 'Protocolo de Segurança do Paciente',
      description: 'Diretrizes abrangentes para garantir a segurança dos pacientes em todos os procedimentos médicos.',
      type: 'policy',
      category: 'Segurança',
      status: 'approved',
      version: '2.1',
      author: 'Dr. Ana Costa',
      department: 'Qualidade',
      createdDate: '2024-01-15',
      lastModified: '2024-12-20',
      expiryDate: '2025-12-31',
      fileSize: '2.4 MB',
      downloads: 342,
      views: 1250,
      tags: ['segurança', 'paciente', 'protocolo', 'obrigatório']
    },
    {
      id: '2',
      title: 'Manual de Procedimentos de Enfermagem',
      description: 'Guia completo com todos os procedimentos padrão para a equipe de enfermagem.',
      type: 'manual',
      category: 'Procedimentos',
      status: 'approved',
      version: '3.0',
      author: 'Enf. Maria Silva',
      department: 'Enfermagem',
      createdDate: '2024-02-01',
      lastModified: '2024-11-15',
      expiryDate: '2025-11-30',
      fileSize: '8.7 MB',
      downloads: 856,
      views: 2340,
      tags: ['enfermagem', 'procedimentos', 'manual', 'técnicas']
    },
    {
      id: '3',
      title: 'Política de Gestão de Dados',
      description: 'Regulamentações sobre coleta, armazenamento e uso de dados de pacientes.',
      type: 'policy',
      category: 'Tecnologia',
      status: 'review',
      version: '1.5',
      author: 'Carlos Lima',
      department: 'TI',
      createdDate: '2024-03-10',
      lastModified: '2024-12-01',
      fileSize: '1.8 MB',
      downloads: 198,
      views: 540,
      tags: ['dados', 'privacidade', 'LGPD', 'tecnologia']
    },
    {
      id: '4',
      title: 'Formulário de Avaliação de Risco',
      description: 'Documento para avaliação sistemática de riscos em procedimentos médicos.',
      type: 'form',
      category: 'Qualidade',
      status: 'approved',
      version: '1.2',
      author: 'Dr. João Santos',
      department: 'Qualidade',
      createdDate: '2024-01-20',
      lastModified: '2024-10-05',
      fileSize: '450 KB',
      downloads: 623,
      views: 1890,
      tags: ['avaliação', 'risco', 'formulário', 'qualidade']
    },
    {
      id: '5',
      title: 'Diretriz de Controle de Infecção',
      description: 'Protocolos para prevenção e controle de infecções hospitalares.',
      type: 'guideline',
      category: 'Segurança',
      status: 'draft',
      version: '2.0',
      author: 'Dra. Patricia Rocha',
      department: 'Controle de Infecção',
      createdDate: '2024-11-01',
      lastModified: '2024-12-10',
      fileSize: '3.2 MB',
      downloads: 45,
      views: 120,
      tags: ['infecção', 'controle', 'prevenção', 'hospitalar']
    }
  ]

  const categories = ['Segurança', 'Procedimentos', 'Tecnologia', 'Qualidade', 'Administração', 'Emergência']
  const documentTypes = [
    { value: 'policy', label: 'Política' },
    { value: 'procedure', label: 'Procedimento' },
    { value: 'guideline', label: 'Diretriz' },
    { value: 'form', label: 'Formulário' },
    { value: 'manual', label: 'Manual' }
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesType = selectedType === 'all' || doc.type === selectedType
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Em Revisão</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Rascunho</Badge>
      case 'archived':
        return <Badge className="bg-red-100 text-red-800">Arquivado</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'manual':
        return <FileText className="w-5 h-5 text-maternar-blue-500" />
      case 'guideline':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'form':
        return <Edit className="w-5 h-5 text-purple-500" />
      case 'procedure':
        return <Clock className="w-5 h-5 text-orange-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    const today = new Date()
    const expiry = new Date(expiryDate)
    return expiry < today
  }

  const statsCards = [
    { title: 'Total de Documentos', value: documents.length.toString(), icon: FileText, color: 'bg-maternar-blue-500' },
    { title: 'Aprovados', value: documents.filter(d => d.status === 'approved').length.toString(), icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Em Revisão', value: documents.filter(d => d.status === 'review').length.toString(), icon: Clock, color: 'bg-yellow-500' },
    { title: 'Expirando Soon', value: documents.filter(d => isExpiringSoon(d.expiryDate)).length.toString(), icon: AlertTriangle, color: 'bg-red-500' }
  ]

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie políticas, procedimentos e documentos institucionais
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Documento
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-maternar-blue-500 focus:border-maternar-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-maternar-blue-500 focus:border-maternar-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-maternar-blue-500 focus:border-maternar-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">Todos os Tipos</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-maternar-blue-500 focus:border-maternar-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="approved">Aprovado</option>
                <option value="review">Em Revisão</option>
                <option value="draft">Rascunho</option>
                <option value="archived">Arquivado</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                  onClick={() => setViewMode('list')}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Documents Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{doc.title}</h3>
                      <p className="text-sm text-gray-600">v{doc.version}</p>
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    {doc.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="w-4 h-4 mr-2" />
                    {doc.department}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(doc.lastModified).toLocaleDateString('pt-BR')}
                  </div>
                  {doc.expiryDate && (
                    <div className={`flex items-center text-sm ${
                      isExpired(doc.expiryDate) ? 'text-red-600' : 
                      isExpiringSoon(doc.expiryDate) ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Expira: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{doc.tags.length - 3} mais</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{doc.fileSize}</span>
                  <div className="flex space-x-3">
                    <span>{doc.views} visualizações</span>
                    <span>{doc.downloads} downloads</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modificado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atividade
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(doc.type)}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                            <div className="text-sm text-gray-500">v{doc.version} • {doc.fileSize}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{doc.category}</div>
                        <div className="text-sm text-gray-500">{documentTypes.find(t => t.value === doc.type)?.label}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(doc.status)}
                        {doc.expiryDate && isExpiringSoon(doc.expiryDate) && (
                          <div className="text-xs text-yellow-600 mt-1">Expira em breve</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Avatar name={doc.author} size="sm" />
                          <div>
                            <div className="text-sm text-gray-900">{doc.author}</div>
                            <div className="text-sm text-gray-500">{doc.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(doc.lastModified).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(doc.lastModified).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{doc.views} visualizações</div>
                        <div className="text-sm text-gray-500">{doc.downloads} downloads</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        
        {filteredDocuments.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum documento encontrado</p>
            <p className="text-gray-400">Tente ajustar os filtros ou busca</p>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

export default Documents
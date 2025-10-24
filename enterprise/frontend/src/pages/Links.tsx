import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Link as LinkIcon,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Star,
  Clock,
  Users,
  Bookmark,
  Edit,
  Trash2,
  Globe,
  Shield,
  Zap
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'

const Links: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'Todos', count: 42 },
    { id: 'internal', name: 'Internos', count: 18 },
    { id: 'external', name: 'Externos', count: 15 },
    { id: 'training', name: 'Treinamentos', count: 9 }
  ]

  const links = [
    {
      id: 1,
      title: 'Portal ANVISA',
      description: 'Agência Nacional de Vigilância Sanitária - Regulamentações e normas',
      url: 'https://www.gov.br/anvisa',
      category: 'external',
      type: 'government',
      visits: 1234,
      lastVisited: '2025-10-07',
      addedBy: 'Ana Costa',
      addedDate: '2025-09-15',
      tags: ['Regulamentação', 'ANVISA', 'Governo'],
      isFavorite: true,
      icon: '🏛️',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Sistema Interno - Prontuários',
      description: 'Acesso ao sistema de prontuários eletrônicos',
      url: '/internal/medical-records',
      category: 'internal',
      type: 'system',
      visits: 5678,
      lastVisited: '2025-10-08',
      addedBy: 'Dr. Maria Silva',
      addedDate: '2025-08-20',
      tags: ['Prontuário', 'Sistema', 'Interno'],
      isFavorite: true,
      icon: '📋',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Plataforma de Treinamento EAD',
      description: 'Cursos online para desenvolvimento profissional',
      url: 'https://training.sms-sm.health',
      category: 'training',
      type: 'education',
      visits: 2345,
      lastVisited: '2025-10-06',
      addedBy: 'João Santos',
      addedDate: '2025-09-01',
      tags: ['EAD', 'Treinamento', 'Educação'],
      isFavorite: false,
      icon: '🎓',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Conselho Federal de Medicina',
      description: 'Portal do CFM com resoluções e orientações médicas',
      url: 'https://portal.cfm.org.br',
      category: 'external',
      type: 'professional',
      visits: 876,
      lastVisited: '2025-10-05',
      addedBy: 'Dr. Pedro Lima',
      addedDate: '2025-09-10',
      tags: ['CFM', 'Medicina', 'Resoluções'],
      isFavorite: false,
      icon: '⚕️',
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Portal do Colaborador',
      description: 'Acesso a informações de RH, benefícios e documentos',
      url: '/internal/employee-portal',
      category: 'internal',
      type: 'hr',
      visits: 3456,
      lastVisited: '2025-10-08',
      addedBy: 'Sofia Oliveira',
      addedDate: '2025-08-15',
      tags: ['RH', 'Colaborador', 'Benefícios'],
      isFavorite: true,
      icon: '👥',
      priority: 'medium'
    },
    {
      id: 6,
      title: 'Microsoft Office 365',
      description: 'Suite de ferramentas de produtividade corporativa',
      url: 'https://office.com',
      category: 'external',
      type: 'productivity',
      visits: 4567,
      lastVisited: '2025-10-08',
      addedBy: 'Equipe TI',
      addedDate: '2025-07-01',
      tags: ['Office', 'Produtividade', 'Microsoft'],
      isFavorite: true,
      icon: '💼',
      priority: 'high'
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-blue-100 text-blue-800'
      case 'system': return 'bg-green-100 text-green-800'
      case 'education': return 'bg-purple-100 text-purple-800'
      case 'professional': return 'bg-orange-100 text-orange-800'
      case 'hr': return 'bg-pink-100 text-pink-800'
      case 'productivity': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'government': return <Shield className="w-4 h-4" />
      case 'system': return <Zap className="w-4 h-4" />
      case 'education': return <Users className="w-4 h-4" />
      case 'professional': return <Star className="w-4 h-4" />
      case 'hr': return <Users className="w-4 h-4" />
      case 'productivity': return <Globe className="w-4 h-4" />
      default: return <LinkIcon className="w-4 h-4" />
    }
  }

  const filteredLinks = links.filter(link => {
    const matchesCategory = activeCategory === 'all' || link.category === activeCategory
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const favoriteLinks = links.filter(link => link.isFavorite)
  const recentLinks = links
    .sort((a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime())
    .slice(0, 5)

  const stats = {
    total: links.length,
    internal: links.filter(l => l.category === 'internal').length,
    external: links.filter(l => l.category === 'external').length,
    favorites: favoriteLinks.length
  }

  const handleLinkClick = (link: any) => {
    // Track visit and redirect
    console.log(`Visiting: ${link.title}`)
    if (link.url.startsWith('http')) {
      window.open(link.url, '_blank')
    } else {
      window.location.href = link.url
    }
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Links Úteis</h1>
          <p className="text-gray-600 mt-1">
            Acesso rápido a sistemas e recursos importantes
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-maternar-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Link
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
                <LinkIcon className="w-6 h-6 text-maternar-blue-600" />
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
                <p className="text-sm text-gray-600">Internos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.internal}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
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
                <p className="text-sm text-gray-600">Externos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.external}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
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
                <p className="text-sm text-gray-600">Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filters */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 md:mr-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar links..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{link.icon}</div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(link.type)}>
                          {getTypeIcon(link.type)}
                          <span className="ml-1 capitalize">{link.type}</span>
                        </Badge>
                        {link.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 
                    className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-maternar-blue-600 transition-colors"
                    onClick={() => handleLinkClick(link)}
                  >
                    {link.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {link.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {link.visits} acessos
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(link.lastVisited).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {link.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} className="bg-gray-100 text-gray-600 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      Adicionado por {link.addedBy}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleLinkClick(link)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Acessar
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Favorites */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                Favoritos
              </h3>
              <div className="space-y-3">
                {favoriteLinks.map((link) => (
                  <div 
                    key={link.id} 
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleLinkClick(link)}
                  >
                    <div className="text-lg">{link.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {link.title}
                      </h4>
                      <p className="text-xs text-gray-500">{link.visits} acessos</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-maternar-blue-600" />
                Acessados Recentemente
              </h3>
              <div className="space-y-3">
                {recentLinks.map((link) => (
                  <div 
                    key={link.id} 
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleLinkClick(link)}
                  >
                    <div className="text-lg">{link.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {link.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(link.lastVisited).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className={getTypeColor(link.type)}>
                      {link.type}
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
                  Adicionar Link
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Importar Favoritos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Links
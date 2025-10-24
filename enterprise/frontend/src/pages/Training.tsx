import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen,
  Play,
  Award,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Target
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Badge } from '../components/ui/Badge'

const Training: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'Todos', count: 45 },
    { id: 'clinical', name: 'Clínico', count: 15 },
    { id: 'safety', name: 'Segurança', count: 12 },
    { id: 'compliance', name: 'Compliance', count: 8 },
    { id: 'leadership', name: 'Liderança', count: 10 }
  ]

  const courses = [
    {
      id: 1,
      title: 'Protocolos de Segurança do Paciente',
      description: 'Aprenda os protocolos essenciais para garantir a segurança do paciente em ambientes hospitalares.',
      instructor: 'Dr. Maria Silva',
      duration: '4h 30min',
      students: 234,
      rating: 4.8,
      category: 'safety',
      level: 'Intermediário',
      progress: 75,
      thumbnail: '/courses/safety-protocols.jpg',
      completed: false,
      modules: 8,
      completedModules: 6
    },
    {
      id: 2,
      title: 'Farmacologia Clínica Avançada',
      description: 'Curso abrangente sobre farmacologia clínica com foco em interações medicamentosas.',
      instructor: 'Dr. João Santos',
      duration: '6h 15min',
      students: 189,
      rating: 4.9,
      category: 'clinical',
      level: 'Avançado',
      progress: 0,
      thumbnail: '/courses/pharmacology.jpg',
      completed: false,
      modules: 12,
      completedModules: 0
    },
    {
      id: 3,
      title: 'Liderança em Equipes de Saúde',
      description: 'Desenvolva habilidades de liderança para gerenciar equipes multidisciplinares.',
      instructor: 'Ana Costa',
      duration: '3h 45min',
      students: 312,
      rating: 4.7,
      category: 'leadership',
      level: 'Básico',
      progress: 100,
      thumbnail: '/courses/leadership.jpg',
      completed: true,
      modules: 6,
      completedModules: 6
    },
    {
      id: 4,
      title: 'Regulamentações ANVISA 2024',
      description: 'Atualização sobre as novas regulamentações da ANVISA para estabelecimentos de saúde.',
      instructor: 'Dr. Pedro Lima',
      duration: '2h 20min',
      students: 456,
      rating: 4.6,
      category: 'compliance',
      level: 'Básico',
      progress: 30,
      thumbnail: '/courses/anvisa.jpg',
      completed: false,
      modules: 4,
      completedModules: 1
    }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Estudante Dedicado',
      description: 'Complete 5 cursos',
      icon: '🎓',
      progress: 3,
      total: 5,
      completed: false
    },
    {
      id: 2,
      title: 'Especialista em Segurança',
      description: 'Complete todos os cursos de segurança',
      icon: '🛡️',
      progress: 2,
      total: 3,
      completed: false
    },
    {
      id: 3,
      title: 'Líder Nato',
      description: 'Complete o curso de liderança',
      icon: '👑',
      progress: 1,
      total: 1,
      completed: true
    }
  ]

  const stats = {
    coursesCompleted: 12,
    totalHours: 48,
    certificates: 8,
    currentStreak: 7
  }

  const filteredCourses = courses.filter(course => {
    const matchesFilter = activeFilter === 'all' || course.category === activeFilter
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Básico': return 'bg-green-100 text-green-800'
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800'
      case 'Avançado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Treinamentos</h1>
          <p className="text-gray-600 mt-1">
            Desenvolva suas habilidades com nossos cursos especializados
          </p>
        </div>
        <Button className="bg-gradient-to-r from-maternar-blue-600 to-maternar-pink-600">
          <BookOpen className="w-4 h-4 mr-2" />
          Explorar Catálogo
        </Button>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-r from-maternar-blue-500 to-maternar-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-maternar-blue-100">Cursos Concluídos</p>
                <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Horas de Estudo</p>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-r from-maternar-pink-500 to-maternar-pink-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Certificados</p>
                <p className="text-2xl font-bold">{stats.certificates}</p>
              </div>
              <Award className="w-8 h-8 text-purple-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Sequência</p>
                <p className="text-2xl font-bold">{stats.currentStreak} dias</p>
              </div>
              <Target className="w-8 h-8 text-orange-200" />
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 md:mr-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maternar-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeFilter === category.id
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

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                      {course.completed && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-4 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </span>
                      <span className="mr-4 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                    
                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progresso</span>
                          <span>{course.completedModules}/{course.modules} módulos</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Por {course.instructor}
                      </span>
                      <Button 
                        size="sm"
                        variant={course.progress > 0 && !course.completed ? 'primary' : 'outline'}
                      >
                        {course.completed ? 'Revisar' : course.progress > 0 ? 'Continuar' : 'Iniciar'}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Path */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-maternar-blue-600" />
                Trilha de Aprendizado
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-maternar-blue-900">Segurança do Paciente</p>
                    <p className="text-xs text-maternar-blue-600">2/3 cursos</p>
                  </div>
                  <div className="w-12 h-12 bg-maternar-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-maternar-blue-600">67%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Compliance</p>
                    <p className="text-xs text-gray-600">0/2 cursos</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">0%</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Conquistas
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {achievement.description}
                      </p>
                      {!achievement.completed && (
                        <div>
                          <Progress 
                            value={(achievement.progress / achievement.total) * 100}
                            className="h-1 mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            {achievement.progress}/{achievement.total}
                          </p>
                        </div>
                      )}
                      {achievement.completed && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Concluído
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Training
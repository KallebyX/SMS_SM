import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Award,
  Clock,
  Users,
  Star,
  Search,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Target,
  Loader2
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useCourses } from '../hooks/useCourses'
import { useAuth } from '../hooks/useAuth'
import { useGamification } from '../hooks/useGamification'

const Training: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { courses, myCourses, loading, enroll } = useCourses()
  const { user } = useAuth()
  const { achievements: allAchievements } = useGamification()

  // Contar cursos completos do usuário
  const completedCoursesCount = useMemo(() => {
    return myCourses.filter(c => c.completedAt).length
  }, [myCourses])

  // Calcular total de horas de estudo
  const totalHoursStudied = useMemo(() => {
    return myCourses.reduce((acc, course) => {
      const hours = parseInt(course.estimatedTime) || 0
      if (course.completedAt) {
        return acc + hours
      }
      // Se não completou, conta proporcional ao progresso
      return acc + (hours * (course.progress / 100))
    }, 0)
  }, [myCourses])

  // Contar certificados (cursos 100% completos)
  const certificatesCount = completedCoursesCount

  // Obter streak do usuário
  const currentStreak = user?.currentStreak || 0

  const stats = {
    coursesCompleted: completedCoursesCount,
    totalHours: Math.round(totalHoursStudied),
    certificates: certificatesCount,
    currentStreak
  }

  // Extrair categorias únicas dos cursos
  const categories = useMemo(() => {
    const categoryCounts = courses.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { id: 'all', name: 'Todos', count: courses.length },
      ...Object.entries(categoryCounts).map(([category, count]) => ({
        id: category,
        name: category,
        count
      }))
    ]
  }, [courses])

  // Filtrar conquistas relacionadas a cursos
  const courseAchievements = useMemo(() => {
    return allAchievements.filter(a =>
      a.type === 'COURSE_COMPLETION' && !a.isUnlocked
    ).slice(0, 3) // Mostrar apenas 3 conquistas pendentes
  }, [allAchievements])

  // Filtrar cursos baseado no filtro ativo e busca
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesFilter = activeFilter === 'all' || course.category === activeFilter
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [courses, activeFilter, searchTerm])

  // Mapear dificuldade para cores
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Traduzir dificuldade
  const translateDifficulty = (difficulty: string) => {
    const translations = {
      'BEGINNER': 'Básico',
      'INTERMEDIATE': 'Intermediário',
      'ADVANCED': 'Avançado'
    }
    return translations[difficulty as keyof typeof translations] || difficulty
  }

  // Handler para iniciar/continuar curso
  const handleCourseAction = async (courseId: string, hasEnrollment: boolean) => {
    if (!hasEnrollment) {
      try {
        await enroll(courseId)
      } catch (error) {
        console.error('Error enrolling:', error)
      }
    } else {
      // Navegar para a página do curso (TODO: implementar rota de detalhes do curso)
      window.location.href = `/training/${courseId}`
    }
  }

  // Calcular progresso em trilhas de aprendizado
  const learningPaths = useMemo(() => {
    const paths: Record<string, { total: number; completed: number }> = {}

    myCourses.forEach(course => {
      const category = course.category || 'Outros'
      if (!paths[category]) {
        paths[category] = { total: 0, completed: 0 }
      }
      paths[category].total++
      if (course.completedAt) {
        paths[category].completed++
      }
    })

    return Object.entries(paths).map(([category, data]) => ({
      category,
      ...data,
      percentage: Math.round((data.completed / data.total) * 100)
    })).slice(0, 2) // Mostrar apenas 2 trilhas principais
  }, [myCourses])

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
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
                  aria-label="Buscar cursos"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeFilter === category.id
                        ? 'bg-maternar-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-pressed={activeFilter === category.id}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-maternar-blue-600" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCourses.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Novos cursos serão adicionados em breve'}
              </p>
            </Card>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course, index) => {
              const enrollment = course.enrollment
              const isCompleted = enrollment?.completedAt
              const progress = enrollment?.progress || 0
              const completedLessons = course.lessons?.filter(l => l.isCompleted).length || 0
              const totalLessons = course.totalLessons || course.lessons?.length || 0

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/800x450?text=Curso'}
                        alt={course.title}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Curso'
                        }}
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {translateDifficulty(course.difficulty)}
                        </Badge>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" aria-label="Curso concluído" />
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                        {course.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-4">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.estimatedTime}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {course.totalEnrollments || 0}
                        </span>
                        <span className="flex items-center">
                          <Award className="w-4 h-4 mr-1 text-yellow-400" />
                          {course.xpReward} XP
                        </span>
                      </div>

                      {progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progresso</span>
                            <span>{completedLessons}/{totalLessons} aulas</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-gray-600">
                          {course.category}
                        </span>
                        <Button
                          size="sm"
                          variant={progress > 0 && !isCompleted ? 'primary' : 'outline'}
                          onClick={() => handleCourseAction(course.id, !!enrollment)}
                          disabled={loading}
                        >
                          {isCompleted ? 'Revisar' : progress > 0 ? 'Continuar' : 'Iniciar'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Path */}
          {learningPaths.length > 0 && (
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
                  {learningPaths.map((path, index) => (
                    <div
                      key={path.category}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0 ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-medium ${
                          index === 0 ? 'text-maternar-blue-900' : 'text-gray-900'
                        }`}>
                          {path.category}
                        </p>
                        <p className={`text-xs ${
                          index === 0 ? 'text-maternar-blue-600' : 'text-gray-600'
                        }`}>
                          {path.completed}/{path.total} cursos
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-maternar-blue-100' : 'bg-gray-100'
                      }`}>
                        <span className={`text-sm font-bold ${
                          index === 0 ? 'text-maternar-blue-600' : 'text-gray-600'
                        }`}>
                          {path.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Achievements */}
          {courseAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Conquistas Pendentes
                </h3>
                <div className="space-y-4">
                  {courseAchievements.map((achievement) => {
                    // Parse da condição para calcular progresso
                    const condition = JSON.parse(achievement.condition || '{}')
                    const currentProgress = condition.type === 'course_completion'
                      ? completedCoursesCount
                      : 0
                    const totalRequired = condition.count || 1
                    const progressPercent = Math.min((currentProgress / totalRequired) * 100, 100)

                    return (
                      <div key={achievement.id} className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {achievement.description}
                          </p>
                          <div>
                            <Progress
                              value={progressPercent}
                              className="h-1 mb-1"
                            />
                            <p className="text-xs text-gray-500">
                              {currentProgress}/{totalRequired}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Training

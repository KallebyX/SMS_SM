import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
  Shield,
  Award,
  Clock,
  Star,
  TrendingUp,
  Users,
  BookOpen
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Progress } from '../components/ui/Progress'

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const user = {
    id: '1',
    name: 'Ana Costa',
    email: 'ana.costa@sms-sm.health',
    phone: '+55 (11) 98765-4321',
    role: 'Coordenadora de Enfermagem',
    department: 'Enfermagem',
    location: 'São Paulo, SP',
    joinDate: '2023-03-15',
    avatar: '/avatars/ana.jpg',
    bio: 'Enfermeira especializada em UTI com mais de 10 anos de experiência. Apaixonada por cuidado ao paciente e desenvolvimento de equipes.',
    skills: ['Gestão de Equipes', 'UTI', 'Emergência', 'Treinamento', 'Protocolos'],
    certifications: [
      { name: 'Especialização em UTI', date: '2020-12', institution: 'USP' },
      { name: 'Gestão em Saúde', date: '2021-06', institution: 'FGV' },
      { name: 'BLS Provider', date: '2023-01', institution: 'American Heart Association' }
    ]
  }

  const stats = {
    projects: 12,
    completedTraining: 24,
    teamSize: 15,
    experience: 10,
    achievements: 18,
    gamificationPoints: 45230,
    level: 15,
    streak: 12
  }

  const recentActivity = [
    {
      id: 1,
      type: 'training',
      title: 'Concluiu o curso "Protocolos de Segurança"',
      date: '2025-10-07',
      points: 500
    },
    {
      id: 2,
      type: 'project',
      title: 'Atualizou projeto "Implementação ANVISA 2024"',
      date: '2025-10-06',
      points: 200
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Conquistou badge "Líder de Equipe"',
      date: '2025-10-05',
      points: 1000
    },
    {
      id: 4,
      type: 'collaboration',
      title: 'Colaborou no projeto de Telemedicina',
      date: '2025-10-04',
      points: 300
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'training': return <BookOpen className="w-4 h-4 text-maternar-blue-600" />
      case 'project': return <Users className="w-4 h-4 text-maternar-green-600" />
      case 'achievement': return <Award className="w-4 h-4 text-yellow-600" />
      case 'collaboration': return <Users className="w-4 h-4 text-purple-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
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
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas informações pessoais e profissionais
          </p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'bg-maternar-green-600' : 'bg-maternar-blue-600'}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </>
          )}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  fallback={user.name}
                  size="xl"
                  className="mx-auto"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-maternar-blue-600 text-white rounded-full hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.role}</p>
              <Badge className="bg-blue-100 text-blue-800 mt-2">
                {user.department}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">
                  Desde {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Sobre</h3>
              {isEditing ? (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  defaultValue={user.bio}
                />
              ) : (
                <p className="text-sm text-gray-600">{user.bio}</p>
              )}
            </div>

            {/* Skills */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Competências</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} className="bg-gray-100 text-gray-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-maternar-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.projects}</p>
                  <p className="text-xs text-gray-600">Projetos</p>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-4 h-4 text-maternar-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedTraining}</p>
                  <p className="text-xs text-gray-600">Treinamentos</p>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.achievements}</p>
                  <p className="text-xs text-gray-600">Conquistas</p>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.experience}</p>
                  <p className="text-xs text-gray-600">Anos</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex space-x-6 mb-6 border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Visão Geral' },
                  { id: 'activity', label: 'Atividades' },
                  { id: 'certifications', label: 'Certificações' },
                  { id: 'gamification', label: 'Gamificação' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-maternar-blue-600 text-maternar-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Profissionais</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={user.role}
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user.role}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Departamento</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={user.department}
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user.department}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Telefone</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={user.phone}
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Localização</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={user.location}
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Atividades Recentes</h3>
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        +{activity.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'certifications' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Certificações</h3>
                  {user.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.institution}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(cert.date).toLocaleDateString('pt-BR')}
                        </p>
                        <Badge className="bg-blue-100 text-blue-800">Válido</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'gamification' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">Lv {stats.level}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Nível {stats.level}</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.gamificationPoints.toLocaleString()} pts</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-lg font-bold text-gray-900">{stats.achievements}</p>
                      <p className="text-sm text-gray-600">Conquistas</p>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-lg font-bold text-gray-900">{stats.streak}</p>
                      <p className="text-sm text-gray-600">Dias seguidos</p>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-lg font-bold text-gray-900">#{3}</p>
                      <p className="text-sm text-gray-600">Ranking</p>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Progresso para o próximo nível</h4>
                    <Progress value={75} className="h-3" />
                    <p className="text-sm text-gray-600 mt-2">7,500 / 10,000 pontos</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
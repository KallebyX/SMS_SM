import React from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Target, 
  Award, 
  Star, 
  TrendingUp, 
  Gift,
  Users,
  Calendar,
  CheckCircle,
  Medal,
  Crown,
  Zap
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'

const Gamification: React.FC = () => {
  const userStats = {
    level: 15,
    xp: 8750,
    nextLevelXp: 10000,
    totalPoints: 45230,
    streak: 12,
    badges: 24,
    rank: 3,
    completedChallenges: 89
  }

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first health assessment',
      icon: <CheckCircle className="w-6 h-6" />,
      points: 100,
      completed: true,
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Consistency Champion',
      description: 'Log activities for 30 consecutive days',
      icon: <Calendar className="w-6 h-6" />,
      points: 500,
      completed: true,
      rarity: 'rare'
    },
    {
      id: 3,
      title: 'Knowledge Seeker',
      description: 'Complete 10 training courses',
      icon: <Trophy className="w-6 h-6" />,
      points: 1000,
      completed: false,
      progress: 7,
      total: 10,
      rarity: 'epic'
    },
    {
      id: 4,
      title: 'Team Player',
      description: 'Collaborate on 5 projects',
      icon: <Users className="w-6 h-6" />,
      points: 750,
      completed: false,
      progress: 3,
      total: 5,
      rarity: 'rare'
    }
  ]

  const leaderboard = [
    { rank: 1, name: 'Dr. Maria Silva', points: 52340, avatar: '/avatars/maria.jpg', level: 18 },
    { rank: 2, name: 'João Santos', points: 48920, avatar: '/avatars/joao.jpg', level: 17 },
    { rank: 3, name: 'Ana Costa', points: 45230, avatar: '/avatars/ana.jpg', level: 15, isCurrentUser: true },
    { rank: 4, name: 'Pedro Lima', points: 43180, avatar: '/avatars/pedro.jpg', level: 15 },
    { rank: 5, name: 'Sofia Oliveira', points: 41560, avatar: '/avatars/sofia.jpg', level: 14 }
  ]

  const challenges = [
    {
      id: 1,
      title: 'Wellness Wednesday',
      description: 'Complete 3 health activities this Wednesday',
      reward: '200 XP + Wellness Badge',
      deadline: '2025-10-09',
      progress: 2,
      total: 3,
      difficulty: 'easy'
    },
    {
      id: 2,
      title: 'Training Master',
      description: 'Finish 2 training modules this week',
      reward: '500 XP + Knowledge Badge',
      deadline: '2025-10-13',
      progress: 0,
      total: 2,
      difficulty: 'medium'
    },
    {
      id: 3,
      title: 'Team Collaboration',
      description: 'Work with 3 different colleagues on projects',
      reward: '1000 XP + Teamwork Badge',
      deadline: '2025-10-15',
      progress: 1,
      total: 3,
      difficulty: 'hard'
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
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
          <h1 className="text-3xl font-bold text-gray-900">Gamificação</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe seu progresso e conquiste recompensas
          </p>
        </div>
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-right">
            <p className="text-sm text-gray-600">Nível {userStats.level}</p>
            <p className="text-2xl font-bold text-purple-600">{userStats.totalPoints.toLocaleString()} pts</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      </motion.div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Experiência</p>
                <p className="text-2xl font-bold">{userStats.xp} XP</p>
                <Progress 
                  value={(userStats.xp / userStats.nextLevelXp) * 100} 
                  className="mt-2 bg-blue-400"
                />
              </div>
              <Star className="w-8 h-8 text-blue-200" />
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
                <p className="text-green-100">Sequência</p>
                <p className="text-2xl font-bold">{userStats.streak} dias</p>
              </div>
              <Zap className="w-8 h-8 text-green-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Ranking</p>
                <p className="text-2xl font-bold">#{userStats.rank}</p>
              </div>
              <Medal className="w-8 h-8 text-purple-200" />
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
                <p className="text-orange-100">Conquistas</p>
                <p className="text-2xl font-bold">{userStats.badges}</p>
              </div>
              <Award className="w-8 h-8 text-orange-200" />
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                Conquistas
              </h2>
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {achievement.description}
                        </p>
                        {!achievement.completed && achievement.progress && (
                          <div className="mt-2">
                            <Progress 
                              value={(achievement.progress / achievement.total) * 100}
                              className="h-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {achievement.progress}/{achievement.total}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        +{achievement.points} pts
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Ranking
            </h2>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <motion.div
                  key={user.rank}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    user.isCurrentUser 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    user.rank === 1 ? 'bg-yellow-500 text-white' :
                    user.rank === 2 ? 'bg-gray-400 text-white' :
                    user.rank === 3 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {user.rank}
                  </div>
                  <Avatar src={user.avatar} alt={user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      user.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Nível {user.level}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">pts</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Active Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-600" />
              Desafios Ativos
            </h2>
            <Button variant="outline" size="sm">
              <Gift className="w-4 h-4 mr-2" />
              Explorar Mais
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    até {new Date(challenge.deadline).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {challenge.description}
                </p>
                <div className="mb-3">
                  <Progress 
                    value={(challenge.progress / challenge.total) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {challenge.progress}/{challenge.total} concluído
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">
                    {challenge.reward}
                  </span>
                  <Button size="sm" disabled={challenge.progress === challenge.total}>
                    {challenge.progress === challenge.total ? 'Concluído' : 'Participar'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Gamification
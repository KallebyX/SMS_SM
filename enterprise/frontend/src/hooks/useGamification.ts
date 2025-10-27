import { useQuery } from '@apollo/client'
import { GET_ACHIEVEMENTS, GET_MY_ACHIEVEMENTS, ME } from '../graphql/queries'

export const useGamification = () => {
  const { data: achievementsData, loading: achievementsLoading } = useQuery(GET_ACHIEVEMENTS, {
    errorPolicy: 'all'
  })

  const { data: myAchievementsData, loading: myAchievementsLoading } = useQuery(GET_MY_ACHIEVEMENTS, {
    errorPolicy: 'all'
  })

  const { data: userData, loading: userLoading } = useQuery(ME, {
    errorPolicy: 'all'
  })

  const userStats = userData?.me ? {
    level: userData.me.level || 1,
    xp: userData.me.totalXP || 0,
    weeklyXP: userData.me.weeklyXP || 0,
    totalPoints: userData.me.totalXP || 0,
    streak: 0, // TODO: Implementar streak no backend
    badges: myAchievementsData?.myAchievements?.length || 0,
    rank: 0, // TODO: Implementar ranking no backend
    completedChallenges: myAchievementsData?.myAchievements?.length || 0
  } : null

  return {
    achievements: achievementsData?.achievements || [],
    myAchievements: myAchievementsData?.myAchievements || [],
    userStats,
    loading: achievementsLoading || myAchievementsLoading || userLoading
  }
}


import { config } from './index.js'
import { logger } from '../utils/logger.js'

/**
 * Redis Configuration for Maternar Santa Mariense
 * 
 * Configurações de cache para otimizar performance
 */

export const redisCacheConfig = {
  // Cache de sessões de usuários
  session: {
    prefix: 'maternar:session:',
    ttl: 7 * 24 * 60 * 60, // 7 dias (mesmo que JWT)
  },
  
  // Cache de queries frequentes
  queries: {
    // Lista de cursos (5 minutos)
    courses: {
      key: 'maternar:courses:all',
      ttl: 5 * 60,
    },
    
    // Conquistas (15 minutos - raramente mudam)
    achievements: {
      key: 'maternar:achievements:all',
      ttl: 15 * 60,
    },
    
    // Links úteis (30 minutos - raramente mudam)
    links: {
      key: 'maternar:links:all',
      ttl: 30 * 60,
    },
    
    // Políticas (30 minutos)
    policies: {
      key: 'maternar:policies:active',
      ttl: 30 * 60,
    },
    
    // Perfil do usuário (2 minutos)
    userProfile: {
      prefix: 'maternar:user:profile:',
      ttl: 2 * 60,
    },
    
    // Ranking semanal (5 minutos)
    weeklyRanking: {
      key: 'maternar:ranking:weekly',
      ttl: 5 * 60,
    },
  },
  
  // Rate limiting
  rateLimit: {
    prefix: 'maternar:ratelimit:',
    window: 15 * 60, // 15 minutos
    max: 1000, // 1000 requisições por window
  },
  
  // Online users tracking
  onlineUsers: {
    key: 'maternar:users:online',
    ttl: 5 * 60, // 5 minutos de inatividade
  },
}

/**
 * Helper para gerar chaves de cache
 */
export const getCacheKey = {
  userProfile: (userId: string) => `${redisCacheConfig.queries.userProfile.prefix}${userId}`,
  userCourses: (userId: string) => `maternar:user:courses:${userId}`,
  courseProgress: (userId: string, courseId: string) => `maternar:progress:${userId}:${courseId}`,
  channelMessages: (channelId: string) => `maternar:messages:${channelId}`,
  userAchievements: (userId: string) => `maternar:achievements:user:${userId}`,
  projectTasks: (projectId: string) => `maternar:tasks:${projectId}`,
  rateLimit: (ip: string, route: string) => `${redisCacheConfig.rateLimit.prefix}${ip}:${route}`,
}

/**
 * TTL (Time To Live) por tipo de dado
 */
export const cacheTTL = {
  veryShort: 60,        // 1 minuto
  short: 5 * 60,        // 5 minutos
  medium: 15 * 60,      // 15 minutos
  long: 60 * 60,        // 1 hora
  veryLong: 24 * 60 * 60, // 24 horas
  session: 7 * 24 * 60 * 60, // 7 dias
}

/**
 * Invalidação de cache
 * Define quais chaves devem ser invalidadas quando dados mudam
 */
export const cacheInvalidation = {
  onCourseUpdate: (courseId: string) => [
    redisCacheConfig.queries.courses.key,
    `maternar:course:${courseId}`,
  ],
  
  onUserUpdate: (userId: string) => [
    getCacheKey.userProfile(userId),
    getCacheKey.userCourses(userId),
    getCacheKey.userAchievements(userId),
  ],
  
  onLessonComplete: (userId: string, courseId: string) => [
    getCacheKey.userProfile(userId),
    getCacheKey.userCourses(userId),
    getCacheKey.courseProgress(userId, courseId),
    redisCacheConfig.queries.weeklyRanking.key,
  ],
  
  onMessageSent: (channelId: string) => [
    getCacheKey.channelMessages(channelId),
  ],
  
  onTaskUpdate: (projectId: string) => [
    getCacheKey.projectTasks(projectId),
  ],
  
  onAchievementUnlock: (userId: string) => [
    getCacheKey.userAchievements(userId),
    getCacheKey.userProfile(userId),
  ],
}

logger.info('Redis cache configuration loaded for Maternar Santa Mariense')


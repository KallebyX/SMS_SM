"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheInvalidation = exports.cacheTTL = exports.getCacheKey = exports.redisCacheConfig = void 0;
const logger_js_1 = require("../utils/logger.js");
/**
 * Redis Configuration for Maternar Santa Mariense
 *
 * Configurações de cache para otimizar performance
 */
exports.redisCacheConfig = {
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
};
/**
 * Helper para gerar chaves de cache
 */
exports.getCacheKey = {
    userProfile: (userId) => `${exports.redisCacheConfig.queries.userProfile.prefix}${userId}`,
    userCourses: (userId) => `maternar:user:courses:${userId}`,
    courseProgress: (userId, courseId) => `maternar:progress:${userId}:${courseId}`,
    channelMessages: (channelId) => `maternar:messages:${channelId}`,
    userAchievements: (userId) => `maternar:achievements:user:${userId}`,
    projectTasks: (projectId) => `maternar:tasks:${projectId}`,
    rateLimit: (ip, route) => `${exports.redisCacheConfig.rateLimit.prefix}${ip}:${route}`,
};
/**
 * TTL (Time To Live) por tipo de dado
 */
exports.cacheTTL = {
    veryShort: 60, // 1 minuto
    short: 5 * 60, // 5 minutos
    medium: 15 * 60, // 15 minutos
    long: 60 * 60, // 1 hora
    veryLong: 24 * 60 * 60, // 24 horas
    session: 7 * 24 * 60 * 60, // 7 dias
};
/**
 * Invalidação de cache
 * Define quais chaves devem ser invalidadas quando dados mudam
 */
exports.cacheInvalidation = {
    onCourseUpdate: (courseId) => [
        exports.redisCacheConfig.queries.courses.key,
        `maternar:course:${courseId}`,
    ],
    onUserUpdate: (userId) => [
        exports.getCacheKey.userProfile(userId),
        exports.getCacheKey.userCourses(userId),
        exports.getCacheKey.userAchievements(userId),
    ],
    onLessonComplete: (userId, courseId) => [
        exports.getCacheKey.userProfile(userId),
        exports.getCacheKey.userCourses(userId),
        exports.getCacheKey.courseProgress(userId, courseId),
        exports.redisCacheConfig.queries.weeklyRanking.key,
    ],
    onMessageSent: (channelId) => [
        exports.getCacheKey.channelMessages(channelId),
    ],
    onTaskUpdate: (projectId) => [
        exports.getCacheKey.projectTasks(projectId),
    ],
    onAchievementUnlock: (userId) => [
        exports.getCacheKey.userAchievements(userId),
        exports.getCacheKey.userProfile(userId),
    ],
};
logger_js_1.logger.info('Redis cache configuration loaded for Maternar Santa Mariense');

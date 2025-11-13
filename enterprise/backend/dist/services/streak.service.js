"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streakService = exports.StreakService = void 0;
const client_1 = require("@prisma/client");
const logger_js_1 = require("../utils/logger.js");
const prisma = new client_1.PrismaClient();
class StreakService {
    /**
     * Calcula e atualiza o streak do usuário baseado em completamento de lições
     */
    async updateUserStreak(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    currentStreak: true,
                    longestStreak: true,
                    lastStreakDate: true
                }
            });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            let newStreak = user.currentStreak;
            let newLongestStreak = user.longestStreak;
            // Verificar se o usuário já completou alguma lição hoje
            const completedToday = await prisma.lessonCompletion.findFirst({
                where: {
                    userId,
                    completedAt: {
                        gte: today
                    }
                }
            });
            if (!completedToday) {
                // Se não completou nenhuma lição hoje, não atualiza o streak
                return {
                    currentStreak: user.currentStreak,
                    longestStreak: user.longestStreak
                };
            }
            if (!user.lastStreakDate) {
                // Primeiro dia de streak
                newStreak = 1;
            }
            else {
                const lastStreakDate = new Date(user.lastStreakDate);
                lastStreakDate.setHours(0, 0, 0, 0);
                if (lastStreakDate.getTime() === yesterday.getTime()) {
                    // Continuou o streak
                    newStreak = user.currentStreak + 1;
                }
                else if (lastStreakDate.getTime() === today.getTime()) {
                    // Já contabilizou hoje
                    return {
                        currentStreak: user.currentStreak,
                        longestStreak: user.longestStreak
                    };
                }
                else {
                    // Quebrou o streak
                    newStreak = 1;
                }
            }
            // Atualizar o longest streak se necessário
            if (newStreak > user.longestStreak) {
                newLongestStreak = newStreak;
            }
            // Atualizar no banco de dados
            await prisma.user.update({
                where: { id: userId },
                data: {
                    currentStreak: newStreak,
                    longestStreak: newLongestStreak,
                    lastStreakDate: today
                }
            });
            logger_js_1.logger.info(`User ${userId} streak updated: ${newStreak} days`);
            return {
                currentStreak: newStreak,
                longestStreak: newLongestStreak
            };
        }
        catch (error) {
            logger_js_1.logger.error('Update user streak failed:', error);
            throw error;
        }
    }
    /**
     * Obtém o streak atual do usuário
     */
    async getUserStreak(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    currentStreak: true,
                    longestStreak: true,
                    lastStreakDate: true
                }
            });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            // Verificar se o streak ainda é válido
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (user.lastStreakDate) {
                const lastStreakDate = new Date(user.lastStreakDate);
                lastStreakDate.setHours(0, 0, 0, 0);
                // Se a última data de streak não foi ontem nem hoje, o streak foi quebrado
                if (lastStreakDate.getTime() !== yesterday.getTime() &&
                    lastStreakDate.getTime() !== today.getTime()) {
                    // Resetar o streak
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            currentStreak: 0
                        }
                    });
                    return {
                        currentStreak: 0,
                        longestStreak: user.longestStreak
                    };
                }
            }
            return {
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak
            };
        }
        catch (error) {
            logger_js_1.logger.error('Get user streak failed:', error);
            throw error;
        }
    }
    /**
     * Reseta o streak semanal de XP (chamado semanalmente por job)
     */
    async resetWeeklyXP() {
        try {
            await prisma.user.updateMany({
                data: {
                    weeklyXP: 0
                }
            });
            logger_js_1.logger.info('Weekly XP reset completed');
        }
        catch (error) {
            logger_js_1.logger.error('Reset weekly XP failed:', error);
            throw error;
        }
    }
}
exports.StreakService = StreakService;
exports.streakService = new StreakService();

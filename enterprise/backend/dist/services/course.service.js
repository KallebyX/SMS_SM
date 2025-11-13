"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseService = exports.CourseService = void 0;
const client_1 = require("@prisma/client");
const logger_js_1 = require("../utils/logger.js");
const streak_service_js_1 = require("./streak.service.js");
const prisma = new client_1.PrismaClient();
class CourseService {
    async getAllCourses(userId) {
        try {
            const courses = await prisma.course.findMany({
                where: { isActive: true },
                include: {
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            order: true,
                            xpReward: true
                        },
                        orderBy: { order: 'asc' }
                    },
                    enrollments: userId ? {
                        where: { userId },
                        select: {
                            id: true,
                            progress: true,
                            completedAt: true,
                            enrolledAt: true
                        }
                    } : false,
                    _count: {
                        select: {
                            lessons: true,
                            enrollments: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return courses.map(course => ({
                ...course,
                enrollment: course.enrollments?.[0] || null,
                enrollments: undefined, // Remove from response
                totalLessons: course._count.lessons,
                totalEnrollments: course._count.enrollments
            }));
        }
        catch (error) {
            logger_js_1.logger.error('Get all courses failed:', error);
            throw error;
        }
    }
    async getCourseById(courseId, userId) {
        try {
            const course = await prisma.course.findUnique({
                where: { id: courseId },
                include: {
                    lessons: {
                        include: {
                            completions: userId ? {
                                where: { userId },
                                select: {
                                    id: true,
                                    completedAt: true
                                }
                            } : false
                        },
                        orderBy: { order: 'asc' }
                    },
                    enrollments: userId ? {
                        where: { userId },
                        select: {
                            id: true,
                            progress: true,
                            completedAt: true,
                            enrolledAt: true
                        }
                    } : false
                }
            });
            if (!course) {
                throw new Error('Curso não encontrado');
            }
            return {
                ...course,
                enrollment: course.enrollments?.[0] || null,
                enrollments: undefined,
                lessons: course.lessons.map(lesson => ({
                    ...lesson,
                    isCompleted: lesson.completions?.length > 0,
                    completions: undefined
                }))
            };
        }
        catch (error) {
            logger_js_1.logger.error('Get course by ID failed:', error);
            throw error;
        }
    }
    async enrollInCourse(userId, courseId) {
        try {
            // Check if already enrolled
            const existingEnrollment = await prisma.courseEnrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId
                    }
                }
            });
            if (existingEnrollment) {
                throw new Error('Usuário já está inscrito neste curso');
            }
            // Check if course exists
            const course = await prisma.course.findUnique({
                where: { id: courseId }
            });
            if (!course || !course.isActive) {
                throw new Error('Curso não encontrado ou inativo');
            }
            // Create enrollment
            const enrollment = await prisma.courseEnrollment.create({
                data: {
                    userId,
                    courseId
                },
                include: {
                    course: {
                        select: {
                            title: true,
                            xpReward: true
                        }
                    }
                }
            });
            logger_js_1.logger.info(`User ${userId} enrolled in course ${courseId}`);
            return enrollment;
        }
        catch (error) {
            logger_js_1.logger.error('Course enrollment failed:', error);
            throw error;
        }
    }
    async completeLesson(userId, lessonId) {
        try {
            // Check if lesson exists
            const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
                include: {
                    course: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            });
            if (!lesson) {
                throw new Error('Lição não encontrada');
            }
            // Check if user is enrolled in the course
            const enrollment = await prisma.courseEnrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId: lesson.course.id
                    }
                }
            });
            if (!enrollment) {
                throw new Error('Usuário não está inscrito neste curso');
            }
            // Check if already completed
            const existingCompletion = await prisma.lessonCompletion.findUnique({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId
                    }
                }
            });
            if (existingCompletion) {
                throw new Error('Lição já foi concluída');
            }
            // Complete lesson and award XP
            const [completion] = await prisma.$transaction([
                // Create lesson completion
                prisma.lessonCompletion.create({
                    data: {
                        userId,
                        lessonId
                    }
                }),
                // Award XP to user
                prisma.user.update({
                    where: { id: userId },
                    data: {
                        totalXP: {
                            increment: lesson.xpReward
                        },
                        weeklyXP: {
                            increment: lesson.xpReward
                        }
                    }
                })
            ]);
            // Update course progress
            await this.updateCourseProgress(userId, lesson.course.id);
            // Update user streak
            await streak_service_js_1.streakService.updateUserStreak(userId);
            logger_js_1.logger.info(`User ${userId} completed lesson ${lessonId} and earned ${lesson.xpReward} XP`);
            return {
                completion,
                xpEarned: lesson.xpReward
            };
        }
        catch (error) {
            logger_js_1.logger.error('Lesson completion failed:', error);
            throw error;
        }
    }
    async updateCourseProgress(userId, courseId) {
        try {
            // Get total lessons in course
            const totalLessons = await prisma.lesson.count({
                where: { courseId }
            });
            // Get completed lessons for user
            const completedLessons = await prisma.lessonCompletion.count({
                where: {
                    userId,
                    lesson: {
                        courseId
                    }
                }
            });
            const progress = Math.round((completedLessons / totalLessons) * 100);
            const isCompleted = progress === 100;
            // Update enrollment progress
            await prisma.courseEnrollment.update({
                where: {
                    userId_courseId: {
                        userId,
                        courseId
                    }
                },
                data: {
                    progress,
                    completedAt: isCompleted ? new Date() : null
                }
            });
            // If course completed, award course XP
            if (isCompleted) {
                const course = await prisma.course.findUnique({
                    where: { id: courseId },
                    select: { xpReward: true, title: true }
                });
                if (course && course.xpReward > 0) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            totalXP: {
                                increment: course.xpReward
                            },
                            weeklyXP: {
                                increment: course.xpReward
                            }
                        }
                    });
                    logger_js_1.logger.info(`User ${userId} completed course ${courseId} and earned ${course.xpReward} XP`);
                }
            }
            return { progress, isCompleted };
        }
        catch (error) {
            logger_js_1.logger.error('Update course progress failed:', error);
            throw error;
        }
    }
    async getUserCourses(userId) {
        try {
            const enrollments = await prisma.courseEnrollment.findMany({
                where: { userId },
                include: {
                    course: {
                        include: {
                            _count: {
                                select: {
                                    lessons: true
                                }
                            }
                        }
                    }
                },
                orderBy: { enrolledAt: 'desc' }
            });
            return enrollments.map(enrollment => ({
                ...enrollment.course,
                enrollment: {
                    id: enrollment.id,
                    progress: enrollment.progress,
                    completedAt: enrollment.completedAt,
                    enrolledAt: enrollment.enrolledAt
                },
                totalLessons: enrollment.course._count.lessons
            }));
        }
        catch (error) {
            logger_js_1.logger.error('Get user courses failed:', error);
            throw error;
        }
    }
    // Admin functions
    async createCourse(data) {
        try {
            const course = await prisma.course.create({
                data: {
                    ...data,
                    xpReward: data.xpReward || 0
                }
            });
            logger_js_1.logger.info(`New course created: ${course.title}`);
            return course;
        }
        catch (error) {
            logger_js_1.logger.error('Create course failed:', error);
            throw error;
        }
    }
    async addLessonToCourse(courseId, data) {
        try {
            // Get next order number
            const lastLesson = await prisma.lesson.findFirst({
                where: { courseId },
                orderBy: { order: 'desc' }
            });
            const order = lastLesson ? lastLesson.order + 1 : 1;
            const lesson = await prisma.lesson.create({
                data: {
                    ...data,
                    courseId,
                    order,
                    xpReward: data.xpReward || 10
                }
            });
            logger_js_1.logger.info(`New lesson added to course ${courseId}: ${lesson.title}`);
            return lesson;
        }
        catch (error) {
            logger_js_1.logger.error('Add lesson to course failed:', error);
            throw error;
        }
    }
}
exports.CourseService = CourseService;
exports.courseService = new CourseService();

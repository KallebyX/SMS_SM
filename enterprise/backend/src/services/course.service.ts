import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger.js'
import { streakService } from './streak.service.js'

export interface CreateCourseData {
  title: string
  description: string
  category: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  xpReward?: number
  estimatedTime: string
  thumbnail?: string
}

export interface CreateLessonData {
  title: string
  content: string
  videoUrl?: string
  xpReward?: number
}

const prisma = new PrismaClient()

export class CourseService {
  
  async getAllCourses(userId?: string) {
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
      })
      
      return courses.map(course => ({
        ...course,
        enrollment: course.enrollments?.[0] || null,
        enrollments: undefined, // Remove from response
        totalLessons: course._count.lessons,
        totalEnrollments: course._count.enrollments
      }))
      
    } catch (error) {
      logger.error('Get all courses failed:', error)
      throw error
    }
  }
  
  async getCourseById(courseId: string, userId?: string) {
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
      })
      
      if (!course) {
        throw new Error('Curso não encontrado')
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
      }
      
    } catch (error) {
      logger.error('Get course by ID failed:', error)
      throw error
    }
  }
  
  async enrollInCourse(userId: string, courseId: string) {
    try {
      // Check if already enrolled
      const existingEnrollment = await prisma.courseEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      })
      
      if (existingEnrollment) {
        throw new Error('Usuário já está inscrito neste curso')
      }
      
      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      })
      
      if (!course || !course.isActive) {
        throw new Error('Curso não encontrado ou inativo')
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
      })
      
      logger.info(`User ${userId} enrolled in course ${courseId}`)
      
      return enrollment
      
    } catch (error) {
      logger.error('Course enrollment failed:', error)
      throw error
    }
  }
  
  async completeLesson(userId: string, lessonId: string) {
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
      })
      
      if (!lesson) {
        throw new Error('Lição não encontrada')
      }
      
      // Check if user is enrolled in the course
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.course.id
          }
        }
      })
      
      if (!enrollment) {
        throw new Error('Usuário não está inscrito neste curso')
      }
      
      // Check if already completed
      const existingCompletion = await prisma.lessonCompletion.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        }
      })
      
      if (existingCompletion) {
        throw new Error('Lição já foi concluída')
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
      ])
      
      // Update course progress
      await this.updateCourseProgress(userId, lesson.course.id)

      // Update user streak
      await streakService.updateUserStreak(userId)

      logger.info(`User ${userId} completed lesson ${lessonId} and earned ${lesson.xpReward} XP`)

      return {
        completion,
        xpEarned: lesson.xpReward
      }
      
    } catch (error) {
      logger.error('Lesson completion failed:', error)
      throw error
    }
  }
  
  async updateCourseProgress(userId: string, courseId: string) {
    try {
      // Get total lessons in course
      const totalLessons = await prisma.lesson.count({
        where: { courseId }
      })
      
      // Get completed lessons for user
      const completedLessons = await prisma.lessonCompletion.count({
        where: {
          userId,
          lesson: {
            courseId
          }
        }
      })
      
      const progress = Math.round((completedLessons / totalLessons) * 100)
      const isCompleted = progress === 100
      
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
      })
      
      // If course completed, award course XP
      if (isCompleted) {
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: { xpReward: true, title: true }
        })
        
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
          })
          
          logger.info(`User ${userId} completed course ${courseId} and earned ${course.xpReward} XP`)
        }
      }
      
      return { progress, isCompleted }
      
    } catch (error) {
      logger.error('Update course progress failed:', error)
      throw error
    }
  }
  
  async getUserCourses(userId: string) {
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
      })
      
      return enrollments.map(enrollment => ({
        ...enrollment.course,
        enrollment: {
          id: enrollment.id,
          progress: enrollment.progress,
          completedAt: enrollment.completedAt,
          enrolledAt: enrollment.enrolledAt
        },
        totalLessons: enrollment.course._count.lessons
      }))
      
    } catch (error) {
      logger.error('Get user courses failed:', error)
      throw error
    }
  }
  
  // Admin functions
  async createCourse(data: CreateCourseData) {
    try {
      const course = await prisma.course.create({
        data: {
          ...data,
          xpReward: data.xpReward || 0
        }
      })
      
      logger.info(`New course created: ${course.title}`)
      
      return course
      
    } catch (error) {
      logger.error('Create course failed:', error)
      throw error
    }
  }
  
  async addLessonToCourse(courseId: string, data: CreateLessonData) {
    try {
      // Get next order number
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' }
      })
      
      const order = lastLesson ? lastLesson.order + 1 : 1
      
      const lesson = await prisma.lesson.create({
        data: {
          ...data,
          courseId,
          order,
          xpReward: data.xpReward || 10
        }
      })
      
      logger.info(`New lesson added to course ${courseId}: ${lesson.title}`)
      
      return lesson
      
    } catch (error) {
      logger.error('Add lesson to course failed:', error)
      throw error
    }
  }
}

export const courseService = new CourseService()
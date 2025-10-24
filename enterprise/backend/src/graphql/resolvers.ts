import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'
import { authService } from '../services/auth.service.js'
import { courseService } from '../services/course.service.js'
import { logger } from '../utils/logger.js'
import { Context } from './context.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const resolvers = {
  DateTime: {
    __parseValue(value: any) {
      return new Date(value) // value from the client
    },
    __serialize(value: any) {
      return value instanceof Date ? value.toISOString() : value // value sent to the client
    },
    __parseLiteral(ast: any) {
      if (ast.kind === 'StringValue') {
        return new Date(ast.value) // ast value is always in string format
      }
      return null
    }
  },

  Query: {
    // Auth
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await authService.getUserById(context.user.userId)
    },

    // Courses
    courses: async (_: any, __: any, context: Context) => {
      const userId = context.user?.userId
      return await courseService.getAllCourses(userId)
    },

    course: async (_: any, { id }: { id: string }, context: Context) => {
      const userId = context.user?.userId
      return await courseService.getCourseById(id, userId)
    },

    myCourses: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await courseService.getUserCourses(context.user.userId)
    },

    // Achievements
    achievements: async () => {
      return await prisma.achievement.findMany({
        orderBy: { createdAt: 'desc' }
      })
    },

    myAchievements: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.userAchievement.findMany({
        where: { userId: context.user.userId },
        include: {
          achievement: true,
          user: true
        },
        orderBy: { unlockedAt: 'desc' }
      })
    },

    // Chat
    channels: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.channel.findMany({
        where: {
          OR: [
            { type: 'PUBLIC' },
            {
              members: {
                some: {
                  userId: context.user.userId
                }
              }
            }
          ]
        },
        include: {
          members: {
            where: { userId: context.user.userId }
          },
          _count: {
            select: { messages: true, members: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    },

    channel: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      const channel = await prisma.channel.findUnique({
        where: { id },
        include: {
          members: {
            include: {
              user: true
            }
          },
          messages: {
            include: {
              sender: true
            },
            orderBy: { createdAt: 'desc' },
            take: 50
          }
        }
      })
      
      if (!channel) {
        throw new UserInputError('Canal não encontrado')
      }
      
      // Check if user has access to this channel
      const isMember = channel.members.some(member => member.userId === context.user!.userId)
      if (channel.type !== 'PUBLIC' && !isMember) {
        throw new ForbiddenError('Acesso negado a este canal')
      }
      
      return channel
    },

    messages: async (_: any, { channelId, limit = 50, offset = 0 }: { channelId: string, limit?: number, offset?: number }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.message.findMany({
        where: { channelId },
        include: {
          sender: true,
          channel: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      })
    },

    // Calendar
    events: async (_: any, { startDate, endDate }: { startDate?: Date, endDate?: Date }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      const where: any = {}
      
      if (startDate || endDate) {
        where.AND = []
        
        if (startDate) {
          where.AND.push({
            endDate: {
              gte: startDate
            }
          })
        }
        
        if (endDate) {
          where.AND.push({
            startDate: {
              lte: endDate
            }
          })
        }
      }
      
      return await prisma.event.findMany({
        where,
        include: {
          organizer: true,
          attendees: {
            include: {
              user: true
            }
          }
        },
        orderBy: { startDate: 'asc' }
      })
    },

    event: async (_: any, { id }: { id: string }) => {
      return await prisma.event.findUnique({
        where: { id },
        include: {
          organizer: true,
          attendees: {
            include: {
              user: true
            }
          }
        }
      })
    },

    // Projects
    projects: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: context.user.userId
            }
          }
        },
        include: {
          members: {
            include: {
              user: true
            }
          },
          tasks: {
            include: {
              assignee: true
            }
          },
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    },

    project: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          members: {
            include: {
              user: true
            }
          },
          tasks: {
            include: {
              assignee: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      })
      
      if (!project) {
        throw new UserInputError('Projeto não encontrado')
      }
      
      // Check if user is a member of this project
      const isMember = project.members.some(member => member.userId === context.user!.userId)
      if (!isMember) {
        throw new ForbiddenError('Acesso negado a este projeto')
      }
      
      return project
    },

    myProjects: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: context.user.userId
            }
          }
        },
        include: {
          members: {
            include: {
              user: true
            }
          },
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    },

    // Policies
    policies: async (_: any, __: any, context: Context) => {
      const userId = context.user?.userId
      
      const policies = await prisma.policy.findMany({
        where: { isActive: true },
        include: userId ? {
          reads: {
            where: { userId },
            take: 1
          }
        } : false,
        orderBy: { updatedAt: 'desc' }
      })
      
      return policies.map(policy => ({
        ...policy,
        userRead: policy.reads?.[0] || null,
        reads: undefined
      }))
    },

    policy: async (_: any, { id }: { id: string }, context: Context) => {
      const userId = context.user?.userId
      
      const policy = await prisma.policy.findUnique({
        where: { id },
        include: userId ? {
          reads: {
            where: { userId },
            take: 1
          }
        } : false
      })
      
      if (!policy) {
        throw new UserInputError('Política não encontrada')
      }
      
      return {
        ...policy,
        userRead: policy.reads?.[0] || null,
        reads: undefined
      }
    },

    // Links
    links: async () => {
      return await prisma.link.findMany({
        where: { isActive: true },
        orderBy: [{ category: 'asc' }, { title: 'asc' }]
      })
    }
  },

  Mutation: {
    // Auth
    login: async (_: any, { input }: { input: any }) => {
      return await authService.login(input)
    },

    register: async (_: any, { input }: { input: any }) => {
      return await authService.register(input)
    },

    logout: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      await authService.logout(context.user.userId)
      return true
    },

    // Courses
    enrollInCourse: async (_: any, { courseId }: { courseId: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await courseService.enrollInCourse(context.user.userId, courseId)
    },

    completeLesson: async (_: any, { lessonId }: { lessonId: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await courseService.completeLesson(context.user.userId, lessonId)
    },

    createCourse: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user || (context.user.role !== 'ADMIN' && context.user.role !== 'MANAGER')) {
        throw new ForbiddenError('Acesso negado - permissões insuficientes')
      }
      
      return await courseService.createCourse(input)
    },

    addLessonToCourse: async (_: any, { courseId, input }: { courseId: string, input: any }, context: Context) => {
      if (!context.user || (context.user.role !== 'ADMIN' && context.user.role !== 'MANAGER')) {
        throw new ForbiddenError('Acesso negado - permissões insuficientes')
      }
      
      return await courseService.addLessonToCourse(courseId, input)
    },

    // Chat
    sendMessage: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      const message = await prisma.message.create({
        data: {
          ...input,
          senderId: context.user.userId,
          type: input.type || 'TEXT'
        },
        include: {
          sender: true,
          channel: true
        }
      })
      
      // Update channel timestamp
      await prisma.channel.update({
        where: { id: input.channelId },
        data: { updatedAt: new Date() }
      })
      
      return message
    },

    joinChannel: async (_: any, { channelId }: { channelId: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.channelMember.create({
        data: {
          userId: context.user.userId,
          channelId,
          role: 'MEMBER'
        },
        include: {
          user: true,
          channel: true
        }
      })
    },

    // Calendar
    createEvent: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      const event = await prisma.event.create({
        data: {
          ...input,
          organizerId: context.user.userId,
          isAllDay: input.isAllDay || false
        },
        include: {
          organizer: true,
          attendees: {
            include: {
              user: true
            }
          }
        }
      })
      
      // Add organizer as attendee with ACCEPTED status
      await prisma.eventAttendee.create({
        data: {
          userId: context.user.userId,
          eventId: event.id,
          status: 'ACCEPTED'
        }
      })
      
      return event
    },

    updateEventAttendance: async (_: any, { eventId, status }: { eventId: string, status: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.eventAttendee.upsert({
        where: {
          userId_eventId: {
            userId: context.user.userId,
            eventId
          }
        },
        create: {
          userId: context.user.userId,
          eventId,
          status: status as any
        },
        update: {
          status: status as any
        },
        include: {
          user: true,
          event: true
        }
      })
    },

    // Projects
    createProject: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      const project = await prisma.project.create({
        data: {
          ...input,
          status: 'PLANNING',
          priority: input.priority || 'MEDIUM'
        }
      })
      
      // Add creator as project owner
      await prisma.projectMember.create({
        data: {
          userId: context.user.userId,
          projectId: project.id,
          role: 'OWNER'
        }
      })
      
      return await prisma.project.findUnique({
        where: { id: project.id },
        include: {
          members: {
            include: {
              user: true
            }
          },
          tasks: {
            include: {
              assignee: true
            }
          }
        }
      })
    },

    createTask: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.task.create({
        data: {
          ...input,
          status: 'TODO',
          priority: input.priority || 'MEDIUM'
        },
        include: {
          assignee: true,
          project: true
        }
      })
    },

    updateTask: async (_: any, { id, input }: { id: string, input: any }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.task.update({
        where: { id },
        data: input,
        include: {
          assignee: true,
          project: true
        }
      })
    },

    deleteTask: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      await prisma.task.delete({
        where: { id }
      })
      
      return true
    },

    // Policies
    markPolicyAsRead: async (_: any, { policyId }: { policyId: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.policyRead.upsert({
        where: {
          userId_policyId: {
            userId: context.user.userId,
            policyId
          }
        },
        create: {
          userId: context.user.userId,
          policyId
        },
        update: {
          readAt: new Date()
        },
        include: {
          user: true,
          policy: true
        }
      })
    },

    acknowledgPolicy: async (_: any, { policyId }: { policyId: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Usuário não autenticado')
      }
      
      return await prisma.policyRead.upsert({
        where: {
          userId_policyId: {
            userId: context.user.userId,
            policyId
          }
        },
        create: {
          userId: context.user.userId,
          policyId,
          acknowledged: true
        },
        update: {
          acknowledged: true,
          readAt: new Date()
        },
        include: {
          user: true,
          policy: true
        }
      })
    }
  }
}
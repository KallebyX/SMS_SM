import { PrismaClient } from '@prisma/client'
import { logger } from '../src/utils/logger.js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  try {
    logger.info('Starting database seeding...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@sms-sm.com' },
      update: {},
      create: {
        email: 'admin@sms-sm.com',
        username: 'admin',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'Sistema',
        role: 'ADMIN',
        department: 'TI',
        position: 'Administrador do Sistema',
        totalXP: 10000,
        level: 10
      }
    })

    // Create sample users
    const userPassword = await bcrypt.hash('user123', 12)
    const user1 = await prisma.user.upsert({
      where: { email: 'joao@sms-sm.com' },
      update: {},
      create: {
        email: 'joao@sms-sm.com',
        username: 'joao.silva',
        password: userPassword,
        firstName: 'João',
        lastName: 'Silva',
        role: 'USER',
        department: 'Enfermagem',
        position: 'Enfermeiro',
        totalXP: 1250,
        level: 3
      }
    })

    const user2 = await prisma.user.upsert({
      where: { email: 'maria@sms-sm.com' },
      update: {},
      create: {
        email: 'maria@sms-sm.com',
        username: 'maria.santos',
        password: userPassword,
        firstName: 'Maria',
        lastName: 'Santos',
        role: 'MANAGER',
        department: 'Medicina',
        position: 'Médica Coordenadora',
        totalXP: 3500,
        level: 5
      }
    })

    // Create sample courses
    const course1 = await prisma.course.upsert({
      where: { id: 'course-1' },
      update: {},
      create: {
        id: 'course-1',
        title: 'Segurança do Paciente',
        description: 'Curso completo sobre protocolos de segurança do paciente no ambiente hospitalar.',
        category: 'Segurança',
        difficulty: 'INTERMEDIATE',
        xpReward: 200,
        estimatedTime: '2 horas',
        thumbnail: '/static/courses/seguranca-paciente.jpg'
      }
    })

    const course2 = await prisma.course.upsert({
      where: { id: 'course-2' },
      update: {},
      create: {
        id: 'course-2',
        title: 'Controle de Infecção Hospitalar',
        description: 'Práticas e protocolos para prevenção e controle de infecções hospitalares.',
        category: 'Controle de Infecção',
        difficulty: 'ADVANCED',
        xpReward: 300,
        estimatedTime: '3 horas',
        thumbnail: '/static/courses/controle-infeccao.jpg'
      }
    })

    // Create lessons for courses
    await prisma.lesson.createMany({
      data: [
        {
          id: 'lesson-1-1',
          title: 'Introdução à Segurança do Paciente',
          content: 'Conceitos fundamentais sobre segurança do paciente...',
          order: 1,
          xpReward: 50,
          courseId: 'course-1'
        },
        {
          id: 'lesson-1-2',
          title: 'Protocolos de Identificação',
          content: 'Protocolos para identificação correta do paciente...',
          order: 2,
          xpReward: 50,
          courseId: 'course-1'
        },
        {
          id: 'lesson-1-3',
          title: 'Medicação Segura',
          content: 'Práticas para administração segura de medicamentos...',
          order: 3,
          xpReward: 50,
          courseId: 'course-1'
        },
        {
          id: 'lesson-2-1',
          title: 'Fundamentos do Controle de Infecção',
          content: 'Bases científicas do controle de infecção hospitalar...',
          order: 1,
          xpReward: 75,
          courseId: 'course-2'
        },
        {
          id: 'lesson-2-2',
          title: 'Higienização das Mãos',
          content: 'Técnicas corretas de higienização das mãos...',
          order: 2,
          xpReward: 75,
          courseId: 'course-2'
        }
      ],
      skipDuplicates: true
    })

    // Create achievements
    await prisma.achievement.createMany({
      data: [
        {
          id: 'achievement-1',
          title: 'Primeiro Curso',
          description: 'Complete seu primeiro curso de treinamento',
          icon: '🎓',
          xpReward: 100,
          type: 'COURSE_COMPLETION',
          condition: JSON.stringify({ type: 'course_completion', count: 1 })
        },
        {
          id: 'achievement-2',
          title: 'Estudante Dedicado',
          description: 'Complete 5 cursos de treinamento',
          icon: '📚',
          xpReward: 500,
          type: 'COURSE_COMPLETION',
          condition: JSON.stringify({ type: 'course_completion', count: 5 })
        },
        {
          id: 'achievement-3',
          title: 'Milestone 1000 XP',
          description: 'Alcance 1000 pontos de experiência',
          icon: '⭐',
          xpReward: 100,
          type: 'XP_MILESTONE',
          condition: JSON.stringify({ type: 'xp_milestone', amount: 1000 })
        }
      ],
      skipDuplicates: true
    })

    // Create channels
    const generalChannel = await prisma.channel.upsert({
      where: { id: 'channel-general' },
      update: {},
      create: {
        id: 'channel-general',
        name: 'Geral',
        description: 'Canal geral para discussões',
        type: 'PUBLIC'
      }
    })

    const emergencyChannel = await prisma.channel.upsert({
      where: { id: 'channel-emergency' },
      update: {},
      create: {
        id: 'channel-emergency',
        name: 'Emergência',
        description: 'Canal para comunicações de emergência',
        type: 'PUBLIC'
      }
    })

    // Create channel members
    await prisma.channelMember.createMany({
      data: [
        { userId: admin.id, channelId: generalChannel.id, role: 'ADMIN' },
        { userId: user1.id, channelId: generalChannel.id, role: 'MEMBER' },
        { userId: user2.id, channelId: generalChannel.id, role: 'MODERATOR' },
        { userId: admin.id, channelId: emergencyChannel.id, role: 'ADMIN' },
        { userId: user1.id, channelId: emergencyChannel.id, role: 'MEMBER' },
        { userId: user2.id, channelId: emergencyChannel.id, role: 'MEMBER' }
      ],
      skipDuplicates: true
    })

    // Create sample events
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    await prisma.event.createMany({
      data: [
        {
          id: 'event-1',
          title: 'Reunião de Equipe',
          description: 'Reunião mensal da equipe de enfermagem',
          startDate: tomorrow,
          endDate: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
          type: 'MEETING',
          location: 'Sala de Reuniões A',
          organizerId: user2.id
        },
        {
          id: 'event-2',
          title: 'Treinamento de Emergência',
          description: 'Simulação de atendimento de emergência',
          startDate: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000), // next day
          endDate: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
          type: 'TRAINING',
          location: 'Centro de Simulação',
          organizerId: admin.id
        }
      ],
      skipDuplicates: true
    })

    // Create sample project
    const project = await prisma.project.upsert({
      where: { id: 'project-1' },
      update: {},
      create: {
        id: 'project-1',
        name: 'Implementação do Protocolo de Sepse',
        description: 'Projeto para implementar o novo protocolo de identificação e tratamento de sepse',
        status: 'ACTIVE',
        priority: 'HIGH',
        startDate: today,
        dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    })

    // Create project members
    await prisma.projectMember.createMany({
      data: [
        { userId: user2.id, projectId: project.id, role: 'OWNER' },
        { userId: admin.id, projectId: project.id, role: 'ADMIN' },
        { userId: user1.id, projectId: project.id, role: 'MEMBER' }
      ],
      skipDuplicates: true
    })

    // Create sample tasks
    await prisma.task.createMany({
      data: [
        {
          id: 'task-1',
          title: 'Revisar literatura sobre sepse',
          description: 'Fazer levantamento bibliográfico sobre protocolos de sepse',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          assigneeId: user1.id,
          projectId: project.id
        },
        {
          id: 'task-2',
          title: 'Definir critérios de diagnóstico',
          description: 'Estabelecer critérios claros para diagnóstico de sepse',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          assigneeId: user2.id,
          projectId: project.id
        },
        {
          id: 'task-3',
          title: 'Treinar equipe médica',
          description: 'Conduzir treinamento da equipe médica sobre o novo protocolo',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
          assigneeId: admin.id,
          projectId: project.id
        }
      ],
      skipDuplicates: true
    })

    // Create sample policies
    await prisma.policy.createMany({
      data: [
        {
          id: 'policy-1',
          title: 'Política de Segurança da Informação',
          content: 'Esta política estabelece as diretrizes para segurança da informação...',
          version: '1.0',
          category: 'Segurança',
          requiresAcknowledgment: true
        },
        {
          id: 'policy-2',
          title: 'Protocolo de Higienização',
          content: 'Protocolo para higienização adequada das mãos e materiais...',
          version: '2.1',
          category: 'Controle de Infecção',
          requiresAcknowledgment: true
        },
        {
          id: 'policy-3',
          title: 'Diretrizes de Atendimento ao Paciente',
          content: 'Diretrizes gerais para atendimento humanizado ao paciente...',
          version: '1.5',
          category: 'Atendimento',
          requiresAcknowledgment: false
        }
      ],
      skipDuplicates: true
    })

    // Create sample links
    await prisma.link.createMany({
      data: [
        {
          id: 'link-1',
          title: 'Portal SMS-SM',
          url: 'https://sms.saomateus.es.gov.br',
          description: 'Portal oficial da Secretaria Municipal de Saúde',
          category: 'SYSTEM'
        },
        {
          id: 'link-2',
          title: 'Sistema de Prontuário Eletrônico',
          url: 'https://prontuario.sms-sm.com',
          description: 'Acesso ao sistema de prontuário eletrônico',
          category: 'SYSTEM'
        },
        {
          id: 'link-3',
          title: 'Biblioteca Virtual em Saúde',
          url: 'https://bvsms.saude.gov.br',
          description: 'Biblioteca virtual com recursos para profissionais de saúde',
          category: 'TRAINING'
        },
        {
          id: 'link-4',
          title: 'Suporte Técnico',
          url: 'https://suporte.sms-sm.com',
          description: 'Portal de suporte técnico para sistemas',
          category: 'SUPPORT'
        }
      ],
      skipDuplicates: true
    })

    logger.info('Database seeding completed successfully!')
    logger.info(`Created users: ${admin.email}, ${user1.email}, ${user2.email}`)
    logger.info('Created sample courses, achievements, channels, events, projects, policies, and links')

  } catch (error) {
    logger.error('Error during database seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed().catch((error) => {
  logger.error('Seeding failed:', error)
  process.exit(1)
})
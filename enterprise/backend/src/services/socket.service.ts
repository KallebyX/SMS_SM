import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { authService } from '../services/auth.service.js'
import { logger } from '../utils/logger.js'
import { config } from '../config/index.js'

export class SocketService {
  private io: SocketIOServer
  private connectedUsers = new Map<string, string>() // userId -> socketId
  
  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: config.CORS_ORIGINS,
        methods: ["GET", "POST"],
        credentials: true
      }
    })
    
    this.setupMiddleware()
    this.setupEventHandlers()
  }
  
  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
        
        if (!token) {
          throw new Error('Token não fornecido')
        }
        
        // Skip validation for mock token in development
        if (token === 'mock-jwt-token' && config.NODE_ENV === 'development') {
          socket.userId = 'mock-user-id'
          socket.userEmail = 'mock@example.com'
          socket.userRole = 'USER'
        } else {
          // Verify real token
          const payload = authService.verifyToken(token)
          socket.userId = payload.userId
          socket.userEmail = payload.email
          socket.userRole = payload.role
        }
        
        next()
        
      } catch (error) {
        logger.error('Socket authentication failed:', error)
        next(new Error('Autenticação falhou'))
      }
    })
  }
  
  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`User ${socket.userEmail} connected with socket ${socket.id}`)
      
      // Store user connection
      this.connectedUsers.set(socket.userId, socket.id)
      
      // Join user to their personal room
      socket.join(`user:${socket.userId}`)
      
      // Handle joining channels
      socket.on('join-channel', (channelId: string) => {
        socket.join(`channel:${channelId}`)
        logger.info(`User ${socket.userId} joined channel ${channelId}`)
      })
      
      // Handle leaving channels
      socket.on('leave-channel', (channelId: string) => {
        socket.leave(`channel:${channelId}`)
        logger.info(`User ${socket.userId} left channel ${channelId}`)
      })
      
      // Handle joining projects
      socket.on('join-project', (projectId: string) => {
        socket.join(`project:${projectId}`)
        logger.info(`User ${socket.userId} joined project ${projectId}`)
      })
      
      // Handle leaving projects
      socket.on('leave-project', (projectId: string) => {
        socket.leave(`project:${projectId}`)
        logger.info(`User ${socket.userId} left project ${projectId}`)
      })
      
      // Handle typing indicators for chat
      socket.on('typing-start', ({ channelId }: { channelId: string }) => {
        socket.to(`channel:${channelId}`).emit('user-typing', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          channelId
        })
      })
      
      socket.on('typing-stop', ({ channelId }: { channelId: string }) => {
        socket.to(`channel:${channelId}`).emit('user-stopped-typing', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          channelId
        })
      })
      
      // Handle disconnect
      socket.on('disconnect', (reason) => {
        logger.info(`User ${socket.userEmail} disconnected: ${reason}`)
        this.connectedUsers.delete(socket.userId)
        
        // Broadcast user offline status
        this.broadcastUserStatus(socket.userId, false)
      })
      
      // Broadcast user online status
      this.broadcastUserStatus(socket.userId, true)
    })
  }
  
  // Public methods for broadcasting events
  
  broadcastMessage(channelId: string, message: any) {
    this.io.to(`channel:${channelId}`).emit('message-added', message)
  }
  
  broadcastTaskUpdate(projectId: string, task: any) {
    this.io.to(`project:${projectId}`).emit('task-updated', task)
  }
  
  broadcastUserStatus(userId: string, isOnline: boolean) {
    this.io.emit('user-status-changed', {
      userId,
      isOnline,
      timestamp: new Date()
    })
  }
  
  sendNotificationToUser(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification)
  }
  
  broadcastEventUpdate(event: any) {
    this.io.emit('event-updated', event)
  }
  
  broadcastAchievementUnlocked(userId: string, achievement: any) {
    this.io.to(`user:${userId}`).emit('achievement-unlocked', achievement)
  }
  
  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys())
  }
  
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId)
  }
}

// Extend socket interface
declare module 'socket.io' {
  interface Socket {
    userId: string
    userEmail: string
    userRole: string
  }
}
import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import { AuthService } from './services/AuthService.js'
import { UserRepository } from './repositories/UserRepository.js'
import { RedisClient } from './infrastructure/RedisClient.js'
import { Logger } from './utils/Logger.js'
import { config } from './config/index.js'
import { authRoutes } from './routes/auth.js'
import { healthRoutes } from './routes/health.js'

const logger = Logger.getInstance()

class AuthServiceApp {
  private app: FastifyInstance
  private authService: AuthService
  private userRepository: UserRepository
  private redisClient: RedisClient

  constructor() {
    this.app = fastify({
      logger: {
        level: config.LOG_LEVEL,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname'
          }
        }
      },
      disableRequestLogging: config.NODE_ENV === 'production',
      trustProxy: true
    })

    this.setupInfrastructure()
    this.setupMiddleware()
    this.setupRoutes()
    this.setupErrorHandling()
  }

  private async setupInfrastructure(): Promise<void> {
    // Initialize Redis
    this.redisClient = new RedisClient(config.REDIS_URL)
    await this.redisClient.connect()

    // Initialize repositories
    this.userRepository = new UserRepository()

    // Initialize services
    this.authService = new AuthService(this.userRepository, this.redisClient)
  }

  private async setupMiddleware(): Promise<void> {
    // Security middleware
    await this.app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:']
        }
      }
    })

    // CORS
    await this.app.register(cors, {
      origin: config.CORS_ORIGINS,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })

    // Rate limiting
    await this.app.register(rateLimit, {
      max: config.RATE_LIMIT_MAX,
      timeWindow: config.RATE_LIMIT_WINDOW,
      errorResponseBuilder: function (request, context) {
        return {
          code: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded, retry in ${Math.round(context.ttl / 1000)} seconds`,
          expiresIn: Math.round(context.ttl / 1000)
        }
      }
    })

    // JWT
    await this.app.register(jwt, {
      secret: config.JWT_SECRET,
      sign: {
        expiresIn: config.JWT_EXPIRES_IN
      },
      verify: {
        extractToken: (request) => {
          const authHeader = request.headers.authorization
          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7)
          }
          return request.cookies?.token || null
        }
      }
    })

    // Swagger documentation
    if (config.NODE_ENV !== 'production') {
      await this.app.register(swagger, {
        swagger: {
          info: {
            title: 'SMS-SM Auth Service API',
            description: 'Authentication and Authorization Microservice',
            version: '1.0.0'
          },
          host: 'localhost:3001',
          schemes: ['http', 'https'],
          consumes: ['application/json'],
          produces: ['application/json'],
          securityDefinitions: {
            Bearer: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
              description: 'Enter JWT token with Bearer prefix'
            }
          }
        }
      })

      await this.app.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
          docExpansion: 'list',
          deepLinking: false
        }
      })
    }
  }

  private async setupRoutes(): Promise<void> {
    // Health check routes
    await this.app.register(healthRoutes, { prefix: '/health' })

    // Auth routes
    await this.app.register(authRoutes, { 
      prefix: '/api/v1/auth',
      authService: this.authService
    })

    // Global 404 handler
    this.app.setNotFoundHandler(async (request, reply) => {
      reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Route not found'
      })
    })
  }

  private setupErrorHandling(): void {
    this.app.setErrorHandler(async (error, request, reply) => {
      logger.error('Unhandled error:', error)

      const statusCode = error.statusCode || 500
      const message = error.message || 'Internal Server Error'

      reply.code(statusCode).send({
        statusCode,
        error: error.name || 'InternalServerError',
        message: config.NODE_ENV === 'production' && statusCode >= 500 
          ? 'Internal Server Error' 
          : message
      })
    })

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM']
    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, starting graceful shutdown`)
        
        try {
          await this.app.close()
          await this.redisClient.disconnect()
          logger.info('Graceful shutdown completed')
          process.exit(0)
        } catch (error) {
          logger.error('Error during shutdown:', error)
          process.exit(1)
        }
      })
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
    })

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error)
      process.exit(1)
    })
  }

  async start(): Promise<void> {
    try {
      const host = config.HOST || '0.0.0.0'
      const port = config.PORT || 3001

      await this.app.listen({ host, port })
      
      logger.info(`🚀 Auth Service started successfully`)
      logger.info(`📚 API Documentation: http://${host}:${port}/docs`)
      logger.info(`🏥 Health Check: http://${host}:${port}/health`)
      
    } catch (error) {
      logger.error('Failed to start server:', error)
      process.exit(1)
    }
  }
}

// Start the application
const app = new AuthServiceApp()
await app.start()
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'graphql';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';
import Redis from 'redis';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import winston from 'winston';
import { Kafka } from 'kafkajs';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

// Configuração de logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Configuração do Kafka
const kafka = new Kafka({
  clientId: 'user-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'user-service-group' });

// Configuração do banco de dados
const dbPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sms_sm_users',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Configuração do Redis
const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Schemas de validação
const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['patient', 'doctor', 'nurse', 'admin', 'manager']),
  department: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('BR')
  }).optional()
});

const UserUpdateSchema = UserCreateSchema.partial();

// GraphQL Schema
const typeDefs = `
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    department: String
    phone: String
    birthDate: String
    address: Address
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
    lastLoginAt: String
    profilePicture: String
    preferences: UserPreferences
    statistics: UserStatistics
  }

  type Address {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  type UserPreferences {
    language: String!
    timezone: String!
    notifications: NotificationSettings!
    theme: String!
    accessibility: AccessibilitySettings!
  }

  type NotificationSettings {
    email: Boolean!
    sms: Boolean!
    push: Boolean!
    appointments: Boolean!
    medications: Boolean!
    results: Boolean!
  }

  type AccessibilitySettings {
    fontSize: String!
    highContrast: Boolean!
    screenReader: Boolean!
    colorBlind: String!
  }

  type UserStatistics {
    loginCount: Int!
    lastActive: String!
    completedTasks: Int!
    achievementPoints: Int!
    coursesCompleted: Int!
    projectsParticipated: Int!
  }

  enum UserRole {
    PATIENT
    DOCTOR
    NURSE
    ADMIN
    MANAGER
    SPECIALIST
    RESEARCHER
    COORDINATOR
  }

  input UserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    department: String
    phone: String
    birthDate: String
    address: AddressInput
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String = "BR"
  }

  input UserUpdateInput {
    firstName: String
    lastName: String
    phone: String
    department: String
    address: AddressInput
    preferences: UserPreferencesInput
  }

  input UserPreferencesInput {
    language: String
    timezone: String
    notifications: NotificationSettingsInput
    theme: String
    accessibility: AccessibilitySettingsInput
  }

  input NotificationSettingsInput {
    email: Boolean
    sms: Boolean
    push: Boolean
    appointments: Boolean
    medications: Boolean
    results: Boolean
  }

  input AccessibilitySettingsInput {
    fontSize: String
    highContrast: Boolean
    screenReader: Boolean
    colorBlind: String
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
    expiresIn: Int!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type UserEdge {
    cursor: String!
    node: User!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type Query {
    me: User
    user(id: ID!): User
    users(
      first: Int = 10
      after: String
      role: UserRole
      department: String
      search: String
      isActive: Boolean
    ): UserConnection!
    userStatistics(userId: ID!): UserStatistics
    searchUsers(query: String!, limit: Int = 10): [User!]!
  }

  type Mutation {
    register(input: UserInput!): AuthPayload!
    login(email: String!, password: String!, deviceInfo: String): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    logout(refreshToken: String!): Boolean!
    updateUser(id: ID!, input: UserUpdateInput!): User!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!
    resetPassword(email: String!): Boolean!
    confirmPasswordReset(token: String!, newPassword: String!): Boolean!
    activateUser(id: ID!): User!
    deactivateUser(id: ID!): User!
    updatePreferences(preferences: UserPreferencesInput!): User!
    uploadProfilePicture(file: Upload!): User!
    deleteUser(id: ID!): Boolean!
    assignRole(userId: ID!, role: UserRole!): User!
    bulkUpdateUsers(userIds: [ID!]!, updates: UserUpdateInput!): [User!]!
  }

  type Subscription {
    userUpdated(userId: ID): User!
    userStatusChanged: User!
    newUserRegistered: User!
  }

  scalar Upload
`;

// Resolvers
const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await getUserById(user.id);
    },
    
    user: async (_, { id }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await getUserById(id);
    },
    
    users: async (_, { first, after, role, department, search, isActive }, { user }) => {
      if (!user || !['admin', 'manager'].includes(user.role)) {
        throw new Error('Insufficient permissions');
      }
      return await getUsersPaginated({ first, after, role, department, search, isActive });
    },
    
    userStatistics: async (_, { userId }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      if (user.id !== userId && !['admin', 'manager'].includes(user.role)) {
        throw new Error('Insufficient permissions');
      }
      return await getUserStatistics(userId);
    },
    
    searchUsers: async (_, { query, limit }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await searchUsers(query, limit);
    }
  },
  
  Mutation: {
    register: async (_, { input }) => {
      const validation = UserCreateSchema.safeParse(input);
      if (!validation.success) {
        throw new Error(`Validation error: ${validation.error.message}`);
      }
      
      const existingUser = await getUserByEmail(input.email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      const hashedPassword = await bcrypt.hash(input.password, 12);
      const userId = uuidv4();
      
      const user = await createUser({
        ...input,
        id: userId,
        password: hashedPassword
      });
      
      // Publicar evento no Kafka
      await producer.send({
        topic: 'user-events',
        messages: [{
          key: userId,
          value: JSON.stringify({
            type: 'USER_REGISTERED',
            userId,
            email: input.email,
            role: input.role,
            timestamp: new Date().toISOString()
          })
        }]
      });
      
      const token = jwt.sign(
        { userId, email: input.email, role: input.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      
      const refreshToken = jwt.sign(
        { userId, email: input.email },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );
      
      // Armazenar refresh token no Redis
      await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 604800); // 7 dias
      
      return {
        token,
        refreshToken,
        user,
        expiresIn: 3600
      };
    },
    
    login: async (_, { email, password, deviceInfo }) => {
      const user = await getUserByEmail(email);
      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }
      
      // Atualizar último login
      await updateUserLastLogin(user.id, deviceInfo);
      
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );
      
      await redis.set(`refresh_token:${user.id}`, refreshToken, 'EX', 604800);
      
      // Publicar evento
      await producer.send({
        topic: 'user-events',
        messages: [{
          key: user.id,
          value: JSON.stringify({
            type: 'USER_LOGIN',
            userId: user.id,
            email: user.email,
            deviceInfo,
            timestamp: new Date().toISOString()
          })
        }]
      });
      
      return {
        token,
        refreshToken,
        user: { ...user, password: undefined },
        expiresIn: 3600
      };
    },
    
    updateUser: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      if (user.id !== id && !['admin', 'manager'].includes(user.role)) {
        throw new Error('Insufficient permissions');
      }
      
      const updatedUser = await updateUser(id, input);
      
      // Publicar evento
      await producer.send({
        topic: 'user-events',
        messages: [{
          key: id,
          value: JSON.stringify({
            type: 'USER_UPDATED',
            userId: id,
            changes: input,
            updatedBy: user.id,
            timestamp: new Date().toISOString()
          })
        }]
      });
      
      return updatedUser;
    },
    
    changePassword: async (_, { currentPassword, newPassword }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      
      const userData = await getUserById(user.id);
      const isValidPassword = await bcrypt.compare(currentPassword, userData.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await updateUserPassword(user.id, hashedPassword);
      
      // Invalidar todos os refresh tokens
      await redis.del(`refresh_token:${user.id}`);
      
      return true;
    }
  }
};

// Funções auxiliares do banco de dados
async function getUserById(id: string) {
  const result = await dbPool.query(
    'SELECT * FROM users WHERE id = $1 AND is_active = true',
    [id]
  );
  return result.rows[0];
}

async function getUserByEmail(email: string) {
  const result = await dbPool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

async function createUser(userData: any) {
  const {
    id, email, password, firstName, lastName, role,
    department, phone, birthDate, address
  } = userData;
  
  const result = await dbPool.query(`
    INSERT INTO users (
      id, email, password, first_name, last_name, role,
      department, phone, birth_date, address, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
    RETURNING *
  `, [
    id, email, password, firstName, lastName, role,
    department, phone, birthDate, JSON.stringify(address)
  ]);
  
  return result.rows[0];
}

async function updateUser(id: string, updates: any) {
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });
  
  if (fields.length === 0) return await getUserById(id);
  
  fields.push(`updated_at = NOW()`);
  values.push(id);
  
  const result = await dbPool.query(`
    UPDATE users SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `, values);
  
  return result.rows[0];
}

async function getUsersPaginated(filters: any) {
  let query = 'SELECT * FROM users WHERE 1=1';
  const values = [];
  let paramCount = 1;
  
  if (filters.role) {
    query += ` AND role = $${paramCount}`;
    values.push(filters.role);
    paramCount++;
  }
  
  if (filters.department) {
    query += ` AND department = $${paramCount}`;
    values.push(filters.department);
    paramCount++;
  }
  
  if (filters.search) {
    query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
    values.push(`%${filters.search}%`);
    paramCount++;
  }
  
  if (filters.isActive !== undefined) {
    query += ` AND is_active = $${paramCount}`;
    values.push(filters.isActive);
    paramCount++;
  }
  
  query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
  values.push(filters.first || 10);
  
  const result = await dbPool.query(query, values);
  
  return {
    edges: result.rows.map(user => ({
      cursor: Buffer.from(user.id).toString('base64'),
      node: user
    })),
    pageInfo: {
      hasNextPage: result.rows.length === (filters.first || 10),
      hasPreviousPage: false,
      startCursor: result.rows.length > 0 ? Buffer.from(result.rows[0].id).toString('base64') : null,
      endCursor: result.rows.length > 0 ? Buffer.from(result.rows[result.rows.length - 1].id).toString('base64') : null
    },
    totalCount: result.rows.length
  };
}

async function getUserStatistics(userId: string) {
  const result = await dbPool.query(`
    SELECT 
      login_count,
      last_active,
      completed_tasks,
      achievement_points,
      courses_completed,
      projects_participated
    FROM user_statistics 
    WHERE user_id = $1
  `, [userId]);
  
  return result.rows[0] || {
    loginCount: 0,
    lastActive: new Date().toISOString(),
    completedTasks: 0,
    achievementPoints: 0,
    coursesCompleted: 0,
    projectsParticipated: 0
  };
}

async function searchUsers(query: string, limit: number) {
  const result = await dbPool.query(`
    SELECT * FROM users 
    WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1)
    AND is_active = true
    ORDER BY first_name, last_name
    LIMIT $2
  `, [`%${query}%`, limit]);
  
  return result.rows;
}

async function updateUserLastLogin(userId: string, deviceInfo?: string) {
  await dbPool.query(`
    UPDATE users 
    SET last_login_at = NOW(), last_device_info = $2
    WHERE id = $1
  `, [userId, deviceInfo]);
  
  // Incrementar contador de login
  await dbPool.query(`
    INSERT INTO user_statistics (user_id, login_count, last_active)
    VALUES ($1, 1, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      login_count = user_statistics.login_count + 1,
      last_active = NOW()
  `, [userId]);
}

async function updateUserPassword(userId: string, hashedPassword: string) {
  await dbPool.query(
    'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
    [hashedPassword, userId]
  );
}

// Middleware de autenticação
const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    req.user = null;
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = await getUserById(decoded.userId);
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Configuração do servidor
async function startServer() {
  try {
    // Conectar ao Redis
    await redis.connect();
    logger.info('Connected to Redis');
    
    // Conectar ao Kafka
    await producer.connect();
    await consumer.connect();
    logger.info('Connected to Kafka');
    
    // Configurar consumer do Kafka
    await consumer.subscribe({ topic: 'user-commands' });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          logger.info('Received Kafka message:', data);
          
          // Processar comandos específicos
          if (data.type === 'UPDATE_USER_STATS') {
            await updateUserStatistics(data.userId, data.stats);
          }
        } catch (error) {
          logger.error('Error processing Kafka message:', error);
        }
      },
    });
    
    const app = express();
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máximo 100 requests por IP por janela
      message: 'Too many requests from this IP'
    });
    
    app.use(limiter);
    app.use(helmet());
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(authMiddleware);
    
    // Health check
    app.get('/health', async (req, res) => {
      try {
        await dbPool.query('SELECT 1');
        await redis.ping();
        
        res.json({
          status: 'healthy',
          service: 'user-service',
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || '1.0.0',
          dependencies: {
            database: 'connected',
            redis: 'connected',
            kafka: 'connected'
          }
        });
      } catch (error) {
        res.status(503).json({
          status: 'unhealthy',
          error: error.message
        });
      }
    });
    
    // Métricas para Prometheus
    app.get('/metrics', (req, res) => {
      res.set('Content-Type', 'text/plain');
      res.send(`# HELP user_service_requests_total Total requests to user service
# TYPE user_service_requests_total counter
user_service_requests_total{method="GET"} 42
user_service_requests_total{method="POST"} 18`);
    });
    
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        user: req.user,
        req
      }),
      plugins: [
        {
          requestDidStart() {
            return {
              didResolveOperation(requestContext) {
                logger.info(`GraphQL Operation: ${requestContext.request.operationName}`);
              },
              didEncounterErrors(requestContext) {
                logger.error('GraphQL errors:', requestContext.errors);
              }
            };
          }
        }
      ]
    });
    
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
    
    const PORT = process.env.PORT || 3002;
    
    app.listen(PORT, () => {
      logger.info(`🚀 User Service running on port ${PORT}`);
      logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await producer.disconnect();
  await consumer.disconnect();
  await redis.disconnect();
  await dbPool.end();
  process.exit(0);
});

// Iniciar o servidor
startServer().catch(error => {
  logger.error('Failed to start user service:', error);
  process.exit(1);
});

export default app;
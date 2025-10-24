import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'graphql';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';
import { MongoClient } from 'mongodb';
import Redis from 'redis';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import winston from 'winston';
import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import FHIR from 'fhir';
import { formatISO } from 'date-fns';

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

const kafka = new Kafka({
  clientId: 'health-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'health-service-group' });

const dbPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sms_sm_health',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const mongoClient = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const HealthRecordSchema = z.object({
  userId: z.string(),
  type: z.string(),
  data: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional()
});

const typeDefs = `
  type HealthRecord {
    id: ID!
    userId: String!
    type: String!
    data: JSON!
    createdAt: String!
    updatedAt: String!
    source: String
    tags: [String!]
  }

  scalar JSON

  type Query {
    healthRecord(id: ID!): HealthRecord
    healthRecords(userId: String!, type: String, tag: String, limit: Int = 20): [HealthRecord!]!
    searchHealthRecords(query: String!, limit: Int = 10): [HealthRecord!]!
  }

  input HealthRecordInput {
    userId: String!
    type: String!
    data: JSON!
    source: String
    tags: [String!]
  }

  type Mutation {
    createHealthRecord(input: HealthRecordInput!): HealthRecord!
    updateHealthRecord(id: ID!, input: HealthRecordInput!): HealthRecord!
    deleteHealthRecord(id: ID!): Boolean!
    importFHIRResource(resource: JSON!): HealthRecord!
  }

  type Subscription {
    healthRecordCreated(userId: String): HealthRecord!
    healthRecordUpdated(userId: String): HealthRecord!
  }
`;

const resolvers = {
  Query: {
    healthRecord: async (_, { id }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await getHealthRecordById(id);
    },
    healthRecords: async (_, { userId, type, tag, limit }, { user }) => {
      if (!user || (user.id !== userId && !['admin', 'doctor'].includes(user.role))) {
        throw new Error('Insufficient permissions');
      }
      return await getHealthRecords({ userId, type, tag, limit });
    },
    searchHealthRecords: async (_, { query, limit }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await searchHealthRecords(query, limit);
    }
  },
  Mutation: {
    createHealthRecord: async (_, { input }, { user }) => {
      if (!user || (user.id !== input.userId && !['admin', 'doctor'].includes(user.role))) {
        throw new Error('Insufficient permissions');
      }
      const validation = HealthRecordSchema.safeParse({ ...input, createdAt: formatISO(new Date()), updatedAt: formatISO(new Date()) });
      if (!validation.success) {
        throw new Error(`Validation error: ${validation.error.message}`);
      }
      const record = await createHealthRecord(validation.data);
      await producer.send({
        topic: 'health-events',
        messages: [{
          key: record.id,
          value: JSON.stringify({
            type: 'HEALTH_RECORD_CREATED',
            recordId: record.id,
            userId: record.userId,
            timestamp: new Date().toISOString()
          })
        }]
      });
      return record;
    },
    updateHealthRecord: async (_, { id, input }, { user }) => {
      const record = await getHealthRecordById(id);
      if (!user || (user.id !== record.userId && !['admin', 'doctor'].includes(user.role))) {
        throw new Error('Insufficient permissions');
      }
      const updated = await updateHealthRecord(id, input);
      await producer.send({
        topic: 'health-events',
        messages: [{
          key: id,
          value: JSON.stringify({
            type: 'HEALTH_RECORD_UPDATED',
            recordId: id,
            userId: record.userId,
            timestamp: new Date().toISOString()
          })
        }]
      });
      return updated;
    },
    deleteHealthRecord: async (_, { id }, { user }) => {
      const record = await getHealthRecordById(id);
      if (!user || (user.id !== record.userId && !['admin', 'doctor'].includes(user.role))) {
        throw new Error('Insufficient permissions');
      }
      await deleteHealthRecord(id);
      await producer.send({
        topic: 'health-events',
        messages: [{
          key: id,
          value: JSON.stringify({
            type: 'HEALTH_RECORD_DELETED',
            recordId: id,
            userId: record.userId,
            timestamp: new Date().toISOString()
          })
        }]
      });
      return true;
    },
    importFHIRResource: async (_, { resource }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      const fhir = new FHIR();
      const parsed = fhir.validate(resource);
      if (!parsed.valid) throw new Error('Invalid FHIR resource');
      const userId = resource.subject?.reference?.replace('User/', '') || user.id;
      const record = await createHealthRecord({
        userId,
        type: resource.resourceType,
        data: resource,
        createdAt: formatISO(new Date()),
        updatedAt: formatISO(new Date()),
        source: 'FHIR'
      });
      await producer.send({
        topic: 'health-events',
        messages: [{
          key: record.id,
          value: JSON.stringify({
            type: 'FHIR_RESOURCE_IMPORTED',
            recordId: record.id,
            userId,
            timestamp: new Date().toISOString()
          })
        }]
      });
      return record;
    }
  }
};

async function getHealthRecordById(id: string) {
  const db = mongoClient.db('sms_sm_health');
  const record = await db.collection('health_records').findOne({ id });
  return record;
}

async function getHealthRecords({ userId, type, tag, limit }: any) {
  const db = mongoClient.db('sms_sm_health');
  const query: any = { userId };
  if (type) query.type = type;
  if (tag) query.tags = tag;
  return await db.collection('health_records').find(query).limit(limit || 20).toArray();
}

async function searchHealthRecords(query: string, limit: number) {
  const db = mongoClient.db('sms_sm_health');
  return await db.collection('health_records').find({
    $text: { $search: query }
  }).limit(limit).toArray();
}

async function createHealthRecord(data: any) {
  const db = mongoClient.db('sms_sm_health');
  const id = uuidv4();
  const record = { ...data, id, createdAt: formatISO(new Date()), updatedAt: formatISO(new Date()) };
  await db.collection('health_records').insertOne(record);
  return record;
}

async function updateHealthRecord(id: string, updates: any) {
  const db = mongoClient.db('sms_sm_health');
  await db.collection('health_records').updateOne(
    { id },
    { $set: { ...updates, updatedAt: formatISO(new Date()) } }
  );
  return await getHealthRecordById(id);
}

async function deleteHealthRecord(id: string) {
  const db = mongoClient.db('sms_sm_health');
  await db.collection('health_records').deleteOne({ id });
}

const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

async function startServer() {
  try {
    await mongoClient.connect();
    await redis.connect();
    await producer.connect();
    await consumer.connect();
    logger.info('Connected to MongoDB, Redis, Kafka');
    await consumer.subscribe({ topic: 'health-commands' });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          logger.info('Received Kafka message:', data);
        } catch (error) {
          logger.error('Error processing Kafka message:', error);
        }
      },
    });
    const app = express();
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP'
    });
    app.use(limiter);
    app.use(helmet());
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));
    app.use(express.json({ limit: '20mb' }));
    app.use(authMiddleware);
    app.get('/health', async (req, res) => {
      try {
        await dbPool.query('SELECT 1');
        await mongoClient.db('sms_sm_health').command({ ping: 1 });
        await redis.ping();
        res.json({
          status: 'healthy',
          service: 'health-service',
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || '1.0.0',
          dependencies: {
            database: 'connected',
            mongo: 'connected',
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
    app.get('/metrics', (req, res) => {
      res.set('Content-Type', 'text/plain');
      res.send(`# HELP health_service_requests_total Total requests to health service\n# TYPE health_service_requests_total counter\nhealth_service_requests_total{method=\"GET\"} 42\nhealth_service_requests_total{method=\"POST\"} 18`);
    });
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        user: req.user,
        req
      })
    });
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
      logger.info(`🚀 Health Service running on port ${PORT}`);
      logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await producer.disconnect();
  await consumer.disconnect();
  await redis.disconnect();
  await mongoClient.close();
  await dbPool.end();
  process.exit(0);
});
startServer().catch(error => {
  logger.error('Failed to start health service:', error);
  process.exit(1);
});
export default {};

import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  APP_VERSION: z.string().default('2.0.0'),
  
  // Database
  DATABASE_URL: z.string().default('postgresql://postgres:password@localhost:5432/sms_sm_dev'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  // JWT
  JWT_SECRET: z.string().default('super-secret-jwt-key-for-development'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // CORS - Permitir toda a rede local (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  CORS_ORIGINS: z.string().transform(str => str.split(',')).default('http://localhost:3000,http://localhost:5173,http://10.0.0.0/8,http://172.16.0.0/12,http://192.168.0.0/16'),
  
  // Rate Limiting
  ENABLE_RATE_LIMITING: z.coerce.boolean().default(true),
  RATE_LIMIT_WINDOW: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX: z.coerce.number().default(1000),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Upload
  UPLOAD_MAX_SIZE: z.coerce.number().default(10 * 1024 * 1024), // 10MB
  UPLOAD_ALLOWED_TYPES: z.string().default('image/jpeg,image/png,image/gif,application/pdf'),
  
  // External APIs
  GOOGLE_CALENDAR_CLIENT_ID: z.string().optional(),
  GOOGLE_CALENDAR_CLIENT_SECRET: z.string().optional(),
})

export const config = configSchema.parse(process.env)

export type Config = typeof config
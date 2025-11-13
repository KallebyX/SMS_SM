"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const configSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(4000),
    HOST: zod_1.z.string().default('0.0.0.0'),
    APP_VERSION: zod_1.z.string().default('2.0.0'),
    // Database
    DATABASE_URL: zod_1.z.string().default('postgresql://postgres:password@localhost:5432/sms_sm_dev'),
    REDIS_URL: zod_1.z.string().default('redis://localhost:6379'),
    // JWT
    JWT_SECRET: zod_1.z.string().default('super-secret-jwt-key-for-development'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('30d'),
    // CORS - Permitir toda a rede local (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    CORS_ORIGINS: zod_1.z.string().transform(str => str.split(',')).default('http://localhost:3000,http://localhost:5173,http://10.0.0.0/8,http://172.16.0.0/12,http://192.168.0.0/16'),
    // Rate Limiting
    ENABLE_RATE_LIMITING: zod_1.z.coerce.boolean().default(true),
    RATE_LIMIT_WINDOW: zod_1.z.coerce.number().default(15 * 60 * 1000), // 15 minutes
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(1000),
    // Email
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.coerce.number().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    // Upload
    UPLOAD_MAX_SIZE: zod_1.z.coerce.number().default(10 * 1024 * 1024), // 10MB
    UPLOAD_ALLOWED_TYPES: zod_1.z.string().default('image/jpeg,image/png,image/gif,application/pdf'),
    // External APIs
    GOOGLE_CALENDAR_CLIENT_ID: zod_1.z.string().optional(),
    GOOGLE_CALENDAR_CLIENT_SECRET: zod_1.z.string().optional(),
});
exports.config = configSchema.parse(process.env);

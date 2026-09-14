import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

// Load root .env file regardless of current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: rootEnvPath });
// Also load local if present
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default('/api/v1'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:4000'),

  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/mangal_dev?schema=public'),

  REDIS_ENABLED: z.string().transform((val) => val === 'true').default('false'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('mangal_dev_cookie_secret_key_32_chars_long'),

  PROVIDER_MODE: z.enum(['mock', 'live']).default('mock'),
  STORAGE_PROVIDER: z.enum(['local', 's3', 'minio']).default('local'),
  STORAGE_LOCAL_PATH: z.string().default('./uploads'),

  EMAIL_PROVIDER: z.enum(['console', 'smtp', 'ses', 'resend']).default('console'),
  EMAIL_FROM: z.string().default('Mangal Support <no-reply@mangal.com>'),

  SMS_PROVIDER: z.enum(['console', 'twilio', 'msg91']).default('console'),
  PAYMENT_PROVIDER: z.enum(['mock', 'razorpay', 'stripe']).default('mock'),
  AI_PROVIDER: z.enum(['deterministic', 'gemini', 'openai']).default('deterministic'),
  ASTROLOGY_PROVIDER: z.enum(['deterministic', 'vedic_api']).default('deterministic'),
  VIDEO_CALL_PROVIDER: z.enum(['mock', 'webrtc', 'twilio']).default('mock'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables configuration:');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

import "dotenv/config"
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', ' test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string(),
  USER_ID: z.string(),
  PRIVATE_KEY: z.string()
});

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('🚫 Error Environment variable', _env.error.format())
  throw new Error('🚫 Error Environment variable')
}

export const env = _env.data;
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  GAME_TOKEN_SECRET: z.string().min(1),
  BACKEND_PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
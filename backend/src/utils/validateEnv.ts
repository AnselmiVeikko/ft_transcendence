import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  GAME_TOKEN_SECRET: z.string().min(1),
  AVATARS_DIR: z.string().min(1),
});

export const env = envSchema.parse(process.env);
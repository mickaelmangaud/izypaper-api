import { env } from './env';

export const corsOptions = {
    origin: env.CLIENT_URL,
    credentials: true,
  };
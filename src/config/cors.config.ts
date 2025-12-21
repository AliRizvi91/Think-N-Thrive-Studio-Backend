import cors from 'cors';
import { FRONTEND_URL, isProduction } from './app.config';

export const corsOptions: cors.CorsOptions = {
  origin: [
    FRONTEND_URL,
    ...(isProduction ? [] : ['http://localhost:3000'])
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};
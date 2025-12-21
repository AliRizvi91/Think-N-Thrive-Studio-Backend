import cors from 'cors';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { httpLoggerConfig } from './config/logger.config';
import { limiter } from './config/rateLimit.config';
import { corsOptions } from './config/cors.config';
import router from './routes';
import { notFoundHandler } from './middlewares/notFoundMiddleware';
import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

// Middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(compression());
app.use(helmet());
app.use(pinoHttp(httpLoggerConfig));
app.use(limiter);
app.use(cors(corsOptions));

// Routes
app.use(router);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
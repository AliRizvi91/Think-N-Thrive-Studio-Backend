import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.config';
import { isProduction } from '../config/app.config';

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode ?? 500;

  const message =
    isProduction && statusCode === 500
      ? 'Something went wrong'
      : err.message;

  logger.error({
    message,
    statusCode,
    stack: !isProduction ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...( !isProduction && { stack: err.stack } )
  });
};

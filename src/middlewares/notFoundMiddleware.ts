import { Request, Response } from 'express';
import { logger } from '../config/logger.config';

export const notFoundHandler = (_req: Request, res: Response) => {
  logger.warn('404 - Resource not found');
  res.status(404).json({ 
    success: false,
    message: 'Resource not found'
  });
};
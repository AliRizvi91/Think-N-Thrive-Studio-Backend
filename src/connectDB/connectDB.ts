import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { logger } from '../config/logger.config';

export const connect = async (): Promise<void> => {
  try {
    const mongoUri = process.env.Mongo_DB;
    if (!mongoUri) {
      throw new Error('MongoDB connection string not defined in environment variables');
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      autoIndex: true,
    });

    logger.info('Database connected successfully');
  } catch (error) {
    if (error instanceof Error) {
      // Correct usage: pass only the Error object
      logger.error(error);
    } else {
      logger.error(new Error('Unknown database connection error'));
    }
    throw error;
  }
};

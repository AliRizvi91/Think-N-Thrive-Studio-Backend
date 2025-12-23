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
      maxPoolSize: 10,
      autoIndex: true,
    } as mongoose.ConnectOptions); // 👈 FIX

    logger.info('Database connected successfully');
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error('Unknown DB error'));
    throw error;
  }
};

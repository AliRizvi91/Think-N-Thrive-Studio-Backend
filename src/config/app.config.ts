import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '4500', 10);
export const FRONTEND_URL = process.env.FRONTEND_URL ||'' ;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const isProduction = NODE_ENV === 'production';
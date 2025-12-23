"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const logger_config_1 = require("../config/logger.config");
const connect = async () => {
    try {
        const mongoUri = process.env.Mongo_DB;
        if (!mongoUri) {
            throw new Error('MongoDB connection string not defined in environment variables');
        }
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            retryReads: true,
            maxPoolSize: 10,
            autoIndex: true,
        });
        logger_config_1.logger.info('Database connected successfully');
    }
    catch (error) {
        if (error instanceof Error) {
            // Correct usage: pass only the Error object
            logger_config_1.logger.error(error);
        }
        else {
            logger_config_1.logger.error(new Error('Unknown database connection error'));
        }
        throw error;
    }
};
exports.connect = connect;

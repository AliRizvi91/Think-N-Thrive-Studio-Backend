"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.NODE_ENV = exports.FRONTEND_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = parseInt(process.env.PORT || '4500', 10);
exports.FRONTEND_URL = process.env.FRONTEND_URL || '';
exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.isProduction = exports.NODE_ENV === 'production';

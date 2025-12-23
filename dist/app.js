"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const pino_http_1 = __importDefault(require("pino-http"));
const logger_config_1 = require("./config/logger.config");
const rateLimit_config_1 = require("./config/rateLimit.config");
const cors_config_1 = require("./config/cors.config");
const routes_1 = __importDefault(require("./routes"));
const notFoundMiddleware_1 = require("./middlewares/notFoundMiddleware");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const app = (0, express_1.default)();
exports.app = app;
// Middleware
app.use(express_1.default.json({ limit: '30mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '30mb' }));
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use((0, pino_http_1.default)(logger_config_1.httpLoggerConfig));
app.use(rateLimit_config_1.limiter);
app.use((0, cors_1.default)(cors_config_1.corsOptions));
// Routes
app.use(routes_1.default);
// Error handlers
app.use(notFoundMiddleware_1.notFoundHandler);
app.use(errorMiddleware_1.errorHandler);

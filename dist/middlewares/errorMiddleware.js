"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_config_1 = require("../config/logger.config");
const app_config_1 = require("../config/app.config");
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = app_config_1.isProduction && statusCode === 500
        ? 'Something went wrong'
        : err.message;
    logger_config_1.logger.error({
        msg: message,
        err,
        statusCode,
        stack: !app_config_1.isProduction ? err.stack : undefined
    }, 'Error occurred');
    res.status(statusCode).json({
        success: false,
        message,
        ...(!app_config_1.isProduction && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;

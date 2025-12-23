"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const logger_config_1 = require("../config/logger.config");
const notFoundHandler = (_req, res) => {
    logger_config_1.logger.warn('404 - Resource not found');
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
};
exports.notFoundHandler = notFoundHandler;

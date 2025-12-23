"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const logger_config_1 = require("./config/logger.config");
const app_config_1 = require("./config/app.config");
const connectDB_1 = require("./connectDB/connectDB");
(0, connectDB_1.connect)()
    .then(() => {
    const server = app_1.app.listen(app_config_1.PORT, () => {
        logger_config_1.logger.info(`Server running in ${app_config_1.NODE_ENV} mode on port ${app_config_1.PORT}`);
    });
    process.on('unhandledRejection', (err) => {
        logger_config_1.logger.fatal({ err }, 'Unhandled Rejection');
        server.close(() => process.exit(1));
    });
})
    .catch((err) => {
    logger_config_1.logger.fatal({ err }, 'Database connection failed');
    process.exit(1);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLoggerConfig = exports.logger = void 0;
const pino_1 = require("pino");
const app_config_1 = require("./app.config");
exports.logger = (0, pino_1.pino)({
    level: app_config_1.isProduction ? 'info' : 'debug',
    transport: app_config_1.isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        },
});
exports.httpLoggerConfig = {
    logger: exports.logger,
    // apni log level set karna
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500)
            return 'warn';
        if (res.statusCode >= 500 || err)
            return 'error';
        return 'info';
    },
    // sirf chhoti message show kare
    customReceivedMessage: (req) => `➡️  ${req.method} ${req.url} received`,
    customSuccessMessage: (req, res, responseTime) => `✅ ${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`,
    customErrorMessage: (req, res, err) => `❌ ${req.method} ${req.url} ${res.statusCode} - ${err?.message}`,
    // req aur res ka full dump hata do
    customAttributeKeys: {
        req: 'ignoreReq',
        res: 'ignoreRes',
        responseTime: 'time',
    },
    serializers: {
        ignoreReq: () => undefined,
        ignoreRes: () => undefined,
    },
};

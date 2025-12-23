"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const app_config_1 = require("./app.config");
exports.corsOptions = {
    origin: [
        app_config_1.FRONTEND_URL,
        ...(app_config_1.isProduction ? [] : ['http://localhost:3000'])
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

import { pino } from 'pino';
import { isProduction } from './app.config';

export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  transport: isProduction
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

export const httpLoggerConfig = {
  logger,

  // apni log level set karna
  customLogLevel: (req: any, res: any, err: any) => {
    if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
    if (res.statusCode >= 500 || err) return 'error';
    return 'info';
  },

  // sirf chhoti message show kare
  customReceivedMessage: (req: any) => `➡️  ${req.method} ${req.url} received`,
  customSuccessMessage: (req: any, res: any, responseTime: number) =>
    `✅ ${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`,
  customErrorMessage: (req: any, res: any, err: any) =>
    `❌ ${req.method} ${req.url} ${res.statusCode} - ${err?.message}`,

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
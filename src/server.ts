import { app } from './app';
import { logger } from './config/logger.config';
import { PORT, NODE_ENV } from './config/app.config';
import { connect } from './connectDB/connectDB';

connect()
  .then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    process.on('unhandledRejection', (err: Error) => {
      logger.fatal({ err }, 'Unhandled Rejection');
      server.close(() => process.exit(1));
    });
  })
  .catch((err: Error) => {
    logger.fatal({ err }, 'Database connection failed');
    process.exit(1);
  });
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import database from './config/db';
import logger from './config/logger';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health-status', (req, res) => res.sendStatus(200));

database.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/bookstore')
  .catch((err) => {
    logger
      .error(`Shutdown the application because an error occurred when connecting to database ${err.message}`);
    process.exit(1);
  });

const shutdown = event => () => {
  logger.warn('Server receive signal to shutdown, with event %s', event);
  process.exit(0);
};

process.on('SIGTERM', shutdown('SIGTERM'))
  .on('uncaughtException', (err) => {
    logger.error(`uncaughtException caught the error: ${err.message}`);
    throw err;
  })
  .on('exit', (code) => {
    logger.info('Node process exit with code:', code);
    database.close();
  });

export default app;

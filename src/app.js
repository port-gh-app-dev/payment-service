const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const Sentry = require('@sentry/node');
const checkoutRouter = require('./routes/checkout');
const healthRouter = require('./routes/health');
const logger = require('./middleware/logger');

const app = express();

console.log(process.env.SENTRY_DSN);
function parsePort(value, fallback) {
  if (value == null || String(value).trim() === '') return fallback;
  const n = Number.parseInt(String(value).trim(), 10);
  if (Number.isNaN(n) || n < 1 || n > 65535) return fallback;
  return n;
}

const preferredPort = parsePort(process.env.PORT, 3000);

// Sentry must be initialised before routes
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  environment: process.env.NODE_ENV ?? 'production'
});

app.use(Sentry.Handlers.requestHandler());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/checkout', checkoutRouter);

// Sentry error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  const isDev = (process.env.NODE_ENV || 'development') === 'development';
  const maxPortSkips = isDev ? 30 : 0;
  let skip = 0;

  function tryListen() {
    const port = preferredPort + skip;
    const server = app.listen(port);

    server.once('listening', () => {
      if (port !== preferredPort) {
        logger.warn(
          `Port ${preferredPort} was in use; listening on ${port} instead. Set PORT in .env or free ${preferredPort}.`
        );
      }
      logger.info(`payments-service listening on port ${port}`);
    });

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE' && skip < maxPortSkips) {
        skip += 1;
        tryListen();
        return;
      }
      if (err.code === 'EADDRINUSE') {
        logger.error(
          `Port ${port} is already in use. Find the process: lsof -nP -iTCP:${port} | grep LISTEN — then stop it or choose another PORT in .env.`
        );
      } else {
        logger.error('Server failed to start', { error: err.message });
      }
      process.exit(1);
    });
  }

  tryListen();
}

module.exports = app;

const express = require('express');
const Sentry = require('@sentry/node');
const router = express.Router();

/**
 * Demo-only routes: each triggers a different error class than POST /checkout (null cart).
 * All responses are 500 + generic body; Sentry gets the real exception via captureException.
 */

/** SyntaxError — e.g. bad JSON from a misconfigured integration or corrupted cache. */
router.get('/syntax-error', (req, res) => {
  try {
    JSON.parse('{ "broken": ');
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Plain Error with a service-style message — e.g. downstream inventory gRPC deadline.
 * Different fingerprint / title in Sentry than TypeError or SyntaxError.
 */
router.get('/inventory-timeout', (req, res) => {
  try {
    const err = new Error('inventory-service: reservation deadline exceeded (30000ms)');
    err.code = 'ETIMEDOUT';
    throw err;
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

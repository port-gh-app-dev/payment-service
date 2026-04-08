// Jest runs before app loads; keep env stable for tests.
process.env.SENTRY_DSN = process.env.SENTRY_DSN || '';

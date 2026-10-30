# Project guidance

- This is a Node.js 18+ Express payment service; use the existing CommonJS style and project dependencies.
- Carts and users are in-memory demo data. Do not describe them as persistent production storage.
- Stripe calls require `STRIPE_SECRET_KEY`; `DEMO_MOCK_STRIPE=1` or `true` enables the local demo payment path.
- Never commit credentials or log secret/payment data.
- Run `npm test` after JavaScript changes. Keep changes focused and update documentation when behavior changes.

## Install

```bash
npm install
```

## Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Test

```bash
npm test
```

Tests use Jest with coverage (`jest.config.js`). All tests must pass before opening a PR.

## Lint

No dedicated lint script exists in `package.json`. ESLint config is present (`eslint.config.js` / `eslint.config.mjs`):

```bash
npx eslint src/
```

## Key environment variables

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Required for real Stripe calls |
| `DEMO_MOCK_STRIPE` | Set to `1` or `true` to skip real Stripe calls |
| `SENTRY_DSN` | Required to forward errors to Sentry |
| `PORT` | HTTP port (default `3000`) |
| `NODE_ENV` | `production` / `staging` / `development` |

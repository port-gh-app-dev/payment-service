# Agent Instructions: payments-service

This is a Node.js 18+ Express payment service (CommonJS). It handles checkout, payment processing, and refunds. Cart, user, and order data are **in-memory demo data** — not persistent production storage.

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

Tests use Jest with coverage. Config: `jest.config.js`.

## Lint

There is no dedicated lint script in `package.json`. ESLint config is present (`eslint.config.js` / `eslint.config.mjs`) and can be run directly:

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

## Coding conventions

- Use the existing CommonJS (`require`/`module.exports`) style — do not introduce ESM.
- Never commit credentials or log secret/payment data.
- Run `npm test` after any JavaScript change and ensure all tests pass.
- Keep changes focused; update documentation when behaviour changes.
- Carts and users are in-memory demo data — do not describe them as persistent production storage.

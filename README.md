# payments-service

Handles checkout, payment processing, and order creation for the platform. This repo is wired for **local / Sentry demos**: cart and user data are **in-memory** (no Postgres). Stripe can be mocked for demos that do not need a real payment.

## Ownership

- **Team:** Payments Platform
- **On-call:** Rotates weekly — see PagerDuty schedule `payments-oncall`
- **Slack:** #payments-eng
- **Port catalog:** https://app.getport.io/payments-service

## Architecture (this repo)

```
POST /checkout
  └── getCart()            → in-memory (see `src/services/cart.js`)
  └── getUser()            → in-memory (see `src/services/user.js`)
  └── reserveInventory()   → in-memory stub (`src/services/inventory.js`)
  └── processPayment()     → Stripe API, or mock if `DEMO_MOCK_STRIPE=true`
```

## Environment variables

| Variable | Description |
|---|---|
| `SENTRY_DSN` | Sentry DSN — required to see demo errors in Sentry |
| `STRIPE_SECRET_KEY` | Stripe secret (not needed if you only trigger the null-cart bug, or if `DEMO_MOCK_STRIPE=true`) |
| `DEMO_MOCK_STRIPE` | Set to `1` or `true` to skip real Stripe calls (e.g. when testing `cart-with-items`) |
| `CHECKOUT_DEMO_BUG_CART_ID` | Cart id that has `items: null` (default: `cart-null-items`) |
| `GIT_COMMIT_SHA` | Injected by CI — used for Sentry release tracking |
| `NODE_ENV` | `production` / `staging` / `development` |
| `PORT` | HTTP port (default `3000`) |

## Running locally

```bash
# Add SENTRY_DSN (and optionally STRIPE_SECRET_KEY) in .env
npm install
npm run dev
```

## Demo: trigger the null `cart.items` bug (Sentry)

**Scenario:** A deploy introduced a bug: `cart.items` is read with `.length` before a null check, so carts initialised without line items throw `TypeError: Cannot read properties of null (reading 'length')`. Sentry records it; triage ties it to the commit and line.

1. Set `SENTRY_DSN` in `.env` to your Sentry project.
2. Start the service (`npm run dev`).
3. POST checkout using the demo cart id whose `items` are `null` (default `cart-null-items`):

```bash
curl -s -X POST http://localhost:3000/checkout \
  -H 'Content-Type: application/json' \
  -d '{"userId":"demo-user","cartId":"cart-null-items","paymentMethodId":"pm_demo"}'
```

You should get HTTP **500** and see **`TypeError: Cannot read properties of null`** in Sentry (checkout handler calls `Sentry.captureException`).

**Fix (for a real codebase):** guard before using `.length`, e.g. `if (!cart.items || cart.items.length === 0)` — see comment in `src/routes/checkout.js` around the intentional bug line.

## Optional: happy-path checkout without Stripe

Use the in-memory cart that has items and mock Stripe:

```bash
export DEMO_MOCK_STRIPE=1
npm run dev
```

```bash
curl -s -X POST http://localhost:3000/checkout \
  -H 'Content-Type: application/json' \
  -d '{"userId":"demo-user","cartId":"cart-with-items","paymentMethodId":"pm_demo"}'
```

## Deployment

Deployments are managed via GitHub Actions (`deploy.yml`). Merging to `main` triggers an automatic deploy to staging. Production deploys require a manual approval step.

## Runbook

### 500 errors on POST /checkout

1. Check Sentry for the error type — common causes in this demo:
   - `TypeError: Cannot read properties of null` → null cart items (see demo above)
   - `StripeInvalidRequestError` → invalid payment method (when not using `DEMO_MOCK_STRIPE`)

2. Check recent deploys in GitHub Actions or Port — correlate error spike with deploy time

3. Known issue — null cart items (story):
   - Mobile clients on v2.4.0 (released 2025-04-05) can leave `items` null after initialise-cart
   - Checkout must not call `.length` on `cart.items` until after a null/empty check
   - **Fix:** `if (!cart.items || cart.items.length === 0)` before using `cart.items` (see `src/routes/checkout.js`)

### Payment failures (402)

- Check Stripe dashboard for decline reasons
- Common: expired card, insufficient funds, 3DS required
- These are not errors — do not page on-call unless rate exceeds 15%

### Inventory reservation failures (409)

- In this repo, inventory is an in-memory stub; in production, check inventory-service health in Port
- If inventory-service is degraded, do not roll back payments-service

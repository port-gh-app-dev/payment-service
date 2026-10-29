<!-- PAGE_ID: payment-service_04_api-reference -->
<details>
<summary>📚 Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [openapi.yaml:1-64](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/openapi.yaml#L1-L64)
- [health.js:1-13](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/health.js#L1-L13)
- [sentry-demos.js:1-35](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/sentry-demos.js#L1-L35)
- [.env.example:1-8](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/.env.example#L1-L8)
- [README.md:24-34](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L24-L34)

</details>

# API and Configuration

> **Related Pages**: [[Architecture|02_architecture.md]]

---

<!-- BEGIN:AUTOGEN payment-service_04_api-reference_endpoints -->
## HTTP Endpoints

| Method and path | Description | Responses |
|---|---|---|
| `GET /health` | Returns `status`, `service`, `version` (from `GIT_COMMIT_SHA`, else `unknown`) and `timestamp` ([health.js:4-11](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/health.js#L4-L11)) | 200 |
| `POST /checkout` | Body `userId`, `cartId`, `paymentMethodId` ([openapi.yaml:24-37](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/openapi.yaml#L24-L37)) | 200, 400, 402, 404, 409, 500 ([openapi.yaml:39-54](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/openapi.yaml#L39-L54)) |
| `GET /demo/sentry/syntax-error` | Catches a bad `JSON.parse`, reports to Sentry, returns 500 ([sentry-demos.js:11-18](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/sentry-demos.js#L11-L18)) | 500 |
| `GET /demo/sentry/inventory-timeout` | Reports an `ETIMEDOUT` error to Sentry, returns 500 ([sentry-demos.js:24-33](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/sentry-demos.js#L24-L33)) | 500 |

Routers are mounted in `app.js` ([app.js:32-34](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/app.js#L32-L34)). There is no authentication middleware in the code, although the checkout handler's comment speaks of "the authenticated user" ([checkout.js:21-24](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/checkout.js#L21-L24)).

Example from the README ([README.md:88-90](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L88-L90)):

```bash
curl -s -X POST http://localhost:3000/checkout \
  -H 'Content-Type: application/json' \
  -d '{"userId":"demo-user","cartId":"cart-with-items","paymentMethodId":"pm_demo"}'
```

The repository contains other OpenAPI/Swagger files besides `openapi.yaml`; they may disagree with it and were not compared.

Sources: [openapi.yaml:1-64](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/openapi.yaml#L1-L64), [health.js:1-13](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/health.js#L1-L13), [sentry-demos.js:1-35](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/sentry-demos.js#L1-L35)
<!-- END:AUTOGEN payment-service_04_api-reference_endpoints -->

---

<!-- BEGIN:AUTOGEN payment-service_04_api-reference_config -->
## Environment Variables

| Variable | Description | Sample value |
|---|---|---|
| `SENTRY_DSN` | Sentry DSN ([app.js:22-26](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/app.js#L22-L26)) | empty ([.env.example:1](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/.env.example#L1)) |
| `STRIPE_SECRET_KEY` | Required for live Stripe ([payment.js:3-7](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/services/payment.js#L3-L7)) | empty |
| `DEMO_MOCK_STRIPE` | `1`/`true` skips Stripe ([payment.js:10-11](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/services/payment.js#L10-L11)) | `1` |
| `CHECKOUT_DEMO_BUG_CART_ID` | Id of the null-items cart ([cart.js:7](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/services/cart.js#L7)) | `cart-null-items` |
| `GIT_COMMIT_SHA` | Reported by `/health` ([health.js:8](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/routes/health.js#L8)); README says CI injects it ([README.md:32](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L32)) | empty |
| `NODE_ENV` | Sentry environment and dev port-skipping ([app.js:25](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/app.js#L25), [app.js:45](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/app.js#L45)) | `development` |
| `PORT` | HTTP port, default 3000 ([app.js:19](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/app.js#L19)) | `3000` |
| `LOG_LEVEL` | winston level, default `info` ([logger.js:4](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/middleware/logger.js#L4)) | `info` |

Sources: [.env.example:1-8](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/.env.example#L1-L8), [README.md:24-34](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L24-L34)
<!-- END:AUTOGEN payment-service_04_api-reference_config -->

---

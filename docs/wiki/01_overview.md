<!-- PAGE_ID: payment-service_01_overview -->
<details>
<summary>📚 Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [README.md:1-123](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L1-L123)
- [package.json:1-26](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L1-L26)
- [CLAUDE.md:1-7](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/CLAUDE.md#L1-L7)

</details>

# Overview

> **Related Pages**: [[Architecture|02_architecture.md]]

---

<!-- BEGIN:AUTOGEN payment-service_01_overview_introduction -->
## Introduction

payment-service handles checkout, payment processing and order creation. The repository is wired for local and Sentry demos: cart and user data are in-memory (no Postgres), and Stripe can be mocked ([README.md:3](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L3)). The project guidance states that carts and users are demo data and must not be described as persistent production storage ([CLAUDE.md:4](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/CLAUDE.md#L4)).

Ownership metadata: team Payments Platforms, weekly rotating on-call, Slack #payments-eng ([README.md:5-10](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L5-L10)).

Sources: [README.md:1-10](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L1-L10), [CLAUDE.md:3-4](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/CLAUDE.md#L3-L4)
<!-- END:AUTOGEN payment-service_01_overview_introduction -->

---

<!-- BEGIN:AUTOGEN payment-service_01_overview_tech-stack -->
## Technology Stack

| Component | Detail |
|---|---|
| Runtime | Node.js >=18 ([package.json:23-25](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L23-L25)) |
| Web framework | express ^4.18.2 ([package.json:14](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L14)) |
| Payments | stripe ^14.21.0 ([package.json:15](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L15)) |
| Error reporting | @sentry/node ^7.114.0 ([package.json:12](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L12)) |
| Logging | winston ^3.11.0 ([package.json:16](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L16)) |
| Config | dotenv ([package.json:13](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L13)) |
| Tests | jest, supertest ([package.json:19-21](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L19-L21)) |

Scripts: `start` (`node src/app.js`), `dev` (`nodemon`), `test` (jest with coverage) ([package.json:6-10](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L6-L10)). Code is CommonJS ([CLAUDE.md:3](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/CLAUDE.md#L3)).

Sources: [package.json:1-26](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/package.json#L1-L26)
<!-- END:AUTOGEN payment-service_01_overview_tech-stack -->

---

<!-- BEGIN:AUTOGEN payment-service_01_overview_repo-layout -->
## Repository Layout

The README sketches the structure of a request: `POST /checkout` calls `getCart`, `getUser`, `reserveInventory` and `processPayment`; `GET /demo/sentry/*` are intentional demo errors ([README.md:14-22](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L14-L22)).

| Path | Role |
|---|---|
| `src/app.js` | Express app and server start ([app.js:10-82](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/app.js#L10-L82)) |
| `src/routes/` | `checkout`, `health`, `sentry-demos` routers ([app.js:4-6](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/app.js#L4-L6)) |
| `src/services/` | `cart`, `user`, `inventory`, `payment` |
| `src/middleware/logger.js` | winston logger ([logger.js:3-10](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/middleware/logger.js#L3-L10)) |
| `src/__tests__/` | Jest tests ([health.test.js:1-14](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/__tests__/health.test.js#L1-L14)) |
| `openapi.yaml`, `deploy.yml`, `.github/workflows/build.yml` | API description and CI/CD |

The repository also contains several other API-description files (`openapi.yml`, `openapi.json`, `swagger.json`, `swagger.yaml`, `api/openapi.yaml`) and multiple lint/test config files for other languages (e.g. `ruff.toml`, `.golangci.yml`, `tox.ini`); these are not referenced by the application code and were not analysed.

Sources: [README.md:12-22](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/README.md#L12-L22), [app.js:1-8](https://github.com/port-gh-app-dev/payment-service/blob/9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14/src/app.js#L1-L8)
<!-- END:AUTOGEN payment-service_01_overview_repo-layout -->

---

# Project guidance

- This is a Node.js 18+ Express payment service; use the existing CommonJS style and project dependencies.
- Carts and users are in-memory demo data. Do not describe them as persistent production storage.
- Stripe calls require `STRIPE_SECRET_KEY`; `DEMO_MOCK_STRIPE=1` or `true` enables the local demo payment path.
- Never commit credentials or log secret/payment data.
- Run `npm test` after JavaScript changes. Keep changes focused and update documentation when behavior changes.

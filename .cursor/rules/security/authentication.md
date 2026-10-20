# Authentication and authorization

- Authenticate every request to protected endpoints; do not treat a client-supplied identifier as proof of identity.
- Derive the user identity from a verified credential and authorize access to each requested cart, order, and payment.
- Deny access by default and validate authorization again at each service boundary.
- Keep credentials and signing keys in a secret manager or environment configuration; never log or commit them.
- Use short-lived credentials, rotate secrets, and apply least-privilege scopes.
- Tests and demo-only routes must not be mistaken for production authentication.

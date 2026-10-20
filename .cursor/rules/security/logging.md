# Security-conscious logging

- Log security-relevant events with enough context for investigation, while minimizing personal and payment data.
- Never log passwords, authentication tokens, secret keys, full payment credentials, or sensitive request bodies.
- Sanitize untrusted values to prevent log forging and control characters from creating misleading entries.
- Prefer stable identifiers and structured fields; avoid logging raw headers or entire error objects by default.
- Keep client responses generic and do not expose stack traces or internal service details.
- Apply access controls, retention limits, and appropriate protection to log storage.

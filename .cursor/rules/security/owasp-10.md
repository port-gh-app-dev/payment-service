# OWASP Top 10 review checklist

When changing application behavior, assess the relevant OWASP Top 10 risks:

- Broken access control: authorize every operation and object access.
- Cryptographic failures: protect sensitive data in transit and at rest; do not invent cryptography.
- Injection: use safe parameterized APIs and avoid shell or query interpolation.
- Insecure design: enforce business invariants and fail safely.
- Security misconfiguration: use secure defaults and avoid exposing debug behavior in production.
- Vulnerable or outdated components: review dependency updates and advisories.
- Identification and authentication failures: verify identities and protect credentials and sessions.
- Software and data integrity failures: validate trusted sources and protect build and deployment paths.
- Logging and monitoring failures: record useful security events without secrets or unnecessary personal data.
- Server-side request forgery: constrain outbound destinations and reject unexpected schemes and hosts.

Apply the checklist proportionally to the change and document any accepted risk.

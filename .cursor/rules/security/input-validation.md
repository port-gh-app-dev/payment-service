# Input validation

- Treat all request parameters, headers, bodies, and external service responses as untrusted.
- Validate type, format, length, range, and allowed values at the boundary; reject invalid input rather than silently coercing it.
- Use explicit schemas for structured payloads and enforce request-size limits.
- Normalize values consistently before validation and business logic.
- Use context-appropriate output encoding and parameterized APIs; validation is not a substitute for either.
- Return generic client errors and avoid exposing stack traces or implementation details.

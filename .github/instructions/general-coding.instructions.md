# General coding instructions

- Prefer small, focused changes that preserve existing behavior unless a change is requested.
- Validate untrusted input at system boundaries and handle failures without leaking internal details.
- Keep secrets and sensitive payment or personal data out of source control, logs, and client responses.
- Add or update tests for behavior changes and run the existing project checks.
- Avoid adding dependencies when existing platform or project APIs are sufficient.
- Make asynchronous operations and resource cleanup explicit.

# Database security

- Use parameterized queries or a query builder; never concatenate untrusted values into SQL or database commands.
- Enforce authorization and tenant boundaries in every query, not only in the client.
- Validate data at the service boundary and constrain database fields with appropriate types and constraints.
- Use a least-privilege database account and keep connection strings in managed secrets.
- Use transactions for related writes, and handle errors without returning internal query details.
- Do not log credentials, payment data, or full records containing personal information.

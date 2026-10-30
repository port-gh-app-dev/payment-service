# Language-specific instructions

- The service is JavaScript on Node.js 18 or newer; use the existing CommonJS module style unless the project migrates consistently.
- Use `async`/`await` for asynchronous work and handle rejected promises at request boundaries.
- Prefer `const`; use `let` only when reassignment is required.
- Use strict comparisons and validate input types before accessing nested properties.
- Keep route handlers thin and put reusable business behavior in service modules.
- Use the repository's existing Jest tests (`npm test`) for JavaScript changes.

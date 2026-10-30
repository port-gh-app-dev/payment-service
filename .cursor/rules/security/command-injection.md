# Command injection

- Avoid spawning operating-system commands from request-handling code.
- Prefer language and library APIs over shell commands.
- If a subprocess is unavoidable, use a fixed executable and argument array without a shell, validate each argument against an allowlist, and apply least privilege and timeouts.
- Never interpolate request data into shell commands, scripts, or command options.
- Do not expose subprocess output, environment variables, or filesystem paths to clients.

# File upload security

- Accept uploads only where the feature requires them and enforce request-size limits.
- Validate file size, extension, and detected content type; do not trust the filename or client-provided MIME type.
- Generate server-side storage names and store files outside executable or publicly served directories.
- Reject path separators and traversal attempts; never use an uploaded name directly as a filesystem path.
- Scan files where appropriate and serve downloads with safe content-disposition and content-type headers.
- Require authorization and apply retention and deletion policies to uploaded content.

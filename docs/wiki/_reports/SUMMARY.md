# Wiki Documentation Summary

Repository: port-gh-app-dev/payment-service
Commit: `9a0f2d674fc3671ad15f41e6be1c9047bcf5fc14`

## Generation Status

| Metric | Expected | Actual |
|--------|----------|--------|
| Pages | 5 | 5 |
| Sections | 15 | 15 |
| Diagrams | 4 | 4 compiled with mmdc |

## Pages

| Page | Sections | Diagrams |
|------|----------|----------|
| 01_overview.md | 3 | 0 |
| 02_architecture.md | 3 | 2 |
| 03_services.md | 4 | 1 |
| 04_api-reference.md | 2 | 0 |
| 05_testing-deployment.md | 3 | 1 |

## Validation

- Mermaid: all 4 diagrams compiled with `mmdc` (run with `--no-sandbox` via a `/tmp` puppeteer config, since Chromium's sandbox is unavailable on this runner).
- Structure: PAGE_ID and BEGIN/END AUTOGEN marker counts match the TOC for every page (checked by grep). The skill's `validate_docs_structure.py` and `generate_summary.py` were not run: the skill scripts directory could not be listed from this session, so this summary was written by hand.

## Notes

- `.github/workflows/build.yml` runs `node src/index.test.js`, which does not exist.
- `deploy.yml` sits at the repo root rather than under `.github/workflows/`.
- Several other OpenAPI/Swagger files and non-Node lint configs exist and were not analysed.

# ADR-0005: The public API is read-only; no auth surface

- Status: Accepted
- Date: 2026-09-18

## Context

Anything callable from a browser on a public Pages site is callable by
everyone. Write endpoints would need authentication, rate limiting and abuse
handling — all for data that changes a few times a year.

## Decision

The Worker accepts only `GET` (and `OPTIONS` for CORS). Data changes go
through git (`data/*.json`) and then `npm run db:seed`, run by the
maintainer with their own Cloudflare login. CORS is limited to the Pages
origin (`ALLOWED_ORIGIN`) plus `http://localhost:5173`. Responses carry
`cache-control: public, max-age=300` to stay far inside free-tier limits.

## Consequences

- Positive: no secrets in the repo or the browser; nothing to abuse.
- Negative: no in-browser editing; corrections need a commit.
- CORS is not access control — the data is public anyway.

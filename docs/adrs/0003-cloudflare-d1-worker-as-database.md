# ADR-0003: Database — Cloudflare D1 behind a Worker

- Status: Accepted (draft, nothing deployed yet)
- Date: 2026-09-18

## Context

GitHub Pages is static, but the brief wants Cloudflare free-tier storage as
the database. The free tier offers Workers (100k requests/day), D1 (SQLite,
5 GB, 5M row reads/day), KV and R2. The dataset is small, relational
(event → editions per year → distance classes) and queried by date.

## Decision

Use **D1** for storage and a small **Worker** (`worker/src/index.js`) as the
only reader. Schema in `migrations/0001_init.sql`: `events`, `editions`
(one row per event and year, with `status` and `source_url`) and
`distances`. The Worker answers `GET /api/events[?year=]` with exactly the
JSON shape of `public/data/events.json`, so the frontend has one code path.

**The JSON files in `data/` remain the source of truth**; D1 is a
queryable mirror seeded from them (`npm run db:seed`). The repo — not the
database — is what gets reviewed and versioned.

## Consequences

- Positive: reviewable diffs for every data change; DB can be rebuilt from
  scratch at any time; Cloudflare outage or quota exhaustion degrades to
  the static fallback (ADR-0002).
- Negative: two copies of the data; a seed step must follow data changes.
- The Worker URL is baked into the build via `VITE_API_URL`.

## Alternatives considered

- **KV or R2 holding one JSON blob.** Simpler, but not a database and no
  date queries.
- **D1 as source of truth with an admin UI.** Rejected: needs auth and a
  write API (ADR-0005), and loses git history of the data.

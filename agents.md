# agents.md — Triathlonium

## What This Is

A static, client-side site listing triathlons in North Rhine-Westphalia as a
**list** and a **month calendar**, with a big animated CSS/SVG hero. Data
lives as JSON in git (`data/`), is mirrored into **Cloudflare D1** and served
by a tiny read-only **Worker**; the Vite-built frontend on **GitHub Pages**
reads the Worker, and falls back to a static JSON if the Worker is down.
Human-facing overview: `README.md`. Rationale for every choice: `docs/adrs/`.

**Current status: draft, never deployed.** The frontend builds and the data
pipeline works. Not yet done: creating the Cloudflare D1 database/Worker,
enabling Pages on the existing GitHub repo `dbraun1991/Triathlonium`, and a
visual check in a real browser (the draft was only verified with `vite build`).

## Development

```
npm install
npm run dev         # data:build, then http://localhost:5173/Triathlonium/
npm run build       # data:build + production build to dist/
npm run data:build  # data/*.json -> public/data/events.json + worker/seed.sql
```
Cloudflare (needs the maintainer's own login — never run these unprompted):
`npx wrangler d1 create triathlon`, paste the id into `wrangler.toml`, then
`npm run db:migrate && npm run db:seed && npm run worker:deploy`. Set the
repo variable `VITE_API_URL` to the Worker URL.

## Data flow

```
data/triathlons-nrw-2026.json   spreadsheet export, events keyed by name (base, do not restructure)
data/2026.json, data/2027.json  overlays: { year, updates{}, new_events{} }   (one file per year)
        |  scripts/build-data.mjs  (merge, slug ids, parse travel, validate)
        v
public/data/events.json  (gitignored)      worker/seed.sql (gitignored)
        |                                          |  npm run db:seed
        v                                          v
frontend static fallback                    D1 --> Worker GET /api/events --> frontend
```
Both frontend paths return the same shape (`src/data.js`). See ADR-0003/0006.

## Module Layout

| Path | Role | ADR |
|------|------|-----|
| `index.html` | Hero markup, toolbar, `#app`, detail `<dialog>` | 0002, 0008 |
| `src/main.js` | State, filters, event wiring, initial data load | 0002, 0007 |
| `src/views.js` | `renderList`, `renderCalendar`, `renderDetail` — return HTML strings | 0007 |
| `src/data.js` | API-first, static-fallback loading; `flatten` to (event, year) rows | 0002, 0003 |
| `src/util.js` | Date/cost/travel formatting, `esc()` | — |
| `src/style.css` | All styling, CSS custom properties, dark theme, hero animation | 0008 |
| `scripts/build-data.mjs` | Merge + validate data, emit JSON and SQL | 0006 |
| `worker/src/index.js` | Read-only Worker over D1 | 0003, 0005 |
| `migrations/0001_init.sql` | D1 schema (`events`, `editions`, `distances`) | 0003 |
| `.github/workflows/deploy-pages.yml` | Build + deploy to Pages | 0004 |

## Conventions

- **Scope** is fixed by ADR-0011: road and cross triathlons in NRW only.
- **ADRs are append-only** (`docs/adrs/README.md`). A changed decision gets a
  new ADR; do not edit an old one's Decision section.
- **Escape everything.** All strings interpolated into HTML templates go
  through `esc()` — data comes from third-party websites.
- **No framework, no runtime dependencies** (ADR-0002). Vite and wrangler
  are devDependencies only.
- **`data/` is the source of truth.** Never hand-edit `public/data/events.json`
  or `worker/seed.sql`; they are regenerated and gitignored.
- **Don't restructure `data/triathlons-nrw-2026.json`.** It is the reviewed
  export. Add years as overlays; fix mistakes in place with a note in the PR.
- `localStorage` access is always wrapped in try/catch.
- UI copy is English; event names and venues stay German (ADR-0010).

## Adding or updating dates (research protocol, ADR-0009)

1. Read the **organiser's own page** (or a club/press post quoting the
   organiser). Aggregators (running.life, RUNME, finishers, kilometerliebe)
   forecast dates from the previous year and say so — never use them for
   `confirmed`.
2. `status: "confirmed"` only if `source_url` shows the date. "voraussichtlich"
   / "expected" / aggregator-only → `tentative` with a `note`.
3. Never invent a date. If nothing is found, leave the year out.
4. Put the edition number in `edition` when the source states it.
5. Run `npm run data:build` — it fails on unknown names or duplicate ids.

## Features & Future Work

- Fill missing 2027 dates (see `docs/data-review.md` for the open list).
- Distances/fees/travel time for new events (Enni-Triathlon Moers has none yet).
- ICS export / "add to calendar" per race; map view (Leaflet + OSM).
- Upload the swim/bike/run icons as real SVG instead of emoji (ADR-0008).
- Scheduled re-check of organiser pages (a GitHub Action opening PRs).
- In-app language switch (ADR-0010).

## What It Does NOT Do (yet)

- No deployment has happened; no Cloudflare resources exist.
- No write API, no accounts, no user-submitted races (ADR-0005).
- No results, registration links beyond the organiser website, or weather.

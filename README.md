# Triathlonium

A fun, colourful overview of triathlons in North Rhine-Westphalia — browse
them as a **list** or on a **full-year calendar**, filter by distance, travel
time and text, and open any race for its swim/bike/run distances, fees and
organiser link. Data covers 2025–2027; every date shows how trustworthy it is.

**Live demo**: https://dbraun1991.github.io/Triathlonium/

> **Status: draft.** The demo runs on GitHub Pages from the static data
> files. The Cloudflare database and Worker are not set up yet.

## How it works

- **Frontend**: Vite + plain JavaScript, hosted on GitHub Pages ([ADR-0001](docs/adrs/0001-frontend-build-tooling-vite.md), [0002](docs/adrs/0002-vanilla-js-no-framework.md), [0004](docs/adrs/0004-static-hosting-github-pages.md)).
- **Database**: Cloudflare D1 (free tier) behind a small read-only Worker ([ADR-0003](docs/adrs/0003-cloudflare-d1-worker-as-database.md), [0005](docs/adrs/0005-read-only-public-api.md)). If the Worker is unreachable the site uses a static copy of the data, so it never breaks.
- **Source of truth**: the JSON files in `data/`, reviewed like code ([ADR-0006](docs/adrs/0006-data-model-base-plus-year-overlays.md)).
- **Views and look**: list + full-year calendar ([ADR-0007](docs/adrs/0007-list-and-custom-calendar-views.md)), animated hero ([ADR-0008](docs/adrs/0008-hero-graphics-css-svg-emoji.md)), pool / open-water filter ([ADR-0012](docs/adrs/0012-swim-type-derived-from-venue.md)), English UI over German data ([ADR-0010](docs/adrs/0010-english-ui-german-data.md)).
- **Scope**: which events are listed at all — [ADR-0011](docs/adrs/0011-scope-what-counts-as-a-triathlon.md). Repo name and base path — [ADR-0013](docs/adrs/0013-github-repo-name-triathlonium.md).
- Everything is open source (MIT). All decisions are written down in [`docs/adrs/`](docs/adrs/README.md).

## Run it

```
npm install
npm run dev        # http://localhost:5173/Triathlonium/
npm run build      # static site in dist/
```
No Cloudflare account is needed locally — the site reads `public/data/events.json`,
generated from `data/` by `npm run data:build`.

## The data

| File | Contents |
|------|----------|
| `data/triathlons-nrw-2026.json` | 43 events from the original spreadsheet, keyed by event name |
| `data/2027.json` | 2027 dates researched from organiser websites (15 confirmed, 3 tentative, 1 new event) |
| `docs/data-review.md` | Things a human should check — including a few spreadsheet dates that look wrong |

Each date is `confirmed` (organiser source linked), `tentative` (expected or
forecast) or `unverified` (from the spreadsheet, not checked) — see
[ADR-0009](docs/adrs/0009-data-trust-levels-and-2027-sourcing.md).
**Always check the organiser before booking travel.**

## Going live (not done yet)

1. Push to `github.com/dbraun1991/Triathlonium` and enable Pages → GitHub Actions (`base` in `vite.config.js` already matches the repo name, [ADR-0013](docs/adrs/0013-github-repo-name-triathlonium.md)).
2. Optional database: `npx wrangler d1 create triathlon`, put the id in `wrangler.toml`, then
   `npm run db:migrate && npm run db:seed && npm run worker:deploy`.
3. Set the repository variable `VITE_API_URL` to the Worker URL and re-run the deploy workflow.

## Open questions for the maintainer

- Is Duisburg still the reference point for travel times?
- Should the many still-undated 2027 events be shown as "date TBA" instead of being absent?
- Keep the emoji athletes or commission proper SVG icons?

## For AI agents

See [`agents.md`](agents.md).

## License

MIT — see [LICENSE](LICENSE).

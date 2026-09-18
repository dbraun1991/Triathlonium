# Architecture Decision Records

Numbered, append-only decision log for the Triathlon NRW site. A changed
decision gets a new ADR that supersedes the old one — never an edit to an
old ADR's Decision section. A superseded ADR gets a one-line forward pointer
in its metadata header only.

| ADR | Decision |
|-----|----------|
| [0001](0001-frontend-build-tooling-vite.md) | Frontend build tooling: npm + Vite |
| [0002](0002-vanilla-js-no-framework.md) | UI: vanilla JS, no framework; static JSON fallback |
| [0003](0003-cloudflare-d1-worker-as-database.md) | Database: Cloudflare D1 behind a Worker, JSON in git stays source of truth |
| [0004](0004-static-hosting-github-pages.md) | Hosting: GitHub Pages via GitHub Actions (repo name → 0013) |
| [0005](0005-read-only-public-api.md) | Public API is read-only, no auth surface |
| [0006](0006-data-model-base-plus-year-overlays.md) | Data model: spreadsheet export as base + one overlay per year |
| [0007](0007-list-and-custom-calendar-views.md) | Views: list + hand-built month calendar |
| [0008](0008-hero-graphics-css-svg-emoji.md) | Graphics: CSS/SVG scene with emoji athletes |
| [0009](0009-data-trust-levels-and-2027-sourcing.md) | Data trust levels and how 2027 dates are sourced |
| [0010](0010-english-ui-german-data.md) | English UI, German data, no i18n yet |
| [0011](0011-scope-what-counts-as-a-triathlon.md) | Scope: which events belong (road + cross triathlons in NRW; no duathlon/aquathlon/kids) |
| [0012](0012-swim-type-derived-from-venue.md) | Swim type (pool / open water) derived from the venue text; filter + badge |
| [0013](0013-github-repo-name-triathlonium.md) | GitHub repo name: `Triathlonium`, base path `/Triathlonium/` |

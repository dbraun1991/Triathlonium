# ADR-0001: Frontend build tooling — npm + Vite

- Status: Accepted
- Date: 2026-09-18

## Context

The brief asks for a Vite-built site published on GitHub Pages. Sibling
projects (Mainline, Canvallax, storylane-local) already use npm + Vite with
the same hosting target, so the pattern is known to work.

## Decision

Use **npm** and **Vite** (`vite ^8`). `npm run dev` for local work,
`npm run build` for a static build to `dist/`, `npm run preview` to check it.
`npm run dev`/`build` first run `scripts/build-data.mjs` (ADR-0006) so the
generated data is always fresh.

## Consequences

- Positive: real dev server and production build; same tooling as siblings.
- Negative: needs `npm install` before anything runs; `wrangler` is also a
  devDependency (ADR-0003) and makes installs noticeably slower.

## Alternatives considered

- **No build step / CDN scripts.** Rejected: the brief names Vite.

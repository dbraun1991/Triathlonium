# ADR-0004: Static hosting — GitHub Pages via GitHub Actions

- Status: Accepted (repo name superseded by ADR-0013)
- Date: 2026-09-18

## Context

Same hosting as Mainline and Canvallax (their ADR-0006/-0022).

## Decision

`.github/workflows/deploy-pages.yml` builds and deploys `dist/` on every push
to `main`. `vite.config.js` sets `base: '/Triathlon/'`, matching the
project-site subpath; change it if the repo gets another name. The API URL
comes from the repository variable `VITE_API_URL` (not a secret — it is
public by nature).

## Consequences

- Positive: free, no server to run.
- Negative: the base path must match the repo name (as Mainline's ADR-0016
  learned); Pages must be enabled once (Settings → Pages → GitHub Actions).

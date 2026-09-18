# ADR-0013: GitHub repo name — `Triathlonium`

- Status: Accepted
- Date: 2026-09-18

## Context

ADR-0004 assumed the repo would share the working folder's name,
`Triathlon`, and set Vite's `base` to `/Triathlon/`. The repo was actually
created as `dbraun1991/Triathlonium`, so the Pages site is served from
`https://dbraun1991.github.io/Triathlonium/`. (Mainline hit the same
mismatch, its ADR-0016.)

## Decision

`vite.config.js` uses `base: '/Triathlonium/'`; the package, page title,
README and footer link use the name Triathlonium. The Worker's
`ALLOWED_ORIGIN` (`https://dbraun1991.github.io`) is unaffected, since CORS
matches the origin without the path. The rest of ADR-0004 stands.

## Consequences

- Positive: built asset URLs resolve on the deployed site.
- Negative: renaming the repo again means updating `base` again.

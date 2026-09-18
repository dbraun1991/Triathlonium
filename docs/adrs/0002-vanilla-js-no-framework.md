# ADR-0002: UI implementation — vanilla JS, no framework, static JSON fallback

- Status: Accepted
- Date: 2026-09-18

## Context

The UI is two read-only views (list, calendar) over roughly 50–100 events,
plus filters and a detail dialog. There is no editing and no cross-view state
beyond a small filter object. Siblings (ADR-0005 in Mainline) made the same
call for similarly sized UIs.

## Decision

Plain ES modules, string-template rendering, one `state` object in
`src/main.js`, re-render on every change. No React/Vue/Alpine, no calendar
library (ADR-0007). The frontend loads data from the Worker API when
`VITE_API_URL` is set and otherwise — or when the API call fails — from the
static `public/data/events.json` the build generates. The site therefore
works with zero Cloudflare setup.

## Consequences

- Positive: tiny bundle, no framework churn, site never breaks because the
  API is down or the free tier is exhausted.
- Negative: full re-render on each keystroke in search (fine at this scale);
  all interpolated strings must go through `esc()` — see `agents.md`.

## Alternatives considered

- **React/Svelte.** Rejected: nothing here needs component state or a
  virtual DOM.

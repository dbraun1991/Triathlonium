# ADR-0008: "Fancy" graphics — CSS/SVG scene with emoji athletes

- Status: Accepted
- Date: 2026-09-18

## Decision

The hero is a full-width animated scene built from a gradient sky, a bobbing
sun, an SVG hill, and three lanes — running track, road, water — across which
🏃 🚴 🏊 travel at different speeds while SVG waves drift. It costs no image
assets and no JS animation loop. `prefers-reduced-motion` freezes it. Palette
uses swim-blue / bike-orange / run-red as the brand triple; distance classes
have their own colours (sprint green, short orange, middle purple). Dark
mode swaps sky, hill and water tokens.

## Consequences

- Positive: light, themeable, accessible, fully open source.
- Negative: emoji render differently per OS; a bespoke SVG athlete set or a
  Canvas/WebGL scene could replace them later without touching the app.

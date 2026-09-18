# ADR-0006: Data model — spreadsheet export as base, one overlay per year

- Status: Accepted
- Date: 2026-09-18

## Context

`data/triathlons-nrw-2026.json` is the cleaned export of the original
spreadsheet: events keyed by name, with `date_2026`/`date_2025` columns and
no per-date provenance. 2027 (and later years) need dates that may be
confirmed, guessed, or missing, each with a source.

## Decision

Leave the reviewed export untouched. Each further year is an overlay
`data/<year>.json`: `{ year, updates: { <event name>: { date, status,
source_url, note? } }, new_events: { <name>: { location, date, status,
source_url, distances?, cost?, … } } }`. `scripts/build-data.mjs` merges base
and overlays into the normalized shape (`id` slug, `travel` parsed to km and
minutes, `editions: { "<year>": { date, status, source_url, … } }`) and
emits both `public/data/events.json` and `worker/seed.sql`. The build fails
on unknown event names or duplicate ids.

`status` is one of `confirmed`, `tentative`, `unverified` (ADR-0009).

## Consequences

- Positive: every year is a small, reviewable file; the original export
  stays as a snapshot; new years never restructure old data.
- Negative: event renames must be applied in the base file and in every
  overlay; new events lack `distance_from_duisburg` unless filled by hand.

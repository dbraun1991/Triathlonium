# ADR-0012: Swim type (pool / open water) derived from the swim venue text

- Status: Accepted
- Date: 2026-09-18

## Context

The swim venue was already in the data (`course.swim`, e.g. "Freibad 50m",
"Verler See") but only as free text, visible in the detail dialog. It could
not be filtered, although pool versus open water (wetsuit, cold water,
no pool turns) matters a lot when choosing a race.

## Decision

`scripts/build-data.mjs` derives `swim_type` — `pool` or `open-water` — from
the venue text by keyword (Bad/Freibad/Hallenbad/Schwimmbad/pool → pool;
See/Badesee/Kanal/Rhein/Hafen/Talsperre/Regattabahn → open water; anything
else → null). It is stored in D1 and returned by the Worker, and the UI
shows a badge plus "Pool" / "Open water" filter chips. Events with no
venue text (or unrecognised text) have no `swim_type` and are hidden while a
swim filter is active. The original text is never modified.

## Consequences

- Positive: no manual tagging; new events are classified automatically.
- Negative: keyword rules can misjudge new wording (a `Badesee` is
  matched as open water before "bad" is considered); "Freibad" is an
  outdoor pool, so it counts as pool although it may be unheated. Indoor
  versus outdoor pool is not distinguished.

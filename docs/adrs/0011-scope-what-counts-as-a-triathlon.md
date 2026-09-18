# ADR-0011: Scope — which events belong in the dataset

- Status: Accepted
- Date: 2026-09-18

## Context

A search for events missing from the spreadsheet turns up many multisport
events: duathlons, aquathlons, swim-runs, kids' triathlons, cross
triathlons, and events over the border in other states. Listing all of them
would blur what the site is for.

## Decision

An event is in scope if it is a **swim–bike–run race in NRW with at least one
sprint (~0.5/20/5), short (~1.5/40/10) or middle (~2/90/20) class**.
Out of scope: duathlons, aquathlons and swim-runs, kids-only and
family-fun events, and events outside NRW.

**Cross triathlons** (off-road bike/run) are in scope when their classes are
called sprint/short, but carry `format: "cross"` (shown as a badge) because
their bike and run legs are shorter than the road distances. Their
distances are recorded as published, not converted.

## Consequences

- Positive: the list stays comparable; borderline cases stay visible instead
  of silently dropped.
- Negative: "in the categories" is a judgement at the edges (for example a
  0.5/11/8 "fun triathlon" was left out); the excluded list lives in
  `docs/data-review.md`.

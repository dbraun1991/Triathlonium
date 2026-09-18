# ADR-0010: English UI, German source data, no i18n yet

- Status: Accepted
- Date: 2026-09-18

## Decision

UI copy is English; event names, venues ("Freibad 50m") and course notes stay
verbatim in German because they are proper names or terse local jargon and
translating them would introduce errors. Travel text keeps "Zug" as
written in the data. Multi-language UI (siblings use i18next, Canvallax
ADR-0026) is deferred until someone asks.

## Consequences

- Positive: no translation layer to maintain; data stays faithful.
- Negative: mixed-language cards for non-German readers.

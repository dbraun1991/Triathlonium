# ADR-0007: Two views — list and a hand-built month calendar

- Status: Accepted
- Date: 2026-09-18

## Decision

The **list** groups races by month as cards (date tile, name, town, travel
time, distance classes, fee, status). The **calendar** is a Monday-first
month grid with one pill per race, weekends tinted, today outlined, and
previous/next navigation across years. Both read the same filtered rows
(year, distance class, max travel time, text search) and open the same
detail dialog (native `<dialog>`). The last-used view and theme persist in
`localStorage`, always inside try/catch.

The calendar is ~30 lines of date arithmetic, so no calendar library
(FullCalendar etc.) is pulled in. Pills are coloured by the event's first
distance class only; a day with many races simply grows taller.

## Consequences

- Positive: no dependency, fully themeable.
- Negative: no week/agenda view, no drag or ICS export yet (see `agents.md`
  future work).

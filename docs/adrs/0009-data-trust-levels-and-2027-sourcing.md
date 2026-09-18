# ADR-0009: Data trust levels and how 2027 dates are sourced

- Status: Accepted
- Date: 2026-09-18

## Context

The 2027 research was run unattended by an agent. Organisers publish dates
late, websites are sometimes stale, and search results can be wrong. A
calendar that presents guesses as facts would send people to empty fields.

## Decision

Every edition carries a `status`:

| status | meaning |
|--------|---------|
| `confirmed` | Date read from the organiser's or another primary page, `source_url` set |
| `tentative` | Announced loosely (e.g. "Pfingsten 2027") or projected from the previous year's weekday; `note` explains |
| `unverified` | Carried over from the manual spreadsheet, not checked against a source |

Rules for agents: never write `confirmed` without a `source_url` whose page
actually shows the date; never invent a date to fill a gap — leave the year
out instead; keep the source's wording in `note` when a date is ambiguous.
The UI shows the status on every card and in the detail dialog.

## Consequences

- Positive: users can see how much to trust each date; reviewers can spot-check
  by opening `source_url`.
- Negative: many 2027 rows will be `tentative` for months.

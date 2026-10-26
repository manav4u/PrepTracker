# Visual guide

An opt-in guide at /guide, available before setup. Entry points: landing footer and Settings. No changes to the existing navigation dock or data model.

Content lives in lib/guide.ts. Every chapter uses source-verified current UI names. Screenshots use an isolated synthetic account, Aarya, never a student's data. Scripts under scripts/guide-* recreate the examples with a fixed clock. Product behavior is not simulated inside the reader: screenshots are clearly marked examples; destination links open the actual screen.

## Maintenance
- Check source behavior before changing copy. Historical notes are not an implementation contract.
- Retake images after a relevant UI change; keep the account and time consistent.
- Run typecheck, unit tests and browser tests at 390/1440. Inspect actual pixels.
- Distinguish Home unit-state scoring, actual course topic coverage, Home study-action goal and per-subject Plan topic credit.
- Offline and install affordances depend on browser support. Never promise that external links or every screen work offline.
- Use screenshot enlargement for long forms. Keep instructions in HTML, not burned into images.

## Coverage
Setup and course eligibility; Home metrics/calendar; topic checklist, bulk states and PYQs; Plan; spaced Review; Tasks and explicit carryover; Library and external links; global search/announcements; profile/date/course changes; backup/restore/data loss; install/offline/consent/troubleshooting.

## Scope exclusions
No app-wide redesign, new calculator route, cloud sync, native app, automatic task rescheduling, or unrelated Settings contrast fix. No production release in this PR.

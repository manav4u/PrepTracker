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

Regenerate screenshots with the guide capture scripts, then run `python3 scripts/guide-optimize.py` to mark focus targets and generate WebP. Keep the PNG captures out of the published asset set. Screenshots use cropped app controls; the small red dot marks the focus target named in the text. Full labels stay visible.

## Review build verification (2026-10-27)
- 104 unit tests, typecheck and production build pass.
- 66 browser checks at 390px and 1440px pass with zero retries, including all 42 guide steps, image loads, overflow, axe, reduced motion, keyboard dismissal/focus return, Settings entry and existing-data preservation.
- Previously loaded guide chapter reloads offline after the service worker takes control. A not-yet-visited Settings route failed offline in the same clean profile. The guide explicitly says to open needed screens while online, and does not promise every route or external resource offline.
- All first-step phone compositions and representative desktop compositions visually reviewed. Screenshot enlargement uses a vertically scrollable image with a fixed close control.
- Preview is on the existing isolated catchup project, with noindex/noarchive headers and robots disallow. It is not the live product release. The host uses a separate browser-storage origin; no production study data is copied.

## Interaction correction, 2026-10-27
User clarified the intended guide is a first-open in-app popup tour, not the separate reader. The first Home tour is a design sample triggered by `/app?tour=sample`; it also carries through setup in the current tab. It is not yet enabled automatically or marked completed persistently. No other-screen tour rollout until sample approval. The earlier reader is retained in draft only, not treated as fulfilling the corrected request.

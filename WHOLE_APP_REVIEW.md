# Whole-app paper edition review

Reviewed 10 October 2026. PR130 remains a review build, not a production release.

## What changed

- One warm-paper palette across landing, setup, course library, course notebook, desk, plan, tasks, marks, resources, revision, progress and settings.
- Green means recorded coverage/completion. Neutral ink means navigation and selection. Errors and destructive actions stay distinct.
- Different page structures remain: paper desk, course notebook, week folio, task pins, marks ledger and link cabinet. This is not the same hero grid repeated.
- Desk and Progress show evidence without changing coverage. Coverage edits belong in Courses.
- Stored writes happen before saved-looking state. Failed task/resource creation preserves the form; failed practice save preserves the attempt; failed Undo keeps the recorded attempt.
- Covered topics no longer return in Plan through a legacy fallback after their return date was explicitly cleared.
- Legacy base resource codes match complete course-code segments, without partial-code false positives.
- Revision cards say a syllabus heading is not an answer key. Self-reported confidence and attempts are not exam-readiness scores.
- Route-level splitting replaces the single application bundle. The catalog remains a large shared chunk.
- Desk totals stay stable while paper/ribbon arrival and hover motion provide life. No animated fake tally values.
- Unknown addresses show a plain page-not-found state instead of falling into an old dark shell.

## Validation completed

- TypeScript and production build pass.
- 61 automated tests pass.
- Anonymous hosted review checked at 320, 390 and 1280 pixels on ten main routes. No horizontal page overflow or browser page errors observed. Shared root ground verified on all routes.
- Landing, onboarding and Add course checked on phone and PC.
- Complete FE onboarding with five actual basket choices persisted through reload.
- Task create, linked paper dates (including two papers on one day), plan generation/edit, marks reload, resource create/view, profile reload and backup export tested on local and hosted builds.
- Complete attempt save, Undo and backup import tested locally. Restore cancel kept the profile unchanged.
- Injected storage failures checked for task drafts, profile state, marks, resource creation/removal, practice save and Undo. Previous saved state remained intact in these checks.
- Course coverage edits reflected in storage and survived reload. One SE course add and raw-source unit view checked; the calculator explicitly excluded the unmapped SE assessment scheme.
- Reduced-motion check observed zero active CSS animations. Mobile More drawer and unknown route checked.
- Actual screenshots inspected, including course unit details, paper calendar, restore dialog and every major page on phone and PC. Screenshots are samples, not a claim to have exercised every possible record combination or every browser engine.

## Neutral scores out of 10

| Aspect | Score | Remaining miss |
|---|---:|---|
| Palette consistency and hierarchy | 8 | Distinct support surfaces now read across the app, but the exact area ratio varies by page, data and viewport. |
| Visual identity | 8.5 | Distinct paper forms, but several pages still carry large editorial headings. |
| Responsive layout | 8.5 | Checked phone/PC widths; long source paragraphs and a 150-course catalog need scrolling. |
| Motion | 8 | Arrival, ribbon sweep, lifts and drawer response work; no rich transition choreography between every route. |
| Exam-time usefulness | 8 | Coverage, next paper and revision are clear; paper times/reminders are not present. |
| Reliability and data honesty | 8.5 | Tested write failures and explicit claims; local browser storage is still the only primary store. |
| Accessibility | 8 | Keyboard/focus/reduced motion present; not a full screen-reader, Safari or cross-browser certification. |
| Performance | 7.5 | Pages split; catalog is still about 948 kB raw / 166 kB gzip and triggers the build warning. |
| Product breadth | 7.5 | FE marks only; supplemental learning materials and unavailable AI are explicit. |
| Overall | 8.1 | Ready for product review, not a claim of a complete 10/10 product. |

## All known product compromises

1. Local-only data, no account sync, server recovery or app-level encryption. Back up before clearing browser data or changing devices.
2. Exam tasks are user-entered date-only records, not an official timetable. No paper-time countdown, calendar subscription or closed-page reminder delivery.
3. Marks estimation supports FE. Complete SE/TE assessment mapping is not ready. The published handbook's exact-40 grade boundary remains disclosed, not silently corrected.
4. Syllabus tracking is theory-focused. Labs, tutorials and every open elective are not represented. Conflicting/draft curriculum branches remain reference-only where appropriate.
5. Coverage, practice outcomes and confidence are the student's own records. They cannot establish mastery, predicted grades or exam readiness.
6. Only four supplemental material mappings were reviewed for topic fit. Legacy course links remain labeled as unreviewed topic fit; these are not official SPPU papers or answer keys.
7. AI tutor is not available. Earlier confidence-based records remain separate from new actual attempts.
8. Georgia/system typography is used rather than the initial preview's licensed typography. Full course lists and raw source paragraphs can make long pages.
9. The catalog is still large; no measured real-device performance budget or Safari/Firefox matrix has been completed.
10. Restore uses a rollback snapshot, but backup files remain private data the student must keep safe. No cloud backup promise.

Review deployment: https://preptracker-paper-review.vercel.app/

## Proportional hierarchy follow-up

The 19:46 critique was valid: the first consistent pass used too many near-white surfaces, so the secondary color did not carry enough visual weight. This follow-up makes support surfaces deeper oat (`#d5c6ad`) while leaving the dominant reading paper light and recorded progress sage.

- Supporting bands now carry the desk header/stats, plan budget, task form, marks coverage choices, catalog filters/disclosure, resources controls, course method/stats, revision work sheet, progress heading/maps and settings bookplate.
- Longer lists use bounded alternating oat cards rather than making the entire page one dark panel.
- Light reading leaves stay distinct from oat support panels. Ink remains the text/navigation/action color.
- Green is not added to meet a decorative quota. Empty, setup, resources and settings views can have none.

Anonymous hosted screenshots checked again on all 13 pages at 390 and 1280 pixels; ten main routes also checked at 320. No horizontal overflow or page errors observed. Main hosted flows and local save/Undo/import flows pass. Typecheck, build and 61 tests pass.

A simple color-area audit of first 1000-pixel hosted views found oat at roughly 23-38% on the ten main phone views and 15-33% on desktop. The phone Add course view remains heavier at 46%; desktop marks remains lighter at 15%. These are known misses, not exact 60/30/10 compliance. Recorded green occupied about 3-4% in the sampled desk/progress views and zero where no recorded progress is shown. This audit measures pixels, not perceived hierarchy, and changes with scroll position and data.

The goal is a dominant/support/accent hierarchy, not literal percentages on every dynamic screen. This pass fixes the previously weak secondary hierarchy but does not claim a perfect ratio or a 10/10 design. Product/reliability compromises above remain unchanged.

# Whole-app paper edition review

Reviewed 10 October 2026. PR130 remains a review build, not a production release.

## What changed

- One warm-paper palette across landing, setup, course library, course notebook, desk, plan, tasks, marks, resources, revision, progress and settings.
- After the 20:01 steering, green is a secondary design surface across the app. Dark checks, labels and state text identify actual coverage/completion. Color alone is not evidence. Ink remains navigation/actions; errors and destructive actions stay distinct.
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

## Earlier oat hierarchy follow-up (superseded by green steering)

The 19:46 critique was valid: the first consistent pass used too many near-white surfaces, so the secondary color did not carry enough visual weight. This follow-up makes support surfaces deeper oat (`#d5c6ad`) while leaving the dominant reading paper light and recorded progress sage.

- Supporting bands now carry the desk header/stats, plan budget, task form, marks coverage choices, catalog filters/disclosure, resources controls, course method/stats, revision work sheet, progress heading/maps and settings bookplate.
- Longer lists use bounded alternating oat cards rather than making the entire page one dark panel.
- Light reading leaves stay distinct from oat support panels. Ink remains the text/navigation/action color.
- Green is not added to meet a decorative quota. Empty, setup, resources and settings views can have none.

Anonymous hosted screenshots checked again on all 13 pages at 390 and 1280 pixels; ten main routes also checked at 320. No horizontal overflow or page errors observed. Main hosted flows and local save/Undo/import flows pass. Typecheck, build and 61 tests pass.

A simple color-area audit of first 1000-pixel hosted views found oat at roughly 23-38% on the ten main phone views and 15-33% on desktop. The phone Add course view remains heavier at 46%; desktop marks remains lighter at 15%. These are known misses, not exact 60/30/10 compliance. Recorded green occupied about 3-4% in the sampled desk/progress views and zero where no recorded progress is shown. This audit measures pixels, not perceived hierarchy, and changes with scroll position and data.

The goal is a dominant/support/accent hierarchy, not literal percentages on every dynamic screen. This pass fixes the previously weak secondary hierarchy but does not claim a perfect ratio or a 10/10 design. Product/reliability compromises above remain unchanged.

## Green secondary and richer pages

The user requested "Green 30" and said other pages were too quiet at 20:01. This supersedes the previous earned-only green rule.

- Muted green (`#afbea6`) is now the real secondary paper/book-cloth surface. Deep green (`#3d5945`) supplies edges, checks and book-spine details. Light paper stays dominant; ink carries text and primary actions.
- Plan, Tasks, Marks, Resources, Progress and Settings have working-page indexes with current record counts. These are actual values, not invented sample activity: planned sessions/minutes/dates, open tasks/papers, resource types, completed assessment heads, topic evidence and backup state.
- Page forms differ: folio binding/day tabs, pinned task tape, ruled marks ledger, resource cabinet spines, framed settings bookplate, topic-map binding and revision work sheet. Fine texture and offset paper edges add depth without photographic noise.
- Coverage tiles use deep fill, checks and labels. Uncovered tiles stay warm paper, so a green supporting panel does not falsely suggest completion. Resource video count derives from video type/YouTube parsing, not a nonexistent category.
- The formerly over-heavy Add face is now a bounded green title band over a light reading/action body.

Local validation: all 13 pages inspected at 390/1280; ten main routes also at 320. No page overflow/errors. Typecheck, build and 61 tests pass. Core create/save/reload flows and injected storage failures pass. Resource failure preserves title, failed removal retains saved link, successful removal deletes it; reduced-motion has zero active CSS animations; mobile More drawer works. An initial test-script failure targeted a desktop-only missing More button, corrected to mobile dock; it was not an app failure.

Approximate first-1000px local green surface area: main phone views 20-38%, desktop 19-34%. Add desktop is lighter (13%); source notebook phone heavier (38%). These are samples, not literal 60/30/10 on every scroll/data combination.

Self-review: palette/hierarchy 8, visual richness 8, responsive 8.5, motion 8, exam usefulness 8, reliability/honesty 8.5, accessibility 8, performance 7.5, breadth 7.5. Overall 8.1/10. The new page indexes still share a family; this is richer and more useful, not a claim of a fully bespoke visual sculpture per route. Catalog size, system typography, long sources, local-only storage and FE-only marks remain the known limits.

Hosted publication completed at 20:20 IST on the isolated review project. The stable URL now shows this green pass: https://preptracker-paper-review.vercel.app/ . Anonymous 13-page phone/PC plus ten-route 320-pixel audit found no horizontal overflow or page errors. Actual hosted contact sheets and full-size Resources phone, Marks phone and Plan PC inspected. Hosted task, same-day papers, plan generation/state, marks persistence, resource creation/view, profile persistence, backup export and study-stage flows pass.

Hosted first-view green surface audit is approximately 19-38% on main phone views and 17-33% on desktop, affected by the review banner and scroll position. Add PC remains lighter at 14%. This is a supporting hierarchy, not a literal pixel quota.

No production/main mutation or merge.

## Review-refine cycle 3: remove the repeated index

Brutal finding: the green pass repeated the same three-number strip on six pages. Texture and different borders did not fix the shared template. Large headings also spent too much first-screen space on atmosphere.

Removed the shared strip and component. Each working page now has its own useful form:

- Plan: a date runway, with actual planned minutes and clickable date slips.
- Tasks: a write-a-pin register that focuses the real editor, plus pending-paper/completed counts.
- Marks: a complete-assessment-head track, with entered cells and explicit partial coverage. Zero courses prompts a course/basket choice, not a success state.
- Resources: four working category drawers, with exact category counts and filter selection.
- Progress: per-course recorded-coverage bands that select the course below. No chart invents history or practice evidence.
- Settings: a data-custody seal and backup jump instead of another generic statistic strip.

Mastheads are smaller, resource/catalog/task typography is tighter, and unnecessary desktop control minimum heights were removed. Actions and evidence arrive earlier without stripping the paper identity.

Validation: typecheck/build and 61 tests pass. Local core flows/injected failures pass. Anonymous hosted 13-page phone/PC and ten-route 320 audit has no page overflow/errors. New drawer filters returned the expected 2 notes / 11 lecture-stream links in the fixture; course band selected Physics; task jump focused the editor; backup jump responded. Seven empty routes checked without overflow. Hosted main task/plan/marks/resources/profile/backup/study flows pass. Hosted all-page pixels plus Resources phone and empty Marks phone inspected. Empty-state screenshots were taken after the arrival animation settled, not during its fade.

Self-review: visual identity 8.5, useful density 8.5, palette/hierarchy 8, responsive 8.5, motion 8, exam usefulness 8.5, reliability/honesty 8.5, accessibility 8, performance 7.5, breadth 7.5. Overall 8.3/10. Biggest remaining design miss: typography is still system Georgia/Arial and some course/source pages remain long. The app is improved, not 10/10. Existing product limits remain.

Review: https://preptracker-paper-review.vercel.app/
Deployment: https://preptracker-paper-review-4uhi7xfj4-manavships.vercel.app
PR130 stays open/unmerged. Production/main unchanged.

## Review-refine cycle 4: type and reading proportion

Biggest miss addressed: Georgia/Arial gave the edition a borrowed browser-default feel, and the method block on course pages delayed the unit work by a whole phone screen.

Self-hosted Libre Baskerville (regular, bold, italic) and DM Sans (400/500/600), with OFL licenses included. Latin/punctuation subset keeps the six font assets to about 113 KB. No runtime Google Fonts dependency; old unused Inter/Space Grotesk links removed after network verification caught them. Original family fallbacks remain for missing characters/load failure. Serif is for headings/figures, sans for working text and controls. Course title/leaf and resource/catalog heading proportions retuned for the wider real type.

Course preparation guidance is a native, keyboard-accessible disclosure, closed initially. Its method remains one tap away; the course unit tabs/work now fit far earlier on phone. Coverage declarations and limits stay visible.

Validation: 61 tests/typecheck/build pass; local all-page 320/390/1280 audit, core flows, injected failures pass. Anonymous hosted all 13 pages 390/1280 and ten routes 320 no page errors/overflow. Hosted core flows pass; new controls and seven empty routes pass. Hosted network/computed styles confirm both selected families loaded and only first-party font requests. Method disclosure opens and preserves all three steps. Actual hosted all-page contact sheets and full-size course phone pixels inspected after final publish. No fabricated test or practice evidence.

Self-review /10: identity 8.7, typography 8.5, useful density 8.5, hierarchy 8.3, responsive 8.5, motion 8, exam use 8.5, reliability/honesty 8.5, accessibility 8, performance 7.5, breadth 7.5. Overall 8.4. Biggest remaining miss is not a font: very long source/topic text and the working studio still require substantial scrolling; resource/PYQ mapping is incomplete, so visual polish cannot make the product 10/10.

Review: https://preptracker-paper-review.vercel.app/
Final deployment: https://preptracker-paper-review-6gntihkp5-manavships.vercel.app
No merge or production/main change.

## Cycle 5, local-only pending review publish route

Course unit reading now has phrase search and a Show what is left toggle. It preserves the full official/source-boundary entries and their original IDs, rather than clipping or rewriting long text. Shown/total count, Reset view and explicit zero-result states are included. Coverage remains self-reported, never a test result.

Local validation: 61 tests/typecheck/build pass; all-page 320/390/1280 overflow/error audit/core flows/injected failures pass. Filtered-index test starts with empty fixture topic states: cover topic 1, show six remaining, mark displayed topic 2 (Mean Value Theorems); it disappears from filtered results and reset confirms topic 2 is covered. No-match phrase and Reset view pass. Actual course phone pixels inspected.

Not deployed. Hosted review remains cycle 4. Browser opened only the token form and stopped; no new credential created. Publication awaits a decision on the review-only credential route.

### Cycle 5 hosted closeout

Published after the user's original 21:39 Continue reply to the tonight-build temporary-credential question. Review-only project-scoped one-hour credential created for this publish, then deleted; populated account token list confirmed its absence. No production/main change.

Anonymous hosted filtered-ID proof passed: six remaining after covering first entry; original topic 2 (Mean Value Theorems) marked, removed from filtered view, and still correctly covered after Reset view. Phrase no-result and Reset view passed. Hosted all-page phone/PC plus ten main pages 320 no overflow/page errors; hosted core flows passed. Actual hosted course-filter phone pixels inspected.

Self-review /10: identity 8.7, typography 8.5, useful density 8.6, hierarchy 8.3, responsive 8.5, motion 8, exam use 8.6, reliability/honesty 8.5, accessibility 8, performance 7.5, breadth 7.5. Overall 8.4. A useful improvement, not a new whole-point score. Biggest remaining miss: study-session comparison is long on phone; the large catalog bundle and incomplete material/PYQ mapping remain.

Deployment: https://preptracker-paper-review-ee9d51nsd-manavships.vercel.app
Review: https://preptracker-paper-review.vercel.app/

## Cycle 6: a shorter comparison desk

Biggest working-form miss addressed: repeated question, optional link and oversized proportions made comparison longer than it needed to be. The chosen task is now a native disclosure in stages 2/3, optional reference URL is a disclosure, dates share a row when width allows. Studio heading/topic/stage sizes and phone textarea height are tighter; fields still resize. Required comparison source, worked reference, outcome and return controls stay visible. No extra stage or fabricated automatic evaluation.

61 tests/typecheck/build pass. Local all-page 320/390/1280 overflow/error audit/core flows/injected failures pass. Explicit comparison at 320/390/1280 records the optional URL and correct outcome. Hosted repeats all three viewport save tests and all-page audit with no overflow/page errors. Actual hosted stage phone/PC and full-phone-form pixels inspected. Save failure retains the entered source without showing a receipt; failed Undo retains the saved attempt. Review-only one-hour credential revoked after publish, populated token list confirms absence.

Scores: identity 8.7, typography 8.5, density 8.7, hierarchy 8.5, responsive 8.5, motion 8, exam use 8.6, reliability/honesty 8.5, accessibility 8, performance 7.5, breadth 7.5. Overall 8.5/10. Biggest remaining miss: initial source catalog weight and incomplete topic material/PYQ mapping, plus large comparison references still necessarily take space. Product limits remain; not 10/10.

Review: https://preptracker-paper-review.vercel.app/
Deployment: https://preptracker-paper-review-p7u5v6vcj-manavships.vercel.app
No merge, production/main untouched.

## Cycle 7: stop loading the syllabus just to count it

Landing imported the full source catalog only for the number of courses and the coverage note. Generate a tiny summary from the same catalog build instead. A new visitor now gets the unchanged count/note without fetching or parsing the 947 KB source catalog chunk (~166 KB gzip). Directory still fetches the catalog on navigation; all source entries, IDs and tracking restrictions are unchanged. This improves the entry route, not the weight of the working catalog itself.

62 tests pass, including a summary/source parity guard; typecheck/build pass. Local and anonymous hosted network checks show zero catalog requests on landing, then the real catalog chunk on Directory navigation and the same 150-course count. Local/hosted 13 pages phone/PC and ten 320 routes no overflow/page errors. Actual final hosted landing phone/PC pixels inspected. Review-only one-hour credential deleted and populated token list confirms absence.

Scores unchanged visually: identity 8.7, typography 8.5, density 8.7, hierarchy 8.5, responsive 8.5, motion 8, exam use 8.6, reliability/honesty 8.5, accessibility 8, performance 8, breadth 7.5. Overall 8.5. Biggest miss: catalog still loads in full on working course routes; material/PYQ mapping remains incomplete. No claim of faster measured wall-clock rendering or 10/10.

Review: https://preptracker-paper-review.vercel.app/
Deployment: https://preptracker-paper-review-jlkpwbz8o-manavships.vercel.app
No merge or production/main change.

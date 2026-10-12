# Paper desk review

Full read-only exam-preparation desk, built against current main and tag v0.26.10.08's useful density.

## Review contract
- No merge or production replacement. Review branch only.
- Coverage comes from actual source-topic marks, not fictional demo state or unit weights.
- Tiles and numbered unit ribbons reveal details. Open course unit navigates to the existing editor.
- Paper calendar uses pending, selected-course-linked Exam tasks. Dates are user-entered; no official time is invented. Days change at midnight.
- Revision slips show chosen return dates and existing earlier revision records. No new revision engine or readiness score.
- Plan, tasks, syllabus, materials, calculator, settings and backup are reachable.
- The existing Courses, Plan and revision pages remain intact. This redesign replaces the desk, not every page's information architecture.
- No new fonts with unclear licensing. System Georgia/Arial provide the paper hierarchy.
- Existing stored data keys are unchanged. A separate best-effort visit snapshot supports an honest changed-since-visit indicator.

## First self-review
Biggest miss: a date-only task cannot support a truthful ticking-seconds countdown. The build deliberately uses midnight-updating calendar days rather than the earlier simulated counter. The paper folio still responds to paper selection, with multiple papers on the same date preserved.

Scores before visual refinement: data/IA 8, completeness 8, design 7, motion 7, phone 7, accessibility 7. These are engineering self-scores, not the user's aesthetic verdict. Final checks and remaining limits will be recorded on the PR.

## Refinement and final checks
- Phone topic tiles and unit ribbon controls have 44px target height; search and dialogs support keyboard use.
- Fixed a return-date edge case: explicitly clearing nextReview must not resurrect an earlier confidence-based due date.
- Native modal dialog supplies focus containment, Escape close and focus restoration.
- Reflow tested at 320, 390, 768, 1280 and 1440. Empty selections, 12 courses, no-result search and reduced motion checked. Reduced motion has zero running animations.
- 57 automated tests pass, including 6 desk tests; TypeScript and production build pass.
- Hosted anonymous-browser interactions at 320/390/1280/1440 preserve the exact study storage value when opening topic/unit details and selecting papers. Opening a course goes to the real course editor; a coverage edit there reflects back on the desk.
- Inspected the actual hosted desktop and phone pixels: top, course cards/ribbons, paper folio/plan/tasks, revision slips, chart, materials/footer and topic dialog.

Final self-scores: IA/data 8.5/10, completeness 8/10, visual design 7.5/10, motion 7/10, responsive layout 8/10, accessibility 8/10. No 10/10 claim. The biggest remaining limits are date-only papers (no exact-time countdown), existing revision-page practice terminology, system fonts instead of the preview's licensed faces, and a long desk when many courses are selected. The build has a pre-existing large-bundle warning. The user gets the aesthetic verdict.

Review deployment: https://preptracker-paper-review.vercel.app/
Select "Load sample review desk" for labeled fictional fixtures or "Start empty". This is a separate review-only site. The live PrepTracker domain and main branch are unchanged. Sample bootstrap exists only in the review deployment, not in the app source or production code.

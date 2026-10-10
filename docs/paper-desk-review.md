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

# Findings
- Favor opt-in, recallable help over automatic tour overlays. Important backup warning belongs in entry and chapter, not hidden.
- Real controls must use their real UI names. Existing status pills read Start / Studying / Done, while stored Mastered is shown as Units Mastered on Home.
- Topic PYQ ribbons mark solved state; they do not open a question paper. Library supplies archive links.
- Current public UI has no marks calculator. Do not teach historical routes.
- Plan targets derive from per-subject dates, ceil(remaining topics / study days), with two revision days reserved at six+ days away. Exam day and past are excluded. Extra work cannot substitute for another subject.
- Review steps are first after3days, then7days after a successful review, then21days after the next; Forgot resets to tomorrow; max8 reviews per local day; Undo last answer.
- Home daily goal is5study actions, not5topics and not Plan completion. Task checkbox does not record syllabus progress.

## Contextual expansion - 27 October 2026

The approved Home popup pattern now covers Home, Library, Tasks, Review, Daily Plan, Settings and course details. There are 42 explanations plus one welcome per screen. First-visit state is local, with skip/completion, per-screen replay and an opt-out in Settings. Existing navigation and study data remain unchanged. No sparkle motifs.

Testing uses synthetic Aarya records, never a real student's storage. Tours make the app shell inert and preserve scroll. Cookie consent and the daily due-review prompt take priority. An extra due-review test caught and fixed an initial modal race. The subject-filter component needed to forward the spotlight identifier; this was fixed after a small-phone screenshot sweep.

Visual checks: 320x568, 390x844, 768x900 and 1440x900. Every explanation checked for current-step targeting, popup/spotlight overlap, horizontal overflow and off-screen card. Actual screenshots reviewed across all seven tours. Compact phones use an internally scrollable card when necessary; no study controls are exercised by a tour. The earlier optional reader remains a separate help reference, not the first-use experience. Production release remains approval-gated.

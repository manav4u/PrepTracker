# Learning loop storage, v2

Original course, unit and FE topic IDs are retained. Upper-year source paragraphs remain in `topics` and the revision event log under their original aggregate ID. Source-boundary display children use a hash of the preserved NFC text plus duplicate occurrence number. Unrelated source insertion does not move those IDs. A changed source span creates a new identity, not silently transferred evidence. This is a derived reading structure, not an official subtopic taxonomy.

Migration only adds schemaVersion 2 and an empty attempts list. It never awards coverage or recall to children from a parent's record. Existing confidence/revision history, planner, marks, tasks, resources, progress and profile remain intact. Old aggregate evidence will be separately labelled in the atlas.

Attempt history holds goal, typed/paper attempt, comparison reference, self-reported outcome, date, editable next review and prior topic recall state for undo. A syllabus heading is not accepted as a comparison reference. User-provided comparisons are labelled user-provided, not verified. No learning event comes from a timer or source reveal. The starting outcome intervals are transparent 1/3/7-day heuristics, not adaptive retention estimates.

Coverage and legacy confidence/date fields stay separate from new outcome/nextReview. Undo is latest-per-topic only, restores recall state and preserves subsequent coverage edits. No cross-device sync, grading or memory prediction is provided.

Backup version 6 includes every old state group and the new loop data. Versions 3.1, 4 and 5 remain accepted under their existing missing-field rules. Validate before any restore write; preserve full rollback on storage failure. Old exports cannot reconstruct data they never contained. Attempt/event logs remain bounded at 5,000 each.

Tests cover stable handles, FE IDs, idempotent migration, no child inference, gates, calendar rollover, explicit no-review, undo ordering, backup/restore/rollback, old-v5 compatibility, invalid references and storage quota failure.

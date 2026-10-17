# Year / branch scope - official source research (2026-10-18)

Goal: extend PrepTracker beyond first year so any SPPU engineering student can use it.
Rule: syllabus data only from latest official SPPU sources, honest about coverage.

## Official sources found (unipune.ac.in / collegecirculars.unipune.ac.in)

- FE 2024 pattern (current, effective AY 2024-25):
  - Official document library: http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024
  - Exam pattern circular: http://collegecirculars.unipune.ac.in/sites/examdocs/November%202024/F.E%20(%202024%20PATTERN%20).pdf
  - (Current constants.tsx FE data already matches this pattern.)
- SE 2024 pattern (NEP-2020 compliant, effective AY 2025-26, carries forward to TE 2026-27, BE 2027-28):
  - Official library: http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025
  - Branch PDFs confirmed present there:
    - SE Computer Engineering 2024 Pattern
    - SE Civil 2024 pattern (SE-Civil2024_pattern-_final_version_22072025.pdf)
    - SE Electrical 2024 pattern (SE_Electrical_Syllabus_2024_pattern_14th_July...)
    - SE AI&DS 2024 Pattern (SE - AIandDS - 2024 Pattern_18072025.pdf)
    - SE CSE (Data Science) 2024 pattern (listed in Syllabus-2024 library, ID 194)
  - SE Computer sem III courses (from official PDF): Data Structures; OOP and Computer Graphics; Operating Systems; Data Structures Lab; OOP and CG Lab; Digital Electronics and Logic Design; Entrepreneurship Development; Universal Human Values and Professional Ethics; Community Engagement Project.
  - SE Computer sem IV courses: DBMS; Discrete Mathematics; Computer Organization and Microprocessor; DBMS Lab; Microprocessor Lab; Internet of Things; Web Development; Modern Indian Languages - Marathi; Engineering Product Design; Environmental Studies.
- TE/BE 2024 pattern: not yet published (they follow in AY 2026-27 / 2027-28). Must say so honestly in the app.

## Implementation sketch (next run)

1. Data: new `data/curriculum.ts` with BRANCHES -> YEARS -> SEMESTERS -> SUBJECTS (units with topics) extracted per official PDF. Start with FE (existing) + SE Computer (most likely audience). Mark coverage honestly in Settings/Onboarding ("More branches coming").
2. Profile: add branch + year fields; onboarding gains a branch/year step (keep 5-subject FE flow as-is for FE).
3. Subject codes/names come only from the PDFs above; unit/topic text transcribed, not paraphrased from third-party sites.
4. SGPA credit values per course from the same PDF curriculum-structure pages.

## Open questions for the owner
- Which branches to prioritize after Computer? (IT, ENTC, Mechanical, Civil all have 2024-pattern SE PDFs in the same library.)

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users: SPPU engineering students tracking their semester syllabus progress. Secondary: students who need to access the syllabus library and question paper archives.

## Product Purpose

PrepTracker helps engineering students break their syllabus into units and topics, track progress by ticking topics off as they study, and surfaces what's left before exams through day-study tasks, progress counts, and streaks. It replaces the manual workflow of PDF folders and group chats with a single organized app that counts down to the exam, sizes each day's tasks to remaining time, and keeps progress in the browser.

## Positioning

The only progress tracker purpose-built for the SPPU engineering syllabus. Nearest competitors are generic note-taking or spreadsheet tools; PrepTracker uniquely maps SPPU's unit-topic structure and surfaces SPPU question paper links alongside tracked progress.

## Operating Context

- SPPU engineering students (FE/SE/TE across Computer, Electrical, Mechanical, Civil, IT, etc.)
- Study sessions happen locally in the browser; progress persists in localStorage
- Students set their exam start date in Settings; all countdowns derive from that date
- Syllabus data comes from SPPU official PDFs; question paper links are curated from verified sources
- Works offline after initial load; data stays in the browser per the privacy commitment

## Capabilities and Constraints

- **Syllabus tracking**: Subjects → Units → Topics, with status (Not Started / In Progress / Revision / Mastered)
- **Progress visualization**: Overall percentage bar, per-subject breakdown, streak counter, days-to-exam countdown
- **Daily tasks**: App generates today's study tasks based on days left and remaining topics
- **Question paper library**: Curated SPPU PYQ links per branch/semester, visible alongside syllabus units
- **Resource saving**: Users can save custom videos/PDFs/links per subject; system resources are read-only
- **Storage persistence**: Best-effort `navigator.storage.persist()`; full quota triggers global alert in Settings
- **Offline first**: All cached data persists in localStorage; app shell prerenders at build time

## Brand Commitments

- Name: PrepTracker
- Voice: student-for-students, honest, no-nonsense
- License: MIT (open source)
- Privacy: data stays in browser; no account required; optional storage persistence
- Visual identity: Maroon (#F63C49) gradient, dark theme (#030303), logo mark

## Evidence on Hand

- Codebase at `/tmp/pt`: React + Vite app with 9 page components, 27+ UI components
- SPPU subject catalog: 18 first-year subjects in `constants.tsx` with unit-topic breakdowns
- System resources: 60+ curated links (PYQ archives, lecture videos, notes) in `SYSTEM_RESOURCES`
- Local storage keys: `sppu_profile`, `sppu_progress`, `sppu_tasks`, `sppu_calculator_marks`, `sppu_reviews`, `sppu_custom_resources`, `sppu_deleted_system_ids`
- 6 FAQ entries visible in the landing page footer
- 6 testimonial placeholder quotes in LandingPage
- Build command: `vite build` + prerender scripts (`prerender-landing.mjs`, `prerender.mjs`)
- Deploy: Vite preview, Vercel (`.vercel/` directory present)

## Product Principles

1. **Progress over perfection**: Tick one topic and see immediate impact on tasks and countdown
2. **Local first**: All data stays in the browser; no account needed; privacy by design
3. **SPPU-native**: Every feature maps to SPPU's actual unit-topic structure and exam cycle
4. **Zero-config onboarding**: Get started in under 2 minutes — pick subjects, set exam date, done
5. **Visible, not noisy**: Interventions (alerts, bells, calls-to-action) are sparse and action-driven

## Accessibility & Inclusion

- Known requirement: keyboard-navitable focus rings, screen-reader-friendly labels, color contrast sufficient on dark background
- Standards: WCAG AA contrast for body text on #030303 (target 4.5:1), focus-visible rings, aria-labeled dialogs and navigational landmarks
- Omit when no product-specific requirement was established beyond the above
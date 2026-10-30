⚠️ DEGRADED: single-context (no sub-agent tool exposed; assessments ran inline in this session)

#### Report header provenance
Method: single-context (A: design review inline · B: CLI detect)

#### Design Health Score
> *Consult the [Heuristics Scoring Guide](#heuristics-scoring-guide) section below.*

Present the Nielsen's 10 heuristics scores as a table:

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Partial feedback; some actions produce visible response, major gaps remain in form validation and loading states |
| 2 | Match System / Real World | 3 | Mostly natural; occasional term needs context (e.g. "PRN", code references) |
| 3 | User Control and Freedom | 3 | Good control; users can exit and undo most actions, but some traps remain |
| 4 | Consistency and Standards | 2 | Partially consistent; main flows match, details diverge (hover styles, active states) |
| 5 | Error Prevention | 2 | Partial prevention; common errors caught, edge cases slip (contrast, confirmation traps) |
| 6 | Recognition Rather Than Recall | 3 | Good recognition; most things discoverable, few memory demands |
| 7 | Flexibility and Efficiency | 1 | One rigid path; no shortcuts or alternatives (no keyboard shortcuts) |
| 8 | Aesthetic and Minimalist Design | 2 | Some clutter; main content clear, periphery noisy (testimonials, grid bg, animations) |
| 9 | Error Recovery | 2 | Clear but unhelpful; names the problem but not always the fix |
| 10 | Help and Documentation | 2 | Basic help; FAQ or docs exist, not contextual |

| **Total** | | **23/40** | **Acceptable** |

The applicable maximum is 40 (all ten heuristics applied).

#### Design Specificity Verdict
**LLM assessment:** The interface is unmistakably authored for SPPU engineering students. The unit-topic structure, exam countdown, syllabus library, and question paper integration are SPPU-native and could not be easily transplanted to another context. However, category-intercrepare choices dilute the product character: generic dark theme, overused fonts (Inter, Space Grotesk), and generic component patterns (glass morphism, grid backgrounds) feel drawn from a UI toolkit rather than grown from the product's purpose. The app earns its SPPU-native verdict through structural coherence but loses ground through visual interchangeability.

**Deterministic scan:** The CLI detector found 14 antipatterns/slop issues across the codebase: `border-accent-on-rounded` in ConceptB.tsx, `overused-font` in index.css and multiple script files, `codex-grid-background` in index.css, `bounce-easing` in landing-v2.css, and `low-contrast` in public/404.html. Additional design issues not caught by the detector include cognitive overload on the landing page, inconsistent interaction patterns, and a fragmented color palette.

**Visual overlays:** Detector overlays are visible in the [Human] tab highlighting the detected issues. Console output reported the same antipattern counts above.

#### Overall Impression
PrepTracker is a strongly purpose-built app for SPPU engineering students with a coherent information architecture (subjects → units → topics → progress → tasks → revision). The core workflow — pick subjects, tick topics, see what's left — is elegant and effective. However the entry point (LandingPage) and several component patterns dilute the impact with visual noise, inconsistent detailing, and generic design choices that feel inherited from a UI toolkit rather than intentional for this product.

#### What's Working
1. **Subjects → Units → Topics hierarchy** is SPPU-native and executes perfectly; ticking a topic immediately updates progress cards and the countdown is a genuine "aha" moment.
2. **Progress persistence** via localStorage works reliably; the auto-save pattern means users never lose work, and the storage-full alert is a honest, non-panicking intervention.
3. **Exam countdown + daily tasks** integration is the product's superpower — the countdown drives task sizing, and the whole system derives from one user input (exam date).

#### Priority Issues
1. **[P1] What: Landing page cognitive overload** — The hero section alone contains a switching pill, four-reveal-animate sequence, problem/feature/how sections, a scroll-driven scene, a 6-item testimonial marquee, and a final CTA. Below the fold: library accordions, FAQ details, and more. At any decision point the user faces 10+ visible options with no hierarchy.
   - **Why it matters:** Users cannot determine the primary action; the "Start tracking" CTA is buried among competing visual weight. This increases drop-off before the user even reaches the app.
   - **Fix:** Prune the landing to one core message + one CTA. Move the feature showcase and testimonials to secondary positions. Apply progressive disclosure — show the view switcher after the user commits, not before.
   - **Suggested command:** `/impeccable clarify` — identify the single primary action and hierarchy for the landing.

2. **[P1] What: Low-contrast text fails WCAG AA** — The detector found 4.47:1 contrast on the 404 page (#e11d48 on #000000). Similar contrast issues exist throughout the app: slate-200 on #030303, slate-300 on #030303, and placeholder text colors across components likely fall below 4.5:1.
   - **Why it matters:** Excludes users with low vision or who browse in bright environments; violates the product's own accessibility commitment.
   - **Fix:** Systematically raise body text contrast to ≥4.5:1 against #030303. Target: use slate-100 or increase weight. For large text, target ≥3:1.
   - **Suggested command:** `/impeccable harden` — enforce contrast standards across the CSS.

3. **[P2] What: Inconsistent interaction patterns across components** — Hover styles vary (e.g., StatPill uses `hover:border-white/15` vs `hover:border-white/10`), some actions are hover-only (TaskRow desktop actions), some are click-only, active states use different color treatments (`text-white` vs `text-[#F63C49]`). The StatPill component conditionally renders `<a>` vs `<div>` based on `to` prop, creating inconsistent focus/keyboard behavior.
   - **Why it matters:** Users cannot predict how any given interactive element behaves; breaks learnability and consistency heuristic.
   - **Fix:** Establish a consistent hover/active/focus pattern library. Make StatPill always use `<button>` or always use `<a>` with consistent styling. Ensure desktop and mobile interaction patterns align.
   - **Suggested command:** `/impeccable layout` — harmonize component interaction patterns.

4. **[P2] What: Fragmented color palette** — The app uses #F63C49 (maroon accent), #D61A40 (red), blue-400, slate-500, gray tones, and background gradients that don't always harmonize. The landing page has f3/f2/f1 glow colors (#F02A41, #FF9200, #FFFFFF) separate from the brand maroon. CustomSelect components use both #F63C49 and #D61A40. The toast/confirm modal uses green-500 and red-500 palettes outside the brand system.
   - **Why it matters:** Dilutes brand identity; users cannot instantly recognize the product's visual language; feels stitched together from a component library.
   - **Fix:** Anchor all colors to the brand palette: maroon #F63C49 as primary accent, a single secondary color, and neutrals (slate-500, slate-800) for text/backgrounds. Remove redundant accent colors.
   - **Suggested command:** `/impeccable colorize` — consolidate to the brand palette.

5. **[P3] What: Bounce/elastic easing feels dated** — The detector found `cubic-bezier(.32, 1.3, .42, 1)` in landing-v2.css, and framer-motion uses default spring configs in places. Craft floor bans "bounce or elastic easing" as feeling "dated and tacky."
   - **Why it matters:** Undermines the product's modern, student-for-students brand voice; feels like generated UI rather than considered design.
   - **Fix:** Replace all bounce/elastic easings with exponential ease-out (e.g., `cubic-bezier(0.4, 0, 0.2, 1)` or `power4-out`).
   - **Suggested command:** `/impeccable polish` — refresh easing patterns.

6. **[P3] What: Decorative grid background signature** — The detector found `codex-grid-background` in index.css, a recurring generated-UIs signature. The grid-line gradient background at line 9 is decorative and does not serve the product purpose.
   - **Why it matters:** Reads as default generated UI rather than intentional design; the craft floor warns "Reserve grid overlays for actual canvas, map, blueprint, or measurement surfaces."
   - **Fix:** Remove or replace the decorative grid background with a plain surface or product-structure-based backdrop.
   - **Suggested command:** `/impeccable distill` — remove unnecessary decorative elements.

#### Persona Red Flags
We evaluate 3 personas most relevant to this interface type (landing page / marketing):

**Jordan (First-Timer):** Icon-only nav in sidebar (DesktopNav hidden on mobile, relying on logo mark alone). Technical jargon in error messages ("404 Not Found" page). No visible help before the user commits to onboarding. The landing page's 10+ options at once will cause Jordan to abandon at step 2, unsure what to do.

**Alex (Power User):** No keyboard shortcuts for primary actions. Form requires multiple clicks for primary actions (Settings > Change subjects resets profile, Backup/download requires multiple steps). High abandonment risk when power-user expectations (shortcuts, batch actions) are unmet.

**Sam (Accessibility-Dependent):** Missing focus rings on many interactive elements; color-conveyed meaning (red = error states without text alternative); the landing page's testimonials marquee and animated strip create motion that may be disruptive; insufficient color contrast in multiple places; icon-only interactions without text labels.

#### Minor Observations
- The `global search` in GlobalSearch correctly filters across subjects, units, topics, tasks, and resources — a powerful recognition-aid.
- The `details`/summary accordion in Resources.tsx correctly collapses on mobile and stays expanded on desktop — solid responsive pattern.
- The `skip-link` at the top of LandingPage is a thoughtful accessibility inclusion.
- The `stat card` MasteryCard and ProgressGraphCard follow the hero-metric template (big number, small label, supporting stats) well.
- The `first-open-tour` and `TourSettings` provide an optional onboarding path without forcing it.
- The `local storage active` indicator in the desktop nav gives users explicit awareness of data persistence.

#### Questions to Consider
1. "I found problems with visual hierarchy on the landing page, color consistency, and lack of keyboard shortcuts. Which area should we tackle first?" Offer: **Visual hierarchy** (landing prune), **Color system** (consolidate palette), **Keyboard accessibility** (add shortcuts).
2. "The interface feels clinical and corporate with its dark theme and generic component patterns. Is that the intended tone, or should it feel warmer/bolder/more playful?" Offer: **Keep current tone**, **Make warmer/playful**, **Make bolder/more maroon-focused**.
3. "I found 6 priority issues across hierarchy, contrast, consistency, color, easing, and decorative elements. Want to address everything, focus on the top 3, or critical issues only?" Offer: **All issues**, **Top 3 only**, **Critical issues only** (P1 + P2 only).
import React, { useEffect, useState } from 'react';
import type { TourArtId } from '../lib/tours';

// Tour step spot illustrations, in the same hand-drawn language as StepArt
// and the Revise doodles: one stroke weight, round caps, slate lines with a
// single red accent, drawn once (ease, staggered). Reduced motion shows the
// finished scene at once. Each scene explains its step's idea instead of
// decorating the card.
const circle = (x: number, y: number, r: number) =>
  `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
const spine = (x: number) =>
  `M${x + 4} 34h12a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-44a4 4 0 0 1 4-4Z`;
const R = (x: number, y: number, w: number, h: number, r = 4) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`;
const check = (x: number, y: number) => `M${x} ${y}l3 3 6-7`;
const arc = (cx: number, cy: number, r: number, pct: number) => {
  const a = pct * Math.PI * 2 - Math.PI / 2;
  return `M${cx} ${cy - r}A${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
};
const gridRow = (y: number) =>
  [0, 1, 2, 3, 4, 5, 6].map((i) => R(76 + i * 13, y, 9, 9, 2)).join(' ');
const ribbon = (x: number) => `M${x} 34h18v44l-9-7-9 7Z`;

const SCENES: Record<TourArtId, { d: string; accent?: boolean }[]> = {
  // Home step 1: Overall Progress averages unit states. Three unit spines
  // (Start = empty, Studying = part way, Done = checked) merge into one
  // gauge whose red arc is the averaged value.
  'progress-average': [
    { d: 'M20 92h90' },
    { d: spine(26) },
    { d: circle(36, 60, 4) },
    { d: spine(54) },
    { d: 'M59 60h10' },
    { d: spine(82) },
    { d: 'M87 60l4 4 8-9' },
    { d: 'M104 44C114 44 118 52 126 58' },
    { d: 'M104 60H126' },
    { d: 'M104 76C114 76 118 68 126 62' },
    { d: circle(128, 60, 2.5) },
    { d: 'M132 60H146' },
    { d: 'M141 54L148 60L141 66' },
    { d: circle(188, 60, 30) },
    { d: 'M188 33v5M215 60h-5M188 87v-5M161 60h5' },
    { d: arc(188, 60, 30, 0.6), accent: true },
  ],

  // Home welcome: the study space - a shelf of courses and the progress gauge.
  'welcome-home': [
    { d: 'M40 88h92' },
    { d: spine(50) },
    { d: spine(78) },
    { d: spine(106) },
    { d: circle(186, 60, 26) },
    { d: 'M186 37v5M209 60h-5M186 83v-5M163 60h5' },
    { d: arc(186, 60, 26, 0.6), accent: true },
  ],
  // Home step 2: five small study actions a day feed the streak flame.
  'goal-streak': [
    { d: R(44, 50, 15, 15, 3) },
    { d: R(66, 50, 15, 15, 3) },
    { d: R(88, 50, 15, 15, 3) },
    { d: R(110, 50, 15, 15, 3) },
    { d: R(132, 50, 15, 15, 3) },
    { d: 'M178 52c-3 4-5 6-5 9a5 5 0 0 0 10 0c0-3-2-5-5-9Z' },
    { d: 'M178 38c-9 11-13 16-13 23a13 13 0 0 0 26 0c0-7-4-12-13-23Z', accent: true },
  ],
  // Home step 3: the activity grid is history by date; select one day.
  'activity-grid': [
    { d: gridRow(34) },
    { d: gridRow(47) },
    { d: gridRow(60) },
    { d: gridRow(73) },
    { d: R(124.5, 43.5, 16, 16, 4) },
    { d: circle(132.5, 51.5, 2.5), accent: true },
  ],
  // Home step 4: open one course card from the shelf.
  'open-course': [
    { d: 'M44 92h150' },
    { d: R(64, 36, 46, 52, 5) },
    { d: 'M73 36v52' },
    { d: 'M84 50h17M84 60h17M84 70h11' },
    { d: 'M134 62h36' },
    { d: 'M163 55l8 7-8 7', accent: true },
  ],
  // Home step 5: the exam timeline - every subject carries its own date flag.
  'subject-dates': [
    { d: 'M32 72h176' },
    { d: R(52, 44, 20, 28, 4) },
    { d: R(98, 44, 20, 28, 4) },
    { d: R(144, 44, 20, 28, 4) },
    { d: 'M62 44V26M62 26h13l-4 5 4 5h-13Z' },
    { d: 'M108 44V26M108 26h13l-4 5 4 5h-13Z', accent: true },
    { d: 'M154 44V26M154 26h13l-4 5 4 5h-13Z' },
    { d: 'M86 72v5M132 72v5' },
  ],
  // Home step 6: the navigation dock, with Revise as the active stop.
  'nav-dock': [
    { d: R(52, 42, 136, 34, 16) },
    { d: 'M70 63l7-7 7 7v6h-14v-6Z' },
    { d: 'M104 53h13v12h-13ZM110.5 53v12' },
    { d: `${circle(144, 59, 8)}M141 59l2.5 2.5 4.5-5`, accent: true },
    { d: `${circle(178, 59, 6)}M178 50v3M178 65v3M169 59h3M184 59h3` },
  ],
  // Home step 7: search (magnifier) and announcements (bell with a red dot).
  'search-bell': [
    { d: circle(88, 54, 15) },
    { d: 'M99 65l13 13' },
    { d: 'M152 44a13 13 0 0 1 26 0c0 11 4 15 7 18h-40c3-3 7-7 7-18Z' },
    { d: 'M161 66a4.5 4.5 0 0 0 8 0' },
    { d: circle(180, 40, 3.5), accent: true },
  ],

  // Library welcome: a shelf of saved resource cards, one with a link.
  'welcome-library': [
    { d: 'M44 88h152' },
    { d: R(60, 44, 36, 42, 5) },
    { d: 'M68 58h20M68 66h13' },
    { d: R(102, 44, 36, 42, 5) },
    { d: `${circle(115, 63, 5)}${circle(126, 63, 5)}`, accent: true },
    { d: R(144, 44, 36, 42, 5) },
    { d: 'M152 58h20M152 66h13' },
  ],
  // Library step 1: search plus filters pour the shelf through a funnel.
  'filter-funnel': [
    { d: `${R(56, 28, 30, 11, 5.5)}${R(92, 28, 30, 11, 5.5)}${R(128, 28, 30, 11, 5.5)}` },
    { d: 'M78 46h84l-30 30v12l-24 8V76Z' },
    { d: 'M96 60h48' },
    { d: circle(120, 102, 2.5), accent: true },
  ],
  // Library step 2: subject chips narrow the shelf; one chip is selected.
  'subject-chips': [
    { d: R(36, 48, 38, 18, 9) },
    { d: R(82, 48, 30, 18, 9) },
    { d: R(120, 48, 44, 18, 9), accent: true },
    { d: R(172, 48, 34, 18, 9) },
    { d: 'M47 57h16M90 57h14M133 57h18M181 57h16' },
  ],
  // Library step 3: Add Resource - a form card, a link, and the red plus.
  'add-link': [
    { d: R(76, 34, 88, 52, 6) },
    { d: 'M88 48h64' },
    { d: 'M88 60h44' },
    { d: `${circle(107, 74, 5)}${circle(119, 74, 5)}` },
    { d: 'M146 68v12M140 74h12', accent: true },
  ],
  // Library step 4: resource cards open the viewer or the original site.
  'open-source': [
    { d: R(64, 36, 72, 50, 6) },
    { d: 'M64 48h72' },
    { d: 'M72 42h2M79 42h2' },
    { d: 'M92 60l17 10-17 10Z' },
    { d: 'M140 74L174 40' },
    { d: 'M160 40h14v14', accent: true },
  ],
  // Library step 5: selection mode - tick items, then the bin.
  'select-delete': [
    { d: R(48, 42, 40, 38, 5) },
    { d: R(96, 42, 40, 38, 5) },
    { d: R(122, 36, 13, 13, 3) },
    { d: check(125, 42.5), accent: true },
    { d: 'M160 50h22M165 50v28h12V50M169 45h8' },
    { d: 'M170 57v15M177 57v15' },
  ],

  // Tasks welcome: a checklist card, one job ticked.
  'welcome-tasks': [
    { d: R(70, 30, 100, 60, 8) },
    { d: `${R(82, 42, 10, 10, 3)}M100 47h56` },
    { d: `${R(82, 56, 10, 10, 3)}M100 61h56` },
    { d: `${R(82, 70, 10, 10, 3)}M100 75h56` },
    { d: 'M84 47l2.5 2.5 5-5.5', accent: true },
  ],
  // Tasks step 1: write the job; the red chip is its priority.
  'write-task': [
    { d: 'M44 42h96' },
    { d: 'M44 48h26' },
    { d: 'M44 58h72' },
    { d: 'M44 72h84' },
    { d: R(158, 36, 46, 18, 9), accent: true },
    { d: 'M169 45h24' },
  ],
  // Tasks step 2: optionally link a task to a subject and unit.
  'link-unit': [
    { d: R(48, 40, 24, 40, 4) },
    { d: 'M54 40v40' },
    { d: 'M72 60h16' },
    { d: `${circle(96, 60, 7)}${circle(112, 60, 7)}`, accent: true },
    { d: 'M119 60h49' },
    { d: R(168, 44, 44, 32, 5) },
    { d: 'M176 54h28M176 63h19' },
  ],
  // Tasks step 3: a due date is optional - set calendar, or open slot.
  'task-date': [
    { d: R(52, 38, 40, 36, 5) },
    { d: 'M52 50h40M62 32v8M82 32v8' },
    { d: circle(72, 62, 3), accent: true },
    { d: 'M132 40h8M156 40h8M132 72h8M156 72h8M130 44v8M130 62v8M166 44v8M166 62v8' },
    { d: 'M104 57h12M110 51v12' },
  ],
  // Tasks step 4: All / Active / Completed slice the same list.
  'task-filters': [
    { d: R(52, 34, 136, 20, 10) },
    { d: 'M97 34v20M143 34v20' },
    { d: 'M63 44h24M108 44h24M153 44h26' },
    { d: 'M64 48.5h22', accent: true },
    { d: `${R(52, 64, 9, 9, 2)}M67 68.5h52` },
    { d: `${R(52, 78, 9, 9, 2)}M67 82.5h38` },
  ],
  // Tasks step 5: carryover - move a job from yesterday to today on purpose.
  'carry-over': [
    { d: R(48, 40, 38, 34, 5) },
    { d: 'M48 50h38' },
    { d: circle(67, 62, 3) },
    { d: R(154, 40, 38, 34, 5) },
    { d: 'M154 50h38' },
    { d: 'M92 62C112 44 132 44 150 56' },
    { d: 'M144 48l8 5-6 7', accent: true },
  ],

  // Review welcome: the recall cycle - a card comes back around.
  'welcome-review': [
    { d: 'M120 32A28 28 0 0 1 144 82M144 82l-10 4 11 4' },
    { d: R(109, 51, 22, 18, 4) },
    { d: 'M114 60h10' },
    { d: 'M120 88A28 28 0 0 1 96 38M96 38l10-4-11-4', accent: true },
  ],
  // Review step 1: the Review / Plan toggle.
  'revise-tabs': [
    { d: R(60, 38, 120, 24, 12) },
    { d: 'M120 38v24' },
    { d: 'M76 50h28' },
    { d: 'M136 50h28' },
    { d: 'M74 55h32', accent: true },
  ],
  // Review step 2: the queue is capped - so many cards a day, no more.
  'recall-cap': [
    { d: R(74, 54, 60, 34, 5) },
    { d: R(80, 48, 60, 34, 5) },
    { d: R(86, 42, 60, 34, 5) },
    { d: 'M60 32h110M60 28v8M170 28v8', accent: true },
  ],
  // Review step 3: recall from memory before answering - the question mark.
  'recall-first': [
    { d: R(76, 32, 88, 54, 7) },
    { d: 'M88 44h40' },
    { d: `${circle(94, 62, 2)}${circle(99, 68, 2.5)}` },
    { d: 'M112 56a8 8 0 1 1 8 8v5M120 75v.5', accent: true },
  ],
  // Review step 4: the honest answer - Forgot or Got it.
  'forgot-gotit': [
    { d: R(52, 42, 56, 28, 9) },
    { d: 'M73 50l12 13M85 50l-12 13' },
    { d: R(132, 42, 56, 28, 9) },
    { d: 'M149 55l5 5 10-11', accent: true },
  ],
  // Review step 5: an empty queue is fine - up next shows what is coming.
  'empty-queue': [
    { d: 'M64 44h38v4a10 10 0 0 0 34 0v-4h40v30a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8Z' },
    { d: circle(168, 32, 9), accent: true },
    { d: 'M168 27v5l4 3' },
  ],

  // Plan welcome: today's target marked on the calendar.
  'welcome-plan': [
    { d: R(78, 32, 84, 54, 7) },
    { d: 'M78 46h84M96 26v9M144 26v9' },
    { d: 'M96 56h4M112 56h4M128 56h4M144 56h4M96 68h4M112 68h4M128 68h4M144 68h4' },
    { d: circle(112, 56, 6.5), accent: true },
  ],
  // Plan step 1: plans come from each subject's real exam date flags.
  'plan-dates': [
    { d: R(56, 34, 72, 50, 6) },
    { d: 'M56 48h72M72 28v8M112 28v8' },
    { d: 'M68 58h4M82 58h4M96 58h4M68 70h4M82 70h4' },
    { d: 'M150 32v22M150 32h13l-4 5 4 5h-13Z' },
    { d: 'M170 32v22M170 32h13l-4 5 4 5h-13Z', accent: true },
    { d: 'M190 32v22M190 32h13l-4 5 4 5h-13Z' },
    { d: 'M44 90h180' },
  ],
  // Plan step 2: Left and Done read against the day's total bar.
  'plan-total': [
    { d: 'M52 38h34M154 38h34' },
    { d: R(52, 48, 136, 14, 7) },
    { d: R(54.5, 50.5, 52, 9, 4.5), accent: true },
    { d: 'M106 44v5M106 65v5' },
    { d: 'M52 74h8M72 74h8M92 74h8M112 74h8M132 74h8M152 74h8M172 74h8' },
  ],
  // Plan step 3: tick only the topics you actually covered.
  'plan-tick': [
    { d: 'M52 36h44' },
    { d: `${R(52, 46, 10, 10, 3)}M70 51h58` },
    { d: `${R(52, 60, 10, 10, 3)}M70 65h58` },
    { d: `${R(52, 74, 10, 10, 3)}M70 79h40` },
    { d: 'M54 51l2.5 2.5 5-5.5', accent: true },
  ],
  // Plan step 4: every subject keeps its own goal bar.
  'own-goal': [
    { d: 'M48 34h26M140 34h26' },
    { d: R(48, 42, 72, 13, 6.5) },
    { d: R(50.5, 44.5, 67, 8, 4), accent: true },
    { d: R(140, 42, 72, 13, 6.5) },
    { d: R(142.5, 44.5, 34, 8, 4) },
    { d: 'M48 66h30M140 66h44' },
  ],
  // Plan step 5: a plan is calculated; it is not your task list.
  'plan-vs-tasks': [
    { d: R(50, 38, 48, 42, 5) },
    { d: 'M50 50h48M60 32v8M88 32v8' },
    { d: 'M62 58h4M74 58h4M86 58h4M62 68h4M74 68h4' },
    { d: R(142, 38, 48, 42, 5) },
    { d: 'M151 50h30M151 59h30M151 68h20' },
    { d: 'M112 84l16-44', accent: true },
  ],

  // Settings welcome: the card of you, plus the gear.
  'welcome-settings': [
    { d: R(56, 36, 60, 48, 7) },
    { d: 'M66 50h40M66 60h28' },
    { d: circle(160, 58, 14) },
    { d: 'M160 39v5M160 72v5M141 58h5M174 58h5M147 45l3.5 3.5M169.5 67.5l3.5 3.5M173 45l-3.5 3.5M150.5 67.5l-3.5 3.5' },
    { d: circle(160, 58, 5), accent: true },
  ],
  // Settings step 1: change the avatar - the pencil edits the profile.
  'avatar-edit': [
    { d: circle(110, 48, 11) },
    { d: 'M88 84c4-16 14-21 22-21s18 5 22 21' },
    { d: 'M142 64l14-14 7 7-14 14-9 2 2-9Z', accent: true },
  ],
  // Settings step 2: the first exam date winds the countdown ring.
  'countdown-date': [
    { d: circle(96, 58, 26) },
    { d: 'M96 32v5M122 58h-5M96 84v-5M70 58h5' },
    { d: arc(96, 58, 26, 0.35), accent: true },
    { d: R(150, 52, 34, 30, 4) },
    { d: 'M150 62h34M159 46v7M175 46v7' },
  ],
  // Settings step 3: every subject spine gets its own date card.
  'per-subject-dates': [
    { d: 'M44 90h150' },
    { d: spine(54) },
    { d: `${R(57, 19, 18, 13, 3)}M61 16v4M71 16v4` },
    { d: spine(90) },
    { d: `${R(93, 19, 18, 13, 3)}M97 16v4M107 16v4` },
    { d: spine(126) },
    { d: `${R(129, 19, 18, 13, 3)}M133 16v4M143 16v4` },
    { d: circle(102, 25.5, 2.5), accent: true },
  ],
  // Settings step 4: change subjects - the books swap, the shield keeps history.
  'change-subjects': [
    { d: 'M48 90h160' },
    { d: spine(62) },
    { d: spine(110) },
    { d: 'M86 46c12-9 24-9 36 0M116 39l7 6-9 2' },
    { d: 'M114 76c-12 9-24 9-36 0M84 83l-7-6 9-2', accent: true },
    { d: 'M186 40l12 4v9c0 9-7 13-12 15-5-2-12-6-12-15v-9Z' },
  ],
  // Settings step 5: save a backup - download your data out of the browser.
  'backup-save': [
    { d: R(58, 30, 124, 44, 6) },
    { d: 'M58 42h124' },
    { d: 'M66 36h2M73 36h2' },
    { d: 'M92 82h56l-8 12h-40Z' },
    { d: 'M120 52v26M112 70l8 9 8-9', accent: true },
  ],
  // Settings step 6: restore shows a preview before anything is replaced.
  'restore-preview': [
    { d: R(70, 32, 48, 56, 5) },
    { d: 'M106 32v12h12' },
    { d: 'M80 54h28M80 64h28M80 74h18' },
    { d: `${circle(142, 68, 13)}M151 77l11 11`, accent: true },
  ],
  // Settings step 7: erase is permanent - bin and warning triangle.
  'erase-danger': [
    { d: 'M62 50h44' },
    { d: 'M70 50v30a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V50M78 50v-6h12v6' },
    { d: 'M80 58v18M88 58v18' },
    { d: 'M150 44l22 38h-44Z', accent: true },
    { d: 'M150 58v10M150 74v2' },
  ],
  // Settings step 8: replay any walkthrough - the replay arrow and compass.
  'replay-tour': [
    { d: 'M120 34A24 24 0 1 1 97 51M97 51l10-2-5 9', accent: true },
    { d: circle(176, 46, 12) },
    { d: 'M176 40l3 6-3 6-3-6Z' },
  ],
  // Settings step 9: install puts the app on your phone - it is not a backup.
  'install-app': [
    { d: R(98, 28, 44, 64, 11) },
    { d: 'M98 42h44' },
    { d: 'M114 84h12' },
    { d: 'M120 50v18M113 62l7 7 7-7', accent: true },
  ],

  // Course welcome: open the book; the bar shows real topic progress.
  'welcome-course': [
    { d: 'M120 46c-10-6-24-6-36-2v38c12-4 26-4 36 2 10-6 24-6 36-2v-38c-12-4-26-4-36-2Z' },
    { d: 'M120 46v38' },
    { d: 'M92 54h18M92 62h18M92 70h12' },
    { d: 'M130 54h18M130 62h18' },
    { d: R(96, 26, 48, 7, 3.5) },
    { d: R(96, 26, 20, 7, 3.5), accent: true },
  ],
  // Course step 1: the summary bar over the unit spines.
  'course-coverage': [
    { d: R(52, 34, 136, 14, 7) },
    { d: 'M86 34v14M120 34v14M154 34v14' },
    { d: R(54.5, 36.5, 29, 9, 4.5), accent: true },
    { d: R(64, 60, 18, 26, 4) },
    { d: R(90, 60, 18, 26, 4) },
    { d: R(116, 60, 18, 26, 4) },
    { d: 'M121 73l3 3 6-6' },
    { d: 'M56 90h84' },
  ],
  // Course step 2: a unit opens like a book.
  'open-unit': [
    { d: R(52, 34, 54, 48, 4) },
    { d: R(134, 34, 54, 48, 4) },
    { d: 'M120 34v48' },
    { d: 'M62 46h34M62 56h34' },
    { d: 'M144 46h34M144 56h24' },
    { d: 'M112 88l8 8 8-8', accent: true },
  ],
  // Course step 3: Start, Studying, Done - the unit state ladder.
  'unit-states': [
    { d: R(48, 66, 44, 16, 8) },
    { d: 'M58 74h24' },
    { d: R(100, 52, 48, 16, 8) },
    { d: 'M110 62h28' },
    { d: R(156, 38, 40, 16, 8), accent: true },
    { d: 'M165 48h22' },
  ],
  // Course step 4: tick the topics as you study them.
  'tick-topics': [
    { d: `${R(52, 38, 10, 10, 3)}M70 43h52` },
    { d: `${R(52, 54, 10, 10, 3)}M70 59h52` },
    { d: `${R(52, 70, 10, 10, 3)}M70 75h38` },
    { d: 'M54 59l3 3 5.5-6', accent: true },
    { d: 'M150 62l18-18 6 6-18 18-8 2 2-8Z' },
  ],
  // Course step 5: paper-year ribbons mark solved practice.
  'pyq-ribbons': [
    { d: ribbon(66) },
    { d: ribbon(111), accent: true },
    { d: ribbon(156) },
    { d: 'M71 44h8M116 44h8M161 44h8' },
  ],
  // Course step 6: the course's own resource shelf beside the book.
  'course-resources': [
    { d: 'M44 88h160' },
    { d: spine(56) },
    { d: R(120, 48, 72, 36, 6) },
    { d: 'M130 60h40' },
    { d: `${circle(140, 73, 4.5)}${circle(150, 73, 4.5)}`, accent: true },
    { d: 'M160 73h22' },
  ],
};

const EASE = 'cubic-bezier(0.4,0,0.2,1)';

const TourArt: React.FC<{ kind: TourArtId; className?: string }> = ({ kind, className = '' }) => {
  const shapes = SCENES[kind];
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState(still);
  useEffect(() => {
    if (still) return;
    setOn(false);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(id);
  }, [kind, still]);
  if (!shapes) return null;
  return (
    <svg viewBox="0 12 240 96" aria-hidden="true" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {shapes.map((s, i) => (
        <path
          key={`${kind}-${i}`}
          d={s.d}
          pathLength={1}
          stroke={s.accent ? '#F63C49' : '#475569'}
          style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 260ms ${EASE} ${i * 55}ms` }}
        />
      ))}
    </svg>
  );
};

export default TourArt;

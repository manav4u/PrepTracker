// Compute module for the /research pages: every headline number on the
// statistics page, in llms.txt and in the FAQ comes from these functions,
// so a number lives in exactly one place. Pure and data-in/data-out so the
// tests can pin behaviour (shares add up, thin data prints no finding).
// Data shapes are declared locally and passed in, so this module stays pure
// and testable outside the vite bundle. researchCatalog.ts wires real data.
export interface CourseLike { units: { hours: number }[]; credits: number }
export interface BranchLike {
  slug: string; branch: string; year?: 'TE'; draft?: boolean; courses: CourseLike[];
}
export interface FeSubjectLike { id: string; credits?: number; units: { topics: unknown[] }[] }

// Below this many rows a finding says nothing rather than implying a pattern.
export const MIN_SAMPLE = 20;

export interface BranchStats {
  slug: string;
  label: string; // 'SE Computer Engineering'
  year: 'SE' | 'TE';
  draft: boolean;
  courses: number;
  units: number;
  credits: number;
  hours: number;
}

export interface FeStats {
  subjects: number;
  units: number;
  topics: number;
  credits: number;
}

export interface CatalogTotals {
  branches: number; // final (non-draft) branches
  drafts: number;
  seBranches: number;
  teBranches: number;
  courses: number;
  units: number;
  credits: number;
  hours: number;
  fe: FeStats;
}

export function branchStats(branches: BranchLike[]): BranchStats[] {
  return branches.map((b) => ({
    slug: b.slug,
    label: (b.year === 'TE' ? 'TE ' : 'SE ') + b.branch,
    year: b.year === 'TE' ? 'TE' : 'SE',
    draft: !!b.draft,
    courses: b.courses.length,
    units: b.courses.reduce((a, c) => a + c.units.length, 0),
    credits: b.courses.reduce((a, c) => a + c.credits, 0),
    hours: b.courses.reduce((a, c) => a + c.units.reduce((x, u) => x + u.hours, 0), 0),
  }));
}

export function feStats(subjects: FeSubjectLike[], pageIds: string[]): FeStats {
  // Only FE subjects with a public page count; the app data may hold more ids.
  const ids = new Set(pageIds);
  const listed = subjects.filter((s) => ids.has(s.id));
  return {
    subjects: listed.length,
    units: listed.reduce((a, s) => a + s.units.length, 0),
    topics: listed.reduce((a, s) => a + s.units.reduce((x, u) => x + u.topics.length, 0), 0),
    credits: listed.reduce((a, s) => a + (s.credits || 0), 0),
  };
}

export function catalogTotals(branches: BranchLike[], feSubjects: FeSubjectLike[] = [], fePageIds: string[] = []): CatalogTotals {
  const stats = branchStats(branches);
  const final = stats.filter((b) => !b.draft);
  return {
    branches: final.length,
    drafts: stats.length - final.length,
    seBranches: final.filter((b) => b.year === 'SE').length,
    teBranches: final.filter((b) => b.year === 'TE').length,
    courses: final.reduce((a, b) => a + b.courses, 0),
    units: final.reduce((a, b) => a + b.units, 0),
    credits: final.reduce((a, b) => a + b.credits, 0),
    hours: final.reduce((a, b) => a + b.hours, 0),
    fe: feStats(feSubjects, fePageIds),
  };
}

// Unit-count distribution across the courses of the final branches.
export function unitDistribution(branches: BranchLike[]): Map<number, number> {
  const dist = new Map<number, number>();
  for (const b of branches) {
    if (b.draft) continue;
    for (const c of b.courses) dist.set(c.units.length, (dist.get(c.units.length) || 0) + 1);
  }
  return dist;
}

export interface Finding {
  id: string; // stable anchor, e.g. 'f-courses'
  text: string; // one or two self-contained sentences, quotable alone
}

const pct = (part: number, whole: number) => Math.round((part / whole) * 100);

// Findings are generated from the data: if the data changes the wording
// follows, a comparison that flips flips the sentence, and a finding built on
// fewer than MIN_SAMPLE rows is dropped instead of printed thin.
export function buildFindings(branches: BranchLike[], feSubjects: FeSubjectLike[] = [], fePageIds: string[] = []): Finding[] {
  const t = catalogTotals(branches, feSubjects, fePageIds);
  const stats = branchStats(branches).filter((b) => !b.draft);
  const out: Finding[] = [];
  if (t.branches >= 2) {
    out.push({
      id: 'f-coverage',
      text: `PrepTracker catalogs the official SPPU 2024-pattern syllabus for ${t.branches} branches: ${t.seBranches} Second Year and ${t.teBranches} Third Year. One more branch (SE Automobile) is published by SPPU only as a draft and is marked as such.`,
    });
  }
  if (t.courses >= MIN_SAMPLE) {
    out.push({
      id: 'f-courses',
      text: `Across those ${t.branches} branches, the library holds ${t.courses} theory courses, ${t.units} units and ${t.credits} credits of theory, copied from the official SPPU syllabus PDFs.`,
    });
  }
  if (t.courses >= MIN_SAMPLE) {
    const dist = unitDistribution(branches);
    const sorted = [...dist.entries()].sort((a, b) => b[1] - a[1]);
    const [topUnits, topCount] = sorted[0];
    const second = sorted[1];
    if (second && topCount - second[1] <= 2) {
      out.push({
        id: 'f-units',
        text: `Courses are about evenly split between ${topUnits} and ${second[0]} units: ${topCount} of ${t.courses} courses have ${topUnits} units and ${second[1]} have ${second[0]}.`,
      });
    } else {
      out.push({
        id: 'f-units',
        text: `The most common course size is ${topUnits} units: ${topCount} of ${t.courses} theory courses (${pct(topCount, t.courses)}%, rounded) have exactly ${topUnits} units.`,
      });
    }
  }
  if (stats.length >= 2) {
    const byCourses = [...stats].sort((a, b) => b.courses - a.courses || b.units - a.units);
    const big = byCourses[0];
    const small = byCourses[byCourses.length - 1];
    if (big.courses - small.courses <= 1) {
      out.push({
        id: 'f-branch-size',
        text: `Branch sizes are about the same across the catalog: every final branch lists between ${small.courses} and ${big.courses} theory courses.`,
      });
    } else {
      out.push({
        id: 'f-branch-size',
        text: `The largest cataloged branch is ${big.label} with ${big.courses} theory courses and ${big.units} units; the smallest is ${small.label} with ${small.courses} courses and ${small.units} units.`,
      });
    }
  }
  if (t.fe.subjects >= 5) {
    out.push({
      id: 'f-fe',
      text: `The First Year section covers ${t.fe.subjects} subjects with ${t.fe.units} units and ${t.fe.topics} named topics, ${t.fe.credits} credits in total, from the SPPU FE 2024-pattern syllabus.`,
    });
  }
  if (t.courses >= MIN_SAMPLE) {
    out.push({
      id: 'f-hours',
      text: `Cataloged theory hours total ${t.hours} across the final branches. Each branch page links the official SPPU PDF its numbers come from.`,
    });
  }
  return out;
}

// FAQ answers for the statistics page, pulled from the same totals.
export function researchFaq(branches: BranchLike[], feSubjects: FeSubjectLike[] = [], fePageIds: string[] = []): [string, string][] {
  const t = catalogTotals(branches, feSubjects, fePageIds);
  return [
    [
      'How many SPPU branches does PrepTracker cover?',
      `${t.branches} branches with final SPPU 2024-pattern syllabi: ${t.seBranches} Second Year and ${t.teBranches} Third Year. SE Automobile is published by SPPU as a draft and is labeled draft on its page.`,
    ],
    [
      'How many courses and units are cataloged?',
      `${t.courses} theory courses and ${t.units} units across those branches, plus ${t.fe.subjects} First Year subjects with ${t.fe.units} units. Practical, lab and project courses are not counted.`,
    ],
    [
      'Where do these numbers come from?',
      'Every count is computed at build time from the same syllabus data that renders the subject pages, and that data is copied from the official SPPU syllabus PDF linked at the bottom of each branch page. Nothing is estimated.',
    ],
    [
      'How often do these numbers change?',
      'When SPPU publishes a new or revised syllabus and the catalog is updated. The date on this page is the data date, not a page rebuild date.',
    ],
  ];
}

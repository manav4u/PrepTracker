// Spaced review: a topic the student has ticked comes back to be recalled, then again later.
// Everything here is derived from progress, study events and one small saved record per topic,
// so ticking and unticking topics elsewhere in the app needs no extra bookkeeping.
// Day keys are local calendar days (YYYY-MM-DD), the same as lib/activity.ts.

export interface ReviewEntry {
  stage: number; // reviews recalled so far
  due: string; // day the next review is due; '' once graduated
  last: string; // day of the last review
  shaky?: boolean; // the last review was marked shaky
}
export type Reviews = Record<string, ReviewEntry>;

/** Days to wait after the topic was studied (step 0), then after each recalled review. */
export const STEPS = [1, 3, 7, 21];
/** Most reviews shown on one day. The rest wait quietly for tomorrow. */
export const DAILY_CAP = 8;

export const reviewKey = (unitId: string, topic: string): string => `${unitId}::${topic}`;

const pad = (n: number) => String(n).padStart(2, '0');
export const dayOf = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const addDays = (key: string, n: number): string => {
  const [y, m, d] = key.split('-').map(Number);
  return dayOf(new Date(y, m - 1, d + n));
};
const gap = (a: string, b: string): number => {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime()) / 86400000);
};

interface SubjectLike { id: string; name: string; units: { id: string; unit_number: number; topics: string[] }[] }
interface ProgressLike { unitId: string; topicsDone?: string[] }
interface EventLike { day: string; unitId?: string; topic?: string; kind: string }

export interface ReviewItem {
  key: string;
  subjectId: string;
  subjectName: string;
  unitId: string;
  unitNumber: number;
  topic: string;
  stage: number;
  due: string;
  overdue: number; // days past due
  shaky: boolean;
}

export interface Queue {
  today: ReviewItem[]; // what to review now, capped for the day
  waiting: number; // due but held back by the daily cap
  doneToday: number;
  trackedTopics: number; // topics currently in the review cycle
  tomorrow: number; // topics that become due tomorrow
  nextDue: string | null; // first day something is due after today
}

/** Day a topic was last studied: its own tick, else its unit's status change, else unknown. */
const studiedOn = (events: EventLike[], unitId: string, topic: string): string | undefined => {
  let own: string | undefined;
  let unit: string | undefined;
  for (const e of events) {
    if (e.unitId !== unitId) continue;
    if (e.kind === 'topic' && e.topic === topic && (!own || e.day > own)) own = e.day;
    if (e.kind === 'unit' && (!unit || e.day > unit)) unit = e.day;
  }
  return own || unit;
};

/** Entry for a topic that has never been reviewed: due one step after it was studied. */
const baseline = (day: string): ReviewEntry => ({ stage: 0, due: addDays(day, STEPS[0]), last: day });

export const buildQueue = (
  subjects: SubjectLike[],
  selected: string[],
  progress: ProgressLike[],
  events: EventLike[],
  reviews: Reviews,
  now: Date = new Date()
): Queue => {
  const today = dayOf(now);
  const tomorrow = addDays(today, 1);
  const done = new Map(progress.map((p) => [p.unitId, new Set(p.topicsDone || [])]));
  const due: ReviewItem[] = [];
  let tracked = 0;
  let tomorrowCount = 0;
  let nextDue: string | null = null;
  let doneToday = 0;

  for (const s of subjects) {
    if (!selected.includes(s.id)) continue;
    for (const u of s.units) {
      const ticked = done.get(u.id);
      if (!ticked) continue;
      for (const topic of u.topics) {
        if (!ticked.has(topic)) continue;
        const key = reviewKey(u.id, topic);
        const saved = reviews[key];
        if (saved?.last === today) doneToday++;
        const entry = saved || baseline(studiedOn(events, u.id, topic) || today);
        if (entry.stage >= STEPS.length || !entry.due) continue; // graduated
        tracked++;
        if (entry.due <= today) {
          due.push({
            key, subjectId: s.id, subjectName: s.name, unitId: u.id, unitNumber: u.unit_number, topic,
            stage: entry.stage, due: entry.due, overdue: gap(entry.due, today), shaky: !!entry.shaky,
          });
        } else {
          if (entry.due === tomorrow) tomorrowCount++;
          if (!nextDue || entry.due < nextDue) nextDue = entry.due;
        }
      }
    }
  }

  // Longest-waiting first; shaky ones ahead of equally late topics.
  due.sort((a, b) => b.overdue - a.overdue || Number(b.shaky) - Number(a.shaky) || a.key.localeCompare(b.key));
  const room = Math.max(0, DAILY_CAP - doneToday);
  return {
    today: due.slice(0, room),
    waiting: Math.max(0, due.length - room),
    doneToday,
    trackedTopics: tracked,
    tomorrow: tomorrowCount,
    nextDue,
  };
};

/** Result of one review. Recalled moves up a step; shaky starts the steps again from tomorrow. */
export const answer = (prev: ReviewEntry | undefined, recalled: boolean, now: Date = new Date()): ReviewEntry => {
  const today = dayOf(now);
  const stage = prev?.stage ?? 0;
  if (!recalled) return { stage: 0, due: addDays(today, STEPS[0]), last: today, shaky: true };
  const next = stage + 1;
  return { stage: next, due: next >= STEPS.length ? '' : addDays(today, STEPS[next]), last: today };
};

/** Saved reviews that are well formed. Anything else in storage is dropped, never trusted. */
const DAY = /^\d{4}-\d{2}-\d{2}$/;
export const isReviewEntry = (v: unknown): v is ReviewEntry => {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return false;
  const e = v as Record<string, unknown>;
  return (
    Number.isInteger(e.stage) && (e.stage as number) >= 0 && (e.stage as number) <= STEPS.length &&
    typeof e.due === 'string' && (e.due === '' || DAY.test(e.due)) &&
    typeof e.last === 'string' && DAY.test(e.last) &&
    (e.shaky === undefined || typeof e.shaky === 'boolean')
  );
};
export const isReviews = (x: unknown): x is Reviews =>
  x !== null && typeof x === 'object' && !Array.isArray(x) &&
  Object.keys(x as object).length <= 10000 &&
  Object.entries(x as Record<string, unknown>).every(([k, v]) => k.length <= 400 && isReviewEntry(v));
export const cleanReviews = (x: unknown): Reviews => (isReviews(x) ? x : {});

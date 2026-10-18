// Study activity and streak, kept on the profile so it travels with backups.
// Day keys use the student's local calendar day (YYYY-MM-DD).

export interface StudyEventInput {
  subjectId: string;
  unitId?: string;
  topic?: string;
  kind: 'topic' | 'unit' | 'pyq';
}

export interface StudyEvent extends StudyEventInput {
  day: string;
}

export interface ActivityProfile {
  streak: number;
  lastStudyDate: string;
  activity?: Record<string, number>;
  events?: StudyEvent[];
}

const KEEP_DAYS = 91; // about thirteen weeks - one full study season
/** Study actions that make a full study day; drives the daily-goal readout. */
export const DAILY_GOAL = 5;

export const dayKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const daysBetween = (a: Date, b: Date): number =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);

/** Streak to show right now. A streak survives today and yesterday, then it is over. */
export const currentStreak = (p: ActivityProfile, now: Date = new Date()): number => {
  if (!p.lastStudyDate || !(p.streak > 0)) return 0;
  const last = new Date(p.lastStudyDate);
  if (isNaN(last.getTime())) return 0;
  return daysBetween(last, now) <= 1 ? p.streak : 0;
};

/** Returns the profile after one real study action (ticking a topic or changing a unit).
 *  When the caller knows where the action happened, it passes an event so the day can
 *  later answer "what did I study", not only "how much". */
export const recordStudy = <T extends ActivityProfile>(p: T, now: Date = new Date(), event?: StudyEventInput): T => {
  const shown = currentStreak(p, now);
  const last = p.lastStudyDate ? new Date(p.lastStudyDate) : null;
  const studiedToday = shown > 0 && last && daysBetween(last, now) === 0;
  const streak = studiedToday ? shown : shown + 1;

  const activity: Record<string, number> = { ...(p.activity || {}) };
  const key = dayKey(now);
  activity[key] = (activity[key] || 0) + 1;
  const cutoff = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - KEEP_DAYS));
  for (const k of Object.keys(activity)) if (k < cutoff) delete activity[k];

  let events = p.events ? [...p.events] : undefined;
  if (event) {
    events = [...(events || []), { ...event, day: key }].filter(e => e.day >= cutoff);
  }

  return { ...p, streak, lastStudyDate: now.toISOString(), activity, ...(events ? { events } : {}) };
};

/** What was studied on one local day, oldest first. */
export const eventsForDay = (p: ActivityProfile, key: string): StudyEvent[] =>
  (p.events || []).filter(e => e.day === key);

/** Study actions per day for the last `n` days, oldest first, with one-letter weekday labels. */
export const lastDays = (p: ActivityProfile, n = 7, now: Date = new Date()) => {
  const counts: number[] = [];
  const labels: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    counts.push(p.activity?.[dayKey(d)] || 0);
    labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2));
  }
  return { counts, labels };
};

/** Study actions so far today, for the daily-goal readout. */
export const todayCount = (p: ActivityProfile, now: Date = new Date()): number =>
  p.activity?.[dayKey(now)] || 0;

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

/** Maps a day's study-action count onto the five heat levels of the grid. */
export const levelFor = (count: number): HeatLevel =>
  count <= 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 7 ? 3 : 4;

export interface HeatCell {
  day: string;
  count: number;
  future: boolean;
  level: HeatLevel;
}

export interface HeatWeek {
  cells: HeatCell[]; // Monday first, seven cells
  monthLabel?: string; // set when the week's Monday opens a new month
}

/** Monday-first weeks ending this week, oldest first. Covers the kept activity window. */
export const heatmapWeeks = (p: ActivityProfile, weeksBack = 12, now: Date = new Date()): HeatWeek[] => {
  const today = startOfDay(now);
  const dow = (today.getDay() + 6) % 7; // 0 = Monday
  const thisMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dow);
  const weeks: HeatWeek[] = [];
  let prevMonth = -1;
  for (let w = weeksBack; w >= 0; w--) {
    const monday = new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() - w * 7);
    const cells: HeatCell[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const key = dayKey(d);
      const future = startOfDay(d).getTime() > today.getTime();
      const count = p.activity?.[key] || 0;
      cells.push({ day: key, count, future, level: future ? 0 : levelFor(count) });
    }
    const monthLabel = monday.getMonth() !== prevMonth
      ? monday.toLocaleDateString('en-US', { month: 'short' })
      : undefined;
    prevMonth = monday.getMonth();
    weeks.push({ cells, monthLabel });
  }
  return weeks;
};

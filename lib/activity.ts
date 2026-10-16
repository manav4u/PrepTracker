// Study activity and streak, kept on the profile so it travels with backups.
// Day keys use the student's local calendar day (YYYY-MM-DD).

export interface ActivityProfile {
  streak: number;
  lastStudyDate: string;
  activity?: Record<string, number>;
}

const KEEP_DAYS = 60;

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

/** Returns the profile after one real study action (ticking a topic or changing a unit). */
export const recordStudy = <T extends ActivityProfile>(p: T, now: Date = new Date()): T => {
  const shown = currentStreak(p, now);
  const last = p.lastStudyDate ? new Date(p.lastStudyDate) : null;
  const studiedToday = shown > 0 && last && daysBetween(last, now) === 0;
  const streak = studiedToday ? shown : shown + 1;

  const activity: Record<string, number> = { ...(p.activity || {}) };
  const key = dayKey(now);
  activity[key] = (activity[key] || 0) + 1;
  const cutoff = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - KEEP_DAYS));
  for (const k of Object.keys(activity)) if (k < cutoff) delete activity[k];

  return { ...p, streak, lastStudyDate: now.toISOString(), activity };
};

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

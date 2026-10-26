// Daily plan: how many topics to tick today so every subject is covered before its own exam.
// Derived on open from progress, exam dates and today's study events. Nothing extra is stored.
// Counts are an estimate: topics differ in size.

import { addDays, dayOf } from './revision.ts';

interface SubjectLike { id: string; name: string; units: { id: string; unit_number: number; topics: string[] }[] }
interface ProgressLike { unitId: string; topicsDone?: string[] }
interface EventLike { day: string; subjectId?: string; unitId?: string; topic?: string; kind: string }

/** Days kept back for revision once an exam is this far away or more. */
export const RESERVE_DAYS = 2;
export const RESERVE_FROM = 6;

export interface PlanTopic {
  key: string;
  unitId: string;
  unitNumber: number;
  topic: string;
  done: boolean; // ticked for the first time today
}

export interface PlanSubject {
  subjectId: string;
  name: string;
  examDate: string; // YYYY-MM-DD
  daysToExam: number;
  studyDays: number;
  left: number; // topics not yet ticked
  target: number; // today's total for this subject, fixed for the day
  doneToday: number;
  remaining: number; // target minus done today, never below 0
  topics: PlanTopic[]; // today's done topics first, then the next ones to study
}

export interface Plan {
  subjects: PlanSubject[]; // subjects with an upcoming exam date, soonest first
  examsToday: { subjectId: string; name: string }[];
  pastExams: { subjectId: string; name: string }[];
  undated: { subjectId: string; name: string }[]; // selected subjects with no usable date
  target: number; // M in "N left of M"
  remaining: number; // N
  doneToday: number;
  nothingLeft: boolean; // every dated subject is fully ticked
  perDay: number; // topics a day needed from tomorrow on, for the pace line
}

const parse = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const daysBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);

export const studyDaysFor = (daysToExam: number): number =>
  Math.max(1, daysToExam >= RESERVE_FROM ? daysToExam - RESERVE_DAYS : daysToExam);

export const buildPlan = (
  subjects: SubjectLike[],
  selected: string[],
  examDates: Record<string, string> | undefined,
  progress: ProgressLike[],
  events: EventLike[],
  now: Date = new Date()
): Plan => {
  const today = dayOf(now);
  const done = new Map(progress.map((p) => [p.unitId, new Set(p.topicsDone || [])]));
  const firstToday = new Set<string>();
  for (const e of events) if (e.day === today && e.kind === 'topic' && e.unitId && e.topic) firstToday.add(`${e.unitId}::${e.topic}`);

  const out: PlanSubject[] = [];
  const undated: Plan['undated'] = [];
  const examsToday: Plan['examsToday'] = [];
  const pastExams: Plan['pastExams'] = [];
  for (const s of subjects) {
    if (!selected.includes(s.id)) continue;
    const date = examDates?.[s.id];
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(parse(date).getTime())) { undated.push({ subjectId: s.id, name: s.name }); continue; }
    const daysToExam = daysBetween(today, date);
    if (daysToExam < 1) {
      (daysToExam === 0 ? examsToday : pastExams).push({ subjectId: s.id, name: s.name });
      continue; // exam today or past: no new study target
    }
    const todo: PlanTopic[] = [];
    const doneList: PlanTopic[] = [];
    let left = 0;
    for (const u of s.units) {
      const ticked = done.get(u.id);
      for (const t of u.topics) {
        const key = `${u.id}::${t}`;
        const isTicked = !!ticked?.has(t);
        if (isTicked && firstToday.has(key)) doneList.push({ key, unitId: u.id, unitNumber: u.unit_number, topic: t, done: true });
        else if (!isTicked) { left++; todo.push({ key, unitId: u.id, unitNumber: u.unit_number, topic: t, done: false }); }
      }
    }
    const doneToday = doneList.length;
    const studyDays = studyDaysFor(daysToExam);
    const target = Math.ceil((left + doneToday) / studyDays);
    const remaining = Math.max(0, target - doneToday);
    out.push({
      subjectId: s.id, name: s.name, examDate: date, daysToExam, studyDays, left, target, doneToday, remaining,
      topics: [...doneList, ...todo.slice(0, remaining)],
    });
  }
  out.sort((a, b) => a.examDate.localeCompare(b.examDate) || a.name.localeCompare(b.name));
  const target = out.reduce((n, s) => n + s.target, 0);
  const doneToday = out.reduce((n, s) => n + s.doneToday, 0);
  const remaining = out.reduce((n, s) => n + s.remaining, 0);
  // Pace from tomorrow: what is still unticked after today's remaining, over the days after today.
  const perDay = out.reduce((n, s) => {
    const rest = Math.max(0, s.left - s.remaining);
    const days = Math.max(1, s.studyDays - 1);
    return n + Math.ceil(rest / days);
  }, 0);
  return { subjects: out, undated, examsToday, pastExams, target, remaining, doneToday, nothingLeft: out.length > 0 && out.every((s) => s.left === 0), perDay };
};

/** Next local midnight, for the timer that refreshes the plan while the app stays open. */
export const msToMidnight = (now: Date = new Date()): number =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

export { addDays };

/** Tick or untick one topic. Same bookkeeping as the subject page. */
export const toggleTopicProgress = <P extends { unitId: string; status: string; pyqsCompleted: string[]; topicsDone?: string[] }>(
  progress: P[], unitId: string, topic: string, allTopics: string[], statuses: { notStarted: string; inProgress: string; mastered: string }
): { next: P[]; nowTicked: boolean } => {
  const idx = progress.findIndex((p) => p.unitId === unitId);
  const cur = idx > -1 ? progress[idx] : ({ unitId, status: statuses.notStarted, pyqsCompleted: [] as string[], topicsDone: [] as string[] } as unknown as P);
  const had = cur.topicsDone || [];
  const wasTicked = had.includes(topic);
  const topicsDone = wasTicked ? had.filter((t) => t !== topic) : [...had, topic];
  let status = cur.status;
  if (topicsDone.length === allTopics.length) status = statuses.mastered;
  else if (topicsDone.length > 0) status = statuses.inProgress;
  else if (status === statuses.mastered) status = statuses.inProgress;
  const row = { ...cur, status, topicsDone };
  return { next: idx > -1 ? progress.map((p, i) => (i === idx ? row : p)) : [...progress, row], nowTicked: !wasTicked };
};

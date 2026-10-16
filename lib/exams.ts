import type { Profile, Subject } from '../types';

export interface SubjectExam {
  subjectId: string;
  name: string;
  code: string;
  date: Date;
}

/**
 * The student's exam timeline: one entry per selected subject that has a date
 * the student set themselves in Settings, sorted by date. Built-in schedules
 * go stale every cycle, so PrepTracker never invents exam dates - the only
 * dates shown are the ones the student entered.
 */
export const subjectExamList = (
  profile: Pick<Profile, 'selectedSubjects' | 'examDates'>,
  subjects: Subject[]
): SubjectExam[] => {
  const examDates = profile.examDates || {};
  const selected = profile.selectedSubjects || [];
  return subjects
    .filter(s => selected.includes(s.id) && examDates[s.id])
    .map(s => ({
      subjectId: s.id,
      name: s.name,
      code: s.code,
      date: new Date(`${examDates[s.id]}T00:00:00`)
    }))
    .filter(e => !isNaN(e.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

/** Index of the first exam on or after `now` (start of day), or -1 when every exam is past. */
export const nextExamIndex = (exams: SubjectExam[], now: Date = new Date()): number => {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return exams.findIndex(e => e.date.getTime() >= startOfToday);
};

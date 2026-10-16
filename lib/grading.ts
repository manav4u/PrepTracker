// Grade bands and SGPA, from the official SPPU "Credit Framework, Guidelines, Rules and
// Regulations, 4 Years UG Engineering Programme (AY 2024-25)", Table 2 (Grade and Grade Point).
// A grade is given per head: theory (CCE + end-semester, out of 100) and term work (out of 25).
// SGPA = sum(grade point x credits) / sum(credits).

export interface Grade {
  letter: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  point: number;
}

export const GRADE_BANDS: { min: number; letter: Grade['letter']; point: number; label: string }[] = [
  { min: 90, letter: 'O', point: 10, label: '90 to 100' },
  { min: 75, letter: 'A+', point: 9, label: '75 to 89' },
  { min: 60, letter: 'A', point: 8, label: '60 to 74' },
  { min: 55, letter: 'B+', point: 7, label: '55 to 59' },
  { min: 50, letter: 'B', point: 6, label: '50 to 54' },
  { min: 45, letter: 'C', point: 5, label: '45 to 49' },
  { min: 40, letter: 'D', point: 4, label: '40 to 44' },
];

export const MAX_CCE = 30;
export const MAX_END_SEM = 70;
export const MAX_TERM_WORK = 25;

export const gradeForPercent = (percent: number): Grade => {
  for (const b of GRADE_BANDS) if (percent >= b.min) return { letter: b.letter, point: b.point };
  return { letter: 'F', point: 0 };
};

export interface CourseMarks {
  inSem?: number; // CCE, out of 30 (key kept for compatibility with existing backups)
  endSem?: number; // end-semester, out of 70
  termWork?: number; // term work, out of 25
}
export type MarksMap = Record<string, CourseMarks>;

export interface GradedCourse {
  id: string;
  theoryCredits: number;
  termWorkCredits: number;
}

const validMark = (v: unknown, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= max;

export const cleanMarks = (raw: unknown): MarksMap => {
  const out: MarksMap = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
    const m = v as Record<string, unknown>;
    const next: CourseMarks = {};
    if (validMark(m.inSem, MAX_CCE)) next.inSem = m.inSem;
    if (validMark(m.endSem, MAX_END_SEM)) next.endSem = m.endSem;
    if (validMark(m.termWork, MAX_TERM_WORK)) next.termWork = m.termWork;
    if (Object.keys(next).length) out[id] = next;
  }
  return out;
};

export interface Estimate {
  sgpa: number | null; // null when no head is complete
  gradedCredits: number;
  totalCredits: number;
  completeHeads: number;
  totalHeads: number;
  complete: boolean;
}

export const theoryGrade = (m: CourseMarks | undefined): Grade | null =>
  m && m.inSem !== undefined && m.endSem !== undefined ? gradeForPercent(m.inSem + m.endSem) : null;

export const termWorkGrade = (m: CourseMarks | undefined): Grade | null =>
  m && m.termWork !== undefined ? gradeForPercent((m.termWork / MAX_TERM_WORK) * 100) : null;

export const estimate = (courses: GradedCourse[], marks: MarksMap): Estimate => {
  let points = 0, gradedCredits = 0, totalCredits = 0, completeHeads = 0, totalHeads = 0;
  for (const c of courses) {
    const m = marks[c.id];
    totalCredits += c.theoryCredits + c.termWorkCredits;
    if (c.theoryCredits > 0) {
      totalHeads++;
      const g = theoryGrade(m);
      if (g) { points += g.point * c.theoryCredits; gradedCredits += c.theoryCredits; completeHeads++; }
    }
    if (c.termWorkCredits > 0) {
      totalHeads++;
      const g = termWorkGrade(m);
      if (g) { points += g.point * c.termWorkCredits; gradedCredits += c.termWorkCredits; completeHeads++; }
    }
  }
  return {
    sgpa: gradedCredits > 0 ? Math.round((points / gradedCredits) * 100) / 100 : null,
    gradedCredits,
    totalCredits,
    completeHeads,
    totalHeads,
    complete: totalHeads > 0 && completeHeads === totalHeads,
  };
};

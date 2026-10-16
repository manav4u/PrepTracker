import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subjectExamList, nextExamIndex } from '../lib/exams.ts';
// Minimal subject fixture typed loosely: lib/exams only reads id/name/code.
const SUBJECTS: any[] = [
  { id: 'm1', name: 'Engineering Mathematics-I', code: 'BSC-101-BES', credits: 4, theoryCredits: 3, termWorkCredits: 1, units: [] },
  { id: 'fpl', name: 'Fundamentals of Programming Languages', code: 'ESC-105-COM', credits: 3, theoryCredits: 2, termWorkCredits: 1, units: [] },
  { id: 'chem', name: 'Engineering Chemistry', code: 'BSC-103-BES', credits: 4, theoryCredits: 3, termWorkCredits: 1, units: [] }
];

const profile = (examDates: Record<string, string>, selectedSubjects = ['m1', 'fpl']) => ({ examDates, selectedSubjects });

test('lists only selected subjects with a student-set date, sorted by date', () => {
  const list = subjectExamList(profile({ fpl: '2026-12-10', m1: '2026-12-05' }), SUBJECTS);
  assert.equal(list.length, 2);
  assert.equal(list[0].subjectId, 'm1');
  assert.equal(list[1].subjectId, 'fpl');
});

test('ignores subjects without a date and dates for unselected subjects', () => {
  const list = subjectExamList(profile({ m1: '2026-12-05', chem: '2026-12-06' }), SUBJECTS);
  assert.deepEqual(list.map(e => e.subjectId), ['m1']);
});

test('drops unparseable dates instead of crashing', () => {
  const list = subjectExamList(profile({ m1: 'not-a-date', fpl: '2026-12-10' }), SUBJECTS);
  assert.deepEqual(list.map(e => e.subjectId), ['fpl']);
});

test('empty examDates means an empty timeline', () => {
  assert.deepEqual(subjectExamList(profile({}), SUBJECTS), []);
});

test('nextExamIndex points at the first exam on or after today', () => {
  const now = new Date(2026, 11, 7); // 7 Dec 2026 local
  const list = subjectExamList(profile({ fpl: '2026-12-10', m1: '2026-12-05' }), SUBJECTS);
  assert.equal(nextExamIndex(list, now), 1); // m1 is past, fpl is next
  assert.equal(nextExamIndex(list, new Date(2026, 11, 10)), 1); // same day still counts
  assert.equal(nextExamIndex(list, new Date(2026, 11, 31)), -1); // all past
});

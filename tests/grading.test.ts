import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeForPercent, estimate, cleanMarks, theoryGrade, termWorkGrade, failingHeads, roundToHalf } from '../lib/grading.ts';

// Official SPPU 2024-25 rules, Table 2.
test('grade band edges', () => {
  const cases: [number, string, number][] = [
    [100, 'O', 10], [90, 'O', 10], [89, 'A+', 9], [75, 'A+', 9], [74, 'A', 8], [60, 'A', 8],
    [59, 'B+', 7], [55, 'B+', 7], [54, 'B', 6], [50, 'B', 6], [49, 'C', 5], [45, 'C', 5],
    [44, 'D', 4], [40, 'D', 4], [39, 'F', 0], [0, 'F', 0],
  ];
  for (const [pct, letter, point] of cases) {
    const g = gradeForPercent(pct);
    assert.equal(g.letter, letter, `${pct}`);
    assert.equal(g.point, point, `${pct}`);
  }
});

test('theory is CCE plus end-sem out of 100, term work scales from 25', () => {
  assert.equal(theoryGrade({ inSem: 20, endSem: 50 })?.letter, 'A');
  assert.equal(theoryGrade({ inSem: 20 }), null);
  assert.equal(termWorkGrade({ termWork: 25 })?.letter, 'O');
  assert.equal(termWorkGrade({ termWork: 10 })?.letter, 'D'); // 40%
  assert.equal(termWorkGrade({ termWork: 9 })?.letter, 'F'); // 36%
});

test('SGPA is credit weighted per head', () => {
  const courses = [
    { id: 'a', theoryCredits: 3, termWorkCredits: 1 },
    { id: 'b', theoryCredits: 2, termWorkCredits: 1 },
  ];
  const marks = {
    a: { inSem: 28, endSem: 65, termWork: 25 }, // 93 -> O 10, tw 100% -> O 10
    b: { inSem: 20, endSem: 50, termWork: 15 }, // 70 -> A 8, tw 60% -> A 8
  };
  const e = estimate(courses, marks);
  // (10*3 + 10*1 + 8*2 + 8*1) / 7 = 64/7 = 9.142857
  assert.equal(e.sgpa, 9.14);
  assert.equal(e.complete, true);
  assert.equal(e.totalCredits, 7);
});

test('partial entry only grades completed heads and says so', () => {
  const courses = [{ id: 'a', theoryCredits: 3, termWorkCredits: 1 }];
  const e = estimate(courses, { a: { inSem: 30, endSem: 70 } });
  assert.equal(e.sgpa, 10);
  assert.equal(e.gradedCredits, 3);
  assert.equal(e.complete, false);
  assert.equal(estimate(courses, {}).sgpa, null);
});

test('a failing head counts as zero points', () => {
  const e = estimate([{ id: 'a', theoryCredits: 2, termWorkCredits: 0 }], { a: { inSem: 10, endSem: 20 } });
  assert.equal(e.sgpa, 0);
});

test('half marks are valid, other fractions and out-of-range are dropped', () => {
  assert.deepEqual(cleanMarks({ a: { inSem: 31, endSem: 70, termWork: 2.5 }, b: 'x', c: { inSem: 30 } }), {
    a: { endSem: 70, termWork: 2.5 },
    c: { inSem: 30 },
  });
  assert.deepEqual(cleanMarks({ a: { inSem: 12.3, endSem: -1 } }), {});
  assert.deepEqual(cleanMarks(null), {});
  assert.deepEqual(cleanMarks([]), {});
});

test('failingHeads counts only graded heads under 40 percent', () => {
  const courses = [{ id: 'a', theoryCredits: 3, termWorkCredits: 1 }];
  assert.equal(failingHeads(courses, { a: { inSem: 10, endSem: 20, termWork: 5 } }), 2);
  assert.equal(failingHeads(courses, { a: { inSem: 10 } }), 0);
});

test('roundToHalf', () => {
  assert.equal(roundToHalf(22.3), 22.5);
  assert.equal(roundToHalf(22.2), 22);
});

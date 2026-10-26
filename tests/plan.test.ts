import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPlan, studyDaysFor, msToMidnight } from '../lib/plan.ts';

const at = (s: string, h = 10) => new Date(`${s}T${String(h).padStart(2, '0')}:00:00`);
const topics = (p: string, n: number) => Array.from({ length: n }, (_, i) => `${p}${i + 1}`);
const subjects = [
  { id: 'a', name: 'Alpha', units: [{ id: 'a1', unit_number: 1, topics: topics('a', 30) }] },
  { id: 'b', name: 'Beta', units: [{ id: 'b1', unit_number: 1, topics: topics('b', 24) }] },
];
const dates = { a: '2026-10-20', b: '2026-10-24' };

test('studyDays keeps a 2 day reserve only from 6 days out', () => {
  assert.equal(studyDaysFor(10), 8);
  assert.equal(studyDaysFor(6), 4);
  assert.equal(studyDaysFor(5), 5);
  assert.equal(studyDaysFor(1), 1);
});

test('per subject targets are summed: 30/8 + 24/12', () => {
  const p = buildPlan(subjects, ['a', 'b'], dates, [], [], at('2026-10-10'));
  assert.deepEqual(p.subjects.map((s) => [s.name, s.target]), [['Alpha', 4], ['Beta', 2]]);
  assert.equal(p.target, 6);
  assert.equal(p.remaining, 6);
});

test('one missed day raises the target: A 5 + B 3', () => {
  const p = buildPlan(subjects, ['a', 'b'], dates, [], [], at('2026-10-11'));
  assert.equal(p.subjects[0].target, 5); // 30 / 7
  assert.equal(p.subjects[1].target, 3); // 24 / 11 -> 3
  assert.equal(p.target, 8);
});

test('today first-time ticks count toward the target and the total does not shrink', () => {
  const prog = [{ unitId: 'a1', topicsDone: ['a1', 'a2'] }];
  const ev = [{ day: '2026-10-10', unitId: 'a1', topic: 'a1', kind: 'topic' }, { day: '2026-10-10', unitId: 'a1', topic: 'a2', kind: 'topic' }];
  const p = buildPlan(subjects, ['a', 'b'], dates, prog, ev, at('2026-10-10'));
  const a = p.subjects[0];
  assert.equal(a.target, 4); // ceil((28 + 2) / 8)
  assert.equal(a.doneToday, 2);
  assert.equal(a.remaining, 2);
  assert.equal(p.target, 6);
  assert.equal(p.remaining, 4);
  assert.equal(a.topics.filter((t) => t.done).length, 2);
  assert.equal(a.topics.length, 4);
});

test('doing more than the target never goes below zero and keeps M', () => {
  const ticked = topics('a', 6);
  const prog = [{ unitId: 'a1', topicsDone: ticked }];
  const ev = ticked.map((t) => ({ day: '2026-10-10', unitId: 'a1', topic: t, kind: 'topic' }));
  const a = buildPlan(subjects, ['a'], dates, prog, ev, at('2026-10-10')).subjects[0];
  assert.equal(a.target, 4); // ceil(30/8)
  assert.equal(a.remaining, 0);
  assert.equal(a.doneToday, 6);
});

test('ticks from earlier days do not count as today', () => {
  const prog = [{ unitId: 'a1', topicsDone: ['a1'] }];
  const ev = [{ day: '2026-10-09', unitId: 'a1', topic: 'a1', kind: 'topic' }];
  const a = buildPlan(subjects, ['a'], dates, prog, ev, at('2026-10-10')).subjects[0];
  assert.equal(a.doneToday, 0);
  assert.equal(a.left, 29);
});

test('unticking a topic ticked today returns it to topics left', () => {
  const ev = [{ day: '2026-10-10', unitId: 'a1', topic: 'a1', kind: 'topic' }];
  const a = buildPlan(subjects, ['a'], dates, [{ unitId: 'a1', topicsDone: [] }], ev, at('2026-10-10')).subjects[0];
  assert.equal(a.doneToday, 0);
  assert.equal(a.left, 30);
});

test('no date means left out and listed as undated; past and same-day exams are dropped', () => {
  const p = buildPlan(subjects, ['a', 'b'], { a: '2026-10-10' }, [], [], at('2026-10-10'));
  assert.equal(p.subjects.length, 0);
  assert.deepEqual(p.undated.map((u) => u.subjectId), ['b']);
  assert.equal(p.target, 0);
  assert.equal(p.nothingLeft, false);
});

test('unselected subjects are ignored and bad dates are undated', () => {
  const p = buildPlan(subjects, ['a'], { a: 'nope', b: '2026-10-24' }, [], [], at('2026-10-10'));
  assert.equal(p.subjects.length, 0);
  assert.deepEqual(p.undated.map((u) => u.subjectId), ['a']);
});

test('all ticked: nothing left', () => {
  const prog = [{ unitId: 'a1', topicsDone: topics('a', 30) }];
  const p = buildPlan(subjects, ['a'], dates, prog, [], at('2026-10-10'));
  assert.equal(p.nothingLeft, true);
  assert.equal(p.remaining, 0);
});

test('high pace shows the real number with no cap', () => {
  const big = [{ id: 'c', name: 'Big', units: [{ id: 'c1', unit_number: 1, topics: topics('c', 40) }] }];
  const p = buildPlan(big, ['c'], { c: '2026-10-13' }, [], [], at('2026-10-10'));
  assert.equal(p.subjects[0].studyDays, 3);
  assert.equal(p.target, 14);
});

test('topic lists follow syllabus order and only show what is left today', () => {
  const a = buildPlan(subjects, ['a'], dates, [], [], at('2026-10-10')).subjects[0];
  assert.deepEqual(a.topics.map((t) => t.topic), ['a1', 'a2', 'a3', 'a4']);
});

test('msToMidnight is positive and under a day', () => {
  const ms = msToMidnight(at('2026-10-10', 23));
  assert.ok(ms > 0 && ms <= 86400000);
});

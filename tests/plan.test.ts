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

test('same inputs give the same plan on every reload', () => {
  const prog = [{ unitId: 'a1', topicsDone: ['a1', 'a2'] }];
  const ev = [{ day: '2026-10-10', unitId: 'a1', topic: 'a1', kind: 'topic' }, { day: '2026-10-10', unitId: 'a1', topic: 'a2', kind: 'topic' }];
  const one = buildPlan(subjects, ['a', 'b'], dates, prog, ev, at('2026-10-10', 9));
  const two = buildPlan(subjects, ['a', 'b'], dates, prog, ev, at('2026-10-10', 23));
  assert.deepEqual(one, two);
});

test('tick then untick returns exactly the starting plan', () => {
  const start = buildPlan(subjects, ['a', 'b'], dates, [], [], at('2026-10-10'));
  const ev = [{ day: '2026-10-10', unitId: 'a1', topic: 'a1', kind: 'topic' }];
  const ticked = buildPlan(subjects, ['a', 'b'], dates, [{ unitId: 'a1', topicsDone: ['a1'] }], ev, at('2026-10-10'));
  assert.equal(ticked.target, start.target);
  assert.equal(ticked.remaining, start.remaining - 1);
  const unticked = buildPlan(subjects, ['a', 'b'], dates, [{ unitId: 'a1', topicsDone: [] }], ev, at('2026-10-10'));
  assert.deepEqual(unticked.subjects.map((s) => [s.target, s.remaining]), start.subjects.map((s) => [s.target, s.remaining]));
});

test('changing an exam date or the subject list recomputes from the new inputs', () => {
  const base = buildPlan(subjects, ['a', 'b'], dates, [], [], at('2026-10-10'));
  const sooner = buildPlan(subjects, ['a', 'b'], { ...dates, b: '2026-10-14' }, [], [], at('2026-10-10'));
  assert.ok(sooner.subjects.find((s) => s.subjectId === 'b')!.target > base.subjects.find((s) => s.subjectId === 'b')!.target);
  const dropped = buildPlan(subjects, ['a'], dates, [], [], at('2026-10-10'));
  assert.equal(dropped.target, 4);
});

test('the day rolls over at local midnight: yesterday ticks stop counting', () => {
  const prog = [{ unitId: 'a1', topicsDone: ['a1'] }];
  const ev = [{ day: '2026-10-10', unitId: 'a1', topic: 'a1', kind: 'topic' }];
  const late = buildPlan(subjects, ['a'], dates, prog, ev, new Date('2026-10-10T23:59:59'));
  const early = buildPlan(subjects, ['a'], dates, prog, ev, new Date('2026-10-11T00:00:01'));
  assert.equal(late.subjects[0].doneToday, 1);
  assert.equal(early.subjects[0].doneToday, 0);
  assert.equal(early.subjects[0].daysToExam, 9);
});

test('day counts hold across a daylight saving change', () => {
  const prev = process.env.TZ;
  process.env.TZ = 'America/New_York';
  try {
    // US clocks go back on 2026-11-01: that day is 25 hours long.
    const p = buildPlan(subjects, ['a'], { a: '2026-11-05' }, [], [], new Date(2026, 9, 30, 10, 0, 0));
    assert.equal(p.subjects[0].daysToExam, 6);
    const q = buildPlan(subjects, ['a'], { a: '2026-11-05' }, [], [], new Date(2026, 10, 1, 23, 30, 0));
    assert.equal(q.subjects[0].daysToExam, 4);
    // Clocks go forward on 2026-03-08: that day is 23 hours long.
    const r = buildPlan(subjects, ['a'], { a: '2026-03-10' }, [], [], new Date(2026, 2, 7, 12, 0, 0));
    assert.equal(r.subjects[0].daysToExam, 3);
    assert.ok(msToMidnight(new Date(2026, 10, 1, 0, 30, 0)) > 24 * 3600 * 1000 - 1);
  } finally {
    if (prev === undefined) delete process.env.TZ; else process.env.TZ = prev;
  }
});

test('exam today and no date cases never produce a target', () => {
  const p = buildPlan(subjects, ['a', 'b'], { a: '2026-10-10' }, [], [], at('2026-10-10'));
  assert.equal(p.target, 0);
  assert.equal(p.remaining, 0);
  assert.equal(p.undated.length, 1);
});

import { recordEvents, recordStudy } from '../lib/activity.ts';

test('marking a unit Mastered counts its newly ticked topics as done today and keeps the target', () => {
  const now = at('2026-10-10');
  const profile: any = { streak: 0, lastStudyDate: '', events: [] as any[] };
  const before = buildPlan(subjects, ['a'], dates, [{ unitId: 'a1', topicsDone: ['a1'] }], [], now);
  const ev1 = [{ day: '2026-10-10', unitId: 'a1', topic: 'a1', kind: 'topic' }];
  const start = buildPlan(subjects, ['a'], dates, [{ unitId: 'a1', topicsDone: ['a1'] }], ev1, now).subjects[0].target;
  // Mastered tap: the unit action plus a line for each topic that was not ticked before.
  const newly = topics('a', 30).slice(1).map((topic) => ({ subjectId: 'a', unitId: 'a1', topic, kind: 'topic' as const }));
  const after = recordEvents(recordStudy({ ...profile, events: ev1.map((e) => ({ ...e, subjectId: 'a' })) as any[] }, now, { subjectId: 'a', unitId: 'a1', kind: 'unit' }), now, newly);
  const plan = buildPlan(subjects, ['a'], dates, [{ unitId: 'a1', topicsDone: topics('a', 30) }], after.events!, now);
  assert.equal(plan.subjects[0].target, start);
  assert.equal(plan.subjects[0].left, 0);
  assert.equal(plan.subjects[0].remaining, 0);
  assert.equal(plan.nothingLeft, true);
  assert.ok(before.subjects[0].target >= 1);
  assert.equal(after.activity![`2026-10-10`], 1); // still one action, streak untouched by the extra lines
});

test('recordEvents is idempotent and does not change the action count', () => {
  const now = at('2026-10-10');
  const p = { streak: 2, lastStudyDate: now.toISOString(), activity: { '2026-10-10': 3 }, events: [] as any[] };
  const add = [{ subjectId: 'a', unitId: 'a1', topic: 'a1', kind: 'topic' as const }];
  const once = recordEvents(p, now, add);
  const twice = recordEvents(once, now, add);
  assert.equal(twice.events!.length, 1);
  assert.equal(twice.activity!['2026-10-10'], 3);
  assert.equal(twice.streak, 2);
});

test('today and past exam dates stay distinct from missing dates', () => {
  const today = at('2026-10-10');
  const p = buildPlan(subjects, ['a', 'b'], { a: '2026-10-10', b: '2026-10-09' }, [], [], today);
  assert.deepEqual(p.examsToday, [{ subjectId: 'a', name: 'Alpha' }]);
  assert.deepEqual(p.pastExams, [{ subjectId: 'b', name: 'Beta' }]);
  assert.deepEqual(p.undated, []);
  assert.equal(p.target, 0);
  const mixed = buildPlan(subjects, ['a', 'b'], { a: '2026-10-10', b: '2026-10-24' }, [], [], today);
  assert.equal(mixed.examsToday.length, 1);
  assert.equal(mixed.subjects.length, 1);
  assert.equal(mixed.subjects[0].subjectId, 'b');
});

test('extra work in one subject never fills another subject goal', () => {
  const now = at('2026-10-10');
  const ev = topics('a', 7).map(topic => ({ day: '2026-10-10', unitId: 'a1', topic, kind: 'topic' }));
  const first = buildPlan(subjects, ['a', 'b'], dates, [{ unitId: 'a1', topicsDone: topics('a', 7) }], ev, now);
  assert.equal(first.target, 6);
  assert.equal(first.doneToday, 7);
  assert.equal(first.creditedToday, 4);
  assert.equal(first.extraToday, 3);
  assert.equal(first.remaining, 2);
  assert.equal(first.creditedToday + first.remaining, first.target);
  const added = topics('b', 2).map(topic => ({ day: '2026-10-10', unitId: 'b1', topic, kind: 'topic' }));
  const finished = buildPlan(subjects, ['a', 'b'], dates, [{ unitId: 'a1', topicsDone: topics('a', 7) }, { unitId: 'b1', topicsDone: topics('b', 2) }], [...ev, ...added], now);
  assert.equal(finished.creditedToday, finished.target);
  assert.equal(finished.remaining, 0);
  assert.equal(finished.extraToday, 3);
  const unticked = buildPlan(subjects, ['a', 'b'], dates, [{ unitId: 'a1', topicsDone: topics('a', 7) }, { unitId: 'b1', topicsDone: ['b1'] }], [...ev, ...added], now);
  assert.equal(unticked.creditedToday, 5);
  assert.equal(unticked.remaining, 1);
});

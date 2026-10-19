import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQueue, answer, addDays, isReviews, cleanReviews, reviewKey, DAILY_CAP, STEPS, SHAKY_DAYS } from '../lib/revision.ts';

const at = (s: string) => new Date(`${s}T10:00:00`);
const subjects = [
  { id: 's1', name: 'Subject One', units: [{ id: 's1-u1', unit_number: 1, topics: ['a', 'b', 'c'] }] },
  { id: 's2', name: 'Subject Two', units: [{ id: 's2-u1', unit_number: 1, topics: ['x'] }] },
];
const prog = [{ unitId: 's1-u1', topicsDone: ['a', 'b'] }, { unitId: 's2-u1', topicsDone: ['x'] }];
const ev = (day: string, unitId: string, topic: string) => ({ day, unitId, topic, kind: 'topic' });

test('a topic studied today is first due in three days', () => {
  const q = buildQueue(subjects, ['s1', 's2'], prog, [ev('2026-10-10', 's1-u1', 'a')], {}, at('2026-10-10'));
  assert.equal(q.today.length, 0);
  assert.equal(q.tomorrow, 0);
  assert.equal(q.nextDue, '2026-10-13');
  assert.equal(q.trackedTopics, 3);
});

test('a topic studied three days ago is due today', () => {
  const q = buildQueue(subjects, ['s1'], prog, [ev('2026-10-07', 's1-u1', 'a')], {}, at('2026-10-10'));
  assert.deepEqual(q.today.map((i) => i.topic), ['a']);
  assert.equal(q.today[0].subjectName, 'Subject One');
});

test('unticked topics and unselected subjects never appear', () => {
  const q = buildQueue(subjects, ['s1'], prog, [ev('2026-10-01', 's2-u1', 'x'), ev('2026-10-01', 's1-u1', 'c')], {}, at('2026-10-10'));
  assert.ok(!q.today.some((i) => i.topic === 'x' || i.topic === 'c'));
});

test('a unit marked Mastered uses the unit event date', () => {
  const q = buildQueue(subjects, ['s1'], prog, [{ day: '2026-10-01', unitId: 's1-u1', kind: 'unit' }], {}, at('2026-10-10'));
  assert.equal(q.today.length, 2);
  assert.equal(q.today[0].overdue, 6);
});

test('recalled climbs the steps and graduates after the last one', () => {
  let e = answer(undefined, true, at('2026-10-10'));
  assert.equal(e.stage, 1);
  assert.equal(e.due, addDays('2026-10-10', STEPS[1]));
  e = answer(e, true, at('2026-10-17'));
  assert.equal(e.due, addDays('2026-10-17', STEPS[2]));
  e = answer(e, true, at('2026-11-07'));
  assert.equal(e.stage, STEPS.length);
  assert.equal(e.due, '');
});

test('shaky starts again from tomorrow', () => {
  const e = answer({ stage: 3, due: '2026-10-10', last: '2026-10-01' }, false, at('2026-10-10'));
  assert.deepEqual(e, { stage: 0, due: addDays('2026-10-10', SHAKY_DAYS), last: '2026-10-10', shaky: true });
});

test('graduated topics leave the cycle', () => {
  const reviews = { [reviewKey('s1-u1', 'a')]: { stage: STEPS.length, due: '', last: '2026-10-01' } };
  const q = buildQueue(subjects, ['s1'], prog, [], reviews, at('2026-10-10'));
  assert.equal(q.trackedTopics, 1);
});

test('the daily cap holds the rest back and counts reviews already done today', () => {
  const topics = Array.from({ length: 12 }, (_, i) => `t${i}`);
  const big = [{ id: 'b', name: 'Big', units: [{ id: 'b-u1', unit_number: 1, topics }] }];
  const p = [{ unitId: 'b-u1', topicsDone: topics }];
  const events = topics.map((t) => ev('2026-10-01', 'b-u1', t));
  let q = buildQueue(big, ['b'], p, events, {}, at('2026-10-10'));
  assert.equal(q.today.length, DAILY_CAP);
  assert.equal(q.waiting, 4);
  const reviews = { [reviewKey('b-u1', 't0')]: answer(undefined, true, at('2026-10-10')), [reviewKey('b-u1', 't1')]: answer(undefined, true, at('2026-10-10')) };
  q = buildQueue(big, ['b'], p, events, reviews, at('2026-10-10'));
  assert.equal(q.doneToday, 2);
  assert.equal(q.today.length, DAILY_CAP - 2);
  assert.equal(q.waiting, 12 - 2 - (DAILY_CAP - 2));
});

test('shaky topics sort ahead of equally late ones', () => {
  const reviews = { [reviewKey('s1-u1', 'b')]: { stage: 0, due: '2026-10-08', last: '2026-10-07', shaky: true } };
  const q = buildQueue(subjects, ['s1'], prog, [ev('2026-10-05', 's1-u1', 'a')], reviews, at('2026-10-10'));
  assert.equal(q.today[0].topic, 'b');
});

test('storage validation drops anything malformed', () => {
  assert.ok(isReviews({}));
  assert.ok(isReviews({ k: { stage: 1, due: '2026-10-10', last: '2026-10-09' } }));
  assert.ok(!isReviews([]));
  assert.ok(!isReviews({ k: { stage: 9, due: '2026-10-10', last: '2026-10-09' } }));
  assert.ok(!isReviews({ k: { stage: 1, due: 'soon', last: '2026-10-09' } }));
  assert.deepEqual(cleanReviews('nope'), {});
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { recordStudy, currentStreak, lastDays, dayKey, heatmapWeeks, levelFor, eventsForDay, type ActivityProfile } from '../lib/activity.ts';

const at = (s: string) => new Date(`${s}T10:00:00`);
const base: ActivityProfile = { streak: 0, lastStudyDate: '' };

test('first study starts a streak at 1', () => {
  const p = recordStudy(base, at('2026-10-10'));
  assert.equal(p.streak, 1);
  assert.equal(p.activity?.['2026-10-10'], 1);
});

test('signup day with streak 0 still counts the first study', () => {
  const p = recordStudy({ streak: 0, lastStudyDate: at('2026-10-10').toISOString() }, at('2026-10-10'));
  assert.equal(p.streak, 1);
});

test('same day twice does not inflate the streak but counts activity', () => {
  let p = recordStudy(base, at('2026-10-10'));
  p = recordStudy(p, at('2026-10-10'));
  assert.equal(p.streak, 1);
  assert.equal(p.activity?.['2026-10-10'], 2);
});

test('consecutive days extend the streak', () => {
  let p = recordStudy(base, at('2026-10-10'));
  p = recordStudy(p, at('2026-10-11'));
  p = recordStudy(p, at('2026-10-12'));
  assert.equal(p.streak, 3);
});

test('a missed day resets to 1, not old streak + 1', () => {
  let p = recordStudy(base, at('2026-10-10'));
  p = recordStudy(p, at('2026-10-11'));
  p = recordStudy(p, at('2026-10-14'));
  assert.equal(p.streak, 1);
});

test('displayed streak drops to 0 after a missed day', () => {
  const p = recordStudy(base, at('2026-10-10'));
  assert.equal(currentStreak(p, at('2026-10-11')), 1);
  assert.equal(currentStreak(p, at('2026-10-12')), 0);
});

test('lastDays is oldest first and aligned to real days', () => {
  let p = recordStudy(base, at('2026-10-10'));
  p = recordStudy(p, at('2026-10-12'));
  const r = lastDays(p, 7, at('2026-10-12'));
  assert.deepEqual(r.counts, [0, 0, 0, 0, 1, 0, 1]);
  assert.equal(r.counts.length, 7);
  assert.equal(dayKey(at('2026-01-05')), '2026-01-05');
});

test('old days are pruned', () => {
  const p = recordStudy({ ...base, activity: { '2026-01-01': 5 } }, at('2026-10-10'));
  assert.equal(p.activity?.['2026-01-01'], undefined);
});

test('an event lands on the acted day with subject and topic', () => {
  const p = recordStudy(base, at('2026-10-10'), { subjectId: 'm1', unitId: 'm1-u2', topic: 'Euler', kind: 'topic' });
  assert.equal(p.events?.length, 1);
  assert.deepEqual(p.events?.[0], { day: '2026-10-10', subjectId: 'm1', unitId: 'm1-u2', topic: 'Euler', kind: 'topic' });
});

test('events older than the 91-day window are pruned', () => {
  const seeded: ActivityProfile = { streak: 1, lastStudyDate: at('2026-07-01').toISOString(), events: [{ day: '2026-07-01', subjectId: 'm1', kind: 'unit' }] };
  const p = recordStudy(seeded, at('2026-10-10'), { subjectId: 'phy', kind: 'unit' });
  assert.equal(p.events?.length, 1);
  assert.equal(p.events?.[0].subjectId, 'phy');
});

test('heatmap weeks: 13 monday-first weeks, 7 cells, future flagged, today matched', () => {
  const now = at('2026-10-14'); // a Wednesday
  const p: ActivityProfile = { streak: 1, lastStudyDate: now.toISOString(), activity: { '2026-10-14': 3 } };
  const weeks = heatmapWeeks(p, 12, now);
  assert.equal(weeks.length, 13);
  assert.equal(weeks[12].cells.length, 7);
  assert.equal(weeks[12].cells[2].day, '2026-10-14');
  assert.equal(weeks[12].cells[2].count, 3);
  assert.equal(weeks[12].cells[2].level, 2);
  assert.equal(weeks[12].cells[3].future, true);
  assert.equal(weeks[12].cells[0].future, false);
});

test('levelFor buckets counts onto five heat levels', () => {
  assert.equal(levelFor(0), 0);
  assert.equal(levelFor(2), 1);
  assert.equal(levelFor(4), 2);
  assert.equal(levelFor(7), 3);
  assert.equal(levelFor(9), 4);
});

test('eventsForDay returns only that day, in order', () => {
  const p: ActivityProfile = { streak: 0, lastStudyDate: '', events: [
    { day: '2026-10-10', subjectId: 'm1', kind: 'topic', topic: 'A' },
    { day: '2026-10-11', subjectId: 'phy', kind: 'unit' },
    { day: '2026-10-10', subjectId: 'fpl', kind: 'pyq', topic: '2024' },
  ] };
  const evs = eventsForDay(p, '2026-10-10');
  assert.equal(evs.length, 2);
  assert.equal(evs[0].subjectId, 'm1');
  assert.equal(evs[1].subjectId, 'fpl');
});

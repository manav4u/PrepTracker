import test from 'node:test';
import assert from 'node:assert/strict';
import { recordStudy, currentStreak, lastDays, dayKey, type ActivityProfile } from '../lib/activity.ts';

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

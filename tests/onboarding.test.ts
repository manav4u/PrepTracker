import test from 'node:test';
import assert from 'node:assert/strict';
import { finishSetup } from '../lib/onboarding.ts';

test('re-picking subjects preserves all unrelated profile fields, including unknown fields', () => {
  const previous = {
    name: 'Student', theme: 'light' as const, avatarId: 'saved', avatarShape: 'square' as const,
    selectedSubjects: ['m1', 'phy'], setupComplete: false, prn: '123', streak: 4,
    lastStudyDate: '2026-10-26T18:00:00Z', examStartDate: '2026-11-05',
    examDates: { m1: '2026-11-05', phy: '2026-11-07' }, activity: { '2026-10-26': 5 },
    events: [{ day: '2026-10-26', subjectId: 'm1', kind: 'topic' as const, unitId: 'm1-u1', topic: 'Topic' }],
    futureField: { keep: true },
  };
  const before = structuredClone(previous);
  const choices = { name: 'Renamed', avatarId: 'new', avatarShape: 'circle' as const, selectedSubjects: ['m1'] };
  assert.deepEqual(finishSetup(previous, choices), { ...previous, ...choices, setupComplete: true });
  assert.deepEqual(previous, before);
  assert.deepEqual(finishSetup(previous, choices).examDates, previous.examDates); // retain deselected dates too
});

test('first setup has clean defaults and only the supplied choices', () => {
  const choices = { name: 'New student', avatarShape: 'circle' as const, selectedSubjects: ['m1'] };
  const now = new Date('2026-10-27T10:00:00Z');
  assert.deepEqual(finishSetup(null, choices, now), { theme: 'dark', streak: 0, lastStudyDate: now.toISOString(), ...choices, setupComplete: true });
});

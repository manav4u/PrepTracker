import { test, expect } from '@playwright/test';

test('changing subjects preserves study history and all other saved data', async ({ page }) => {
  const profile = {
    name: 'QA Student', prn: 'QA123', theme: 'dark', selectedSubjects: ['m1', 'phy'], setupComplete: true,
    streak: 4, lastStudyDate: '2026-10-26T18:00:00Z', activity: { '2026-10-26': 5 },
    events: [{ day: '2026-10-23', subjectId: 'm1', unitId: 'm1-u1', topic: 'Rolle’s Theorem', kind: 'topic' }],
    examStartDate: '2026-11-05', examDates: { m1: '2026-11-05', phy: '2026-11-07' }, futureField: { keep: true },
  };
  const other = { sppu_progress: [{ unitId: 'm1-u1', status: 'In Progress', topicsDone: ['Rolle’s Theorem'], pyqsCompleted: [] }],
    sppu_tasks: [{ id: 'task', text: 'Notes', completed: false, priority: 'NORMAL', category: 'GENERAL', createdAt: '2026-10-26' }],
    sppu_reviews: { 'm1-u1::Rolle’s Theorem': { stage: 1, due: '2026-11-05', last: '2026-10-26' } },
    sppu_calculator_marks: { m1: { inSem: 20, endSem: 50 } }, sppu_custom_resources: [], sppu_deleted_system_ids: [] };
  await page.addInitScript(({ profile, other }) => {
    if (sessionStorage.getItem('qa-seeded')) return;
    localStorage.setItem('pt_ga_consent', 'denied');
    localStorage.setItem('sppu_profile', JSON.stringify(profile));
    for (const [k, v] of Object.entries(other)) localStorage.setItem(k, JSON.stringify(v));
    sessionStorage.setItem('qa-seeded', 'yes');
  }, { profile, other });
  await page.goto('/app/settings');
  await page.getByRole('button', { name: 'Change subjects', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: /First year/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sppu_profile')!));
  for (const k of ['prn', 'theme', 'streak', 'lastStudyDate', 'activity', 'events', 'examStartDate', 'examDates', 'futureField']) expect(saved[k]).toEqual(profile[k as keyof typeof profile]);
  expect(saved.setupComplete).toBe(true);
  const storedOther = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, JSON.parse(localStorage.getItem(k)!)])), Object.keys(other));
  expect(storedOther).toEqual(other);
  await page.reload();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sppu_profile')!).examDates)).toEqual(profile.examDates);
});

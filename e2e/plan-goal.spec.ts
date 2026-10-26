import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const maths = ['Rolle’s Theorem', 'Mean Value Theorems', "Taylor's and Maclaurin's Series", 'Indeterminate Forms', "L' Hospital's Rule", 'Fourier series (Full range & Half range)', 'Harmonic analysis'];
test('extra Maths work cannot complete the Physics goal', async ({ page }, info) => {
  await page.clock.install({ time: new Date('2026-10-27T10:00:00') });
  await page.addInitScript(maths => {
    if (sessionStorage.getItem('qa-seeded')) return;
    localStorage.setItem('pt_ga_consent', 'denied');
    localStorage.setItem('sppu_profile', JSON.stringify({ name: 'QA', theme: 'dark', selectedSubjects: ['m1', 'phy'], setupComplete: true, streak: 0, lastStudyDate: '', examDates: { m1: '2026-11-05', phy: '2026-11-07' }, events: maths.map(topic => ({ day: '2026-10-27', subjectId: 'm1', unitId: 'm1-u1', topic, kind: 'topic' })) }));
    localStorage.setItem('sppu_progress', JSON.stringify([{ unitId: 'm1-u1', status: 'Mastered', topicsDone: maths, pyqsCompleted: [] }]));
    sessionStorage.setItem('qa-seeded', 'yes');
  }, maths);
  await page.goto('/app/revise?tab=plan');
  const plan = page.getByTestId('plan-tab');
  await expect(plan).toContainText('4 done of 8');
  await expect(plan).toContainText('4left');
  await expect(plan).toContainText('+3 extra topics studied');
  const bar = page.getByRole('progressbar', { name: 'Daily topic goals completed' });
  await expect(bar).toHaveAttribute('aria-valuenow', '4');
  for (const topic of ['Laser: Spontaneous/Stimulated emission', 'CO2 laser construction & working']) await page.getByRole('button', { name: `Mark done: ${topic}`, exact: true }).click();
  await expect(plan).toContainText('6 done of 8');
  await expect(plan).toContainText('2left');
  await expect(bar).toHaveAttribute('aria-valuenow', '6');
  await page.reload();
  await expect(plan).toContainText('6 done of 8');
  await expect(bar).toHaveAttribute('aria-valuenow', '6');
  if (process.env.QA_SHOTS) {
    fs.mkdirSync('/tmp/preptracker-proof', { recursive: true });
    await page.screenshot({ path: `/tmp/preptracker-proof/goal-${info.project.name}.png`, fullPage: true });
  }
  await page.getByRole('button', { name: 'Mark not done: Laser: Spontaneous/Stimulated emission', exact: true }).click();
  await expect(plan).toContainText('5 done of 8');
  await expect(plan).toContainText('3left');
  for (const name of await page.getByRole('button', { name: /^Mark done:/ }).evaluateAll(bs => bs.map(b => b.getAttribute('aria-label')!))) await page.getByRole('button', { name, exact: true }).click();
  await expect(plan).toContainText('8 done of 8');
  await expect(plan).toContainText('0left');
  await expect(bar).toHaveAttribute('aria-valuenow', '8');
});

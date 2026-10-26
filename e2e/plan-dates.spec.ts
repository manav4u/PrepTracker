import { test, expect } from '@playwright/test';
import fs from 'node:fs';

for (const scenario of [
  { name: 'missing', dates: {}, headline: 'Add an exam date to get a plan.', action: 'Open Settings' },
  { name: 'today', dates: { m1: '2026-10-27', phy: '2026-10-26' }, headline: 'Exam day.', action: 'Open Review' },
  { name: 'past', dates: { m1: '2026-10-26', phy: '2026-10-25' }, headline: 'No upcoming exams to plan for.', action: 'Edit exam dates' },
  { name: 'mixed', dates: { m1: '2026-10-27', phy: '2026-11-07' }, headline: '', action: 'Open Review' },
]) {
  test(`honest date state: ${scenario.name}`, async ({ page }, info) => {
    await page.clock.install({ time: new Date('2026-10-27T10:00:00') });
    await page.addInitScript(dates => {
      localStorage.setItem('pt_ga_consent', 'denied');
      localStorage.setItem('sppu_profile', JSON.stringify({ name: 'QA', theme: 'dark', selectedSubjects: ['m1', 'phy'], setupComplete: true, streak: 0, lastStudyDate: '', examDates: dates }));
    }, scenario.dates);
    await page.goto('/app/revise?tab=plan');
    if (scenario.headline) await expect(page.getByTestId('plan-empty')).toContainText(scenario.headline);
    else await expect(page.getByTestId('plan-tab')).toContainText('Engineering Physics', { ignoreCase: true });
    if (scenario.name === 'today' || scenario.name === 'mixed') {
      await expect(page.getByText(/Exam today: Engineering Mathematics-I/)).toBeVisible();
      await expect(page.getByText('Add an exam date to get a plan.')).toHaveCount(0);
    }
    if (scenario.name === 'past') await expect(page.getByText(/Past exam dates:/)).toBeVisible();
    const action = page.getByRole('link', { name: scenario.action, exact: true }).last();
    await expect(action).toHaveAttribute('href', /\/app\/(settings|revise)$/);
    if (process.env.QA_SHOTS && scenario.name !== 'missing') {
      fs.mkdirSync('/tmp/preptracker-proof', { recursive: true });
      await page.screenshot({ path: `/tmp/preptracker-proof/dates-${scenario.name}-${info.project.name}.png`, fullPage: true });
    }
    await action.click();
    await expect(page).toHaveURL(scenario.action === 'Open Review' ? /\/app\/revise$/ : /\/app\/settings$/);
  });
}

import { test, expect } from '@playwright/test';

for (const link of [{ subjectId: 'm1' }, { unitId: 'm1-u1' }, {}]) {
  test(`no-op edit preserves task link ${JSON.stringify(link)}`, async ({ page }) => {
    const task = { id: 'qa-task', text: 'Review notes', completed: true, priority: 'NORMAL', category: 'EXAM', dueDate: '2026-11-05', createdAt: '2026-10-25T10:00:00Z', ...link };
    await page.addInitScript(task => {
      localStorage.setItem('pt_ga_consent', 'denied');
      localStorage.setItem('sppu_profile', JSON.stringify({ name: 'QA', theme: 'dark', selectedSubjects: ['m1'], setupComplete: true, streak: 0, lastStudyDate: '' }));
      if (!sessionStorage.getItem('qa-seeded')) { localStorage.setItem('sppu_tasks', JSON.stringify([task])); sessionStorage.setItem('qa-seeded', 'yes'); }
    }, task);
    await page.goto('/app/tasks');
    if (test.info().project.name === 'mobile') {
      const row = page.locator('#task-qa-task > div').nth(1);
      await row.dispatchEvent('touchstart', { touches: [{ identifier: 0, clientX: 330, clientY: 500 }] });
      await row.dispatchEvent('touchmove', { touches: [{ identifier: 0, clientX: 180, clientY: 500 }] });
      await row.dispatchEvent('touchend', { touches: [] });
      await page.getByRole('button', { name: 'Edit task: Review notes', exact: true }).first().click();
    } else {
      await page.getByRole('button', { name: 'Edit task: Review notes', exact: true }).last().click();
    }
    if ('subjectId' in link || 'unitId' in link) await expect(page.getByRole('button', { name: 'Engineering Mathematics-I', exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sppu_tasks')!)[0]);
    expect(saved).toEqual({ ...task, ...('unitId' in link ? { subjectId: 'm1' } : {}) });
    await page.reload();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sppu_tasks')!)[0])).toEqual(saved);
  });
}

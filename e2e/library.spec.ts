import { test, expect } from '@playwright/test';

test.describe('static library', () => {
  test('hub lists branches and links through to a subject page', async ({ page }) => {
    await page.goto('/syllabus/');
    // Library links are absolute production URLs; follow the same path locally.
    const href = await page.getByRole('link', { name: /Cyber Security/ }).first().getAttribute('href');
    expect(href).toMatch(/\/syllabus\/se-cyber-security\/$/);
    await page.goto(new URL(href!).pathname);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Cyber Security');
  });

  test('subject page renders course entries and the privacy footer link', async ({ page }) => {
    await page.goto('/syllabus/se-cyber-security/');
    await expect(page.getByRole('link', { name: /Probability and Statistics/ })).toBeVisible();
    const privacy = page.locator('footer a[href$="/privacy/"]');
    await expect(privacy.first()).toBeVisible();
  });

  test('privacy page covers data storage, analytics and contact', async ({ page }) => {
    await page.goto('/privacy/');
    await expect(page.getByRole('heading', { name: 'Privacy', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /study data stays on your device/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Visit statistics/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'sia@manavdev.site' })).toHaveAttribute('href', 'mailto:sia@manavdev.site');
  });

  test('reading-mode toggle and print control work', async ({ page }) => {
    await page.goto('/syllabus/se-cyber-security/');
    const toggle = page.getByRole('button', { name: /Quiet reading|Full reference view/ });
    await expect(toggle).toBeVisible();
    const before = await page.locator('body').getAttribute('class');
    await toggle.click();
    expect(await page.locator('body').getAttribute('class')).not.toBe(before);
  });
});

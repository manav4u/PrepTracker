import { test, expect } from '@playwright/test';

const KEY = 'pt_ga_consent';

test.describe('analytics consent', () => {
  test('banner offers both choices and defaults to denied', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Analytics consent' });
    await expect(banner).toBeVisible();
    await expect(banner.getByRole('button', { name: 'Allow stats' })).toBeVisible();
    await expect(banner.getByRole('button', { name: 'No thanks' })).toBeVisible();
    const consent = await page.evaluate(() => (window as any).dataLayer?.find(
      (a: unknown[]) => a[0] === 'consent' && a[1] === 'default'));
    expect(consent?.[2]).toMatchObject({ analytics_storage: 'denied', ad_storage: 'denied' });
  });

  test('No thanks stores denied and hides the banner for later visits', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Analytics consent' });
    await banner.getByRole('button', { name: 'No thanks' }).click();
    await expect(banner).toBeHidden();
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('denied');
    await page.reload();
    await expect(page.getByRole('region', { name: 'Analytics consent' })).toHaveCount(0);
  });

  test('Allow stats grants storage and carries over to library pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('region', { name: 'Analytics consent' })
      .getByRole('button', { name: 'Allow stats' }).click();
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('granted');
    // The static library pages share the key; no second banner there.
    await page.goto('/syllabus/');
    await expect(page.locator('.pt-consent')).toHaveCount(0);
    await page.goto('/privacy/');
    await expect(page.locator('.pt-consent')).toHaveCount(0);
  });

  test('static pages show the banner when no choice exists yet', async ({ page }) => {
    await page.goto('/syllabus/se-cyber-security/');
    const banner = page.locator('.pt-consent');
    await expect(banner).toBeVisible();
    await banner.locator('.c-n').click();
    await expect(banner).toHaveCount(0);
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('denied');
    await page.reload();
    await expect(page.locator('.pt-consent')).toHaveCount(0);
  });
});

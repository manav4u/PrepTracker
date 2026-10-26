import { test, expect } from '@playwright/test';

const KEY = 'pt_ga_consent';

test.describe('cookie consent', () => {
  test('banner offers both choices and defaults to denied', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Cookie consent' });
    await expect(banner).toBeVisible();
    await expect(banner.getByRole('button', { name: 'Accept' })).toBeVisible();
    await expect(banner.getByRole('button', { name: 'Reject' })).toBeVisible();
    await expect(banner.getByRole('button', { name: 'Manage' })).toBeVisible();
    const consent = await page.evaluate(() => (window as any).dataLayer?.find(
      (a: unknown[]) => a[0] === 'consent' && a[1] === 'default'));
    expect(consent?.[2]).toMatchObject({ analytics_storage: 'denied', ad_storage: 'denied' });
  });

  test('Reject stores denied and hides the banner for later visits', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Cookie consent' });
    await banner.getByRole('button', { name: 'Reject' }).click();
    await expect(banner).toBeHidden();
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('denied');
    await page.reload();
    await expect(page.getByRole('region', { name: 'Cookie consent' })).toHaveCount(0);
  });

  test('Manage opens preferences and Save choices stores the toggle', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Cookie consent' });
    await banner.getByRole('button', { name: 'Manage' }).click();
    const toggle = banner.getByRole('switch', { name: 'Analytics cookies' });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await toggle.click();
    await banner.getByRole('button', { name: 'Save choices' }).click();
    await expect(banner).toBeHidden();
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('granted');
  });

  test('Accept grants storage and carries over to library pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('region', { name: 'Cookie consent' })
      .getByRole('button', { name: 'Accept' }).click();
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
    await expect(banner.locator('.c-t')).toHaveText('We use cookies');
    await banner.locator('.c-n').click();
    await expect(banner).toHaveCount(0);
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('denied');
    await page.reload();
    await expect(page.locator('.pt-consent')).toHaveCount(0);
  });

  for (const path of ['/', '/syllabus/grading-system-sgpa/']) {
    test(`sends nothing to Google before a choice or after Reject, loads it after Accept (${path})`, async ({ page }) => {
      const google: string[] = [];
      page.on('request', (r) => {
        if (/google-analytics\.com|googletagmanager\.com/.test(r.url())) google.push(r.url());
      });

      await page.goto(path, { waitUntil: 'networkidle' });
      const banner = page.getByRole('region', { name: 'Cookie consent' });
      await expect(banner).toBeVisible();
      expect(google).toEqual([]);

      await banner.getByRole('button', { name: 'Reject' }).click();
      await page.reload({ waitUntil: 'networkidle' });
      expect(google).toEqual([]);

      await page.evaluate((k) => localStorage.removeItem(k), KEY);
      await page.reload({ waitUntil: 'networkidle' });
      await page.getByRole('region', { name: 'Cookie consent' }).getByRole('button', { name: 'Accept' }).click();
      await expect.poll(() => google.some((u) => u.includes('googletagmanager.com/gtag/js'))).toBe(true);
    });
  }

  test('after Accept the app sends a GA collect request', async ({ page }) => {
    const collect: string[] = [];
    page.on('request', (r) => { if (/google-analytics\.com\/g\/collect/.test(r.url())) collect.push(r.url()); });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('region', { name: 'Cookie consent' }).getByRole('button', { name: 'Accept' }).click();
    await expect.poll(() => collect.length).toBeGreaterThan(0);
  });
});

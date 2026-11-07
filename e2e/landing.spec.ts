import { test, expect } from '@playwright/test';

test.describe('prerendered landing', () => {
  test('renders hero content with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Know exactly what/i })).toBeVisible();
    await expect(page.getByText('What is PrepTracker?')).toBeVisible();
    await expect(page.locator('.foot-lockup')).toContainText('PrepTracker.');
    await context.close();
  });

  test('ships WebApplication JSON-LD', async ({ page }) => {
    await page.goto('/');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    // JSON.parse throws on a malformed block, failing the test.
    const parsed = blocks.map((text) => JSON.parse(text));
    const apps = parsed.filter((json) => json['@type'] === 'WebApplication');
    expect(apps, 'landing ships exactly one WebApplication JSON-LD block').toHaveLength(1);
    const app = apps[0];
    expect(app['@context']).toBe('https://schema.org');
    expect(app.name).toBeTruthy();
    expect(app.url).toMatch(/^https:\/\//);
    expect(app.applicationCategory).toBeTruthy();
  });

  test('footer links to the privacy page', async ({ page }) => {
    await page.goto('/');
    // Use the banner as a visitor would: rejecting clears it off the footer.
    const banner = page.getByRole('region', { name: 'Cookie consent' });
    if (await banner.isVisible()) await banner.getByRole('button', { name: 'Reject' }).click();
    const link = page.locator('footer a[href="/privacy/"]');
    await expect(link.first()).toBeVisible();
    await link.first().click();
    await expect(page).toHaveURL(/\/privacy\/$/);
    await expect(page.getByRole('heading', { name: 'Privacy', level: 1 })).toBeVisible();
  });
});

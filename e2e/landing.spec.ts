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
    const ld = page.locator('script[type="application/ld+json"]');
    await expect(ld).toHaveCount(1);
    const json = JSON.parse((await ld.textContent()) || '{}');
    expect(json['@type']).toBe('WebApplication');
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

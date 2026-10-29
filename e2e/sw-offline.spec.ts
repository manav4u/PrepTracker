import { test, expect } from '@playwright/test';

// Regression tests for the navigation-cache bug: the service worker used to
// overwrite its single './' cache entry on every successful navigation, so an
// offline revisit after opening /app served the bare app shell for '/', which
// booted into the error boundary instead of the landing.

test.describe('offline navigation', () => {
  test('landing still loads offline after visiting another page', async ({ page, context }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    // Guide pages are real static documents, unlike the SPA shell, so a visit
    // here is what polluted the single './' cache slot. (In production /app/
    // also returns a distinct bare-shell document; vite preview's SPA fallback
    // masks that path locally, so the guide page stands in for both.)
    await page.goto('/syllabus/grading-system-sgpa/');
    await page.waitForTimeout(500);
    await context.setOffline(true);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Know exactly what/i })).toBeVisible();
    await expect(page.getByText(/hit a problem/i)).toHaveCount(0);
  });

  test('a visited guide page loads offline', async ({ page, context }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.goto('/syllabus/grading-system-sgpa/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await context.setOffline(true);
    await page.goto('/syllabus/grading-system-sgpa/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

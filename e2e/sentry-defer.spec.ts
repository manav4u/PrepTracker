import { test, expect } from '@playwright/test';

// Fail-closed Sentry verification. The loader is served with its embedded DSN
// replaced by a test-only fixture on an RFC 2606 .invalid host, so even if
// every intercept were bypassed, envelopes could only go to a nonexistent
// host. Any request to the real ingest host fails the test. No live DSN is
// used anywhere in this spec.

const REAL_KEY = 'c5e41db25dc0f73bfdac78df0f8c403e';
const REAL_HOST = 'o4512298317447168.ingest.us.sentry.io';
const TEST_KEY = '00000000000000000000000000000000';
const TEST_HOST = 'o0.ingest.test.invalid';

async function stubSentryTransport(context: any, envelopes: string[], delayMs = 0) {
  let delayed = false;
  // Serve the real loader code with the DSN swapped to the fixture.
  await context.route('**/js.sentry-cdn.com/**', async (route: any) => {
    const res = await route.fetch();
    const body = (await res.text()).split(REAL_KEY).join(TEST_KEY).split(REAL_HOST).join(TEST_HOST);
    if (delayMs && !delayed) { delayed = true; await new Promise((s) => setTimeout(s, delayMs)); }
    await route.fulfill({ response: res, body });
  });
  // Record envelopes addressed to the fixture host; never forward.
  await context.route(`**/${TEST_HOST}/**`, async (route: any) => {
    envelopes.push(route.request().postData() || '');
    await route.fulfill({ status: 200, body: '{}' });
  });
  // Fail closed: any request to a real Sentry ingest host is a test failure.
  const realIngestHits: string[] = [];
  await context.route('**/*sentry.io/**', async (route: any) => {
    realIngestHits.push(route.request().url());
    await route.abort();
  });
  return realIngestHits;
}

test.describe('sentry loader', () => {
  test('does not block first paint and still initializes', async ({ page, context }) => {
    await stubSentryTransport(context, [], 1500);
    await page.goto('/');
    const fcp = await page.evaluate(() => {
      const paints = performance.getEntriesByType('paint');
      return paints.find((p) => p.name === 'first-contentful-paint')?.startTime ?? Infinity;
    });
    expect(fcp).toBeLessThan(1000);
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    expect(await page.evaluate(() => !!(window as any).Sentry)).toBe(true);
  });

  test('captures errors and rejections end to end with a delayed loader', async ({ page, context }) => {
    const envelopes: string[] = [];
    const realIngestHits = await stubSentryTransport(context, envelopes, 1500);
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);
    await page.addScriptTag({ content: 'setTimeout(() => { throw new Error("pt-e2e-defer-error"); }, 0); Promise.reject(new Error("pt-e2e-defer-rejection"));' });
    await expect.poll(() => envelopes.join('\n').includes('pt-e2e-defer-error'), { timeout: 10000 }).toBe(true);
    await expect.poll(() => envelopes.join('\n').includes('pt-e2e-defer-rejection'), { timeout: 10000 }).toBe(true);
    expect(realIngestHits).toEqual([]);
  });
});

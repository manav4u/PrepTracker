import test from 'node:test';
import assert from 'node:assert/strict';

// Analytics is privacy-critical: nothing may reach Google before the visitor
// accepts on the consent banner. These tests shim the browser globals the
// module touches and drive it through its real consent flows.

function shimBrowser() {
  const store: Record<string, string> = {};
  const appended: Array<Record<string, unknown>> = [];
  (globalThis as any).localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
  };
  (globalThis as any).window = {};
  (globalThis as any).document = {
    createElement: () => ({}),
    head: { appendChild: (el: Record<string, unknown>) => { appended.push(el); } },
  };
  return { store, appended };
}

function dataLayer() {
  return ((globalThis as any).window.dataLayer || []) as unknown[][];
}

async function freshModule() {
  // Cache-bust so each test gets clean module state (the `started` latch).
  return import(`../lib/analytics.ts?case=${Math.random()}`);
}

test('init pushes an all-denied consent default before any choice', async () => {
  const { appended } = shimBrowser();
  const analytics: any = await freshModule();
  analytics.initAnalytics();
  const first = dataLayer()[0] as unknown[];
  assert.equal(first[0], 'consent');
  assert.equal(first[1], 'default');
  assert.deepEqual(first[2], {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  assert.equal(appended.length, 0, 'no gtag script may load before acceptance');
});

test('rejecting updates consent to denied and never loads the script', async () => {
  const { appended } = shimBrowser();
  const analytics: any = await freshModule();
  analytics.initAnalytics();
  analytics.setAnalyticsConsent(false);
  const update = dataLayer().find((a) => a[0] === 'consent' && a[1] === 'update');
  assert.deepEqual(update?.[2], { analytics_storage: 'denied' });
  assert.equal(appended.length, 0);
});

test('accepting updates consent and loads exactly one gtag script', async () => {
  const { appended } = shimBrowser();
  const analytics: any = await freshModule();
  analytics.initAnalytics();
  analytics.setAnalyticsConsent(true);
  analytics.setAnalyticsConsent(true); // repeat acceptance must not double-load
  const update = dataLayer().find((a) => a[0] === 'consent' && a[1] === 'update');
  assert.deepEqual(update?.[2], { analytics_storage: 'granted' });
  assert.equal(appended.length, 1);
  assert.match(String(appended[0].src), /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+$/);
  const config = dataLayer().find((a) => a[0] === 'config');
  assert.ok(config, 'gtag config command pushed after acceptance');
});

test('a stored acceptance from a previous visit starts analytics on init', async () => {
  const { store, appended } = shimBrowser();
  const analytics: any = await freshModule();
  store[analytics.GA_CONSENT_KEY] = 'granted';
  analytics.initAnalytics();
  assert.equal(appended.length, 1);
  const update = dataLayer().find((a) => a[0] === 'consent' && a[1] === 'update');
  assert.deepEqual(update?.[2], { analytics_storage: 'granted' });
});

test('consent reader rejects garbage and blocked storage', async () => {
  const { store } = shimBrowser();
  const analytics: any = await freshModule();
  assert.equal(analytics.readAnalyticsConsent(), null);
  store[analytics.GA_CONSENT_KEY] = 'yes';
  assert.equal(analytics.readAnalyticsConsent(), null);
  store[analytics.GA_CONSENT_KEY] = 'denied';
  assert.equal(analytics.readAnalyticsConsent(), 'denied');
  (globalThis as any).localStorage = { getItem: () => { throw new Error('blocked'); } };
  assert.equal(analytics.readAnalyticsConsent(), null);
});

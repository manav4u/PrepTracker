#!/usr/bin/env node
// seo-check.mjs - live SEO sanity checks for the deployed site.
//
// Why this exists (grounded in real incidents):
// - Oct 2026: Google excluded the homepage as "Duplicate, Google chose
//   different canonical than user" (it picked the github.io origin). A
//   canonical check on every sitemap URL catches that class of problem.
// - The SPA fallback once served unknown paths with HTTP 200 (soft 404);
//   production must answer a real 404 with a noindex shell.
//
// Usage: node scripts/seo-check.mjs [base-url]
//   base-url defaults to https://preptracker.manavdev.site - pass a preview
//   URL to check a deploy before it ships.
// Exit code 1 if any check fails.

const BASE = (process.argv[2] || 'https://preptracker.manavdev.site').replace(/\/+$/, '');
const CONCURRENCY = 6;

const failures = [];
const notes = [];

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'preptracker-seo-check/1.0' } });
  const text = await res.text();
  return { status: res.status, finalUrl: res.url, text, redirected: res.redirected };
}

function check(name, ok, detail) {
  if (!ok) failures.push(`${name}: ${detail}`);
  return ok;
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }));
  return results;
}

function urlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

function canonicalOf(html) {
  const matches = [...html.matchAll(/<link[^>]*rel=["']canonical["'][^>]*>/gi)];
  if (matches.length !== 1) return { count: matches.length, href: null };
  const tag = matches[0][0];
  const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1] || null;
  return { count: 1, href };
}

function hasNoindex(html) {
  return /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}

async function main() {
  console.log(`seo-check: base ${BASE}`);

  // 1. Sitemap itself
  const sm = await fetchText(`${BASE}/sitemap.xml`);
  check('sitemap', sm.status === 200, `sitemap.xml returned HTTP ${sm.status}`);
  const urls = urlsFromSitemap(sm.text);
  check('sitemap', urls.length > 0, 'no <loc> entries found');
  console.log(`seo-check: ${urls.length} sitemap URLs`);

  // 2. Every sitemap URL: 200, single self-canonical, indexable
  await mapLimit(urls, CONCURRENCY, async (url) => {
    const path = new URL(url).pathname;
    let r;
    try {
      r = await fetchText(url);
    } catch (e) {
      failures.push(`${path}: fetch failed (${e.message})`);
      return;
    }
    check(path, r.status === 200, `HTTP ${r.status}`);
    if (r.redirected) notes.push(`${path}: redirected -> ${r.finalUrl}`);
    const c = canonicalOf(r.text);
    check(path, c.count === 1, `${c.count} canonical tags (want exactly 1)`);
    if (c.count === 1) {
      check(path, c.href === url, `canonical ${c.href} != sitemap URL ${url}`);
    }
    check(path, !hasNoindex(r.text), 'sitemap URL carries noindex');
  });

  // 3. Private app routes: served but noindexed (deliberate design)
  for (const path of ['/app/', '/app/settings/', '/onboarding/']) {
    const r = await fetchText(`${BASE}${path}`);
    check(path, r.status === 200, `HTTP ${r.status}`);
    check(path, hasNoindex(r.text), 'app route missing its deliberate noindex');
  }

  // 4. Unknown paths: real 404 with a noindex shell (never a soft 404)
  const missing = await fetchText(`${BASE}/syllabus/__seo-check-missing__/`);
  check('unknown-path', missing.status === 404, `unknown path returned HTTP ${missing.status} (soft 404 risk)`);
  check('unknown-path', hasNoindex(missing.text), '404 fallback missing noindex');

  for (const n of notes) console.log(`  note: ${n}`);
  if (failures.length) {
    console.error(`\nseo-check: FAIL (${failures.length})`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log('seo-check: PASS');
}

main().catch(e => { console.error(`seo-check: fatal ${e.message}`); process.exit(1); });

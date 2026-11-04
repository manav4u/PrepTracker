import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Guards the static sitemap against the two failures that hurt crawling:
// a prerendered syllabus page that never gets listed (invisible to Google)
// and a stale entry that keeps pointing crawlers at a removed page (404s in
// Search Console). The expected URL set is derived from the exact sources
// scripts/prerender.mjs renders from, so adding or removing a page without
// updating public/sitemap.xml fails here.

const SITE = 'https://preptracker.manavdev.site';
const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');

// Same slug rule as scripts/sePage.tsx coursePath.
const slugify = (n: string) => n.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const subjectSlugs = readdirSync(new URL('../scripts/pages/', import.meta.url))
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .map(f => readFileSync(new URL(`../scripts/pages/${f}`, import.meta.url), 'utf8').match(/slug: '([^']+)'/)![1]);

const infoSlugs = [...readFileSync(new URL('../scripts/infoPages.tsx', import.meta.url), 'utf8')
  .matchAll(/^    slug: '([^']+)'/gm)].map(m => m[1]);

const seSource = readFileSync(new URL('../scripts/seBranches.ts', import.meta.url), 'utf8');
const dataFiles = Object.fromEntries(
  [...seSource.matchAll(/import (\w+) from '\.\/seData\/([\w-]+)\.json'/g)].map(m => [m[1], m[2]]),
);
const branches = [...seSource.matchAll(/slug: '([^']+)', branch: '[^']*'[^]*?courses: (\w+) as SeBranch\['courses'\]/g)]
  .map(m => ({ slug: m[1], courses: JSON.parse(readFileSync(new URL(`../scripts/seData/${dataFiles[m[2]]}.json`, import.meta.url), 'utf8')) as { name: string }[] }));

const expectedUrls = new Set<string>(['/', '/syllabus/']);
for (const s of subjectSlugs) expectedUrls.add(`/syllabus/${s}/`);
for (const s of infoSlugs) expectedUrls.add(`/syllabus/${s}/`);
for (const b of branches) {
  expectedUrls.add(`/syllabus/${b.slug}/`);
  for (const c of b.courses) expectedUrls.add(`/syllabus/${b.slug}/${slugify(c.name)}/`);
}
// /privacy/ is prerendered and linked from every page footer, but deliberately
// not listed: a policy page is not a search landing page.

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const paths = locs.map(u => u.slice(SITE.length));

test('sitemap lists the homepage first and every URL on the canonical origin', () => {
  assert.ok(locs.length > 0, 'sitemap has no URLs');
  assert.equal(locs[0], SITE + '/', 'homepage must be the first entry');
  for (const u of locs) {
    assert.ok(u.startsWith(SITE + '/') || u === SITE + '/', `off-origin or insecure URL: ${u}`);
    assert.ok(u.endsWith('/'), `URL must use the canonical trailing-slash form: ${u}`);
  }
});

test('every prerendered page is listed exactly once, with no stale entries', () => {
  const listed = new Set(paths);
  assert.equal(listed.size, paths.length, 'sitemap contains duplicate URLs');
  const missing = [...expectedUrls].filter(u => !listed.has(u));
  const stale = paths.filter(u => !expectedUrls.has(u));
  assert.deepEqual(missing, [], 'prerendered pages missing from the sitemap');
  assert.deepEqual(stale, [], 'sitemap entries with no rendered page');
});

test('sitemap is structurally well-formed with sane metadata', () => {
  assert.equal((sitemap.match(/<urlset[ >]/g) || []).length, 1, 'exactly one urlset');
  assert.equal((sitemap.match(/<url>/g) || []).length, locs.length, 'one url block per loc');
  const changefreqs = [...sitemap.matchAll(/<changefreq>([^<]+)<\/changefreq>/g)].map(m => m[1]);
  for (const c of changefreqs) {
    assert.ok(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].includes(c), `invalid changefreq: ${c}`);
  }
  const today = new Date().toISOString().slice(0, 10);
  // lastmod is optional per the sitemap protocol; the TE branch sections
  // currently omit it. Any lastmod that is present must be trustworthy.
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
  assert.ok(lastmods.length > 0, 'at least some entries carry a lastmod');
  for (const d of lastmods) {
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(d), `lastmod must be YYYY-MM-DD: ${d}`);
    assert.equal(new Date(d).toISOString().slice(0, 10), d, `lastmod must be a real calendar date: ${d}`);
    assert.ok(d <= today, `lastmod must not be in the future: ${d}`);
  }
  const home = sitemap.slice(sitemap.indexOf('<url>'), sitemap.indexOf('</url>'));
  assert.ok(home.includes('<priority>1.0</priority>'), 'homepage keeps priority 1.0');
});

test('robots.txt points crawlers at the sitemap', () => {
  const lines = robots.split('\n').map(l => l.trim()).filter(l => l.toLowerCase().startsWith('sitemap:'));
  assert.deepEqual(lines, [`Sitemap: ${SITE}/sitemap.xml`], 'robots.txt must reference exactly the production sitemap');
});

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// axe-core has no Playwright dependency here: inject the bundle directly so
// the same scan runs against the built site in CI.
const axeSource = fs.readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../node_modules/axe-core/axe.min.js'), 'utf8');

const PAGES = ['/', '/privacy/', '/syllabus/', '/syllabus/se-cyber-security/'];

for (const url of PAGES) {
  test(`no axe violations on ${url}`, async ({ page }) => {
    await page.goto(url);
    await page.addScriptTag({ content: axeSource });
    const results = await page.evaluate(async () => await (window as any).axe.run(document, { resultTypes: ['violations'] }));
    const violations = results.violations.map((v: any) => `${v.id} (${v.impact}): ${v.nodes.length} nodes`);
    expect(violations).toEqual([]);
  });
}

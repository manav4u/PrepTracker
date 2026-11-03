import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const script = resolve('scripts/postbuild.mjs');
const routes = ['app', 'onboarding', 'library', 'app/resources', 'app/tasks', 'app/revise', 'app/settings'];

// Run the real build step in an isolated output tree, never against dist/.
function fixture(run: (root: string, build: () => void) => void) {
  const root = mkdtempSync(join(tmpdir(), 'preptracker-postbuild-'));
  try {
    mkdirSync(join(root, 'dist'));
    writeFileSync(join(root, 'dist/index.html'), '<!doctype html><html><head><title>Fixture</title></head><body><div id="root"></div></body></html>');
    run(root, () => { execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' }); });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('postbuild materializes every static app route as a noindex shell', () => {
  fixture((root, build) => {
    build();
    for (const route of routes) {
      const html = readFileSync(join(root, 'dist', route, 'index.html'), 'utf8');
      assert.match(html, /<div id="root"><\/div>/, `${route}: app mount must survive`);
      assert.match(html, /<meta name="robots" content="noindex">/, `${route}: private app shell must stay noindexed`);
    }
    assert.match(readFileSync(join(root, 'dist/404.html'), 'utf8'), /<meta name="robots" content="noindex">/);
    assert.doesNotMatch(readFileSync(join(root, 'dist/index.html'), 'utf8'), /noindex/, 'the landing input must not inherit app noindex');
  });
});

test('postbuild is repeatable and preserves the original landing HTML', () => {
  fixture((root, build) => {
    const landing = readFileSync(join(root, 'dist/index.html'), 'utf8');
    build();
    const first = readFileSync(join(root, 'dist/app/index.html'), 'utf8');
    build();
    assert.equal(readFileSync(join(root, 'dist/app/index.html'), 'utf8'), first);
    assert.equal((first.match(/name="robots"/g) || []).length, 1);
    assert.equal(readFileSync(join(root, 'dist/404.html'), 'utf8'), first);
    assert.equal(readFileSync(join(root, 'dist/index.html'), 'utf8'), landing);
  });
});

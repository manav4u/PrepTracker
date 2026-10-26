// SPA hosting on GitHub Pages: /app must be a real file (200) and deeper
// app paths fall back to 404.html, which Pages serves for unknown URLs.
// The app shell and the 404 fallback are noindexed: only the landing and
// the prerendered syllabus pages belong in search results.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
mkdirSync('dist/app', { recursive: true });
copyFileSync('dist/index.html', 'dist/app/index.html');
copyFileSync('dist/index.html', 'dist/404.html');
const NOINDEX = '<meta name="robots" content="noindex">';
for (const file of ['dist/app/index.html', 'dist/404.html']) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('name="robots"')) {
    writeFileSync(file, html.replace('</head>', `  ${NOINDEX}\n</head>`));
  }
}
// Real client routes must exist as real files so GitHub Pages serves them
// with a 200, not a 404 status on the shell. Anything else still falls back
// to the noindex 404.html. /app/subject/:id is user-data-driven, so it stays
// on the fallback (renders fine in the browser; noindexed by design).
const SHELL_ROUTES = ['onboarding', 'library', 'app/resources', 'app/tasks', 'app/revise', 'app/settings', 'guide', 'guide/get-started', 'guide/home', 'guide/syllabus', 'guide/daily-plan', 'guide/review', 'guide/tasks', 'guide/library', 'guide/search-updates', 'guide/settings', 'guide/backup-restore', 'guide/offline-privacy'];
for (const route of SHELL_ROUTES) {
  mkdirSync(`dist/${route}`, { recursive: true });
  copyFileSync('dist/app/index.html', `dist/${route}/index.html`);
}
console.log('postbuild: copied index.html to app/index.html and 404.html (noindex on both)');
console.log(`postbuild: materialized ${SHELL_ROUTES.length} client routes with 200 status (noindex shell)`);

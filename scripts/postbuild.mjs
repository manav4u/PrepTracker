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
console.log('postbuild: copied index.html to app/index.html and 404.html (noindex on both)');

// SPA hosting on GitHub Pages: /app must be a real file (200) and deeper
// app paths fall back to 404.html, which Pages serves for unknown URLs.
import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('dist/app', { recursive: true });
copyFileSync('dist/index.html', 'dist/app/index.html');
copyFileSync('dist/index.html', 'dist/404.html');
console.log('postbuild: copied index.html to app/index.html and 404.html');

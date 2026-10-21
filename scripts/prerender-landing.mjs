// Prerenders the landing page ("/") into dist/index.html so first paint and
// crawlers get real content instead of a bare JS shell. The client hydrates
// the markup (see index.tsx). Runs after postbuild so /app and 404.html keep
// the empty shell they need.
import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const outDir = path.resolve('.prerender-landing-tmp');
await build({
  logLevel: 'error',
  build: {
    ssr: path.resolve('scripts/prerenderLanding.tsx'),
    outDir,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'prerender-landing.mjs', format: 'es' } },
  },
  ssr: {
    noExternal: [
      'react-router-dom', 'react-router', 'framer-motion', 'motion-dom', 'motion-utils',
      'lucide-react', 'gsap', '@gsap/react', 'lenis',
    ],
  },
});
try {
  const mod = await import(pathToFileURL(path.join(outDir, 'prerender-landing.mjs')).href);
  const html = mod.renderLanding();
  if (!html || html.length < 1000) throw new Error(`landing prerender suspiciously small (${html.length} bytes)`);

  const indexPath = path.resolve('dist/index.html');
  let index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('<div id="root"></div>')) throw new Error('dist/index.html has no empty #root to fill');

  // The landing stylesheet normally loads with the lazy LandingPage chunk;
  // inline it so the prerendered page is styled before (and without) JS.
  const cssName = fs.readdirSync('dist/assets').find((f) => f.startsWith('LandingPage') && f.endsWith('.css'));
  if (!cssName) throw new Error('landing CSS chunk not found in dist/assets');
  const css = fs.readFileSync(path.join('dist/assets', cssName), 'utf8');
  index = index.replace('</head>', `<style data-prerender="landing">${css}</style></head>`);

  index = index.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  fs.writeFileSync(indexPath, index);
  console.log(`prerendered landing into dist/index.html (${html.length} bytes of markup, inlined ${cssName})`);
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}

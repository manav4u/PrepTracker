import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Bundle the landing page for Node, render it to a string, and inject it into dist/index.html.
const outDir = path.resolve('.prerender-tmp');
await build({
  logLevel: 'error',
  build: { ssr: path.resolve('scripts/prerender.tsx'), outDir, emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'prerender.mjs', format: 'es' } } },
  ssr: { noExternal: ['react-router-dom', 'react-router', 'framer-motion', 'motion-dom', 'motion-utils', 'lucide-react'] },
});
try {
  const mod = await import(pathToFileURL(path.join(outDir, 'prerender.mjs')).href);
  const html = mod.renderLanding();
  const file = path.resolve('dist/index.html');
  const page = fs.readFileSync(file, 'utf8');
  if (!page.includes('<div id="root"></div>')) throw new Error('empty #root marker not found in dist/index.html');
  fs.writeFileSync(file, page.replace('<div id="root"></div>', `<div id="root">${html}</div>`));
  for (const c of mod.SUBJECT_PAGES) {
    const sub = path.resolve('dist/syllabus/' + c.slug + '/');
    fs.mkdirSync(sub, { recursive: true });
    fs.writeFileSync(path.join(sub, 'index.html'), mod.renderSubjectPage(c));
  }
  for (const c of mod.INFO_PAGES) {
    const sub = path.resolve('dist/syllabus/' + c.slug + '/');
    fs.mkdirSync(sub, { recursive: true });
    fs.writeFileSync(path.join(sub, 'index.html'), mod.renderInfoPage(c));
  }
  for (const b of mod.SE_BRANCHES) {
    const bd = path.resolve('dist/syllabus/' + b.slug + '/');
    fs.mkdirSync(bd, { recursive: true });
    fs.writeFileSync(path.join(bd, 'index.html'), mod.renderSeBranch(b));
    for (const c of b.courses) {
      const cd = path.resolve('dist' + mod.coursePath(b, c));
      fs.mkdirSync(cd, { recursive: true });
      fs.writeFileSync(path.join(cd, 'index.html'), mod.renderSeCourse(b, c));
    }
  }
  console.log(`prerendered landing page (${html.length} bytes)`);
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}

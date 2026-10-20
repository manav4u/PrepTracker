import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Prerenders the static syllabus library into dist/syllabus/<slug>/index.html so
// crawlers get real content and the pre-revamp /syllabus/* URLs keep working.
// The revamp landing is a client-rendered SPA and is intentionally untouched.

// Static pages are separate HTML documents, so they need their own gtag snippet.
// Production builds (GitHub Pages) get the shared production property; preview
// builds (Vercel) override it via VITE_GA_MEASUREMENT_ID.
const GA_ID = process.env.VITE_GA_MEASUREMENT_ID || 'G-PWDXVCDCP8';
const GA_SNIPPET = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');</script>`;
const GA_NOTE = '<p style="font-size:12px;opacity:.7">Anonymous visit stats via Google Analytics.</p>';

const outDir = path.resolve('.prerender-tmp');
await build({
  logLevel: 'error',
  build: { ssr: path.resolve('scripts/prerender.tsx'), outDir, emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'prerender.mjs', format: 'es' } } },
  ssr: { noExternal: ['react-router-dom', 'react-router', 'framer-motion', 'motion-dom', 'motion-utils', 'lucide-react'] },
});
try {
  const mod = await import(pathToFileURL(path.join(outDir, 'prerender.mjs')).href);
  let pages = 0;
  for (const c of mod.SUBJECT_PAGES) {
    const sub = path.resolve('dist/syllabus/' + c.slug + '/');
    fs.mkdirSync(sub, { recursive: true });
    fs.writeFileSync(path.join(sub, 'index.html'), mod.renderSubjectPage(c));
    pages++;
  }
  for (const c of mod.INFO_PAGES) {
    const sub = path.resolve('dist/syllabus/' + c.slug + '/');
    fs.mkdirSync(sub, { recursive: true });
    fs.writeFileSync(path.join(sub, 'index.html'), mod.renderInfoPage(c));
    pages++;
  }
  for (const b of mod.SE_BRANCHES) {
    const bd = path.resolve('dist/syllabus/' + b.slug + '/');
    fs.mkdirSync(bd, { recursive: true });
    fs.writeFileSync(path.join(bd, 'index.html'), mod.renderSeBranch(b));
    pages++;
    for (const c of b.courses) {
      const cd = path.resolve('dist' + mod.coursePath(b, c));
      fs.mkdirSync(cd, { recursive: true });
      fs.writeFileSync(path.join(cd, 'index.html'), mod.renderSeCourse(b, c));
      pages++;
    }
  }
  const catalog = JSON.parse(fs.readFileSync('catalog/courses.json','utf8'));
  for(const c of catalog.courses){
    const file=path.resolve('dist'+c.path+'index.html');
    if(fs.existsSync(file)){
      const link=c.trackerReady ? `<p><a class="cta" href="/#/add/${encodeURIComponent(c.id)}">Add to my plan</a></p>` : '<p>Reference only. Tracking metadata for this branch is not yet reviewed.</p>';
      fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('</main>',link+'<p><a href="/#/directory">Browse all syllabus courses</a></p></main>'));
    }
  }
  for (const file of sourceFiles(path.resolve('dist/syllabus'))) {
    let page=fs.readFileSync(file,'utf8');
    page=page
      .replace('</head>', `<style>${mod.readingCss}</style>${GA_SNIPPET}</head>`)
      .replace('<body>', '<body>'+mod.readingChrome)
      .replace('</footer>', GA_NOTE+'</footer>')
      .replace('</body>', `<script>${mod.readingScript}</script></body>`);
    fs.writeFileSync(file,page);
  }
  console.log(`prerendered ${pages} library pages (GA ${GA_ID})`);
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}

function sourceFiles(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?sourceFiles(path.join(dir,d.name)):d.name==='index.html'?[path.join(dir,d.name)]:[]);}

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
// Consent Mode v2: Google's script is requested only after the visitor accepts
// on the banner, and storage stays denied until then
// (choice shared with the app via the pt_ga_consent key).
const SENTRY_SNIPPET = '<script src="https://js.sentry-cdn.com/c5e41db25dc0f73bfdac78df0f8c403e.min.js" crossorigin="anonymous"></script>';
const GA_SNIPPET = `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});var ptGaStarted=false;window.ptStartAnalytics=function(){if(ptGaStarted)return;ptGaStarted=true;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);gtag('js',new Date());gtag('config','${GA_ID}')};try{if(localStorage.getItem('pt_ga_consent')==='granted'){gtag('consent','update',{analytics_storage:'granted'});window.ptStartAnalytics()}}catch(e){}</script>`;
const GA_NOTE = '<p style="font-size:12px;color:rgba(20,20,25,.62)"><a href="/privacy/" style="color:inherit">Privacy</a></p>';

const SITE = 'https://preptracker.manavdev.site';
const outDir = path.resolve('.prerender-tmp');
await build({
  logLevel: 'error',
  build: { ssr: path.resolve('scripts/prerender.tsx'), outDir, emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'prerender.mjs', format: 'es' } } },
  ssr: { noExternal: ['react-router-dom', 'react-router', 'framer-motion', 'motion-dom', 'motion-utils', 'lucide-react'] },
});
try {
  const mod = await import(pathToFileURL(path.join(outDir, 'prerender.mjs')).href);
  let pages = 0;
  // llms.txt index entries, collected as pages are written.
  const llms = { pages: [['PrepTracker home', SITE + '/index.md'], ['SPPU syllabus library', SITE + '/syllabus/index.md']], guides: [], fe: [], branches: [] };
  const writePage = (dir, html, mirror, pageUrl) => {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    // Markdown mirror from this same freshly rendered page, before any
    // analytics/consent script injection below: script-free by construction.
    if (mirror) fs.writeFileSync(path.join(dir, 'index.md'), mod.htmlToMarkdown(html, pageUrl));
  };
  // Draft branches keep their current HTML/sitemap/robots state exactly as it
  // is, but get no markdown mirrors and no llms.txt entries while they are
  // drafts: drafts are never exposed as markdown. Their mirror paths are the
  // explicit skip reason in the coverage assertion below.
  const draftMirrors = new Set();
  for (const c of mod.SUBJECT_PAGES) {
    writePage(path.resolve('dist/syllabus/' + c.slug + '/'), mod.renderSubjectPage(c), true, SITE + '/syllabus/' + c.slug + '/');
    llms.fe.push([c.ogTitle, SITE + '/syllabus/' + c.slug + '/index.md']);
    pages++;
  }
  for (const c of mod.INFO_PAGES) {
    writePage(path.resolve('dist/syllabus/' + c.slug + '/'), mod.renderInfoPage(c), true, SITE + '/syllabus/' + c.slug + '/');
    llms.guides.push([c.crumb, SITE + '/syllabus/' + c.slug + '/index.md']);
    pages++;
  }
  for (const b of mod.SE_BRANCHES) {
    writePage(path.resolve('dist/syllabus/' + b.slug + '/'), mod.renderSeBranch(b), !b.draft, SITE + '/syllabus/' + b.slug + '/');
    if (b.draft) draftMirrors.add(path.resolve('dist/syllabus/' + b.slug + '/index.md'));
    const label = (b.year === 'TE' ? 'TE ' : 'SE ') + b.branch + (b.draft ? ' (draft)' : '');
    const entry = { label, hub: SITE + '/syllabus/' + b.slug + '/index.md', courses: [] };
    if (!b.draft) llms.branches.push(entry);
    pages++;
    for (const c of b.courses) {
      writePage(path.resolve('dist' + mod.coursePath(b, c)), mod.renderSeCourse(b, c), !b.draft, SITE + mod.coursePath(b, c));
      if (b.draft) draftMirrors.add(path.resolve('dist' + mod.coursePath(b, c) + 'index.md'));
      else entry.courses.push([c.name + ' (' + c.code + ')', SITE + mod.coursePath(b, c) + 'index.md']);
      pages++;
    }
  }
  fs.mkdirSync(path.resolve('dist/syllabus'), { recursive: true });
  writePage(path.resolve('dist/syllabus/'), mod.renderSyllabusHub(mod.SUBJECT_PAGES, mod.INFO_PAGES, mod.SE_BRANCHES), true, SITE + '/syllabus/');
  pages++;
  writePage(path.resolve('dist/privacy/'), mod.renderPrivacyPage(), true, SITE + '/privacy/');
  llms.pages.push(['Privacy policy', SITE + '/privacy/index.md']);
  pages++;
  const catalog = JSON.parse(fs.readFileSync('catalog/courses.json','utf8'));
  for(const c of catalog.courses){
    const file=path.resolve('dist'+c.path+'index.html');
    if(fs.existsSync(file)){
      const link=c.trackerReady ? `<p><a class="cta" href="/#/add/${encodeURIComponent(c.id)}">Add to my plan</a></p>` : '<p>Reference only. Tracking metadata for this branch is not yet reviewed.</p>';
      fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('</main>',link+'<p><a href="/#/directory">Browse all syllabus courses</a></p></main>'));
    }
  }
  for (const root of ['dist/syllabus', 'dist/privacy']) {
    for (const file of sourceFiles(path.resolve(root))) {
      let page=fs.readFileSync(file,'utf8');
      page=page
        .replace('</head>', `<style>${mod.readingCss}${mod.consentCss}</style>${GA_SNIPPET}</head>`)
        .replace('<body>', '<body>'+mod.readingChrome)
        .replace('</footer>', GA_NOTE+'</footer>')
        .replace('</head>', SENTRY_SNIPPET + '</head>')
        .replace('</body>', `<script>${mod.readingScript};${mod.consentScript}</script></body>`);
      fs.writeFileSync(file,page);
    }
  }
  // llms.txt: a plain-text index of every markdown mirror, per the llmstxt.org
  // proposal. Deliberately not linked from page heads or the sitemap.
  const lines = [
    '# PrepTracker',
    '',
    '> PrepTracker is a free, no-account study planner for SPPU engineering students. This file indexes a plain-text markdown mirror of the site\'s public pages. The mirrors carry the same text as the HTML pages, with no scripts, tracking or app chrome. Draft branches still in review are not mirrored.',
    '',
    '## Pages',
    ...llms.pages.map(([t, u]) => `- [${t}](${u})`),
    '',
    '## Scheme, grading and exam pattern guides',
    ...llms.guides.map(([t, u]) => `- [${t}](${u})`),
    '',
    '## First Year subjects',
    ...llms.fe.map(([t, u]) => `- [${t}](${u})`),
    '',
    '## Second and Third Year branches',
  ];
  for (const b of llms.branches) {
    lines.push('', `### ${b.label}`, `- [${b.label} syllabus](${b.hub})`, ...b.courses.map(([t, u]) => `- [${t}](${u})`));
  }
  lines.push('');
  fs.writeFileSync(path.resolve('dist/llms.txt'), lines.join('\n'));

  // Coverage assertion: every indexable static page must have a markdown
  // mirror, and no noindex shell or draft page may have one. The noindex meta
  // on the shells (app, onboarding, client routes, 404 fallback) and the
  // draft flag in the branch data are the two explicit skip reasons, so a new
  // public page without a mirror fails this build.
  let mirrored = 0, noindexSkipped = 0, draftSkipped = 0;
  const crawl = [...sourceFiles(path.resolve('dist')), path.resolve('dist/404.html')];
  for (const file of crawl) {
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const mirror = file.replace(/index\.html$/, 'index.md').replace(/404\.html$/, '404.md');
    if (html.includes('content="noindex"')) {
      if (fs.existsSync(mirror)) throw new Error('noindex shell must not have a markdown mirror: ' + mirror);
      noindexSkipped++;
      continue;
    }
    if (draftMirrors.has(mirror)) {
      if (fs.existsSync(mirror)) throw new Error('draft page must not have a markdown mirror: ' + mirror);
      draftSkipped++;
      continue;
    }
    if (!fs.existsSync(mirror)) throw new Error('missing markdown mirror for ' + file);
    mirrored++;
  }
  // Representative mirror-vs-HTML semantic regression checks. The coverage
  // assertion above guards WHICH pages have mirrors; these spot-check WHAT
  // representative mirrors kept: key syllabus facts, rectangular tables,
  // working links (no fragment-only hrefs), and the draft exclusion.
  const checkMirror = (label, file, mustInclude) => {
    const md = fs.readFileSync(file, 'utf8');
    for (const needle of mustInclude) {
      if (!md.includes(needle)) throw new Error(`mirror for ${label} lost expected content: "${needle}"`);
    }
    if (/\]\(#/.test(md)) throw new Error(`mirror for ${label} has a fragment-only link with no target in markdown`);
    const rows = md.split('\n').filter((l) => l.startsWith('| '));
    const widths = new Set(rows.map((r) => r.split('|').length));
    if (widths.size > 1) throw new Error(`mirror for ${label} has a non-rectangular table`);
  };
  const ds = mod.SE_BRANCHES.find((b) => b.slug === 'se-computer-engineering').courses.find((c) => c.code === 'PCC-201-COM');
  const dsPath = 'dist' + mod.coursePath(mod.SE_BRANCHES.find((b) => b.slug === 'se-computer-engineering'), ds) + 'index.md';
  checkMirror('SE course data-structures', path.resolve(dsPath), [
    '# ' + ds.name + ' syllabus', ds.code, 'collegecirculars.unipune.ac.in',
    '**How many units are in ' + ds.name + '?**', '| CCE', '| End-semester exam | 60 |',
  ]);
  const m1 = mod.SUBJECT_PAGES.find((c) => c.slug === 'engineering-mathematics-1');
  checkMirror('FE subject engineering-mathematics-1', path.resolve('dist/syllabus/engineering-mathematics-1/index.md'), [
    '# Engineering Mathematics-I syllabus', 'BSC-101-BES', '| Theory: CCE | 40 |', '**How are the marks split?**',
  ]);
  checkMirror('syllabus hub', path.resolve('dist/syllabus/index.md'), [
    '# SPPU syllabus library', '](https://preptracker.manavdev.site/syllabus/se-computer-engineering/)',
  ]);
  checkMirror('privacy', path.resolve('dist/privacy/index.md'), ['# Privacy policy', 'local storage']);
  const llmsText = fs.readFileSync(path.resolve('dist/llms.txt'), 'utf8');
  for (const b of mod.SE_BRANCHES) {
    if (b.draft && llmsText.includes('/syllabus/' + b.slug + '/')) {
      throw new Error('draft branch leaked into llms.txt: ' + b.slug);
    }
  }
  console.log(`prerendered ${pages} library pages (GA ${GA_ID})`);
  console.log(`markdown mirrors: ${mirrored} covered, ${noindexSkipped} noindex shells excluded, ${draftSkipped} draft pages excluded, llms.txt written`);
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}

function sourceFiles(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?sourceFiles(path.join(dir,d.name)):d.name==='index.html'?[path.join(dir,d.name)]:[]);}

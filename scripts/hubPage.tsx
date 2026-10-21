import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { css, SITE } from './syllabusPage';
import type { SubjectPageConfig } from './syllabusPage';
import type { InfoPage } from './infoPages';
import type { SeBranch } from './sePage';
import { SUBJECTS } from '../constants';

// Static hub for /syllabus/. The library pages live one level down and link to
// each other, but the hub itself had no page and served the SPA 404 shell.
// Same render pipeline and design system as the other library pages.

export function renderSyllabusHub(subjects: SubjectPageConfig[], infos: InfoPage[], branches: SeBranch[]): string {
  const path = '/syllabus/';
  const fe = subjects.map(s => {
    const app = SUBJECTS.find(a => a.id === s.id);
    return { slug: s.slug, name: app?.name ?? s.ogTitle, note: 'FE 2024 pattern' };
  });
  const se = branches.filter(b => b.year !== 'TE');
  const te = branches.filter(b => b.year === 'TE');
  const courseCount = branches.reduce((a, b) => a + b.courses.length, 0);
  const totalPages = fe.length + infos.length + branches.length + courseCount;
  const sectionCount = fe.length + infos.length + branches.length;
  const title = 'SPPU Syllabus Library: FE, SE and TE Subject-wise Units and Marks - PrepTracker';
  const desc = `Every SPPU syllabus page on PrepTracker: First Year subjects, Second and Third Year branch-wise theory courses with units, hours, marks, outcomes and books, plus scheme, grading and exam-pattern guides. ${totalPages} pages from official SPPU PDFs.`;
  const link = (href: string, name: string, note: string) => <a key={href} href={SITE + href}><span>{name}</span><small>{note}</small></a>;
  const page = (
    <html lang="en"><head>
      <meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title><meta name="description" content={desc} />
      <link rel="canonical" href={SITE + path} /><meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="theme-color" content="#F7F5F2" /><link rel="icon" type="image/svg+xml" href={SITE + '/logo.svg'} />
      <meta property="og:type" content="website" /><meta property="og:site_name" content="PrepTracker" />
      <meta property="og:title" content={title} /><meta property="og:description" content={desc} /><meta property="og:url" content={SITE + path} />
      <meta property="og:image" content={SITE + '/assets/ProjectPrepTracker.png'} /><meta name="twitter:card" content="summary_large_image" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <link href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PrepTracker', item: SITE + '/' },
          { '@type': 'ListItem', position: 2, name: 'Syllabus', item: SITE + path }] },
        { '@type': 'ItemList', numberOfItems: sectionCount, itemListElement: [
          ...fe.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: SITE + '/syllabus/' + s.slug + '/' })),
          ...branches.map((b, i) => ({ '@type': 'ListItem', position: fe.length + i + 1, name: (b.year === 'TE' ? 'TE ' : 'SE ') + b.branch, url: SITE + '/syllabus/' + b.slug + '/' })),
          ...infos.map((c, i) => ({ '@type': 'ListItem', position: fe.length + branches.length + i + 1, name: c.crumb, url: SITE + '/syllabus/' + c.slug + '/' })),
        ] }] }) }} />
    </head><body><main>
      <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / Syllabus</nav>
      <h1>SPPU syllabus library</h1>
      <p className="lead">Every syllabus page on PrepTracker, for SPPU First, Second and Third Year. Pick a subject or branch for unit-wise theory courses with marks, outcomes and books, copied from the official SPPU PDFs.</p>
      <div className="chips"><span className="chip">FE 2024 pattern</span><span className="chip">SE 2024 pattern</span><span className="chip">TE latest published</span></div>
      <div className="stats">
        <div className="stat"><b>{totalPages}</b><span>library pages</span></div>
        <div className="stat"><b>{String(sectionCount).padStart(2, '0')}<i>.</i></b><span>subjects and branches</span></div>
        <div className="stat"><b>{String(courseCount).padStart(2, '0')}<i>.</i></b><span>SE + TE theory courses</span></div>
      </div>
      <h2>First Year Engineering</h2>
      <div className="crs">{fe.map(s => link('/syllabus/' + s.slug + '/', s.name, s.note))}</div>
      <h2>Second Year branches</h2>
      <div className="crs">{se.map(b => link('/syllabus/' + b.slug + '/', b.branch, b.courses.length + ' theory courses' + (b.draft ? ' · draft' : '')))}</div>
      <h2>Third Year branches</h2>
      <div className="crs">{te.map(b => link('/syllabus/' + b.slug + '/', b.branch, b.courses.length + ' theory courses'))}</div>
      <h2>Scheme, grading and exam pattern</h2>
      <div className="crs">{infos.map(c => link('/syllabus/' + c.slug + '/', c.crumb, 'Guide'))}</div>
      <footer>
        <p>Sources: the official SPPU syllabus PDF linked from each subject and branch page. PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.</p>
        <p><a href={SITE + '/'}>PrepTracker home</a> · <a href={SITE + '/syllabus/grading-system-sgpa/'}>Grading and SGPA</a> · <a href={SITE + '/syllabus/first-year-scheme-credits/'}>FE scheme and credits</a> · <a href={SITE + '/privacy/'}>Privacy</a></p>
      </footer>
    </main></body></html>);
  return '<!doctype html>' + renderToStaticMarkup(page);
}

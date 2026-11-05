// Renders the /research pages: a hub and the syllabus statistics report.
// Every number on these pages comes from researchCatalog (the pure compute
// module wired to real data), so the page, its markdown mirror, llms.txt and
// the FAQ can never disagree.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { css, SITE } from './syllabusPage';
import { AI_SITE } from './aiFiles';
import { RESEARCH_PATH, RESEARCH_SLUG, realBranchStats, realFindings, realResearchFaq, realTotals } from './researchCatalog';
import type { Finding } from './researchData';

const researchCss = `
.findings{list-style:none;padding:0;margin:24px 0}
.findings li{position:relative;padding:18px 18px 18px 20px;border:1px solid rgba(20,20,25,.12);border-radius:14px;margin:0 0 12px;background:#fff}
.findings li:before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px;background:#D61A40}
.findings p{margin:0;color:#141419;font-size:16px;line-height:1.65}
.findings .anchor{display:inline-block;margin-top:10px;font-size:12px;color:#5A5A66}
.cite{border-left:3px solid #D61A40;background:#FBF9F5;padding:14px 18px;border-radius:0 12px 12px 0;color:#3F3F4A;font-size:14.5px;line-height:1.7}
details .anchor{font-size:12px;color:#5A5A66;display:inline-block;margin-top:6px}
.method li{margin:8px 0;line-height:1.7;color:#3F3F4A}
.total td{font-weight:700;border-top:2px solid rgba(20,20,25,.3)}
`;

function ResearchHead({ title, desc, path }: { title: string; desc: string; path: string }) {
  return <>
    <meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title><meta name="description" content={desc} />
    <link rel="canonical" href={SITE + path} /><meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="#F7F5F2" /><link rel="icon" type="image/svg+xml" href={SITE + '/logo.svg'} />
    <meta property="og:type" content="article" /><meta property="og:site_name" content="PrepTracker" />
    <meta property="og:title" content={title} /><meta property="og:description" content={desc} /><meta property="og:url" content={SITE + path} />
    <meta property="og:image" content={SITE + '/assets/ProjectPrepTracker.png'} /><meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <link href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap" rel="stylesheet" />
    <style dangerouslySetInnerHTML={{ __html: css + researchCss }} />
  </>;
}

const ResearchFoot = () => <footer>
  <p>Method: every figure is computed at build time from the same syllabus catalog that renders the subject pages, and the catalog is copied from the official SPPU syllabus PDFs linked at the bottom of each branch page. PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University.</p>
  <p><a href={SITE + '/'}>PrepTracker home</a> · <a href={SITE + '/syllabus/'}>Syllabus</a> · <a href={SITE + '/research/'}>Research</a> · <a href={SITE + '/privacy/'}>Privacy</a></p>
</footer>;

const FindingList = ({ findings }: { findings: Finding[] }) => (
  <ol className="findings">
    {findings.map((f) => (
      <li key={f.id} id={f.id}>
        <p>{f.text}</p>
        <a className="anchor" href={'#' + f.id}>Link to this finding</a>
      </li>
    ))}
  </ol>
);

export function renderSyllabusStats(generated: string): string {
  const t = realTotals();
  const stats = realBranchStats().filter((b) => !b.draft);
  const findings = realFindings();
  const faq = realResearchFaq();
  const title = `SPPU syllabus statistics 2026: ${t.courses} cataloged theory courses analyzed`;
  const desc = `${t.courses} cataloged theory courses, ${t.units} units and ${t.credits} credits across ${t.branches} SPPU 2024-pattern year-branch catalogs, plus ${t.fe.subjects} First Year subjects. Every number computed from the official syllabus catalog.`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', name: title, description: desc, url: SITE + RESEARCH_PATH,
        dateModified: generated, isPartOf: { '@type': 'WebSite', name: 'PrepTracker', url: SITE + '/' },
      },
      {
        '@type': 'Dataset',
        name: 'SPPU 2024-pattern syllabus catalog (PrepTracker)',
        description: 'Structured counts of theory courses, units, credits and hours across SPPU 2024-pattern branches, computed from the official SPPU syllabus PDFs.',
        creator: { '@type': 'Organization', name: 'PrepTracker', url: SITE + '/' },
        dateModified: generated,
        variableMeasured: ['theory course count', 'unit count', 'credit count', 'theory hours'],
        measurementTechnique: 'Build-time aggregation over the syllabus catalog rendered on PrepTracker branch and subject pages',
        distribution: { '@type': 'DataDownload', encodingFormat: 'text/markdown', contentUrl: SITE + RESEARCH_PATH + 'index.md' },
      },
      { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };
  const page = (
    <html lang="en"><head>
      <ResearchHead title={title} desc={desc} path={RESEARCH_PATH} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </head><body><main>
      <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / <a href={SITE + '/research/'}>Research</a> / Syllabus statistics</nav>
      <h1>SPPU syllabus statistics 2026</h1>
      <p className="lead">{t.courses} cataloged theory courses, {t.units} units, {t.credits} credits and {t.hours} theory hours across {t.branches} SPPU 2024-pattern year-branch catalogs, computed from the same syllabus data that powers the subject pages. A course taught in several branches counts once per branch catalog. Data date {generated}.</p>

      <h2>Key findings</h2>
      <FindingList findings={findings} />

      <h2>Branch breakdown</h2>
      <table>
        <thead><tr><th>Branch</th><th>Year</th><th>Theory courses</th><th>Units</th><th>Credits</th><th>Theory hours</th></tr></thead>
        <tbody>
          {[...stats].sort((a, b) => a.year.localeCompare(b.year) || a.label.localeCompare(b.label)).map((b) => (
            <tr key={b.slug}><td><a href={SITE + '/syllabus/' + b.slug + '/'}>{b.label}</a></td><td>{b.year}</td><td>{b.courses}</td><td>{b.units}</td><td>{b.credits}</td><td>{b.hours}</td></tr>
          ))}
          <tr className="total"><td>All final catalogs</td><td></td><td>{t.courses}</td><td>{t.units}</td><td>{t.credits}</td><td>{t.hours}</td></tr>
          <tr><td>First Year subjects (all branches)</td><td>FE</td><td>{t.fe.subjects}</td><td>{t.fe.units}</td><td>{t.fe.credits}</td><td></td></tr>
        </tbody>
      </table>

      <h2>Methodology</h2>
      <ul className="method">
        <li>Source: the official SPPU syllabus PDFs, one linked at the bottom of every branch page. Counts are computed at build time from the catalog that renders those pages, so this page cannot drift from them.</li>
        <li>Included: theory courses on branches whose 2024-pattern syllabus SPPU has published as final, and the ten First Year subjects.</li>
        <li>Counting rule: courses are cataloged per branch and year, so a course taught in several branch catalogs counts once per catalog ({t.courses} entries, fewer unique titles). Hours are semester hours summed from each unit's hour allocation in the syllabus, not weekly hours.</li>
        <li>Excluded: SE Automobile (SPPU publishes it as a draft; its page is labeled draft), practical, lab and project courses, and the 2019-pattern TE pages kept for reference.</li>
        <li>Percentages are rounded to whole numbers; counts are exact.</li>
        <li>The data date is when the catalog last changed, not when the page was rebuilt.</li>
      </ul>

      <h2>Cite this page</h2>
      <p className="cite">PrepTracker (2026). SPPU syllabus statistics 2026: {t.courses} cataloged theory courses analyzed. {SITE + RESEARCH_PATH} (data as of {generated}).</p>

      <h2>FAQ</h2>
      {faq.map(([q, a], i) => (
        <details key={q} id={'faq-' + (i + 1)}><summary>{q}</summary><p>{a}</p><a className="anchor" href={'#faq-' + (i + 1)}>Link to this answer</a></details>
      ))}
      <ResearchFoot />
    </main></body></html>
  );
  return '<!doctype html>' + renderToStaticMarkup(page);
}

export function renderResearchHub(generated: string): string {
  const t = realTotals();
  const title = 'PrepTracker research: SPPU syllabus data';
  const desc = 'Statistics computed from PrepTracker\'s SPPU syllabus catalog: course, unit, credit and hour counts per branch, with methods and citations.';
  const page = (
    <html lang="en"><head>
      <ResearchHead title={title} desc={desc} path="/research/" />
    </head><body><main>
      <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / Research</nav>
      <h1>Research</h1>
      <p className="lead">Numbers computed from PrepTracker's own syllabus catalog, with the method and a suggested citation on each report. Nothing here is estimated or user-submitted.</p>
      <h2>Reports</h2>
      <div className="crs">
        <a href={SITE + RESEARCH_PATH}><span>SPPU syllabus statistics 2026</span><small>{t.courses} courses · {t.units} units · {t.branches} year-branch catalogs · data {generated}</small></a>
      </div>
      <ResearchFoot />
    </main></body></html>
  );
  return '<!doctype html>' + renderToStaticMarkup(page);
}

export { RESEARCH_PATH, RESEARCH_SLUG, AI_SITE };

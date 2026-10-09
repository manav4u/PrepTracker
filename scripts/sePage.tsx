import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { css, SITE } from './syllabusPage';

export interface SeUnit { roman: string; title: string; hours: number; text: string }
export interface SeCourse {
  code: string; name: string; hours: number; credits: number; cce: number; ese: number;
  prereq: string; outcomes: string[]; units: SeUnit[]; textBooks: string[]; refBooks: string[]; links: string[];
}
export interface SeBranch {
  slug: string; branch: string; short: string; pdf: string; pdfLabel: string; motif: string; accent: string; draft?: boolean; year?: 'TE'; courses: SeCourse[];
}
export const slugify = (n: string) => n.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const coursePath = (b: SeBranch, c: SeCourse) => '/syllabus/' + b.slug + '/' + slugify(c.name) + '/';

const D = '#6b2a3b';
const MOTIFS: Record<string, (r: string) => React.ReactNode> = {
  computer: R => <>
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(i => <text key={i} x={6 + i * 14} y="20" fill={i % 7 === 3 ? R : D} fontSize="15" fontFamily="monospace">{(i * 5 + 3) % 3 === 0 ? '1' : '0'}</text>)}
    <path d="M300 38 H340 M340 38 L370 14 M340 38 L370 38 M340 38 L370 44" stroke={D} strokeWidth="1.5" fill="none" />
    <circle cx="340" cy="38" r="4" fill={R} /><circle cx="370" cy="14" r="3.5" fill="none" stroke={R} strokeWidth="1.5" /><circle cx="370" cy="38" r="3.5" fill="none" stroke={D} strokeWidth="1.5" /><circle cx="370" cy="44" r="3.5" fill="none" stroke={D} strokeWidth="1.5" />
    <path d="M380 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>,
};
MOTIFS.cse = R => <>
    <text x="4" y="36" fill={D} fontSize="34" fontFamily="monospace">{'{'}</text>
    <path d="M44 24 H90 M90 24 L120 10 M90 24 L120 38 M120 10 L150 4 M120 10 L150 18 M120 38 L150 32 M120 38 L150 44" stroke={D} strokeWidth="1.5" fill="none" />
    <circle cx="44" cy="24" r="4" fill={R} /><circle cx="90" cy="24" r="3.5" fill="none" stroke={R} strokeWidth="1.5" /><circle cx="120" cy="10" r="3.5" fill="none" stroke={D} strokeWidth="1.5" /><circle cx="120" cy="38" r="3.5" fill="none" stroke={D} strokeWidth="1.5" />
    {[150, 150, 150, 150].map((x, i) => <circle key={i} cx={x} cy={[4, 18, 32, 44][i]} r="3" fill={i === 1 ? R : D} />)}
    <text x="176" y="36" fill={D} fontSize="34" fontFamily="monospace">{'}'}</text>
    <path d="M210 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.aids = R => <>
    {[[20, 10], [20, 24], [20, 38]].map(([x, y], i) => <circle key={'a' + i} cx={x} cy={y} r="4" fill={i === 1 ? R : 'none'} stroke={i === 1 ? R : D} strokeWidth="1.5" />)}
    {[[70, 6], [70, 24], [70, 42]].map(([x, y], i) => <circle key={'b' + i} cx={x} cy={y} r="4" fill="none" stroke={D} strokeWidth="1.5" />)}
    <path d="M24 10 L66 6 M24 10 L66 24 M24 24 L66 6 M24 24 L66 24 M24 24 L66 42 M24 38 L66 24 M24 38 L66 42" stroke={D} strokeWidth="1" fill="none" />
    <path d="M74 24 H110" stroke={R} strokeWidth="1.5" /><circle cx="120" cy="24" r="5" fill={R} />
    <path d="M140 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.elec = R => <>
    <path d="M6 24 H40 L48 8 L60 40 L72 8 L84 40 L92 24 H140" stroke={D} strokeWidth="1.5" fill="none" />
    <circle cx="6" cy="24" r="4" fill={R} /><circle cx="140" cy="24" r="4" fill="none" stroke={R} strokeWidth="1.5" />
    <path d="M160 24 q12 -18 24 0 t24 0 t24 0 t24 0" stroke={D} strokeWidth="1.5" fill="none" />
    <path d="M260 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.it = R => <>
    {[[14, 24], [60, 8], [60, 40], [110, 24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={i === 0 ? R : 'none'} stroke={i === 0 ? R : D} strokeWidth="1.5" />)}
    <path d="M18 22 L56 10 M18 26 L56 38 M64 10 L106 22 M64 38 L106 26 M64 10 L64 36" stroke={D} strokeWidth="1.2" fill="none" />
    <rect x="130" y="19" width="10" height="10" rx="2" fill={R} /><rect x="146" y="19" width="10" height="10" rx="2" fill="none" stroke={D} strokeWidth="1.5" /><rect x="162" y="19" width="10" height="10" rx="2" fill="none" stroke={D} strokeWidth="1.5" />
    <path d="M190 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.civil = R => <>
    <path d="M6 40 H150" stroke={D} strokeWidth="1.5" /><path d="M20 40 V30 M50 40 V30 M80 40 V30 M110 40 V30 M140 40 V30" stroke={D} strokeWidth="1.5" />
    <path d="M20 30 Q80 -6 140 30" stroke={R} strokeWidth="1.8" fill="none" />
    <path d="M50 30 V17 M80 30 V13 M110 30 V17" stroke={D} strokeWidth="1" />
    <circle cx="80" cy="13" r="3.5" fill={R} />
    <path d="M170 40 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.instr = R => <>
    <path d="M10 40 A30 30 0 0 1 70 40" stroke={D} strokeWidth="1.5" fill="none" />
    {[0, 1, 2, 3, 4].map(i => { const a = Math.PI * (1 - i / 4); return <path key={i} d={`M${40 + 26 * Math.cos(a)} ${40 - 26 * Math.sin(a)} L${40 + 31 * Math.cos(a)} ${40 - 31 * Math.sin(a)}`} stroke={D} strokeWidth="1.5" />; })}
    <path d="M40 40 L58 22" stroke={R} strokeWidth="2" /><circle cx="40" cy="40" r="3.5" fill={R} />
    <path d="M96 24 H120 L126 10 L134 38 L142 14 L148 24 H190" stroke={D} strokeWidth="1.5" fill="none" />
    <path d="M210 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.auto = R => <>
    <circle cx="34" cy="24" r="15" fill="none" stroke={D} strokeWidth="1.5" /><circle cx="34" cy="24" r="6" fill="none" stroke={R} strokeWidth="1.5" /><path d="M34 9 V39 M19 24 H49" stroke={D} strokeWidth="1.5" />
    <path d="M70 40 H190 M78 40 V30 Q78 24 90 24 H170 Q182 24 182 30 V40" stroke={D} strokeWidth="1.5" fill="none" /><circle cx="100" cy="42" r="5" fill="none" stroke={R} strokeWidth="1.5" /><circle cx="160" cy="42" r="5" fill="none" stroke={R} strokeWidth="1.5" />
    <path d="M210 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.cyber = R => <>
    <path d="M30 8 L48 14 V28 Q48 38 30 44 Q12 38 12 28 V14 Z" fill="none" stroke={D} strokeWidth="1.5" /><rect x="24" y="22" width="12" height="9" rx="1.5" fill={R} /><path d="M26 22 V19 Q26 14 30 14 Q34 14 34 19 V22" fill="none" stroke={R} strokeWidth="1.5" />
    <path d="M70 24 H100 M108 24 H118 M126 24 H170" stroke={D} strokeWidth="1.5" /><circle cx="104" cy="24" r="3" fill="none" stroke={R} strokeWidth="1.5" /><circle cx="122" cy="24" r="3" fill="none" stroke={D} strokeWidth="1.5" />
    <path d="M190 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.rai = R => <>
    <rect x="10" y="38" width="30" height="6" rx="2" fill="none" stroke={D} strokeWidth="1.5" /><path d="M25 38 V26 L50 12 L78 24" stroke={R} strokeWidth="2" fill="none" /><circle cx="25" cy="26" r="3.5" fill={R} /><circle cx="50" cy="12" r="3" fill="none" stroke={D} strokeWidth="1.5" />
    <path d="M78 24 L88 16 M78 24 L88 32" stroke={D} strokeWidth="1.5" />
    <circle cx="120" cy="24" r="4" fill="none" stroke={D} strokeWidth="1.5" /><circle cx="148" cy="14" r="4" fill="none" stroke={D} strokeWidth="1.5" /><circle cx="148" cy="34" r="4" fill="none" stroke={D} strokeWidth="1.5" /><path d="M124 22 L144 15 M124 26 L144 33" stroke={R} strokeWidth="1.2" />
    <path d="M180 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
MOTIFS.mech = R => <>
    <circle cx="30" cy="24" r="14" fill="none" stroke={D} strokeWidth="1.5" strokeDasharray="4 3" /><circle cx="30" cy="24" r="5" fill={R} />
    <circle cx="66" cy="24" r="9" fill="none" stroke={R} strokeWidth="1.5" strokeDasharray="3 3" /><circle cx="66" cy="24" r="3" fill="none" stroke={D} strokeWidth="1.5" />
    <path d="M92 40 H150 M100 40 V30 H142 V40" stroke={D} strokeWidth="1.5" fill="none" />
    <circle cx="121" cy="14" r="3.5" fill="none" stroke={D} strokeWidth="1.5" /><path d="M121 17 V30" stroke={D} strokeWidth="1.5" />
    <path d="M170 24 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>;
const YL = (b: SeBranch) => (b.year === 'TE' ? { s: 'TE', l: 'Third Year' } : { s: 'SE', l: 'Second Year' });
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const sectionCss = `.draft{border:1px solid #e11d48;background:#1a0a10;color:#fda4af;border-radius:12px;padding:12px 16px;margin:14px 0;font-size:14px}.crs{display:grid;gap:10px;margin:14px 0}.crs a{display:flex;justify-content:space-between;gap:12px;align-items:baseline;text-decoration:none;border:1px solid #222;background:#101010;border-radius:14px;padding:14px 16px;color:#fff}.crs a:hover{border-color:#e11d48}.crs small{color:#888;font:500 11px/1.3 ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}.utext{margin:10px 0 0;color:#ccc;font-size:15px}.src li{margin:6px 0;word-break:break-word}`;

function Head({ title, desc, path }: { title: string; desc: string; path: string }) {
  return <>
    <meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title><meta name="description" content={desc} />
    <link rel="canonical" href={SITE + path} /><meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="#0a0a0a" /><link rel="icon" type="image/svg+xml" href={SITE + '/favicon.svg'} />
    <meta property="og:type" content="article" /><meta property="og:site_name" content="PrepTracker" />
    <meta property="og:title" content={title} /><meta property="og:description" content={desc} /><meta property="og:url" content={SITE + path} />
    <meta property="og:image" content={SITE + '/assets/ProjectPrepTracker.png'} /><meta name="twitter:card" content="summary_large_image" />
    <style dangerouslySetInnerHTML={{ __html: css + sectionCss }} />
  </>;
}
const DraftNote = ({ b }: { b: SeBranch }) => b.draft ? <p className="draft"><b>DRAFT.</b> SPPU published this {b.branch} syllabus as a draft. It may change before it is final, so check the official PDF and your college before relying on it.</p> : null;
const Motif = ({ b }: { b: SeBranch }) => <svg className="motif" viewBox="0 0 600 48" preserveAspectRatio="xMinYMid meet" aria-hidden="true">{MOTIFS[b.motif](b.accent)}</svg>;
const Foot = ({ b }: { b: SeBranch }) => <footer>
  <p>Source: <a href={b.pdf} rel="noopener">{b.pdfLabel} (official SPPU PDF)</a>. PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.</p>
  <p><a href={SITE + '/'}>PrepTracker home</a> · <a href={SITE + '/syllabus/' + b.slug + '/'}>{b.short} subjects</a> · <a href={SITE + '/syllabus/grading-system-sgpa/'}>Grading and SGPA</a></p>
</footer>;

export function renderSeCourse(b: SeBranch, c: SeCourse): string {
  const path = coursePath(b, c);
  const total = c.units.reduce((a, u) => a + u.hours, 0);
  const consistent = total === c.hours * 15;
  const title = `${c.name} syllabus (${b.short}${b.draft ? ', draft' : ''}, SPPU 2024 pattern) - units, marks, books`;
  const desc = `${c.name} (${c.code}) for SPPU ${b.branch} 2024 pattern${b.draft ? ' (draft syllabus)' : ''}: ${c.units.length} units${consistent ? `, ${total} hours` : ''}, ${c.credits} credits, CCE ${c.cce} and end-semester ${c.ese} marks, outcomes and books.`;
  const faq: [string, string][] = [
    [`How many units are in ${c.name}?`, `${c.name} (${c.code}) has ${c.units.length} units${consistent ? ` and ${total} hours of theory` : ''}: ${c.units.map(u => `Unit ${u.roman} ${u.title} (${u.hours} h)`).join('; ')}.`],
    [`What is the marks scheme for ${c.name}?`, `The official ${b.branch} 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for ${c.cce} marks and the end-semester exam for ${c.ese} marks, for ${c.credits} credits.`],
    ...(c.prereq ? [[`What should I know before ${c.name}?`, `Prerequisite listed in the syllabus: ${c.prereq}.`] as [string, string]] : []),
  ];
  const page = (
    <html lang="en"><head>
      <Head title={title} desc={desc} path={path} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PrepTracker', item: SITE + '/' },
          { '@type': 'ListItem', position: 2, name: b.short + ' syllabus', item: SITE + '/syllabus/' + b.slug + '/' },
          { '@type': 'ListItem', position: 3, name: c.name, item: SITE + path }] },
        { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] }) }} />
    </head><body><main>
      <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / <a href={SITE + '/syllabus/' + b.slug + '/'}>{b.short}</a> / {c.name}</nav>
      <h1>{c.name} syllabus</h1>
      <DraftNote b={b} />
      <p className="lead">{c.code} · {YL(b).l} {b.branch}, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.</p>
      <div className="chips"><span className="chip">{c.code}</span><span className="chip">{c.hours} h/week theory</span><span className="chip">CCE {c.cce} + End-sem {c.ese}</span></div>
      <div className="stats" style={consistent ? undefined : { gridTemplateColumns: 'repeat(2,1fr)' }}>
        {consistent && <div className="stat"><b>{total}</b><span>hours of theory</span></div>}
        <div className="stat"><b>{String(c.units.length).padStart(2, '0')}<i>.</i></b><span>units</span></div>
        <div className="stat"><b>{String(c.credits).padStart(2, '0')}<i>.</i></b><span>credits</span></div>
      </div>
      <Motif b={b} />
      <h2>Unit-wise syllabus</h2>
      <nav className="upills" aria-label="Jump to a unit">{c.units.map((u, i) => <a key={u.roman} href={'#unit-' + (i + 1)}><b>UNIT {ROMAN[i]}</b><small>{u.hours} h</small></a>)}</nav>
      <div className="units">{c.units.map((u, i) => (
        <section className="card unit" id={'unit-' + (i + 1)} key={u.roman}>
          <div className="uh"><span className="chip up">UNIT {ROMAN[i]}</span><h3>{u.title}</h3><span className="hrs">{u.hours} hours</span></div>
          {u.text.split(/(?=Case [Ss]tud(?:y|ies))/).map((t, k) => <p className="utext" key={k}>{t.trim()}</p>)}
        </section>))}</div>
      <h2>Marks and credits</h2>
      <table><thead><tr><th>Head</th><th>Marks</th><th>Credit</th></tr></thead><tbody>
        <tr><td>CCE (continuous comprehensive evaluation)</td><td>{c.cce}</td><td rowSpan={2}>{c.credits}</td></tr>
        <tr><td>End-semester exam</td><td>{c.ese}</td></tr></tbody></table>
      {c.prereq && <p>Prerequisite: {c.prereq}.</p>}
      <h2>Course outcomes</h2>
      <ol className="co">{c.outcomes.map((o, i) => <li key={i}><b>CO{i + 1}</b>{o}</li>)}</ol>
      <h2>Books</h2>
      {c.textBooks.length > 0 && <><h3>Text books</h3><ul>{c.textBooks.map(t => <li key={t}>{t}</li>)}</ul></>}
      {c.refBooks.length > 0 && <><h3 style={{ marginTop: 16 }}>Reference books</h3><ul>{c.refBooks.map(t => <li key={t}>{t}</li>)}</ul></>}
      {c.links.length > 0 && <><h2>NPTEL and SWAYAM links</h2><p>Listed in the official syllabus:</p><ul className="src">{c.links.map(l => <li key={l}><a href={l} rel="noopener">{l.replace('https://', '')}</a></li>)}</ul></>}
      <h2>FAQ</h2>
      {faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      <Foot b={b} />
    </main></body></html>);
  return '<!doctype html>' + renderToStaticMarkup(page);
}

export function renderSeBranch(b: SeBranch): string {
  const path = '/syllabus/' + b.slug + '/';
  const title = `SPPU ${b.short} syllabus${b.draft ? ' (draft)' : ''} 2024 pattern - subject-wise units and marks`;
  const desc = `Subject-wise syllabus for SPPU ${YL(b).l} ${b.branch}, 2024 pattern${b.draft ? ' (draft syllabus)' : ''}: ${b.courses.length} theory courses with units, hours, marks, outcomes and books, from the official PDF${b.draft ? ', which SPPU marks as a draft' : ''}.`;
  const page = (
    <html lang="en"><head><Head title={title} desc={desc} path={path} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PrepTracker', item: SITE + '/' },
          { '@type': 'ListItem', position: 2, name: b.short + ' syllabus', item: SITE + path }] }] }) }} />
    </head><body><main>
      <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / Syllabus / {b.short}</nav>
      <h1>{YL(b).s} {b.branch} syllabus{b.draft ? ' (draft)' : ''}</h1>
      <DraftNote b={b} />
      <p className="lead">{YL(b).l}, SPPU 2024 pattern. Pick a subject for its units, marks, outcomes and books. Practical, lab and project courses are not listed here, only theory courses.</p>
      <Motif b={b} />
      <h2>Theory courses</h2>
      <div className="crs">{b.courses.map(c => <a key={c.code} href={SITE + coursePath(b, c)}><span>{c.name}</span><small>{c.code} · {c.credits} cr</small></a>)}</div>
      <Foot b={b} />
    </main></body></html>);
  return '<!doctype html>' + renderToStaticMarkup(page);
}

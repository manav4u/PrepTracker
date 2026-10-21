import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SUBJECTS } from '../constants';

// Unit teaching hours were dropped from the app's constants in the revamp; the
// library pages still display them, so keep the values verified against the
// official SPPU FE 2024 syllabus here.
const HOURS: Record<string, number[]> = {
  m1: [8, 8, 8, 8, 8], phy: [8, 8, 8, 8, 8], chem: [8, 8, 8, 8, 8], m2: [8, 8, 8, 8, 8],
  fpl: [6, 6, 6, 6, 6], elect: [6, 6, 6, 6, 6], elec: [6, 6, 6, 6, 6],
  mech: [6, 6, 6, 6, 6], graph: [6, 6, 6, 6, 6],
  pps: [4, 4, 3, 4, 4],
};
const unitHours = (subjectId: string, u: { hours?: number }, i: number) => u.hours ?? HOURS[subjectId]?.[i] ?? 8;

export const SITE = 'https://preptracker.manavdev.site';
export const SYLLABUS_PDF = 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/FE%202024%20Pattern%20-%20Revised%202025_04062026.pdf';
export const HANDBOOK = 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/Rev.HANDBOOK-revised%20Rules%20and%20Regulations_27052025.pdf';

export interface SubjectPageConfig {
  id: string; slug: string; title: string; metaDescription: string; ogTitle: string; ogDescription: string;
  lead: string; chips: string[];
  marks: { head: string; marks: number; credit?: number; span?: number }[];
  prereq: string; order?: number[]; outcomes: string[]; coUnits?: boolean; studyOrder: string;
  textBooks: string[]; refBooks: string[];
  videos: { label: string; url: string }[]; videoNote: string;
  faq: [string, string][];
}

export const css = `*{box-sizing:border-box}
body{margin:0;background:#F7F5F2;color:#141419;font:16px/1.65 'Space Grotesk',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:#D61A40;text-underline-offset:3px}
main{max-width:840px;margin:0 auto;padding:40px 20px 80px}
nav.crumbs{font:11px 'Space Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:#5A5A66;margin-bottom:26px}
nav.crumbs a{color:#5A5A66;text-decoration:none}nav.crumbs a:hover{color:#D61A40}
h1{font:700 clamp(34px,6vw,56px)/1.04 'Space Grotesk',sans-serif;letter-spacing:-.035em;color:#141419;margin:0 0 14px}
h2{font:700 clamp(24px,3.4vw,34px)/1.08 'Space Grotesk',sans-serif;letter-spacing:-.03em;color:#141419;margin:52px 0 16px}
h3{font:700 19px/1.2 'Space Grotesk',sans-serif;letter-spacing:-.015em;color:#141419;margin:0 0 4px}
.lead{color:#5A5A66;font-size:17px;max-width:640px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}
.chip{border:1px solid rgba(20,20,25,.14);background:#fff;border-radius:999px;padding:6px 13px;font:10.5px 'Space Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:#5A5A66}
.card{border:1px solid rgba(20,20,25,.10);background:#fff;border-radius:18px;padding:20px 22px;margin:14px 0;box-shadow:0 1px 2px rgba(20,20,25,.05),0 14px 30px -22px rgba(20,20,25,.18)}
.hrs{float:right;font:10px 'Space Mono',monospace;letter-spacing:.08em;color:#D61A40;border:1px solid rgba(214,26,64,.35);border-radius:999px;padding:3px 10px}
.card ul{margin:10px 0 0;padding-left:20px;color:#3F3F4A}
.tw{border:1px solid rgba(20,20,25,.10);background:#fff;border-radius:14px;overflow:hidden;margin:14px 0;box-shadow:0 1px 2px rgba(20,20,25,.05)}
.tw.wide{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:14.5px}
td,th{border-bottom:1px solid rgba(20,20,25,.08);padding:11px 16px;text-align:left}
tr:last-child td{border-bottom:0}
th{font:10.5px 'Space Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:#5A5A66;font-weight:400;background:#FBF9F5}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}
tr.tot td{font-weight:700;background:#FBF9F5;color:#141419}
.cta{display:inline-block;background:#D61A40;color:#fff!important;text-decoration:none;font:700 15px 'Satoshi','Space Grotesk',sans-serif;padding:14px 30px;border-radius:999px;margin-top:10px;transition:transform .2s ease,box-shadow .2s ease}
.cta:hover{transform:translateY(-2px);box-shadow:0 14px 28px -10px rgba(214,26,64,.5)}
details{border-bottom:1px solid rgba(20,20,25,.10);padding:14px 0}
summary{cursor:pointer;color:#141419;font-weight:600;min-height:32px}
details p{margin:8px 0 0;color:#5A5A66}
.note{color:#5A5A66;font-size:13.5px;border-left:2px solid #E4DFD8;padding-left:14px}
.eq{font:14px 'Space Mono',monospace;background:#fff;border:1px solid rgba(20,20,25,.10);border-radius:12px;padding:16px 18px;color:#141419;margin:14px 0;overflow-x:auto}
.draft{background:#FBEDEF;border:1px solid rgba(214,26,64,.25);border-radius:14px;padding:18px 20px;margin:16px 0;color:#141419;font-size:14.5px}
.draft b{color:#D61A40}
.draft ul{color:#3F3F4A;margin:8px 0;padding-left:20px}
.scards{display:grid;gap:14px;margin:14px 0}
.sc{background:#fff;border:1px solid rgba(20,20,25,.10);border-radius:18px;padding:20px 22px;box-shadow:0 1px 2px rgba(20,20,25,.05)}
.sc small{font:10px 'Space Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:#D61A40;display:block;margin-bottom:4px}
.sc b{font:700 20px 'Space Grotesk',sans-serif;letter-spacing:-.02em;color:#141419;display:block;margin-bottom:10px}
.sc.tot{background:#141419;border-color:#141419}
.sc.tot b{color:#F7F5F2}
.sc.tot .chip{background:transparent;border-color:rgba(247,245,242,.28);color:#F7F5F2}
.sc.tot .chip.up{border-color:#F63C49;color:#F63C49}
.rel{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin:14px 0}
.rel a{background:#fff;border:1px solid rgba(20,20,25,.10);border-radius:12px;padding:14px 16px;color:#141419;text-decoration:none;font-weight:500;font-size:14.5px;transition:border-color .2s,transform .2s}
.rel a:hover{border-color:#D61A40;transform:translateY(-2px)}
.crs{display:grid;gap:10px;margin:14px 0}
.crs a{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;background:#fff;border:1px solid rgba(20,20,25,.10);border-radius:14px;padding:16px 18px;color:#141419;text-decoration:none;font-weight:600;transition:border-color .2s,transform .2s}
.crs a:hover{border-color:#D61A40;transform:translateY(-2px)}
.crs small{font:10.5px 'Space Mono',monospace;letter-spacing:.08em;color:#5A5A66;font-weight:400}
.src{padding-left:20px;color:#3F3F4A}
.utext{color:#3F3F4A;font-size:15px;line-height:1.8}
.outline{padding-left:20px;color:#3F3F4A}
.outline li{margin:6px 0;line-height:1.75}
.flow{list-style:none;margin:12px 0;padding:0;position:relative}
.flow li{position:relative;padding:0 0 18px 44px;color:#3F3F4A;font-size:15px}
.flow li:before{content:'';position:absolute;left:14px;top:30px;bottom:-4px;width:2px;background:#EBE6DE}
.flow li:last-child:before{display:none}
.flow .n{position:absolute;left:0;top:0;width:30px;height:30px;border-radius:50%;background:#fff;border:1px solid #D61A40;color:#D61A40;font:700 12px 'Space Mono',monospace;display:flex;align-items:center;justify-content:center}
.flow b{color:#141419;display:block;font-weight:600}
.flow small{color:#5A5A66}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(20,20,25,.12);border-bottom:1px solid rgba(20,20,25,.12);margin:30px 0}
.stat{padding:20px 6px 18px;text-align:left;border-left:1px solid rgba(20,20,25,.08);padding-left:16px}
.stat:first-child{border-left:0;padding-left:0}
.stat b{display:block;font:700 clamp(44px,12vw,72px)/0.95 'Space Grotesk',sans-serif;color:#141419;letter-spacing:-2px}
.stat b i{font-style:normal;color:#D61A40}
.stat span{display:block;margin-top:10px;font:10px 'Space Mono',monospace;letter-spacing:.16em;text-transform:uppercase;color:#5A5A66}
.upills{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 20px}
.upills a{text-decoration:none;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(20,20,25,.14);background:#fff;border-radius:999px;padding:8px 14px;transition:border-color .2s,transform .2s}
.upills a:hover{border-color:#D61A40;transform:translateY(-1px)}
.upills a b{font:700 11px 'Space Mono',monospace;color:#141419;letter-spacing:.06em}
.upills a small{color:#D61A40;font:10px 'Space Mono',monospace}
.units{position:relative;padding-left:24px}
.units:before{content:'';position:absolute;left:5px;top:18px;bottom:30px;width:1px;background:#E4DFD8}
.unit{position:relative;scroll-margin-top:90px}
.unit:before{content:'';position:absolute;left:-23px;top:26px;width:9px;height:9px;border-radius:50%;background:#D61A40;box-shadow:0 0 0 4px #F7F5F2}
.uh{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.uh h3{margin:0;flex:1;min-width:60%}
.uh .hrs{float:none}
.up{letter-spacing:.08em;font:700 10px 'Space Mono',monospace;border:1px solid rgba(214,26,64,.4);background:#fff;color:#D61A40}
.tp{margin:12px 0 0;gap:6px}
.tp .chip{font-size:10px;padding:4px 10px;color:#5A5A66;background:#FBF9F5;text-transform:none;letter-spacing:.02em;font-family:'Space Grotesk',sans-serif;font-size:12.5px}
.motif *{vector-effect:non-scaling-stroke}
.motif{display:block;width:100%;max-width:600px;height:48px;margin:-6px 0 24px}
@media(min-width:1280px){main{max-width:900px}.motif{max-width:720px}}
footer{margin-top:52px;padding-top:26px;border-top:1px solid rgba(20,20,25,.12);font-size:13px;color:#5A5A66}
ol.co{padding-left:0;list-style:none}
ol.co li{margin:12px 0;padding-left:56px;position:relative;color:#3F3F4A;line-height:1.7}
ol.co b{position:absolute;left:0;color:#D61A40;font:700 12px 'Space Mono',monospace;top:4px}
ol.co small{color:#5A5A66}
a:focus-visible,summary:focus-visible,button:focus-visible{outline:2px solid #D61A40;outline-offset:3px}
::selection{background:#D61A40;color:#fff}`;




const R = '#D61A40', D = '#B3123B';
const hex = (x: number, y: number, r: number) => Array.from({ length: 6 }, (_, i) => { const t = Math.PI / 3 * i + Math.PI / 6; return (x + r * Math.cos(t)).toFixed(1) + ',' + (y + r * Math.sin(t)).toFixed(1); }).join(' ');
const tail = (x: number) => <path d={'M' + x + ' 24 H600'} stroke='#D9D3CB' strokeWidth="1.5" strokeDasharray="2 7" />;
const wave = (amp: number, len: number, ph = 0) => { let d = ''; for (let x = 0; x <= 600; x += 6) d += (x ? 'L' : 'M') + x + ' ' + (24 + amp * Math.sin(x / len * 2 * Math.PI + ph)).toFixed(1); return d; };
const MOTIFS: Record<string, React.ReactNode> = {
  m1: <><path d="M0 40 C150 40 200 6 300 24 S480 44 600 8" fill="none" stroke={D} strokeWidth="2" /><path d="M230 34 L370 14" stroke={R} strokeWidth="1.5" strokeDasharray="3 5" /><circle cx="300" cy="24" r="4" fill={R} /></>,
  m2: <><path d="M44 4 C34 2 30 10 30 22 S28 44 16 42" fill="none" stroke={R} strokeWidth="2" strokeLinecap="round" /><path d="M80 42 H420" stroke={D} strokeWidth="2" />{[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const h = 8 + 26 * Math.sin((i + 0.5) / 8 * Math.PI); return <rect key={i} x={84 + i * 42} y={42 - h} width="38" height={h} fill='#FFFFFF' stroke={i === 3 ? R : D} strokeWidth="1.5" />; })}<path d="M420 42 H600" stroke='#D9D3CB' strokeWidth="1.5" strokeDasharray="2 7" /></>,
  phy: <><path d={wave(14, 150)} fill="none" stroke={D} strokeWidth="2" /><path d={wave(14, 150, 0.9)} fill="none" stroke={R} strokeWidth="1.5" strokeDasharray="2 6" /></>,
  chem: <>{[40, 100, 160, 220, 280].map((x, i) => <polygon key={x} points={hex(x, i % 2 ? 31 : 17, 15)} fill="none" stroke={i === 1 ? R : D} strokeWidth="2" strokeLinejoin="round" />)}<circle cx="100" cy="31" r="3" fill={R} />{tail(310)}</>,
  elect: <><path d="M0 24 H120 V10 H220 V38 H330 V24 H600" fill="none" stroke={D} strokeWidth="2" /><circle cx="120" cy="24" r="4" fill={R} /><circle cx="220" cy="38" r="4" fill={R} /><circle cx="330" cy="24" r="4" fill={R} /></>,
  elec: <><path d={wave(14, 200)} fill="none" stroke={D} strokeWidth="2" /><path d={wave(14, 200, 2.09)} fill="none" stroke='#E3A7B1' strokeWidth="1.5" /><path d={wave(14, 200, 4.19)} fill="none" stroke={R} strokeWidth="1.5" /></>,
  mech: <><path d="M10 40 L70 10 L130 40 L190 10 L250 40 L310 10 L370 40 Z M10 40 H370" fill="none" stroke={D} strokeWidth="2" strokeLinejoin="round" /><circle cx="10" cy="40" r="4" fill={R} /><circle cx="370" cy="40" r="4" fill={R} /><path d="M370 40 H600" stroke='#D9D3CB' strokeWidth="1.5" strokeDasharray="2 7" /></>,
  fpl: <><rect x="4" y="12" width="64" height="24" rx="12" fill="none" stroke={D} strokeWidth="2" /><path d="M68 24 H110" stroke={R} strokeWidth="1.5" /><path d="M110 24 L142 6 L174 24 L142 42 Z" fill="none" stroke={R} strokeWidth="2" /><path d="M174 24 H216" stroke={D} strokeWidth="2" /><rect x="216" y="12" width="64" height="24" rx="4" fill="none" stroke={D} strokeWidth="2" />{tail(280)}</>,
  graph: <><path d="M10 4 V44 M4 38 H240" stroke={D} strokeWidth="2" /><rect x="60" y="10" width="70" height="28" fill="none" stroke={R} strokeWidth="1.5" /><path d="M60 10 V38 M130 10 V38 M60 24 H130" stroke={D} strokeWidth="1" strokeDasharray="3 4" /><rect x="170" y="14" width="70" height="24" fill="none" stroke={D} strokeWidth="2" /><path d="M240 38 H600" stroke='#D9D3CB' strokeWidth="1.5" strokeDasharray="2 7" /></>,
  pps: <><path d="M10 24 H70 M120 24 H200" stroke={D} strokeWidth="2" /><circle cx="95" cy="24" r="16" fill="none" stroke={R} strokeWidth="2" strokeDasharray="60 40" /><path d="M200 24 l-8 -6 v12 z" fill={R} /><text x="222" y="31" fill={D} fontSize="24" fontFamily="monospace">{'{ }'}</text>{tail(262)}</>,
};
function Motif({ id }: { id: string }) {
  const m = MOTIFS[id];
  return m ? <svg className="motif" viewBox="0 0 600 48" preserveAspectRatio="xMinYMid meet" aria-hidden="true">{m}</svg> : null;
}
const SUP = ['\u00b9', '\u00b2', '\u00b3', '\u2074', '\u2075', '\u2076'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function renderSubjectPage(c: SubjectPageConfig): string {
  const s = SUBJECTS.find(x => x.id === c.id)!;
  const PATH = '/syllabus/' + c.slug + '/';
  const totalHours = s.units.reduce((a, u, i) => a + unitHours(c.id, u, i), 0);
  const order = c.order ?? s.units.map((_, i) => i);
  const page = (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{c.title}</title>
        <meta name="description" content={c.metaDescription} />
        <link rel="canonical" href={SITE + PATH} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="theme-color" content="#F7F5F2" />
        <link rel="icon" type="image/svg+xml" href={SITE + '/logo.svg'} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="PrepTracker" />
        <meta property="og:title" content={c.ogTitle} />
        <meta property="og:description" content={c.ogDescription} />
        <meta property="og:url" content={SITE + PATH} />
        <meta property="og:image" content={SITE + '/assets/ProjectPrepTracker.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'BreadcrumbList', itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'PrepTracker', item: SITE + '/' },
              { '@type': 'ListItem', position: 2, name: s.name + ' syllabus', item: SITE + PATH } ] },
            { '@type': 'FAQPage', mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
          ] }) }} />
      </head>
      <body>
        <main>
          <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / Syllabus / {s.name}</nav>
          <h1>{s.name} syllabus</h1>
          <p className="lead">{c.lead}</p>
          <div className="chips">{c.chips.map(x => <span className="chip" key={x}>{x}</span>)}</div>

          <div className="stats">
            <div className="stat"><b>{totalHours}</b><span>hours of theory</span></div>
            <div className="stat"><b>{String(s.units.length).padStart(2, '0')}<i>.</i></b><span>units</span></div>
            <div className="stat"><b>{String(s.credits).padStart(2, '0')}<i>.</i></b><span>credits</span></div>
          </div>

          <Motif id={c.id} />
          <h2>Unit-wise syllabus</h2>
          <nav className="upills" aria-label="Jump to a unit">{s.units.map((u, i) => <a key={u.id} href={'#' + u.id}><b>UNIT {ROMAN[i]}</b><small>{unitHours(c.id, u, i)} h</small></a>)}</nav>
          <div className="units">{s.units.map((u, i) => (
            <section className="card unit" id={u.id} key={u.id}>
              <div className="uh"><span className="chip up">UNIT {ROMAN[i]}</span><h3>{u.title}</h3><span className="hrs">{unitHours(c.id, u, i)} hours</span></div>
              <div className="chips tp">{u.topics.map(t => <span className="chip" key={t}>{t}</span>)}</div>
            </section>
          ))}</div>

          <h2>Marks and credits</h2>
          <table><thead><tr><th>Head</th><th>Marks</th><th>Credit</th></tr></thead><tbody>
            {c.marks.map(m => (
              <tr key={m.head}><td>{m.head}</td><td>{m.marks}</td>{m.credit !== undefined && <td rowSpan={m.span}>{m.credit}</td>}</tr>
            ))}
          </tbody></table>
          <p>{c.prereq}</p>

          <h2>Course outcomes</h2>
          <ol className="co">{c.outcomes.map((o, i) => <li key={i}><b>CO{i + 1}</b>{o}{c.coUnits && <><br /><small style={{ color: '#777' }}>Covers Unit {ROMAN[i]}</small></>}</li>)}</ol>

          <h2>Books</h2>
          <h3>Text books</h3><ul>{c.textBooks.map(t => <li key={t}>{t}</li>)}</ul>
          <h3 style={{ marginTop: 16 }}>Reference books</h3><ul>{c.refBooks.map(t => <li key={t}>{t}</li>)}</ul>

          <h2>Video lectures</h2>
          <p>{c.videoNote}{c.videos.length > 0 ? ': ' : ''}{c.videos.map((v, i) => <React.Fragment key={v.url}>{i > 0 && ', '}<a href={v.url} rel="noopener">{v.label}</a></React.Fragment>)}.</p>

          <h2>Track it in PrepTracker</h2>
          <p>Tick off each unit as you finish it, and keep your own notes and links in one place. It is free and needs no account.</p>
          <a className="cta" href={SITE + '/#/subject/' + c.id}>Open {s.name} in the app</a>

          <h2>FAQ</h2>
          {c.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}

          <footer>
            <p>Sources: <a href={SYLLABUS_PDF} rel="noopener">SPPU First Year Engineering 2024 pattern syllabus, revised 2025 (official PDF)</a> and the <a href={HANDBOOK} rel="noopener">SPPU credit framework handbook</a>. PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm exam rules with your college.</p>
            <p><a href={SITE + '/'}>PrepTracker home</a> · <a href={SITE + '/syllabus/'}>Syllabus</a> · <a href={SITE + '/syllabus/first-year-scheme-credits/'}>FE scheme and credits</a> · <a href={SITE + '/syllabus/grading-system-sgpa/'}>Grading and SGPA</a> · <a href={SITE + '/syllabus/cce-end-sem-exam-pattern/'}>Exam pattern</a></p>
          </footer>
        </main>
      </body>
    </html>
  );
  return '<!doctype html>' + renderToStaticMarkup(page);
}

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SUBJECTS } from '../constants';

const SITE = 'https://preptracker.manavdev.site';
const SYLLABUS_PDF = 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/FE%202024%20Pattern%20Syllabus%20-%2016%20July%202024%20(1).pdf';
const HANDBOOK = 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/Rev.HANDBOOK-revised%20Rules%20and%20Regulations_27052025.pdf';

export interface SubjectPageConfig {
  id: string; slug: string; title: string; metaDescription: string; ogTitle: string; ogDescription: string;
  lead: string; chips: string[];
  marks: { head: string; marks: number; credit?: number; span?: number }[];
  prereq: string; order?: number[]; outcomes: string[]; coUnits?: boolean; studyOrder: string;
  textBooks: string[]; refBooks: string[];
  videos: { label: string; url: string }[]; videoNote: string;
  faq: [string, string][];
}

const css = `*{box-sizing:border-box}body{margin:0;background:#0a0a0a;color:#e5e5e5;font:16px/1.65 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
a{color:#fb7185}main{max-width:780px;margin:0 auto;padding:24px 18px 64px}
nav.crumbs{font-size:13px;color:#888;margin-bottom:20px}nav.crumbs a{color:#aaa;text-decoration:none}
h1{font-size:clamp(28px,6vw,44px);line-height:1.15;margin:0 0 8px;color:#fff}h2{font-size:22px;margin:40px 0 12px;color:#fff}h3{font-size:17px;margin:0 0 4px;color:#fff}
.lead{color:#bbb;font-size:18px}.chips{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}.chip{border:1px solid #2a2a2a;background:#111;border-radius:999px;padding:5px 12px;font-size:13px;color:#ccc}
.card{border:1px solid #222;background:#101010;border-radius:16px;padding:16px 18px;margin:12px 0}.hrs{float:right;font-size:12px;color:#fb7185;border:1px solid #3a1620;border-radius:999px;padding:2px 10px}
.card ul{margin:8px 0 0;padding-left:20px;color:#ccc}table{width:100%;border-collapse:collapse;font-size:15px}td,th{border-bottom:1px solid #222;padding:8px 6px;text-align:left}th{color:#888;font-weight:500}
.cta{display:inline-block;background:#e11d48;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:12px;margin-top:8px}
details{border-bottom:1px solid #222;padding:10px 0}summary{cursor:pointer;color:#fff;font-weight:500}details p{margin:8px 0 0;color:#bbb}

.flow{list-style:none;margin:12px 0;padding:0;position:relative}.flow li{position:relative;padding:0 0 18px 44px;color:#ccc;font-size:15px}.flow li:before{content:'';position:absolute;left:14px;top:30px;bottom:-4px;width:2px;background:linear-gradient(#e11d48,#3a1620)}.flow li:last-child:before{display:none}
.flow .n{position:absolute;left:0;top:0;width:30px;height:30px;border-radius:50%;background:#1a0a10;border:1px solid #e11d48;color:#fb7185;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}.flow b{color:#fff;display:block;font-weight:600}.flow small{color:#777}

.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #2a1018;border-bottom:1px solid #2a1018;margin:28px 0}
.stat{padding:18px 6px 16px;text-align:left;border-left:1px solid #1c1c1c;padding-left:14px}.stat:first-child{border-left:0;padding-left:0}
.stat b{display:block;font:800 clamp(44px,13vw,76px)/0.95 Georgia,'Times New Roman',serif;color:#fff;letter-spacing:-2px}.stat b i{font-style:normal;color:#e11d48}
.stat span{display:block;margin-top:8px;font:500 11px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#888}

.upills{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 18px}.upills a{text-decoration:none;display:inline-flex;align-items:center;gap:6px;border:1px solid #2a2a2a;background:#111;border-radius:999px;padding:5px 12px;font-size:13px;color:#ccc}.upills a b{font-weight:600;color:#fff;letter-spacing:.04em;font-size:12px}.upills a small{color:#fb7185;font:500 11px ui-monospace,Menlo,monospace}
.units{position:relative;padding-left:22px}.units:before{content:'';position:absolute;left:4px;top:18px;bottom:30px;width:1px;background:linear-gradient(#e11d48,#2a1018 40%,#2a1018)}
.unit{position:relative;scroll-margin-top:16px}.unit:before{content:'';position:absolute;left:-22px;top:25px;width:9px;height:9px;border-radius:50%;background:#e11d48;box-shadow:0 0 0 4px #0a0a0a}
.uh{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.uh h3{margin:0;flex:1;min-width:60%}.uh .hrs{float:none}
.up{letter-spacing:.06em;font-size:12px;border:1px solid #3a1620;background:#1a0a10;color:#fb7185;font-weight:600}
.tp{margin:12px 0 0}.tp{gap:6px}.tp .chip{font-size:12px;padding:3px 10px;color:#bbb;background:#0d0d0d}.units{padding-left:20px}.unit{padding:14px 14px}
.motif *{vector-effect:non-scaling-stroke}.motif{display:block;width:100%;max-width:600px;height:48px;margin:-10px 0 22px}
@media(min-width:1280px){main{max-width:880px}.motif{max-width:720px}}
footer{margin-top:48px;font-size:13px;color:#777}ol.co{padding-left:0;list-style:none}ol.co li{margin:10px 0;padding-left:56px;position:relative;color:#ccc}ol.co b{position:absolute;left:0;color:#fb7185}`;



const R = '#e11d48', D = '#6b2a3b';
const hex = (x: number, y: number, r: number) => Array.from({ length: 6 }, (_, i) => { const t = Math.PI / 3 * i + Math.PI / 6; return (x + r * Math.cos(t)).toFixed(1) + ',' + (y + r * Math.sin(t)).toFixed(1); }).join(' ');
const tail = (x: number) => <path d={'M' + x + ' 24 H600'} stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" />;
const wave = (amp: number, len: number, ph = 0) => { let d = ''; for (let x = 0; x <= 600; x += 6) d += (x ? 'L' : 'M') + x + ' ' + (24 + amp * Math.sin(x / len * 2 * Math.PI + ph)).toFixed(1); return d; };
const MOTIFS: Record<string, React.ReactNode> = {
  m1: <><path d="M0 40 C150 40 200 6 300 24 S480 44 600 8" fill="none" stroke={D} strokeWidth="2" /><path d="M230 34 L370 14" stroke={R} strokeWidth="1.5" strokeDasharray="3 5" /><circle cx="300" cy="24" r="4" fill={R} /></>,
  m2: <><path d="M44 4 C34 2 30 10 30 22 S28 44 16 42" fill="none" stroke={R} strokeWidth="2" strokeLinecap="round" /><path d="M80 42 H420" stroke={D} strokeWidth="2" />{[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const h = 8 + 26 * Math.sin((i + 0.5) / 8 * Math.PI); return <rect key={i} x={84 + i * 42} y={42 - h} width="38" height={h} fill="#1a0a10" stroke={i === 3 ? R : D} strokeWidth="1.5" />; })}<path d="M420 42 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>,
  phy: <><path d={wave(14, 150)} fill="none" stroke={D} strokeWidth="2" /><path d={wave(14, 150, 0.9)} fill="none" stroke={R} strokeWidth="1.5" strokeDasharray="2 6" /></>,
  chem: <>{[40, 100, 160, 220, 280].map((x, i) => <polygon key={x} points={hex(x, i % 2 ? 31 : 17, 15)} fill="none" stroke={i === 1 ? R : D} strokeWidth="2" strokeLinejoin="round" />)}<circle cx="100" cy="31" r="3" fill={R} />{tail(310)}</>,
  elect: <><path d="M0 24 H120 V10 H220 V38 H330 V24 H600" fill="none" stroke={D} strokeWidth="2" /><circle cx="120" cy="24" r="4" fill={R} /><circle cx="220" cy="38" r="4" fill={R} /><circle cx="330" cy="24" r="4" fill={R} /></>,
  elec: <><path d={wave(14, 200)} fill="none" stroke={D} strokeWidth="2" /><path d={wave(14, 200, 2.09)} fill="none" stroke="#7f1d3a" strokeWidth="1.5" /><path d={wave(14, 200, 4.19)} fill="none" stroke={R} strokeWidth="1.5" /></>,
  mech: <><path d="M10 40 L70 10 L130 40 L190 10 L250 40 L310 10 L370 40 Z M10 40 H370" fill="none" stroke={D} strokeWidth="2" strokeLinejoin="round" /><circle cx="10" cy="40" r="4" fill={R} /><circle cx="370" cy="40" r="4" fill={R} /><path d="M370 40 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>,
  fpl: <><rect x="4" y="12" width="64" height="24" rx="12" fill="none" stroke={D} strokeWidth="2" /><path d="M68 24 H110" stroke={R} strokeWidth="1.5" /><path d="M110 24 L142 6 L174 24 L142 42 Z" fill="none" stroke={R} strokeWidth="2" /><path d="M174 24 H216" stroke={D} strokeWidth="2" /><rect x="216" y="12" width="64" height="24" rx="4" fill="none" stroke={D} strokeWidth="2" />{tail(280)}</>,
  graph: <><path d="M10 4 V44 M4 38 H240" stroke={D} strokeWidth="2" /><rect x="60" y="10" width="70" height="28" fill="none" stroke={R} strokeWidth="1.5" /><path d="M60 10 V38 M130 10 V38 M60 24 H130" stroke={D} strokeWidth="1" strokeDasharray="3 4" /><rect x="170" y="14" width="70" height="24" fill="none" stroke={D} strokeWidth="2" /><path d="M240 38 H600" stroke="#3a1620" strokeWidth="1.5" strokeDasharray="2 7" /></>,
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
  const totalHours = s.units.reduce((a, u) => a + u.hours, 0);
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
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" type="image/svg+xml" href={SITE + '/favicon.svg'} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="PrepTracker" />
        <meta property="og:title" content={c.ogTitle} />
        <meta property="og:description" content={c.ogDescription} />
        <meta property="og:url" content={SITE + PATH} />
        <meta property="og:image" content={SITE + '/assets/ProjectPrepTracker.png'} />
        <meta name="twitter:card" content="summary_large_image" />
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
          <nav className="upills" aria-label="Jump to a unit">{s.units.map((u, i) => <a key={u.id} href={'#' + u.id}><b>UNIT {ROMAN[i]}</b><small>{u.hours} h</small></a>)}</nav>
          <div className="units">{s.units.map((u, i) => (
            <section className="card unit" id={u.id} key={u.id}>
              <div className="uh"><span className="chip up">UNIT {ROMAN[i]}</span><h3>{u.title}</h3><span className="hrs">{u.hours} hours</span></div>
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
            <p>Sources: <a href={SYLLABUS_PDF} rel="noopener">SPPU First Year Engineering 2024 pattern syllabus (official PDF)</a> and the <a href={HANDBOOK} rel="noopener">SPPU credit framework handbook</a>. PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm exam rules with your college.</p>
            <p><a href={SITE + '/'}>PrepTracker home</a></p>
          </footer>
        </main>
      </body>
    </html>
  );
  return '<!doctype html>' + renderToStaticMarkup(page);
}

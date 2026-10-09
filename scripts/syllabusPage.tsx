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

.viz{display:grid;gap:14px;grid-template-columns:1fr}@media(min-width:640px){.viz{grid-template-columns:200px 1fr;align-items:center}}
.donut{width:180px;height:180px;margin:0 auto}.donut text{fill:#fff;font-weight:700}.donut .sub{fill:#888;font-weight:400}
.legend{list-style:none;margin:0;padding:0}.legend li{display:grid;grid-template-columns:12px 1fr auto;gap:10px;align-items:center;padding:6px 0;font-size:14px;color:#ccc;border-bottom:1px solid #1c1c1c}
.legend i{width:10px;height:10px;border-radius:3px;display:block}.legend b{color:#fff;font-weight:600}
.bars{margin:8px 0}.bar{margin:12px 0}.bar .lab{display:flex;justify-content:space-between;gap:10px;font-size:14px;color:#ccc;margin-bottom:5px}.bar .lab b{color:#fff;font-weight:600;white-space:nowrap}
.track{height:10px;border-radius:999px;background:#161616;border:1px solid #222;overflow:hidden}.fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#9f1239,#e11d48 60%,#fb7185)}
.note{font-size:13px;color:#777;margin:6px 0 0}
.flow{list-style:none;margin:12px 0;padding:0;position:relative}.flow li{position:relative;padding:0 0 18px 44px;color:#ccc;font-size:15px}.flow li:before{content:'';position:absolute;left:14px;top:30px;bottom:-4px;width:2px;background:linear-gradient(#e11d48,#3a1620)}.flow li:last-child:before{display:none}
.flow .n{position:absolute;left:0;top:0;width:30px;height:30px;border-radius:50%;background:#1a0a10;border:1px solid #e11d48;color:#fb7185;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}.flow b{color:#fff;display:block;font-weight:600}.flow small{color:#777}

.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #2a1018;border-bottom:1px solid #2a1018;margin:28px 0}
.stat{padding:18px 6px 16px;text-align:left;border-left:1px solid #1c1c1c;padding-left:14px}.stat:first-child{border-left:0;padding-left:0}
.stat b{display:block;font:800 clamp(44px,13vw,76px)/0.95 Georgia,'Times New Roman',serif;color:#fff;letter-spacing:-2px}.stat b i{font-style:normal;color:#e11d48}
.stat span{display:block;margin-top:8px;font:500 11px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#888}
.tree{position:relative;margin:18px 0 8px;padding:0;list-style:none}
.node{position:relative;display:grid;grid-template-columns:64px 1fr;gap:14px;padding:0 0 34px}
.node:last-child{padding-bottom:0}
.node svg.rail{position:absolute;left:0;top:56px;width:64px;height:calc(100% - 56px);overflow:visible}
.node:last-child svg.rail{display:none}
.gem{width:64px;height:64px}.gem text{font:800 22px Georgia,serif;fill:#fff}.gem .lv{font:500 8px ui-monospace,Menlo,monospace;letter-spacing:.12em;fill:#fb7185}
.quest{border:1px solid #2a1018;background:linear-gradient(160deg,#150a0e,#0e0e0e 60%);border-radius:6px 22px 6px 22px;padding:14px 16px 14px}
.quest .tag{font:500 11px ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#fb7185}
.quest h3{margin:4px 0 10px;font-size:18px}
.xp{display:flex;gap:3px;margin:0 0 6px}.xp u{flex:1;height:9px;border-radius:2px;background:#1b1b1b;transform:skewX(-18deg);text-decoration:none}.xp u.on{background:linear-gradient(#fb7185,#be123c);box-shadow:0 0 6px #e11d4855}
.xpl{display:flex;justify-content:space-between;font:500 11px ui-monospace,Menlo,monospace;letter-spacing:.1em;color:#888;text-transform:uppercase}
.xpl b{color:#fff;font-weight:600}
@media(min-width:760px){.node{grid-template-columns:1fr 84px 1fr;gap:0}.node .quest{grid-column:1;grid-row:1;margin-right:18px}.node .gemwrap{grid-column:2;grid-row:1;display:flex;justify-content:center}.node:nth-child(even) .quest{grid-column:3;margin:0 0 0 18px}.node svg.rail{left:50%;margin-left:-32px}}
.gemwrap{width:64px}@media(min-width:760px){.gemwrap{width:auto}}
.treenote{font:500 11px/1.5 ui-monospace,Menlo,monospace;letter-spacing:.06em;color:#666;margin-top:14px}

.upills{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 18px}.upills a{text-decoration:none;display:inline-flex;align-items:center;gap:6px;border:1px solid #2a2a2a;background:#111;border-radius:999px;padding:5px 12px;font-size:13px;color:#ccc}.upills a b{font-weight:600;color:#fff}.upills a small{color:#fb7185;font:500 11px ui-monospace,Menlo,monospace}
.units{position:relative;padding-left:22px}.units:before{content:'';position:absolute;left:4px;top:18px;bottom:30px;width:1px;background:linear-gradient(#e11d48,#2a1018 40%,#2a1018)}
.unit{position:relative;scroll-margin-top:16px}.unit:before{content:'';position:absolute;left:-22px;top:25px;width:9px;height:9px;border-radius:50%;background:#e11d48;box-shadow:0 0 0 4px #0a0a0a}
.uh{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.uh h3{margin:0;flex:1;min-width:60%}.uh .hrs{float:none}
.up{border:1px solid #3a1620;background:#1a0a10;color:#fb7185;font-weight:600}
.tp{margin:12px 0 0}.tp{gap:6px}.tp .chip{font-size:12px;padding:3px 10px;color:#bbb;background:#0d0d0d}.units{padding-left:20px}.unit{padding:14px 14px}
footer{margin-top:48px;font-size:13px;color:#777}ol.co{padding-left:0;list-style:none}ol.co li{margin:10px 0;padding-left:56px;position:relative;color:#ccc}ol.co b{position:absolute;left:0;color:#fb7185}`;



const PALETTE = ['#e11d48', '#fb7185', '#be123c', '#fda4af', '#9f1239', '#f43f5e'];

function Donut({ parts, total }: { parts: number[]; total: number }) {
  const R = 70, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg className="donut" viewBox="0 0 180 180" role="img" aria-label={'Hours per unit, ' + total + ' hours in total'}>
      <circle cx="90" cy="90" r={R} fill="none" stroke="#161616" strokeWidth="20" />
      {parts.map((h, i) => {
        const len = (h / total) * C;
        const el = <circle key={i} cx="90" cy="90" r={R} fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth="20" strokeDasharray={(len - 2).toFixed(2) + ' ' + (C - len + 2).toFixed(2)} strokeDashoffset={(-acc).toFixed(2)} transform="rotate(-90 90 90)" />;
        acc += len;
        return el;
      })}
      <text x="90" y="92" textAnchor="middle" fontSize="30">{total}</text>
      <text className="sub" x="90" y="112" textAnchor="middle" fontSize="12">hours</text>
    </svg>
  );
}


function Gem({ n }: { n: number }) {
  return (
    <svg className="gem" viewBox="0 0 64 64" role="img" aria-label={'Unit ' + n}>
      <path d="M32 3 L57 17 L58 46 L32 61 L6 47 L7 17 Z" fill="#1a0a10" stroke="#e11d48" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 9 L51 20 L52 43 L32 55 L12 43 L13 20 Z" fill="none" stroke="#fb7185" strokeOpacity=".35" strokeWidth="1" strokeDasharray="3 3" />
      <text x="32" y="38" textAnchor="middle">{String(n).padStart(2, '0')}</text>
      <text className="lv" x="32" y="19" textAnchor="middle">LV</text>
    </svg>
  );
}
function Rail({ flip }: { flip: boolean }) {
  const d = flip ? 'M32 0 C 10 30, 54 50, 30 90 S 40 140, 32 160' : 'M32 0 C 54 30, 10 50, 34 90 S 24 140, 32 160';
  return (
    <svg className="rail" viewBox="0 0 64 160" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke="#3a1620" strokeWidth="5" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 9" />
    </svg>
  );
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

          <h2>Unit-wise syllabus</h2>
          <nav className="upills" aria-label="Jump to a unit">{s.units.map((u, i) => <a key={u.id} href={'#' + u.id}><b>U{SUP[i]}</b><small>{u.hours} h</small></a>)}</nav>
          <div className="units">{s.units.map((u, i) => (
            <section className="card unit" id={u.id} key={u.id}>
              <div className="uh"><span className="chip up">U{SUP[i]}</span><h3>{u.title}</h3><span className="hrs">{u.hours} hours</span></div>
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

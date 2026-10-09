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
  prereq: string; outcomes: string[]; coUnits?: boolean; studyOrder: string;
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
footer{margin-top:48px;font-size:13px;color:#777}ol.co{padding-left:0;list-style:none}ol.co li{margin:10px 0;padding-left:56px;position:relative;color:#ccc}ol.co b{position:absolute;left:0;color:#fb7185}`;


const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function renderSubjectPage(c: SubjectPageConfig): string {
  const s = SUBJECTS.find(x => x.id === c.id)!;
  const PATH = '/syllabus/' + c.slug + '/';
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

          <h2>Unit-wise syllabus</h2>
          {s.units.map((u, i) => (
            <section className="card" key={u.id}>
              <span className="hrs">{u.hours} hours</span>
              <h3>Unit {ROMAN[i]}: {u.title}</h3>
              <ul>{u.topics.map(t => <li key={t}>{t}</li>)}</ul>
            </section>
          ))}

          <h2>Marks and credits</h2>
          <table><thead><tr><th>Head</th><th>Marks</th><th>Credit</th></tr></thead><tbody>
            {c.marks.map(m => (
              <tr key={m.head}><td>{m.head}</td><td>{m.marks}</td>{m.credit !== undefined && <td rowSpan={m.span}>{m.credit}</td>}</tr>
            ))}
          </tbody></table>
          <p>{c.prereq}</p>

          <h2>Course outcomes</h2>
          <ol className="co">{c.outcomes.map((o, i) => <li key={i}><b>CO{i + 1}</b>{o}{c.coUnits && <><br /><small style={{ color: '#777' }}>Covers Unit {ROMAN[i]}</small></>}</li>)}</ol>

          <h2>A study order that follows the syllabus</h2>
          <p>{c.studyOrder}</p>

          <h2>Books</h2>
          <h3>Text books</h3><ul>{c.textBooks.map(t => <li key={t}>{t}</li>)}</ul>
          <h3 style={{ marginTop: 16 }}>Reference books</h3><ul>{c.refBooks.map(t => <li key={t}>{t}</li>)}</ul>

          <h2>Video lectures</h2>
          <p>{c.videoNote}: {c.videos.map((v, i) => <React.Fragment key={v.url}>{i > 0 && ', '}<a href={v.url} rel="noopener">{v.label}</a></React.Fragment>)}.</p>

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

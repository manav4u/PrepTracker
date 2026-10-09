import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SUBJECTS } from '../constants';

const SITE = 'https://preptracker.manavdev.site';
const PATH = '/syllabus/engineering-mathematics-1/';
const SYLLABUS_PDF = 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/FE%202024%20Pattern%20Syllabus%20-%2016%20July%202024%20(1).pdf';
const HANDBOOK = 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/Rev.HANDBOOK-revised%20Rules%20and%20Regulations_27052025.pdf';
const NPTEL = 'https://youtube.com/playlist?list=PLbRMhDVUMngeVrxtbBz-n8HvP8KAWBpI5';

const OUTCOMES = [
  'Apply mean value theorems and their generalizations leading to Taylor and Maclaurin series. Determine the Fourier series representation and harmonic analysis of periodic functions.',
  'Evaluate derivative functions of several variables.',
  'Apply the Jacobian to find partial derivatives of implicit functions and functional dependence. Use partial derivatives for errors, approximations and extreme values.',
  'Use matrices and linear algebra to analyse systems of linear equations, linear dependence and independence, and linear and orthogonal transformations.',
  'Determine eigen values and eigen vectors, diagonalize a matrix and reduce a quadratic form to canonical form.',
];
const TEXT = ['Higher Engineering Mathematics by B. V. Ramana (Tata McGraw Hill)', 'Higher Engineering Mathematics by B. S. Grewal (Khanna Publication)'];
const REF = [
  'Advanced Engineering Mathematics by Erwin Kreyszig (Wiley Eastern Ltd.)',
  'Advanced Engineering Mathematics by M. D. Greenberg (Pearson Education)',
  'Advanced Engineering Mathematics by Peter V. O\u2019Neil (Thomson Learning)',
  'Thomas\u2019 Calculus by George B. Thomas (Addison-Wesley, Pearson)',
  'Applied Mathematics (Vol. I & II) by P. N. Wartikar and J. N. Wartikar (Vidyarthi Griha Prakashan, Pune)',
  'Elementary Linear Algebra by Ron Larson and David C. Falvo (Houghton Mifflin Harcourt)',
];
const FAQ: [string, string][] = [
  ['How many credits is Engineering Mathematics-I in the SPPU 2024 pattern?', 'BSC-101-BES carries 4 credits: 3 for theory (3 hours a week) and 1 for the tutorial (1 hour a week).'],
  ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the tutorial credit.'],
  ['How many units are there?', 'Five units of 8 hours each, 40 hours in total: single variable calculus and Fourier series, partial differentiation, its applications, matrices and linear systems, and eigen values with diagonalization.'],
  ['What do I need to pass the theory head?', 'The college copy of the SPPU rules asks for at least 12 in CCE, at least 28 in the End-Semester exam and at least 40 in total. Check your own college notice for the exact rule that applies to you.'],
  ['Which books does the syllabus list?', 'Text books: B. V. Ramana and B. S. Grewal, both titled Higher Engineering Mathematics. Six reference books are listed too, including Kreyszig and Thomas\u2019 Calculus.'],
  ['Is there an official video course?', 'The syllabus lists one NPTEL / YouTube playlist for this course. It is linked on this page.'],
];

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

function Page() {
  const s = SUBJECTS.find(x => x.id === 'm1')!;
  const roman = ['I', 'II', 'III', 'IV', 'V'];
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Engineering Mathematics-I Syllabus (BSC-101-BES) | SPPU FE 2024 Pattern</title>
        <meta name="description" content="Unit-wise SPPU First Year Engineering Mathematics-I syllabus, 2024 pattern (BSC-101-BES): 5 units, 8 hours each, marks scheme, course outcomes, books and the official NPTEL playlist." />
        <link rel="canonical" href={SITE + PATH} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" type="image/svg+xml" href={SITE + '/favicon.svg'} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="PrepTracker" />
        <meta property="og:title" content="Engineering Mathematics-I Syllabus, SPPU FE 2024 Pattern" />
        <meta property="og:description" content="Five units, outcomes, marks scheme, books and the official NPTEL playlist for BSC-101-BES." />
        <meta property="og:url" content={SITE + PATH} />
        <meta property="og:image" content={SITE + '/assets/ProjectPrepTracker.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'BreadcrumbList', itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'PrepTracker', item: SITE + '/' },
              { '@type': 'ListItem', position: 2, name: 'Engineering Mathematics-I syllabus', item: SITE + PATH } ] },
            { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
          ] }) }} />
      </head>
      <body>
        <main>
          <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / Syllabus / Engineering Mathematics-I</nav>
          <h1>Engineering Mathematics-I syllabus</h1>
          <p className="lead">SPPU First Year Engineering, 2024 pattern. Course code {s.code}. Five units, 40 hours of theory, with the marks scheme, outcomes and books taken from the official syllabus book.</p>
          <div className="chips"><span className="chip">4 credits (3 theory + 1 tutorial)</span><span className="chip">CCE 30 + End-Sem 70</span><span className="chip">Term work 25</span><span className="chip">5 units x 8 hours</span></div>

          <h2>Unit-wise syllabus</h2>
          {s.units.map((u, i) => (
            <section className="card" key={u.id}>
              <span className="hrs">{u.hours} hours</span>
              <h3>Unit {roman[i]}: {u.title}</h3>
              <ul>{u.topics.map(t => <li key={t}>{t}</li>)}</ul>
            </section>
          ))}

          <h2>Marks and credits</h2>
          <table><thead><tr><th>Head</th><th>Marks</th><th>Credit</th></tr></thead><tbody>
            <tr><td>Theory: CCE</td><td>30</td><td rowSpan={2}>3</td></tr>
            <tr><td>Theory: End-Semester</td><td>70</td></tr>
            <tr><td>Tutorial / term work</td><td>25</td><td>1</td></tr>
          </tbody></table>
          <p>The prerequisites listed in the syllabus are differentiation, integration, maxima and minima, matrices and determinants. The course aims to build the calculus, Fourier series and linear algebra needed in later engineering subjects.</p>

          <h2>Course outcomes</h2>
          <ol className="co">{OUTCOMES.map((o, i) => <li key={i}><b>CO{i + 1}</b>{o}<br /><small style={{ color: '#777' }}>Covers Unit {roman[i]}</small></li>)}</ol>

          <h2>A study order that follows the syllabus</h2>
          <p>This is a suggestion, not part of the syllabus. Unit II (partial derivatives, Euler's theorem, total derivative) is what Unit III (Jacobian, errors, maxima and minima) builds on, so do them in that order. In the same way, Unit IV (rank, linear systems, transformations) comes before Unit V (eigen values, Cayley-Hamilton, diagonalization). Unit I stands alone, so it is a good starting point or a break between the two blocks.</p>

          <h2>Books</h2>
          <h3>Text books</h3><ul>{TEXT.map(t => <li key={t}>{t}</li>)}</ul>
          <h3 style={{ marginTop: 16 }}>Reference books</h3><ul>{REF.map(t => <li key={t}>{t}</li>)}</ul>

          <h2>Video lectures</h2>
          <p>The syllabus lists one NPTEL / YouTube playlist for this course: <a href={NPTEL} rel="noopener">Engineering Mathematics-I playlist</a>.</p>

          <h2>Track it in PrepTracker</h2>
          <p>Tick off each unit as you finish it, and keep your own notes and links in one place. It is free and needs no account.</p>
          <a className="cta" href={SITE + '/#/subject/m1'}>Open Engineering Mathematics-I in the app</a>

          <h2>FAQ</h2>
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}

          <footer>
            <p>Sources: <a href={SYLLABUS_PDF} rel="noopener">SPPU First Year Engineering 2024 pattern syllabus (official PDF)</a> and the <a href={HANDBOOK} rel="noopener">SPPU credit framework handbook</a>. PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm exam rules with your college.</p>
            <p><a href={SITE + '/'}>PrepTracker home</a></p>
          </footer>
        </main>
      </body>
    </html>
  );
}

export function renderM1Page(): string {
  return '<!doctype html>' + renderToStaticMarkup(<Page />);
}
export const M1_PATH = PATH;

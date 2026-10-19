import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SITE, SYLLABUS_PDF, HANDBOOK, css } from './syllabusPage';

export interface InfoPage {
  slug: string; title: string; metaDescription: string; h1: string; crumb: string; lead: string;
  body: React.ReactNode; faq: [string, string][]; cta?: { href: string; label: string };
}

const extra = `.scards{display:none}.sc{border:1px solid #222;background:#0f0f0f;border-radius:12px;padding:12px 14px;margin:10px 0}.sc small{display:block;font:500 11px ui-monospace,Menlo,monospace;letter-spacing:.06em;color:#fb7185}.sc b{display:block;color:#fff;margin:2px 0 4px;font-size:15px}.sc .chips{margin:8px 0 0}.sc .chip{font-size:12px;padding:3px 10px}.sc.tot{border-color:#3a1620;background:#1a0a10}@media(max-width:700px){.tw.wide{display:none}.scards{display:block}}.tw{overflow-x:auto;margin:12px 0 4px;-webkit-overflow-scrolling:touch}.tw table{min-width:640px;font-size:13.5px}.tw th,.tw td{padding:7px 9px;border-bottom:1px solid #222;text-align:left;vertical-align:top}.tw th{color:#fb7185;font:600 11px ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}.tw td.n{text-align:center;white-space:nowrap}.tw tr.tot td{color:#fff;font-weight:600;border-top:1px solid #3a1620}.eq{border:1px solid #2a1018;background:#120a0e;border-radius:10px;padding:14px 16px;margin:14px 0;font:15px/1.7 ui-monospace,Menlo,monospace;color:#fda4af;overflow-x:auto}.rel{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.rel a{text-decoration:none;border:1px solid #2a2a2a;background:#111;border-radius:999px;padding:5px 12px;font-size:13px;color:#ccc}`;

const SUBJECT_LINKS: [string, string][] = [
  ['engineering-mathematics-1', 'Maths-I'], ['engineering-mathematics-2', 'Maths-II'], ['engineering-physics', 'Physics'],
  ['engineering-chemistry', 'Chemistry'], ['basic-electronics-engineering', 'Electronics'], ['basic-electrical-engineering', 'Electrical'],
  ['engineering-mechanics', 'Mechanics'], ['engineering-graphics', 'Graphics'], ['fundamentals-of-programming-languages', 'FPL'],
  ['programming-and-problem-solving', 'PPS'],
];

type Row = [string, string, string, string, string, string, string, string, string, string];
// code, course, TH h, TUT h, PR h, CCE, ESE, TW, credits (TH/TUT/PR as "3 / 1 / -"), total
const th = ['Code', 'Course', 'Hrs: Th', 'Hrs: Tut', 'Hrs: Pr', 'CCE', 'End-Sem', 'Term work', 'Credits Th / Tut / Pr', 'Credits'];
const SEM1: Row[] = [
  ['BSC-101-BES', 'Engineering Mathematics-I', '3', '1', '-', '30', '70', '25', '3 / 1 / -', '4'],
  ['BSC-102-BES / BSC-103-BES', 'Engineering Physics / Engineering Chemistry', '3', '-', '2', '30', '70', '25', '3 / - / 1', '4'],
  ['ESC-101-ETC / ESC-102-ELE', 'Basic Electronics Engineering / Basic Electrical Engineering', '2', '-', '2', '30', '70', '25', '2 / - / 1', '3'],
  ['ESC-103-MEC / ESC-104-CVL', 'Engineering Graphics / Engineering Mechanics', '2', '-', '2', '30', '70', '25', '2 / - / 1', '3'],
  ['ESC-105-COM', 'Fundamentals of Programming Languages', '2', '-', '2', '30', '70', '25', '2 / - / 1', '3'],
  ['VSE-101 / VSE-102', 'Manufacturing Practice Workshop / Design Thinking and Idea Lab', '-', '-', '2', '-', '-', '25', '- / - / 1', '1'],
  ['AEC-101', 'Professional Communication Skills', '-', '2', '-', '-', '-', '25', '- / 2 / -', '2'],
  ['CCC-101', 'Co-Curricular Course-I', '-', '-', '4', '-', '-', '25', '- / - / 2', '2'],
  ['Total', '', '12', '3', '14', '150', '350', '200', '12 / 3 / 7', '22'],
];
const SEM2: Row[] = [
  ['BSC-151-BES', 'Engineering Mathematics-II', '3', '1', '-', '30', '70', '25', '3 / 1 / -', '4'],
  ['BSC-103-BES / BSC-102-BES', 'Engineering Chemistry / Engineering Physics', '3', '-', '2', '30', '70', '25', '3 / - / 1', '4'],
  ['ESC-102-ELE / ESC-101-ETC', 'Basic Electrical Engineering / Basic Electronics Engineering', '2', '-', '2', '30', '70', '25', '2 / - / 1', '3'],
  ['ESC-104-CVL / ESC-103-MEC', 'Engineering Mechanics / Engineering Graphics', '2', '-', '2', '30', '70', '25', '2 / - / 1', '3'],
  ['PCC-151-ITT', 'Programming and Problem Solving', '2', '-', '2', '30', '70', '25', '2 / - / 1', '3'],
  ['VSE-102 / VSE-101', 'Design Thinking and Idea Lab / Manufacturing Practice Workshop', '-', '-', '2', '-', '-', '25', '- / - / 1', '1'],
  ['IKS-151', 'Indian Knowledge System', '-', '2', '-', '-', '-', '25', '- / 2 / -', '2'],
  ['CCC-151', 'Co-Curricular Course-II', '-', '-', '4', '-', '-', '25', '- / - / 2', '2'],
  ['Total', '', '12', '3', '14', '150', '350', '200', '12 / 3 / 7', '22'],
];

function SchemeTable({ rows }: { rows: Row[] }) {
  return (
    <>
      <div className="tw wide"><table><thead><tr>{th.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>
        {rows.map(r => <tr key={r[0]} className={r[0] === 'Total' ? 'tot' : undefined}>{r.map((c, i) => <td key={i} className={i >= 2 ? 'n' : undefined}>{c}</td>)}</tr>)}
      </tbody></table></div>
      <div className="scards">
        {rows.map(r => r[0] === 'Total' ? (
          <div className="sc tot" key={r[0]}><b>Semester total</b><div className="chips"><span className="chip">{r[2]} + {r[3]} + {r[4]} hrs/week</span><span className="chip">CCE {r[5]}</span><span className="chip">End-Sem {r[6]}</span><span className="chip">Term work {r[7]}</span><span className="chip up">{r[9]} credits</span></div></div>
        ) : (
          <div className="sc" key={r[0]}><small>{r[0]}</small><b>{r[1]}</b>
            <div className="chips">
              <span className="chip">Hrs Th/Tut/Pr {[r[2], r[3], r[4]].join(' / ')}</span>
              {r[5] !== '-' && <span className="chip">CCE {r[5]} + End-Sem {r[6]}</span>}
              <span className="chip">Term work {r[7]}</span>
              <span className="chip up">{r[9]} credits ({r[8]})</span>
            </div></div>
        ))}
      </div>
    </>
  );
}

const GRADES: [string, string, string, string][] = [
  ['O (Outstanding)', '10', '90 to 100', ''], ['A+ (Excellent)', '9', '75 to 89', ''], ['A (Very Good)', '8', '60 to 74', ''],
  ['B+ (Good)', '7', '55 to 59', ''], ['B (Above average)', '6', '50 to 54', ''], ['C (Average)', '5', '45 to 49', ''], ['D (Pass)', '4', '40 to 44', ''],
  ['F (Fail)', '0', 'Below the pass mark', ''], ['Ab (Absent)', '0', '-', ''],
];
const CLASSES: [string, string][] = [
  ['9.50 or more', 'Outstanding (O)'], ['8.50 to below 9.50', 'Excellent (A+)'], ['7.50 to below 8.50', 'Very Good (A)'], ['6.25 to below 7.50', 'Good (B+)'],
  ['5.25 to below 6.25', 'Above Average (B)'], ['4.75 to below 5.25', 'Average (C)'], ['4.00 to below 4.75', 'Pass (D)'], ['Below 4.00', 'Fail (F)'],
];

export const INFO_PAGES: InfoPage[] = [
  {
    slug: 'first-year-scheme-credits',
    title: 'SPPU First Year Engineering 2024 Pattern: Scheme, Credits and Marks',
    metaDescription: 'Semester I and II teaching scheme, credits and marks for SPPU First Year Engineering, 2024 pattern: hours per week, CCE 30 and End-Sem 70, term work 25, 22 credits a semester. Straight from the official syllabus book.',
    h1: 'First Year Engineering scheme, credits and marks',
    crumb: 'FE scheme and credits',
    lead: 'SPPU First Year Engineering, 2024 pattern (NEP 2020 compliant, Level 4.5). Both semesters carry 22 credits. This page copies the structure table from the official syllabus book and adds nothing to it.',
    body: (
      <>
        <div className="chips"><span className="chip">22 credits per semester</span><span className="chip">Theory: CCE 30 + End-Sem 70</span><span className="chip">Term work 25 per course</span></div>
        <h2>Semester I</h2>
        <SchemeTable rows={SEM1} />
        <h2>Semester II</h2>
        <SchemeTable rows={SEM2} />
        <p className="note">Hrs are hours per week (Th theory, Tut tutorial, Pr practical). Where the book lists two courses with a slash, the pair is split across the two semesters, and the order flips in Semester II. CCE is Comprehensive Continuous Evaluation. The book leaves the oral and practical exam columns empty for every course.</p>
        <h2>Read it course by course</h2>
        <p>Each subject has its own page with units, outcomes and books:</p>
        <div className="rel">{SUBJECT_LINKS.map(([s, n]) => <a key={s} href={SITE + '/syllabus/' + s + '/'}>{n}</a>)}</div>
        <p>How the marks are earned is on the <a href={SITE + '/syllabus/cce-end-sem-exam-pattern/'}>CCE and End-Sem exam pattern</a> page, and how grades turn into SGPA is on the <a href={SITE + '/syllabus/grading-system-sgpa/'}>grading page</a>.</p>
      </>
    ),
    faq: [
      ['How many credits does First Year Engineering have in the SPPU 2024 pattern?', 'Each semester carries 22 credits: 12 theory, 3 tutorial and 7 practical or term-work credits. The SPPU credit framework handbook also sets a minimum of 22 credits per semester.'],
      ['Which subjects are in Semester I and Semester II?', 'Engineering Mathematics-I is in Semester I and Engineering Mathematics-II in Semester II. Fundamentals of Programming Languages is in Semester I and Programming and Problem Solving in Semester II. The book pairs Physics with Chemistry, Electronics with Electrical, and Graphics with Mechanics, with one half of each pair in each semester. The full lists are in the tables above.'],
      ['How many marks is each course?', 'A theory course is CCE 30 plus End-Sem 70, with 25 marks of term work on top. Courses without theory (workshop or lab, communication skills, co-curricular, Indian Knowledge System) carry 25 term-work marks only.'],
    ],
  },
  {
    slug: 'grading-system-sgpa',
    title: 'SPPU Grading System: Grade Points, SGPA and CGPA Class (Credit Framework)',
    metaDescription: 'SPPU credit framework grade bands (O to D), grade points, the SGPA formula with a worked example, and the CGPA to class table. Sourced from the official SPPU handbook, with its inconsistencies flagged.',
    h1: 'SPPU grading system: grades, SGPA and CGPA',
    crumb: 'Grading and SGPA',
    lead: 'How marks become grades, grades become grade points, and grade points become SGPA. All numbers come from the SPPU credit framework handbook for the Faculty of Science and Technology.',
    body: (
      <>
        <h2>Grades and grade points</h2>
        <div className="tw"><table style={{ minWidth: 300 }}><thead><tr><th>Grade</th><th>Grade points</th><th>Marks (out of 100)</th></tr></thead><tbody>
          {GRADES.map(g => <tr key={g[0]}><td>{g[0]}</td><td className="n">{g[1]}</td><td>{g[2]}</td></tr>)}
        </tbody></table></div>
        <p className="note">The handbook prints the fail row as "Marks of 40 or less", which overlaps the D band (40 to 44). We show it as "below the pass mark" instead of guessing a cutoff. The handbook also labels two bands "B" (B+ for 55 to 59, B for 50 to 54). Check your university exam rules for the exact fail boundary.</p>
        <h2>SGPA</h2>
        <p>SGPA is the credit-weighted average of grade points over every graded course in the semester:</p>
        <div className="eq">SGPA = sum(grade points x credits) / total credits</div>
        <p>Each graded row counts with its own credits, theory and term work or practical alike, the way the handbook lists them.</p>
        <h3>Worked example (made-up numbers)</h3>
        <div className="tw"><table style={{ minWidth: 300 }}><thead><tr><th>Row</th><th>Credits</th><th>Grade</th><th>Points</th><th>Credits x points</th></tr></thead><tbody>
          <tr><td>Theory A</td><td className="n">3</td><td className="n">A+</td><td className="n">9</td><td className="n">27</td></tr>
          <tr><td>Tutorial A</td><td className="n">1</td><td className="n">A</td><td className="n">8</td><td className="n">8</td></tr>
          <tr><td>Theory B</td><td className="n">2</td><td className="n">B+</td><td className="n">7</td><td className="n">14</td></tr>
          <tr><td>Practical B</td><td className="n">1</td><td className="n">O</td><td className="n">10</td><td className="n">10</td></tr>
          <tr className="tot"><td>Total</td><td className="n">7</td><td></td><td></td><td className="n">59</td></tr>
        </tbody></table></div>
        <p>SGPA = 59 / 7 = 8.43. This example is ours. The handbook's own sample table shows 98 credit points over 22 credits as an SGPA of 8.9, which does not add up, so we did not copy it.</p>
        <p><a className="cta" href={SITE + '/#/calculator'}>Use the SGPA calculator</a></p>
        <h2>CGPA and class of degree</h2>
        <p>CGPA is calculated the same way as SGPA, over all semesters of the programme. If you clear a failed course or improve a grade, the new grade replaces the old one in both SGPA and CGPA. The class awarded depends on CGPA:</p>
        <div className="tw"><table style={{ minWidth: 300 }}><thead><tr><th>CGPA</th><th>Class</th></tr></thead><tbody>
          {CLASSES.map(c => <tr key={c[0]}><td>{c[0]}</td><td>{c[1]}</td></tr>)}
        </tbody></table></div>
        <p className="note">We do not give a CGPA to percentage conversion. The handbook has a formula table for it, but its worked values do not match its own example, so we left it out rather than publish a number that might be wrong. Use the formula your college or the university notice gives you.</p>
      </>
    ),
    faq: [
      ['What is the grade point for each grade in SPPU?', 'O is 10, A+ is 9, A is 8, B+ is 7, B is 6, C is 5, D is 4, and F or Ab is 0, per the SPPU credit framework handbook.'],
      ['How is SGPA calculated?', 'Multiply the grade points of each course by its credits, add them up, and divide by the total credits of the semester.'],
      ['Is there a CGPA to percentage formula here?', 'No. The handbook formulas conflict with its own worked example, so this page does not publish a conversion.'],
    ],
  },
  {
    slug: 'cce-end-sem-exam-pattern',
    title: 'SPPU FE 2024 Pattern Exam Pattern: CCE 30 Marks, End-Sem 70, Term Work',
    metaDescription: 'How SPPU First Year Engineering 2024 pattern marks are earned: CCE 30 marks (unit test 12, assignments 12, seminar or quiz 6), End-Sem 70 by the university, and term work 25 from your journal.',
    h1: 'CCE, End-Sem and term work: how the marks are earned',
    crumb: 'Exam pattern',
    lead: 'The First Year 2024 pattern syllabus book has a guidelines section for examination scheme. This page restates it in plain words, with nothing added.',
    body: (
      <>
        <div className="chips"><span className="chip">CCE 30</span><span className="chip">End-Sem 70</span><span className="chip">Term work 25</span></div>
        <h2>CCE: 30 marks, run by your college</h2>
        <p>Comprehensive Continuous Evaluation covers all five units and is held at institute level.</p>
        <div className="tw"><table style={{ minWidth: 300 }}><thead><tr><th>Part</th><th>Marks</th><th>Units</th></tr></thead><tbody>
          <tr><td>Unit test</td><td className="n">12</td><td>Units I and II</td></tr>
          <tr><td>Assignments or case study</td><td className="n">12</td><td>Units III and IV</td></tr>
          <tr><td>Seminar presentation, open book test or quiz</td><td className="n">6</td><td>Unit V</td></tr>
        </tbody></table></div>
        <p>The book's example timeline: Units I and II in weeks 1 to 4 with the unit test in week 5, Units III and IV in weeks 6 to 8 with assignments collected in week 9, Unit V in weeks 10 to 12 and the seminar, open book test or quiz in week 13. The unit test is built on Bloom's taxonomy levels. For the seminar, you give a talk on a Unit V topic and answer questions, with slides and a 2 to 3 page summary.</p>
        <h2>End-Sem: 70 marks, set by the university</h2>
        <p>A written theory paper on all five units, scheduled by the university, with question papers delivered through QPD (Question Paper Delivery). It is designed on Bloom's taxonomy, from remembering up to creating.</p>
        <p className="note">We do not show a marks split per unit. The book says 14 marks per unit for the 70, then also says 12 marks per unit, and the two cannot both be right. Do not rely on any unit-wise weightage you see quoted.</p>
        <h2>Term work: 25 marks, from your journal</h2>
        <p>Term work is continuous assessment of the journal of practical assignments, with a reflection on each. The book's evaluation criteria:</p>
        <div className="tw"><table style={{ minWidth: 300 }}><thead><tr><th>Criterion</th><th>Weight</th></tr></thead><tbody>
          <tr><td>Completeness</td><td className="n">20%</td></tr><tr><td>Quality of work</td><td className="n">40%</td></tr>
          <tr><td>Organization</td><td className="n">20%</td></tr><tr><td>Presentation</td><td className="n">10%</td></tr><tr><td>Creativity and engagement</td><td className="n">10%</td></tr>
        </tbody></table></div>
        <p>The book's sample timeline has the journal finalized in week 10 and submitted in week 11. The final term-work grade goes to SPPU at the end of the semester.</p>
        <p>See the <a href={SITE + '/syllabus/first-year-scheme-credits/'}>scheme and credits tables</a> for which courses carry which marks, and the <a href={SITE + '/syllabus/grading-system-sgpa/'}>grading page</a> for how they turn into grades.</p>
      </>
    ),
    faq: [
      ['How is the 30 marks CCE divided in SPPU 2024 pattern?', 'Unit test 12 marks on Units I and II, assignments or case study 12 marks on Units III and IV, and a seminar, open book test or quiz for 6 marks on Unit V.'],
      ['Who conducts the End-Sem exam?', 'The university. It is a 70 mark written paper on all five units, and the question paper is delivered through QPD.'],
      ['What decides the term work marks?', 'Your journal of practical assignments, judged on completeness, quality, organization, presentation and creativity, as described in the syllabus book.'],
    ],
  },
];

export function renderInfoPage(c: InfoPage): string {
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
        <meta property="og:title" content={c.title} />
        <meta property="og:description" content={c.metaDescription} />
        <meta property="og:url" content={SITE + PATH} />
        <meta property="og:image" content={SITE + '/assets/ProjectPrepTracker.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <style dangerouslySetInnerHTML={{ __html: css + extra }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'BreadcrumbList', itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'PrepTracker', item: SITE + '/' },
              { '@type': 'ListItem', position: 2, name: c.crumb, item: SITE + PATH } ] },
            { '@type': 'FAQPage', mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
          ] }) }} />
      </head>
      <body>
        <main>
          <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / Syllabus / {c.crumb}</nav>
          <h1>{c.h1}</h1>
          <p className="lead">{c.lead}</p>
          {c.body}
          <h2>FAQ</h2>
          {c.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          <footer>
            <p>Sources: <a href={SYLLABUS_PDF} rel="noopener">SPPU First Year Engineering 2024 pattern syllabus (official PDF)</a> and the <a href={HANDBOOK} rel="noopener">SPPU credit framework handbook</a>. PrepTracker is an independent student project, not affiliated with SPPU. Check the official documents for the latest rules.</p>
            <p><a href={SITE + '/'}>PrepTracker home</a></p>
          </footer>
        </main>
      </body>
    </html>
  );
  return '<!doctype html>' + renderToStaticMarkup(page);
}

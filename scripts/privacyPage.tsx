import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { css, SITE } from './syllabusPage';

// Static /privacy/ page, same render pipeline and reading design as the
// syllabus library. Plain-language privacy note: what is stored, where, and
// how analytics consent works.

export function renderPrivacyPage(): string {
  const path = '/privacy/';
  const title = 'Privacy - PrepTracker';
  const desc = 'What PrepTracker stores (your study data stays in your browser), how cookies and optional analytics work, your rights, and how to change your choices.';
  const page = (
    <html lang="en"><head>
      <meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title><meta name="description" content={desc} />
      <link rel="canonical" href={SITE + path} /><meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#F7F5F2" /><link rel="icon" type="image/svg+xml" href={SITE + '/logo.svg'} />
      <meta property="og:type" content="website" /><meta property="og:site_name" content="PrepTracker" />
      <meta property="og:title" content={title} /><meta property="og:description" content={desc} /><meta property="og:url" content={SITE + path} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <link href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </head><body><main>
      <nav className="crumbs"><a href={SITE + '/'}>PrepTracker</a> / Privacy</nav>
      <h1>Privacy policy</h1>
      <p className="lead">The short version: your study data never leaves your browser, there is no account, and analytics cookies run only if you accept them.</p>
      <p className="draft"><b>Last updated: 22 October 2026.</b> PrepTracker is an independent student project, not affiliated with Savitribai Phule Pune University.</p>

      <h2>Who we are</h2>
      <p>PrepTracker (<a href={SITE + '/'}>preptracker.manavdev.site</a>) is an independent study planner for SPPU students. For anything in this policy, contact <a href="mailto:sia@manavdev.site">sia@manavdev.site</a>.</p>

      <h2>What stays on your device</h2>
      <p>PrepTracker has no accounts and no server-side database. The following is stored only in your own browser's local storage:</p>
      <ul>
        <li><b>Study data:</b> your profile, syllabus progress, tasks, marks, revision state and custom resources.</li>
        <li><b>Cookie choice:</b> whether you accepted or rejected analytics cookies, so the banner does not keep asking.</li>
      </ul>
      <ul>
        <li><b>Backups</b> are files you export yourself; they go only where you share or save them.</li>
        <li><b>Deleting everything:</b> use the reset option in the app's Settings, or clear this site's data in your browser. Both remove every stored key.</li>
        <li>Switching browsers or devices starts fresh unless you restore a backup.</li>
      </ul>

      <h2>Cookies and similar storage</h2>
      <p>This site uses two categories:</p>
      <ul>
        <li><b>Strictly necessary</b> - the on-device storage described above. The site cannot function without it, so it is always on and is never sent to us.</li>
        <li><b>Analytics cookies</b> - optional. They measure anonymous visit statistics: which pages are viewed, how long visits last, the approximate region (country or city level, derived from a truncated IP address), and the device and browser type. They are set only after you press <b>Accept</b> on the cookie banner, and they never track you across other websites.</li>
      </ul>
      <p>Your choice is remembered on this device. To change it, use the <b>Cookie settings</b> button below to reset the banner, or clear this site's data in your browser.</p>
      <p><button type="button" id="cookie-reset" style={{borderRadius:999,padding:'9px 16px',font:"700 12px 'Satoshi','Space Grotesk',sans-serif",cursor:'pointer',border:0,background:'#D61A40',color:'#fff'}}>Cookie settings</button></p>

      <h2>Error reports</h2>
      <p>If something breaks while you use the app or read the library, the site sends a short error report to an error-monitoring provider so the bug can be found and fixed. A report contains the error message, the page address, and your browser and operating system type. It includes no name, email or account details, and none of your study data. Error reports are kept for up to 90 days, then deleted.</p>

      <h2>Third parties that process data for this site</h2>
      <ul>
        <li><b>Hosting and content delivery</b> - serves the site's files and sees the technical data any web server sees (IP address, browser type, time of request), used to deliver pages and prevent abuse.</li>
        <li><b>Analytics provider</b> - processes the anonymous visit statistics described above, only when you have accepted analytics cookies.</li>
        <li><b>Error-monitoring provider</b> - receives the error reports described above.</li>
      </ul>
      <p>Each provider processes only what its service needs, under its own privacy terms. Data may be processed on servers outside India; where it is, the providers apply their standard contractual safeguards. Analytics visit data is kept for no more than 14 months.</p>

      <h2>What PrepTracker does not do</h2>
      <ul>
        <li>No accounts, sign-ups or passwords.</li>
        <li>No advertising, ad trackers, profiling or selling of data.</li>
        <li>No collection of names, emails, phone numbers or precise locations.</li>
        <li>No sharing of your on-device study data with anyone - it never reaches a server.</li>
      </ul>

      <h2>Your rights</h2>
      <p>Most of your data never leaves your device, so you can exercise most rights directly: view or delete your stored study data and cookie choice at any time through the app's Settings or your browser settings.</p>
      <p>If you are in India, the Digital Personal Data Protection Act, 2023 gives you the right to access, correct and erase your personal data, and to grievance redressal. Because this site collects so little, these rights usually mean the optional analytics data described above. To exercise any of them, email <a href="mailto:sia@manavdev.site">sia@manavdev.site</a>; requests are answered within 30 days.</p>

      <h2>Children</h2>
      <p>PrepTracker is a general study tool and does not knowingly collect personal data from children. Since there are no accounts and analytics is opt-in and anonymous, no age-specific data is gathered.</p>

      <h2>Changes to this policy</h2>
      <p>If this policy changes, the "last updated" date at the top changes with it. Material changes are also flagged in the app for a reasonable time.</p>

      <h2>Contact and grievances</h2>
      <p>Questions, requests or complaints: <a href="mailto:sia@manavdev.site">sia@manavdev.site</a>. If a grievance is not resolved, you may also raise it with the Data Protection Board of India once its complaint mechanism is operational.</p>

      <script dangerouslySetInnerHTML={{ __html: "document.getElementById('cookie-reset').addEventListener('click',function(){try{localStorage.removeItem('pt_ga_consent')}catch(e){}location.reload()});" }} />

      <footer>
        <p>PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University.</p>
        <p><a href={SITE + '/'}>PrepTracker home</a> · <a href={SITE + '/syllabus/'}>Syllabus</a></p>
      </footer>
    </main></body></html>
  );
  return '<!doctype html>' + renderToStaticMarkup(page);
}

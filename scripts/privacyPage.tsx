import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { css, SITE } from './syllabusPage';

// Static /privacy/ page, same render pipeline and reading design as the
// syllabus library. Plain-language privacy note: what is stored, where, and
// how analytics consent works.

export function renderPrivacyPage(): string {
  const path = '/privacy/';
  const title = 'Privacy - PrepTracker';
  const desc = 'What PrepTracker stores (your progress stays in your browser), how the optional Google Analytics visit stats work, and how to delete everything.';
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
      <h1>Privacy</h1>
      <p className="lead">The short version: your study data never leaves your browser, there is no account, and visit statistics run only if you allow them.</p>
      <p className="draft"><b>Last updated: 22 October 2026.</b> PrepTracker is an independent student project, not affiliated with Savitribai Phule Pune University.</p>

      <h2>Your study data stays on your device</h2>
      <p>Your profile, syllabus progress, tasks, marks, revision state and custom resources are stored in your browser's local storage on your own device. They are never sent to a server, because PrepTracker has no server and no accounts.</p>
      <ul>
        <li><b>Backups</b> are files you export yourself; they go only where you share or save them.</li>
        <li><b>Deleting everything:</b> use the reset option in the app's Settings, or clear this site's data in your browser. Both remove every stored key.</li>
        <li>Switching browsers or devices starts fresh unless you restore a backup.</li>
      </ul>

      <h2>Visit statistics (optional)</h2>
      <p>With your permission, PrepTracker counts visits with Google Analytics 4 (property G-PWDXVCDCP8) to see which pages get used. This is off until you choose:</p>
      <ul>
        <li>Before you choose, Analytics runs with storage denied: no cookies are set and no identifier is stored.</li>
        <li><b>Allow stats</b> lets Analytics set its cookies and measure usage. <b>No thanks</b> keeps it denied.</li>
        <li>Your choice is stored in your browser (key <code>pt_ga_consent</code>) and applies to the app and every syllabus library page.</li>
        <li>To change your mind, clear this site's data in your browser; the consent note will appear again on your next visit.</li>
      </ul>
      <p>Google's own terms apply to Analytics: <a href="https://policies.google.com/privacy" rel="noopener">Google Privacy Policy</a>.</p>

      <h2>What PrepTracker does not do</h2>
      <ul>
        <li>No accounts, sign-ups or passwords.</li>
        <li>No advertising, ad trackers or selling of data.</li>
        <li>No collection of names, emails, phone numbers or precise locations.</li>
      </ul>

      <h2>Contact</h2>
      <p>Questions or removal requests: <a href="mailto:sia@manavdev.site">sia@manavdev.site</a>.</p>

      <footer>
        <p>PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University.</p>
        <p><a href={SITE + '/'}>PrepTracker home</a> · <a href={SITE + '/syllabus/'}>Syllabus</a></p>
      </footer>
    </main></body></html>
  );
  return '<!doctype html>' + renderToStaticMarkup(page);
}

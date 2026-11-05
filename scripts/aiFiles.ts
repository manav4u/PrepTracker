// Builders for the site-level AI agent files: ai.txt (usage policy) and
// llms-full.txt (every mirrored page in one fetch), plus the head tags that
// advertise the markdown mirrors. Pure functions so tests can pin the output
// without a build; prerender.mjs and prerender-landing.mjs call them.

export const AI_SITE = 'https://preptracker.manavdev.site';
export const CONTACT = 'sia@manavdev.site';
export const SITE_BLURB =
  'PrepTracker is a free, no-account study planner for SPPU engineering students: unit-wise syllabus tracking, an exam countdown, daily tasks and spaced revision. Data stays in the browser.';

export interface MirrorEntry {
  title: string;
  url: string; // absolute HTML page URL the mirror belongs to
  markdown: string; // mirror file contents
}

// ai.txt, following the ai-visibility.org.uk ai-txt spec v1.1.1 section
// names. Identity facts match llms.txt and the Organization JSON-LD exactly.
export function buildAiTxt(generated: string): string {
  return [
    '# ai.txt for PrepTracker (' + AI_SITE + ')',
    '# Spec: ai-visibility.org.uk ai-txt v1.1.1. Keep in sync with robots.txt and llms.txt.',
    '',
    '[identity]',
    'name: PrepTracker',
    'url: ' + AI_SITE,
    'description: ' + SITE_BLURB,
    'contact: ' + CONTACT,
    '',
    '[permissions]',
    'allowed: summarise, quote with attribution, cite, index for search and answers',
    '',
    '[restrictions]',
    'no fabricated quotes or endorsements',
    'no fake reviews or ratings',
    'do not present this content as your own',
    'no training on user data: the app stores everything in the visitor\'s browser, so no user data is served',
    '',
    '[attribution]',
    'cite as: PrepTracker (' + AI_SITE + ')',
    'link to the canonical HTML page, not the markdown mirror',
    '',
    '[scope]',
    'included: /, /syllabus/*, /privacy, /research/* and their markdown mirrors',
    'excluded: /app*, /onboarding, /library, /404 (app shells, noindex)',
    '',
    '[contact]',
    'email: ' + CONTACT,
    '',
    'Last updated: ' + generated,
    '',
  ].join('\n');
}

// llms-full.txt: the site's pages in one fetch. Order follows llms.txt: core
// pages, guides, subjects and branches, legal last. Per-course detail mirrors
// are numerous (140+) and long, so they are listed in llms.txt instead of
// being repeated here; the header states that limit, per the llms-full
// convention of keeping the file fetchable (~500k chars).
export function buildLlmsFull(generated: string, entries: MirrorEntry[], omitted?: { count: number; label: string }): string {
  const parts = [
    '# PrepTracker - full content',
    '',
    '> ' + SITE_BLURB,
    '',
    'Generated: ' + generated,
    'Pages: ' + entries.length,
  ];
  if (omitted && omitted.count > 0) {
    parts.push('Note: ' + omitted.count + ' ' + omitted.label + ' are not repeated here to keep this file small. Find each of them in llms.txt (' + AI_SITE + '/llms.txt) and fetch its markdown directly.');
  }
  for (const e of entries) {
    parts.push('', '---', '', '<!-- ' + e.url + ' -->', '', e.markdown.trim());
  }
  parts.push('');
  const out = parts.join('\n');
  if (out.length > 500_000) console.warn('llms-full.txt is ' + out.length + ' chars, over the ~500k guideline');
  return out;
}

// <meta name="ai-summary">: one or two factual sentences for a model that has
// already fetched the page. Defaults to the page description, per the prompt.
export function aiSummaryTag(summary: string): string {
  return '<meta name="ai-summary" content="' + escapeAttr(summary) + '">';
}

// Advertises the markdown mirror of a page from its HTML head.
export function markdownAlternateTag(pageUrl: string): string {
  return '<link rel="alternate" type="text/markdown" href="' + escapeAttr(pageUrl.replace(/\/$/, '') + '/index.md') + '">';
}

// Organization + WebSite JSON-LD for the landing page. Facts match ai.txt
// and llms.txt; same builder, same constants.
export function siteJsonLdScript(): string {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'PrepTracker',
        url: AI_SITE + '/',
        logo: AI_SITE + '/icon-512.png',
        description: SITE_BLURB,
        email: CONTACT,
        sameAs: ['https://github.com/manav4u/PrepTracker'],
      },
      {
        '@type': 'WebSite',
        name: 'PrepTracker',
        url: AI_SITE + '/',
        publisher: { '@type': 'Organization', name: 'PrepTracker' },
      },
    ],
  };
  return '<script type="application/ld+json">' + JSON.stringify(graph) + '</script>';
}

export function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

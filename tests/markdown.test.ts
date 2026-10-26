import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { htmlToMarkdown, decodeEntities, stripPlaceholderSections } from '../scripts/htmlToMarkdown.ts';

test('entities decode to real characters', () => {
  assert.equal(decodeEntities('a &amp; b &middot; c &rsquo;d&#39; e&#x2019;f'), "a & b · c ’d' e’f");
});

test('headings, paragraphs and links survive; scripts, svgs and buttons are dropped', () => {
  const html = `<main>
    <nav class="crumbs"><a href="https://x.test/">Home</a> / Section</nav>
    <h1>Title <em>here</em></h1>
    <p class="lead">Intro <a href="https://x.test/a">a link</a> done.</p>
    <script>track()</script><svg><path d="M0 0"/></svg><button>Cookie settings</button>
  </main>`;
  const md = htmlToMarkdown(html);
  assert.match(md, /# Title here/);
  assert.match(md, /Intro \[a link\]\(https:\/\/x\.test\/a\) done\./);
  assert.ok(!md.includes('Home'), 'nav chrome leaked');
  assert.ok(!md.includes('track()'), 'script content leaked');
  assert.ok(!md.includes('M0 0'), 'svg content leaked');
  assert.ok(!md.includes('Cookie settings'), 'button label leaked');
});

test('lists nest and ordered lists number themselves', () => {
  const md = htmlToMarkdown('<main><ul><li>one</li><li>two<ul><li>two-a</li></ul></li></ul><ol><li>first</li><li>second</li></ol></main>');
  assert.match(md, /- one\n- two\n {2}- two-a/);
  assert.match(md, /1\. first\n2\. second/);
});

test('tables become pipe tables with a header separator', () => {
  const md = htmlToMarkdown('<main><table><thead><tr><th>Grade</th><th>Points</th></tr></thead><tbody><tr><td>O</td><td>10</td></tr><tr><td><a href="https://x.test/g">A+</a></td><td>9</td></tr></tbody></table></main>');
  assert.match(md, /\| Grade \| Points \|\n\| --- \| --- \|/);
  assert.match(md, /\| O \| 10 \|/);
  assert.match(md, /\| \[A\+\]\(https:\/\/x\.test\/g\) \| 9 \|/);
});

test('details/summary FAQ becomes a bold question and an answer', () => {
  const md = htmlToMarkdown('<main><details><summary>How many units?</summary><p>Five units.</p></details></main>');
  assert.match(md, /\*\*How many units\?\*\*\n\nFive units\./);
});

test('placeholder testimonial sections are stripped from the landing mirror', () => {
  const html = '<section class="sec testi" aria-label="What students say"><h2>In their own words.</h2><figure data-placeholder="testimonial"><blockquote>Great app</blockquote></figure></section><h2>Real heading</h2>';
  const stripped = stripPlaceholderSections(html);
  assert.ok(!stripped.includes('data-placeholder'));
  const md = htmlToMarkdown('<main>' + stripped + '</main>');
  assert.ok(!md.includes('Great app'));
  assert.match(md, /## Real heading/);
});

test('sitemap lists only trailing-slash public paths and no app routes', () => {
  const xml = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.ok(locs.length > 100, 'sitemap unexpectedly small');
  for (const u of locs) {
    assert.ok(u.endsWith('/'), `not a trailing-slash path: ${u}`);
    assert.ok(!new URL(u).pathname.split('/').includes('app'), `app route leaked into sitemap: ${u}`);
  }
});

test('rowspan cells expand so every row stays rectangular under its header', () => {
  const md = htmlToMarkdown('<main><table><thead><tr><th>Head</th><th>Marks</th><th>Credit</th></tr></thead><tbody><tr><td>CCE</td><td>40</td><td rowSpan="2">2</td></tr><tr><td>End-sem</td><td>60</td></tr></tbody></table></main>');
  assert.match(md, /\| Head \| Marks \| Credit \|\n\| --- \| --- \| --- \|\n\| CCE \| 40 \| 2 \|\n\| End-sem \| 60 \| 2 \|/);
});

test('colspan cells expand across every column they cover', () => {
  const md = htmlToMarkdown('<main><table><tbody><tr><td>a</td><td>b</td><td>c</td></tr><tr><td colspan="2">wide</td><td>c2</td></tr></tbody></table></main>');
  assert.match(md, /\| a \| b \| c \|\n\| wide \| wide \| c2 \|/);
});

test('fragment-only links resolve against the canonical page URL', () => {
  const md = htmlToMarkdown('<main><p><a href="#unit-1">Unit permalink</a> and <a href="https://x.test/a">normal</a></p></main>', 'https://x.test/syllabus/course/');
  assert.match(md, /\[Unit permalink\]\(https:\/\/x\.test\/syllabus\/course\/#unit-1\)/);
  assert.match(md, /\[normal\]\(https:\/\/x\.test\/a\)/);
});

test('fragment links without a page URL stay visible for the build check to catch', () => {
  const md = htmlToMarkdown('<main><p><a href="#unit-1">jump</a></p></main>');
  assert.match(md, /\[jump\]\(#unit-1\)/);
});

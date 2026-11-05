import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAiTxt, buildLlmsFull, aiSummaryTag, markdownAlternateTag, siteJsonLdScript } from '../scripts/aiFiles.ts';

test('ai.txt carries every spec section and the site identity', () => {
  const txt = buildAiTxt('2026-11-05');
  for (const sec of ['[identity]', '[permissions]', '[restrictions]', '[attribution]', '[scope]', '[contact]']) {
    assert.ok(txt.includes(sec), 'missing ' + sec);
  }
  assert.match(txt, /name: PrepTracker/);
  assert.match(txt, /url: https:\/\/preptracker\.manavdev\.site/);
  assert.match(txt, /sia@manavdev\.site/);
  assert.match(txt, /Last updated: 2026-11-05/);
  assert.ok(txt.includes('/app*'), 'scope must exclude app shells');
});

test('llms-full.txt joins entries in order with one separator each', () => {
  const out = buildLlmsFull('2026-11-05', [
    { title: 'Home', url: 'https://preptracker.manavdev.site/', markdown: '# Home\n' },
    { title: 'Privacy', url: 'https://preptracker.manavdev.site/privacy/', markdown: '# Privacy\n' },
  ]);
  assert.match(out, /^# PrepTracker - full content/);
  assert.match(out, /Generated: 2026-11-05/);
  assert.match(out, /Pages: 2/);
  assert.equal((out.match(/\n---\n/g) || []).length, 2);
  assert.equal((out.match(/\n<!-- /g) || []).length, 2);
  assert.ok(out.indexOf('# Home') < out.indexOf('# Privacy'), 'order preserved');
});

test('head tags escape attributes and point at the mirror', () => {
  assert.equal(aiSummaryTag('a "quoted" <thing>'), '<meta name="ai-summary" content="a &quot;quoted&quot; &lt;thing&gt;">');
  assert.equal(
    markdownAlternateTag('https://preptracker.manavdev.site/syllabus/x/'),
    '<link rel="alternate" type="text/markdown" href="https://preptracker.manavdev.site/syllabus/x/index.md">'
  );
  assert.equal(
    markdownAlternateTag('https://preptracker.manavdev.site/'),
    '<link rel="alternate" type="text/markdown" href="https://preptracker.manavdev.site/index.md">'
  );
});

test('JSON-LD carries Organization and WebSite with matching facts', () => {
  const tag = siteJsonLdScript();
  const json = JSON.parse(tag.replace('<script type="application/ld+json">', '').replace('</script>', ''));
  const types = json['@graph'].map((n: { '@type': string }) => n['@type']);
  assert.deepEqual(types, ['Organization', 'WebSite']);
  assert.equal(json['@graph'][0].url, 'https://preptracker.manavdev.site/');
  assert.equal(json['@graph'][0].email, 'sia@manavdev.site');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseAnnouncements,
  unreadAnnouncements,
  markAllAnnouncementsSeen,
  getAnnouncementsState,
  __resetAnnouncementsForTests,
  type Announcement,
} from '../lib/announcements.ts';

const good: Announcement = { id: 'a1', date: '2026-10-24', tag: 'Update', title: 'Hello', body: 'World' };

test('a well-formed file parses and sorts newest first', () => {
  const items = parseAnnouncements({
    version: 1,
    items: [
      { ...good, id: 'old', date: '2026-10-01' },
      { ...good, id: 'new', date: '2026-10-24' },
    ],
  });
  assert.deepEqual(items.map((i) => i.id), ['new', 'old']);
});

test('wrong version or non-object input yields nothing, never throws', () => {
  assert.deepEqual(parseAnnouncements(null), []);
  assert.deepEqual(parseAnnouncements('junk'), []);
  assert.deepEqual(parseAnnouncements({ version: 2, items: [{ ...good }] }), []);
  assert.deepEqual(parseAnnouncements({ version: 1, items: 'nope' }), []);
});

test('malformed entries are dropped, valid siblings survive', () => {
  const items = parseAnnouncements({
    version: 1,
    items: [
      good,
      { id: 'x' }, // missing fields
      { ...good, id: 'bad-date', date: '24 Oct' },
      { ...good, id: '', date: '2026-10-24' },
    ],
  });
  assert.deepEqual(items.map((i) => i.id), ['a1']);
});

test('only https links are kept', () => {
  const items = parseAnnouncements({
    version: 1,
    items: [
      { ...good, id: 'ok', link: 'https://example.com/a' },
      { ...good, id: 'js', link: 'javascript:alert(1)' },
      { ...good, id: 'http', link: 'http://example.com' },
    ],
  });
  assert.equal(items.find((i) => i.id === 'ok')?.link, 'https://example.com/a');
  assert.equal(items.find((i) => i.id === 'js')?.link, undefined);
  assert.equal(items.find((i) => i.id === 'http')?.link, undefined);
});

test('the feed is capped at 20 items', () => {
  const many = Array.from({ length: 30 }, (_, i) => ({ ...good, id: `a${i}`, date: `2026-10-${String(i + 1).padStart(2, '0')}` }));
  assert.equal(parseAnnouncements({ version: 1, items: many }).length, 20);
});

test('unread is everything not yet seen; marking seen clears it', () => {
  __resetAnnouncementsForTests({ items: [good, { ...good, id: 'a2' }], seen: [], loaded: true });
  assert.equal(unreadAnnouncements().length, 2);
  markAllAnnouncementsSeen();
  assert.equal(unreadAnnouncements().length, 0);
  // A later post is unread again.
  __resetAnnouncementsForTests({ items: [good, { ...good, id: 'a2' }, { ...good, id: 'a3' }], seen: getAnnouncementsState().seen, loaded: true });
  assert.deepEqual(unreadAnnouncements().map((a) => a.id), ['a3']);
});

test('invalid schema, invalid entries and network errors retain current notices; intentional empty feed clears', async () => {
  const { refreshAnnouncements } = await import('../lib/announcements.ts');
  const original = globalThis.fetch;
  try {
    for (const raw of [{version:2,items:[]},{version:1,items:[{id:'broken'}]},{version:1,items:[good,{...good}]}]) {
      __resetAnnouncementsForTests({items:[good], seen:[], loaded:false});
      globalThis.fetch = async () => new Response(JSON.stringify(raw), {status:200});
      await refreshAnnouncements('/sample.json');
      assert.deepEqual(getAnnouncementsState().items,[good]);
      assert.equal(getAnnouncementsState().loaded,true);
    }
    globalThis.fetch = async () => new Response('{bad-json', {status:200});
    await refreshAnnouncements('/sample.json');
    assert.deepEqual(getAnnouncementsState().items,[good]);
    globalThis.fetch = async () => {throw Error('offline');};
    await refreshAnnouncements('/sample.json');
    assert.deepEqual(getAnnouncementsState().items,[good]);
    globalThis.fetch = async () => new Response('', {status:500});
    await refreshAnnouncements('/sample.json');
    assert.deepEqual(getAnnouncementsState().items,[good]);
    globalThis.fetch = async () => new Response(JSON.stringify({version:1,items:[]}));
    await refreshAnnouncements('/sample.json');
    assert.deepEqual(getAnnouncementsState().items,[]);
  } finally { globalThis.fetch=original; }
});

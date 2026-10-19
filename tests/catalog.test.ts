import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { deriveOutline } from '../lib/outline.ts';
import { toSubjects, branchesFor, branchOf, type CatalogIndex, type RawCourse } from '../lib/catalog.ts';

const dir = new URL('../data/catalog/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir), 'utf8')) as CatalogIndex;
const files = readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'index.json');
const all = files.flatMap(f => JSON.parse(readFileSync(new URL(f, dir), 'utf8')) as RawCourse[]);
const words = (s: string) => s.replace(/;/g, ' ').split(/\s+/).filter(Boolean); // semicolons are the split points, not words

test('outline never changes, adds or drops a word', () => {
  for (const c of all) for (const u of c.units) {
    assert.deepEqual(words(deriveOutline(u.text).join(' ')), words(u.text), `${c.id} unit ${u.unit_number}`);
  }
});

test('outline does not split commas or abbreviations', () => {
  assert.deepEqual(deriveOutline('Sets, relations and functions; Graphs e.g. Trees. Next topic'), ['Sets, relations and functions', 'Graphs e.g. Trees.', 'Next topic']);
});

test('outline turns a one-paragraph unit into several lines for real syllabus text', () => {
  const multi = all.flatMap(c => c.units).filter(u => deriveOutline(u.text).length > 1).length;
  const total = all.flatMap(c => c.units).length;
  assert.ok(multi / total > 0.5, `${multi}/${total} units split`);
  for (const c of all) for (const u of c.units) assert.ok(deriveOutline(u.text).length >= 1, `${c.id} unit ${u.unit_number} is empty`);
});

test('every course id is unique and every course is in the index', () => {
  const ids = all.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(index.courses.length, ids.length);
  for (const c of all) assert.equal(branchOf(index, c.id), c.branchSlug);
});

test('every course has units with an id, number and title; reference-only courses are never tracker ready', () => {
  for (const c of all) {
    assert.ok(c.units.length > 0, c.id);
    for (const u of c.units) { assert.ok(u.id && u.title && u.unit_number > 0, `${c.id}`); }
    if (c.branchSlug === 'se-cyber-security' || c.branchSlug === 'se-automobile-engineering') assert.ok(!c.trackerReady, `${c.id} must stay reference-only`);
  }
});

test('branchesFor maps picked course ids to the branch files to load, ignoring first-year ids', () => {
  const te = all.find(c => c.branchSlug === 'te-information-technology')!;
  const se = all.find(c => c.branchSlug === 'se-computer-engineering')!;
  assert.deepEqual(branchesFor(index, ['m1', te.id, se.id, te.id, 'unknown']).sort(), ['se-computer-engineering', 'te-information-technology']);
  assert.deepEqual(branchesFor(index, ['m1', 'chem']), []);
});

test('toSubjects keeps unit ids and hours and fills topics', () => {
  const [s] = toSubjects([all[0]]);
  assert.equal(s.units[0].id, all[0].units[0].id);
  assert.ok(s.units[0].topics.length >= 1);
  assert.equal(s.units[0].hours, all[0].units[0].hours);
});

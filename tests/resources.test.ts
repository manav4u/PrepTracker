import test from 'node:test';
import assert from 'node:assert/strict';
import { resourceMatchesSubject } from '../lib/resources.ts';
import type { ResourceItem, Subject } from '../types.ts';

const subject = (over: Partial<Subject>): Subject => ({
  id: 's1',
  name: 'DSA',
  code: 'BSC-101',
  credits: 4,
  units: [],
  ...over,
});

const resource = (over: Partial<ResourceItem>): ResourceItem => ({
  id: 'r1',
  type: 'pdf',
  title: 'Notes',
  author: 'A',
  downloads: '1k',
  subject: 'BSC-101',
  category: 'notes',
  url: 'https://example.com',
  ...over,
});

test('branch archive link matches every course in that branch file only', () => {
  const r = resource({ branchSlug: 'comp', subject: 'BSC-101' });
  assert.equal(resourceMatchesSubject(r, subject({ branchSlug: 'comp', code: 'XYZ-999' })), true);
  assert.equal(resourceMatchesSubject(r, subject({ branchSlug: 'it' })), false);
  assert.equal(resourceMatchesSubject(r, subject({})), false);
});

test('GLOBAL shows on every subject', () => {
  const r = resource({ subject: 'GLOBAL' });
  assert.equal(resourceMatchesSubject(r, subject({ year: 'FE' })), true);
  assert.equal(resourceMatchesSubject(r, subject({ year: 'SE' })), true);
});

test('FE resources show on first-year subjects only', () => {
  const r = resource({ subject: 'FE' });
  assert.equal(resourceMatchesSubject(r, subject({ year: 'FE' })), true);
  // FE subjects in constants.tsx carry no year at all.
  assert.equal(resourceMatchesSubject(r, subject({})), true);
  assert.equal(resourceMatchesSubject(r, subject({ year: 'SE' })), false);
  assert.equal(resourceMatchesSubject(r, subject({ year: 'TE' })), false);
});

test('other subjects match by course-code prefix', () => {
  const r = resource({ subject: 'BSC-1' });
  assert.equal(resourceMatchesSubject(r, subject({ code: 'BSC-101' })), true);
  assert.equal(resourceMatchesSubject(r, subject({ code: 'BSC-105' })), true);
  assert.equal(resourceMatchesSubject(r, subject({ code: 'ESC-105' })), false);
});

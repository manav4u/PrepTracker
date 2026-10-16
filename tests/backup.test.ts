import test from 'node:test';
import assert from 'node:assert/strict';
import { KEYS, ROLLBACK_KEY, createBackup, parseBackup, restoreBackup, rollbackRestore, hasRollback, readState } from '../lib/backup.ts';

class Mem {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? (this.m.get(k) as string) : null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}
const profile = { name: 'A', theme: 'dark', selectedSubjects: ['m1', 'fpl'], setupComplete: true, streak: 2, lastStudyDate: '' };
const progress = [{ unitId: 'm1-u1', status: 'Mastered', pyqsCompleted: ['2023-May'] }];
const seed = (s: Mem) => {
  s.setItem(KEYS.profile, JSON.stringify(profile));
  s.setItem(KEYS.progress, JSON.stringify(progress));
  s.setItem(KEYS.marks, JSON.stringify({ m1: { inSem: 20, endSem: 50 } }));
  s.setItem(KEYS.tasks, JSON.stringify([{ id: 't1', text: 'Lab', completed: false, priority: 'NORMAL', category: 'LAB', createdAt: '2026-10-01' }]));
};

test('export uses the real progress key and round-trips', () => {
  const s = new Mem(); seed(s);
  const b = createBackup(s);
  assert.equal(b.metadata.version, '4.0.0');
  assert.deepEqual(b.data.progress, progress);
  assert.deepEqual(b.data.marks, { m1: { inSem: 20, endSem: 50 } });
  const t = new Mem();
  const p = parseBackup(JSON.stringify(b), readState(t));
  restoreBackup(t, p.data);
  assert.deepEqual(JSON.parse(t.getItem(KEYS.progress) as string), progress);
  assert.deepEqual(JSON.parse(t.getItem(KEYS.profile) as string), profile);
  assert.equal(p.counts.units, 1);
});

test('restore keeps a rollback copy and undo brings the old data back', () => {
  const s = new Mem(); seed(s);
  const b = createBackup(s);
  const t = new Mem();
  t.setItem(KEYS.tasks, '[]');
  restoreBackup(t, b.data);
  assert.ok(hasRollback(t));
  rollbackRestore(t);
  assert.equal(t.getItem(KEYS.progress), null);
  assert.equal(t.getItem(KEYS.tasks), '[]');
});

test('legacy 3.1.0 file with empty progress does not wipe current progress', () => {
  const s = new Mem(); seed(s);
  const legacy = { metadata: { version: '3.1.0', type: 'SPPU_PREPTRACKER_LOCAL_BACKUP', timestamp: 'x', agent: 'ua' }, data: { profile, progress: [], marks: {}, resources: [], tasks: [] } };
  const p = parseBackup(JSON.stringify(legacy), readState(s));
  assert.deepEqual(p.data.progress, progress);
  assert.ok(p.warnings.some((w) => /older exporter/.test(w)));
  assert.ok(p.warnings.some((w) => /current unit progress is kept/.test(w)));
});

test('rejects wrong type, wrong version, bad JSON, bad sections, oversize', () => {
  const cur = readState(new Mem());
  assert.throws(() => parseBackup('nope', cur), /not valid JSON/);
  assert.throws(() => parseBackup('{}', cur), /not a PrepTracker backup/);
  assert.throws(() => parseBackup(JSON.stringify({ metadata: { type: 'X', version: '4.0.0' }, data: {} }), cur), /not a PrepTracker backup/);
  assert.throws(() => parseBackup(JSON.stringify({ metadata: { type: 'SPPU_PREPTRACKER_LOCAL_BACKUP', version: '9.9.9' }, data: {} }), cur), /not supported/);
  const s = new Mem(); seed(s);
  const b: any = createBackup(s);
  b.data.progress = [{ unitId: 'x', status: 'Bogus', pyqsCompleted: [] }];
  assert.throws(() => parseBackup(JSON.stringify(b), cur), /progress section/);
  const c: any = createBackup(s); delete c.data.tasks;
  assert.throws(() => parseBackup(JSON.stringify(c), cur), /missing its tasks/);
  assert.throws(() => parseBackup(' '.repeat(5 * 1024 * 1024 + 1), cur), /over 5 MB/);
});

test('a failed restore puts existing data back', () => {
  const s = new Mem(); seed(s);
  const before = JSON.stringify([...s.m.entries()]);
  const b = createBackup(s);
  const t = new Mem(); t.setItem(KEYS.tasks, '[]');
  const orig = t.setItem.bind(t); let n = 0;
  t.setItem = (k, v) => { n++; if (n === 3) throw new Error('quota'); orig(k, v); };
  assert.throws(() => restoreBackup(t, b.data), /existing data was put back/);
  assert.equal(t.getItem(KEYS.tasks), '[]');
  assert.equal(t.getItem(ROLLBACK_KEY), null);
  assert.ok(before.length > 0);
});

test('export refuses to write a backup from corrupt saved data', () => {
  const s = new Mem(); s.setItem(KEYS.progress, '{"bad":1}');
  assert.throws(() => createBackup(s), /unexpected shape/);
  s.setItem(KEYS.progress, '{oops');
  assert.throws(() => createBackup(s), /unreadable/);
});

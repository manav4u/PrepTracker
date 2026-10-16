// Backup and restore for PrepTracker's browser storage.
// One shared key list is used by the app, export and restore so they cannot drift apart again.
import { cleanMarks } from './grading.ts';

export const KEYS = {
  profile: 'sppu_profile',
  progress: 'sppu_progress',
  marks: 'sppu_calculator_marks',
  resources: 'sppu_custom_resources',
  tasks: 'sppu_tasks',
  hiddenResourceIds: 'sppu_deleted_system_ids',
} as const;
export type Field = keyof typeof KEYS;
export const FIELDS = Object.keys(KEYS) as Field[];

export const ROLLBACK_KEY = 'sppu_backup_rollback';
export const BACKUP_TYPE = 'SPPU_PREPTRACKER_LOCAL_BACKUP';
// 4.0.0 is the first version that exports the real progress key. Older files were written by a
// buggy exporter (3.1.0) that read a key the app never used, so their progress is empty.
export const BACKUP_VERSION = '4.0.0';
export const SUPPORTED_VERSIONS = ['3.1.0', '4.0.0'];
export const MAX_BYTES = 5 * 1024 * 1024;

export interface StorageLike {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

export type BackupData = Record<Field, any>;

const plain = (x: unknown): x is Record<string, unknown> =>
  x !== null && typeof x === 'object' && !Array.isArray(x);
const str = (x: unknown): x is string => typeof x === 'string' && x.length <= 10000;
const strs = (x: unknown): x is string[] => Array.isArray(x) && x.length <= 10000 && x.every(str);
const rows = (x: unknown, check: (v: Record<string, unknown>) => boolean) =>
  Array.isArray(x) && x.length <= 10000 && x.every((v) => plain(v) && check(v));

const UNIT_STATUS = ['Not Started', 'In Progress', 'Revision', 'Mastered'];
const PRIORITY = ['CRITICAL', 'NORMAL', 'LOW'];
const CATEGORY = ['EXAM', 'LAB', 'SUBMISSION', 'GENERAL'];
const RES_TYPE = ['video', 'pdf', 'book', 'link'];

const checks: Record<Field, (x: unknown) => boolean> = {
  profile: (x) =>
    x === null ||
    (plain(x) &&
      str(x.name) &&
      strs(x.selectedSubjects) &&
      typeof x.setupComplete === 'boolean' &&
      (x.theme === 'light' || x.theme === 'dark') &&
      typeof x.streak === 'number' &&
      str(x.lastStudyDate)),
  progress: (x) =>
    rows(x, (v) => str(v.unitId) && UNIT_STATUS.includes(v.status as string) && strs(v.pyqsCompleted)),
  tasks: (x) =>
    rows(
      x,
      (v) =>
        str(v.id) &&
        str(v.text) &&
        typeof v.completed === 'boolean' &&
        PRIORITY.includes(v.priority as string) &&
        CATEGORY.includes(v.category as string) &&
        str(v.createdAt) &&
        (v.dueDate === undefined || str(v.dueDate))
    ),
  resources: (x) =>
    rows(
      x,
      (v) =>
        RES_TYPE.includes(v.type as string) &&
        ['id', 'title', 'author', 'downloads', 'subject', 'category', 'url'].every((k) => str(v[k])) &&
        /^https?:\/\//i.test(v.url as string)
    ),
  marks: (x) => plain(x) && JSON.stringify(cleanMarks(x)) === JSON.stringify(x),
  hiddenResourceIds: strs,
};

const defaults: BackupData = { profile: null, progress: [], marks: {}, resources: [], tasks: [], hiddenResourceIds: [] };

export function readState(storage: StorageLike): BackupData {
  const state: any = {};
  for (const f of FIELDS) {
    const raw = storage.getItem(KEYS[f]);
    let v: unknown = defaults[f];
    if (raw !== null) {
      try {
        v = JSON.parse(raw);
      } catch {
        throw new Error(`Saved ${f} is unreadable. Nothing was exported.`);
      }
    }
    if (!checks[f](v)) throw new Error(`Saved ${f} has an unexpected shape. Nothing was exported.`);
    state[f] = v;
  }
  return state;
}

export function createBackup(storage: StorageLike, now = new Date()) {
  return {
    metadata: { version: BACKUP_VERSION, type: BACKUP_TYPE, timestamp: now.toISOString() },
    data: readState(storage),
  };
}

export interface Preview {
  data: BackupData;
  warnings: string[];
  counts: { units: number; tasks: number; resources: number; marksCourses: number; courses: number };
  version: string;
}

/** Parse and validate a backup file without touching storage. Throws a readable Error. */
export function parseBackup(content: string, current: BackupData): Preview {
  if (new TextEncoder().encode(content).length > MAX_BYTES) throw new Error('That file is over 5 MB. Nothing was changed.');
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('That file is not valid JSON. Nothing was changed.');
  }
  if (!plain(parsed) || !plain(parsed.metadata) || !plain(parsed.data)) {
    throw new Error('That is not a PrepTracker backup. Nothing was changed.');
  }
  const meta = parsed.metadata as Record<string, unknown>;
  if (meta.type !== BACKUP_TYPE) throw new Error('That is not a PrepTracker backup. Nothing was changed.');
  const version = String(meta.version);
  if (!SUPPORTED_VERSIONS.includes(version)) {
    throw new Error(`Backup version ${version} is not supported by this version of PrepTracker. Nothing was changed.`);
  }

  const source = parsed.data as Record<string, unknown>;
  const warnings: string[] = [];
  const data: any = {};
  for (const f of FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(source, f)) {
      if (f === 'hiddenResourceIds' || version === '3.1.0') {
        data[f] = current[f];
        if (f !== 'hiddenResourceIds') warnings.push(`This older file has no ${f} section. Your current ${f} are kept.`);
        continue;
      }
      throw new Error(`The backup is missing its ${f} section. Nothing was changed.`);
    }
    if (!checks[f](source[f])) throw new Error(`The ${f} section of the backup is invalid. Nothing was changed.`);
    data[f] = source[f];
  }

  if (version === '3.1.0') {
    warnings.push(
      'This file was made by an older exporter that did not save unit progress. It cannot bring progress back.'
    );
    if (Array.isArray(data.progress) && data.progress.length === 0 && current.progress.length > 0) {
      data.progress = current.progress;
      warnings.push('Your current unit progress is kept instead of being replaced with an empty list.');
    }
  }
  if (data.profile === null) data.profile = current.profile;

  return {
    data,
    warnings,
    version,
    counts: {
      units: data.progress.length,
      tasks: data.tasks.length,
      resources: data.resources.length,
      marksCourses: Object.keys(data.marks).length,
      courses: data.profile?.selectedSubjects?.length ?? 0,
    },
  };
}

function snapshot(storage: StorageLike): Record<string, string | null> {
  return Object.fromEntries(FIELDS.map((f) => [KEYS[f], storage.getItem(KEYS[f])]));
}
function apply(storage: StorageLike, raw: Record<string, string | null>) {
  for (const [k, v] of Object.entries(raw)) {
    if (v === null) storage.removeItem(k);
    else storage.setItem(k, v);
  }
}

/** Replace saved data with the backup. Keeps a rollback copy and restores it if anything throws. */
export function restoreBackup(storage: StorageLike, data: BackupData) {
  for (const f of FIELDS) if (!checks[f](data[f])) throw new Error(`Invalid ${f}. Nothing was changed.`);
  const before = snapshot(storage);
  const oldRollback = storage.getItem(ROLLBACK_KEY);
  try {
    storage.setItem(ROLLBACK_KEY, JSON.stringify(before));
    apply(storage, Object.fromEntries(FIELDS.map((f) => [KEYS[f], JSON.stringify(data[f])])));
  } catch {
    try {
      apply(storage, before);
      if (oldRollback === null) storage.removeItem(ROLLBACK_KEY);
      else storage.setItem(ROLLBACK_KEY, oldRollback);
    } catch {
      throw new Error('Restore failed and the automatic rollback failed. Keep this tab open and download your backup.');
    }
    throw new Error('Restore failed. Your existing data was put back.');
  }
}

export function hasRollback(storage: StorageLike): boolean {
  try {
    const raw = JSON.parse(storage.getItem(ROLLBACK_KEY) || 'null');
    return plain(raw) && FIELDS.every((f) => Object.prototype.hasOwnProperty.call(raw, KEYS[f]));
  } catch {
    return false;
  }
}

/** Undo the last restore. The state before the undo becomes the new rollback copy. */
export function rollbackRestore(storage: StorageLike) {
  if (!hasRollback(storage)) throw new Error('There is no restore to undo.');
  const raw = JSON.parse(storage.getItem(ROLLBACK_KEY) as string) as Record<string, string | null>;
  const before = snapshot(storage);
  try {
    apply(storage, raw);
    storage.setItem(ROLLBACK_KEY, JSON.stringify(before));
  } catch {
    apply(storage, before);
    throw new Error('Undo failed. Your current data is unchanged.');
  }
}

/** Remove every PrepTracker key, including the rollback copy. */
export function wipeAll(storage: Storage) {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k && k.startsWith('sppu_')) keys.push(k);
  }
  keys.forEach((k) => storage.removeItem(k));
}

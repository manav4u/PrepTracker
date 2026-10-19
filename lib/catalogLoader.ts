// Loads one branch file on demand. Each file is its own chunk, fetched once and then cached.
import type { Subject } from '../types';
import { toSubjects, type RawCourse, type CatalogIndex } from './catalog.ts';
import indexJson from '../data/catalog/index.json';

export const CATALOG_INDEX = indexJson as unknown as CatalogIndex;

const files = import.meta.glob(['../data/catalog/*.json', '!../data/catalog/index.json'], { import: 'default' }) as Record<string, () => Promise<unknown>>;
const cache = new Map<string, Promise<Subject[]>>();

export function loadBranch(slug: string): Promise<Subject[]> {
  let p = cache.get(slug);
  if (!p) {
    const load = files[`../data/catalog/${slug}.json`];
    if (!load || slug === 'index') return Promise.reject(new Error(`Unknown branch ${slug}`));
    p = load().then(raw => toSubjects(raw as RawCourse[]));
    p.catch(() => cache.delete(slug)); // a failed fetch can be retried
    cache.set(slug, p);
  }
  return p;
}

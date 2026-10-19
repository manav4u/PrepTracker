// Course catalog for second and third year (2024 pattern). The text comes from official SPPU PDFs and is
// split into one file per branch, so a student only loads the branches they picked.
// First-year subjects stay in constants.tsx.

import type { Subject } from '../types';
import { deriveOutline } from './outline.ts';

/** One row of the small index that is loaded at startup. */
export interface CatalogEntry {
  id: string;
  name: string;
  code: string;
  credits: number;
  year: 'SE' | 'TE';
  branch: string;
  branchSlug: string;
  trackerReady?: boolean;
  draft?: boolean;
  type?: string;
  semester?: number;
  electiveGroup?: string;
  units: number;
}

export interface CatalogIndex {
  meta: { version: number; builtFrom: string; note: string };
  courses: CatalogEntry[];
}

interface RawUnit { id: string; unit_number: number; title: string; hours?: number | null; text: string }
export interface RawCourse extends Omit<Subject, 'units'> { units: RawUnit[] }

/** Turn a branch file into subjects the app can use. Topics are the unit text split into lines. */
export function toSubjects(raw: RawCourse[]): Subject[] {
  return raw.map(c => ({
    ...c,
    units: c.units.map(u => ({
      id: u.id,
      unit_number: u.unit_number,
      title: u.title,
      ...(typeof u.hours === 'number' ? { hours: u.hours } : {}),
      topics: deriveOutline(u.text),
    })),
  }));
}

/** Which branch file holds this course id. Undefined for first-year subjects and unknown ids. */
export function branchOf(index: CatalogIndex, id: string): string | undefined {
  return index.courses.find(c => c.id === id)?.branchSlug;
}

/** Branch files needed for a set of picked course ids. */
export function branchesFor(index: CatalogIndex, ids: string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    const b = branchOf(index, id);
    if (b) out.add(b);
  }
  return [...out];
}

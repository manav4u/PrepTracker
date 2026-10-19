import { ResourceItem, Subject } from '../types';

/**
 * Does this resource belong on this subject's shelf?
 * - branchSlug entries match every course in that branch file
 * - GLOBAL shows everywhere
 * - FE shows on first-year subjects only (constants FE subjects carry no year)
 * - anything else is a course-code prefix (BSC-101, ESC-105, ...)
 */
export function resourceMatchesSubject(r: ResourceItem, subject: Subject): boolean {
  if (r.branchSlug) return subject.branchSlug === r.branchSlug;
  if (r.subject === 'GLOBAL') return true;
  if (r.subject === 'FE') return !subject.year || subject.year === 'FE';
  return subject.code.startsWith(r.subject);
}

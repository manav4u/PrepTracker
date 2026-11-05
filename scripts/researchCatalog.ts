// Wires the real syllabus data into the pure researchData functions. Imported
// only by the prerender SSR bundle (vite resolves the extensionless and JSON
// imports), never by node --test.
import { SE_BRANCHES } from './seBranches';
import { SUBJECTS } from '../constants';
import { SUBJECT_PAGES } from './pages';
import { branchStats, catalogTotals, buildFindings, researchFaq } from './researchData';

export const RESEARCH_SLUG = 'sppu-syllabus-statistics-2026';
export const RESEARCH_PATH = '/research/' + RESEARCH_SLUG + '/';

export const realBranchStats = () => branchStats(SE_BRANCHES);
export const realTotals = () => catalogTotals(SE_BRANCHES, SUBJECTS, SUBJECT_PAGES.map((c) => c.id));
export const realFindings = () => buildFindings(SE_BRANCHES, SUBJECTS, SUBJECT_PAGES.map((c) => c.id));
export const realResearchFaq = () => researchFaq(SE_BRANCHES, SUBJECTS, SUBJECT_PAGES.map((c) => c.id));

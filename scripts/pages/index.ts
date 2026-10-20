import type { SubjectPageConfig } from '../syllabusPage';
import m1 from './m1';
import phy from './phy';
import chem from './chem';
import elect from './elect';
import elec from './elec';
import mech from './mech';
import fpl from './fpl';
import graph from './graph';
import m2 from './m2';
import pps from './pps';

// One config per subject. Each is checked against the official SPPU FE 2024 syllabus book.
export const SUBJECT_PAGES: SubjectPageConfig[] = [m1, phy, chem, elect, elec, mech, fpl, graph, m2, pps];

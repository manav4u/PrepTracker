import type { SeBranch } from './sePage';
import computer from './seData/computer.json';
import cse from './seData/cse.json';
import aids from './seData/aids.json';
import elec from './seData/elec.json';

// One entry per Second Year branch. Course data is checked against each branch's official SPPU 2024 pattern PDF.
export const SE_BRANCHES: SeBranch[] = [
  {
    slug: 'se-computer-engineering', branch: 'Computer Engineering', short: 'SE Computer', motif: 'computer', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20-%20Computer%20Engineering%20-%202024%20Pattern_18072025.pdf',
    pdfLabel: 'SPPU SE Computer Engineering 2024 pattern syllabus',
    courses: computer as SeBranch['courses'],
  },
  {
    slug: 'se-computer-science-and-engineering', branch: 'Computer Science and Engineering', short: 'SE CSE', motif: 'cse', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/SE%20Computer%20Science%20and%20Engineering%20-%202024%20Pattern%20-%20Revised_13062026.pdf',
    pdfLabel: 'SPPU SE Computer Science and Engineering 2024 pattern syllabus (revised June 2026)',
    courses: cse as SeBranch['courses'],
  },
  {
    slug: 'se-artificial-intelligence-and-data-science', branch: 'Artificial Intelligence and Data Science', short: 'SE AI&DS', motif: 'aids', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20-%20AIandDS%20-%202024%20Pattern_18072025.pdf',
    pdfLabel: 'SPPU SE AI and Data Science 2024 pattern syllabus',
    courses: aids as SeBranch['courses'],
  },
  {
    slug: 'se-electrical-engineering', branch: 'Electrical Engineering', short: 'SE Electrical', motif: 'elec', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE_Electrical_Syllabus_2024_pattern_14th_July_15072025.pdf',
    pdfLabel: 'SPPU SE Electrical Engineering 2024 pattern syllabus',
    courses: elec as SeBranch['courses'],
  },
];

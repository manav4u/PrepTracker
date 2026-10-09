import type { SeBranch } from './sePage';
import computer from './seData/computer.json';

// One entry per Second Year branch. Course data is checked against each branch's official SPPU 2024 pattern PDF.
export const SE_BRANCHES: SeBranch[] = [
  {
    slug: 'se-computer-engineering', branch: 'Computer Engineering', short: 'SE Computer', motif: 'computer', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20-%20Computer%20Engineering%20-%202024%20Pattern_18072025.pdf',
    pdfLabel: 'SPPU SE Computer Engineering 2024 pattern syllabus',
    courses: computer as SeBranch['courses'],
  },
];

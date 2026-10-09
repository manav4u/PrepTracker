import type { SeBranch } from './sePage';
import computer from './seData/computer.json';
import cse from './seData/cse.json';
import aids from './seData/aids.json';
import elec from './seData/elec.json';
import it from './seData/it.json';
import civil from './seData/civil.json';
import instr from './seData/instr.json';

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
  {
    slug: 'se-information-technology', branch: 'Information Technology', short: 'SE IT', motif: 'it', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20IT%202024%20Pattern%20Syllabus_15072025.pdf',
    pdfLabel: 'SPPU SE Information Technology 2024 pattern syllabus',
    courses: it as SeBranch['courses'],
  },
  {
    slug: 'se-civil-engineering', branch: 'Civil Engineering', short: 'SE Civil', motif: 'civil', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE-Civil2024_pattern-_final_version_22072025.pdf',
    pdfLabel: 'SPPU SE Civil Engineering 2024 pattern syllabus',
    courses: civil as SeBranch['courses'],
  },
  {
    slug: 'se-instrumentation-and-control-engineering', branch: 'Instrumentation and Control Engineering', short: 'SE Instrumentation', motif: 'instr', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE_Instrumentation%20and%20Control_2024%20Course_Updated_3rd%20July%202025_10072025.pdf',
    pdfLabel: 'SPPU SE Instrumentation and Control Engineering 2024 pattern syllabus',
    courses: instr as SeBranch['courses'],
  },
];

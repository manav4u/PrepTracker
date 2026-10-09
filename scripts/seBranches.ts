import type { SeBranch } from './sePage';
import computer from './seData/computer.json';
import cse from './seData/cse.json';
import aids from './seData/aids.json';
import elec from './seData/elec.json';
import it from './seData/it.json';
import civil from './seData/civil.json';
import instr from './seData/instr.json';
import auto from './seData/auto.json';
import cyber from './seData/cyber.json';
import terai from './seData/terai.json';
import temech from './seData/temech.json';
import tecomp24 from './seData/tecomp24.json';
import teit24 from './seData/teit24.json';
import teel19 from './seData/teel19.json';
import mech from './seData/mech.json';

// One entry per Second Year branch. Course data is checked against each branch's official SPPU 2024 pattern PDF.
export const SE_BRANCHES: SeBranch[] = [
  {
    slug: 'se-computer-engineering', branch: 'Computer Engineering', short: 'SE Computer', motif: 'computer', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/SE%20-%20Computer%20Engineering%20-%202024%20Pattern%20Revised_13062026.pdf',
    pdfLabel: 'SPPU SE Computer Engineering 2024 pattern syllabus (revised June 2026, effective 2026-27)',
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
  {
    slug: 'se-mechanical-engineering', branch: 'Mechanical Engineering', short: 'SE Mechanical', motif: 'mech', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/SE%20(2024)%20Revised%20Mechanical%20Engineering%20Syllabus_08062026.pdf',
    pdfLabel: 'SPPU SE Mechanical Engineering 2024 pattern syllabus (revised June 2026, effective 2026-27)',
    courses: mech as SeBranch['courses'],
  },
  {
    slug: 'se-automobile-engineering', branch: 'Automobile Engineering', short: 'SE Automobile', motif: 'auto', accent: '#e11d48', draft: true,
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/SE%20Automobile%20Draft%20Syllabus%202024%20Pattern-9-6-2026_23062026.pdf',
    pdfLabel: 'SPPU SE Automobile Engineering 2024 pattern draft syllabus (June 2026)',
    courses: auto as SeBranch['courses'],
  },
  {
    slug: 'se-cyber-security', branch: 'Cyber Security', short: 'SE Cyber Security', motif: 'cyber', accent: '#e11d48',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/SE%20-%20Cyber%20Security%20-%202024%20Pattern.pdf',
    pdfLabel: 'SPPU SE Cyber Security 2024 pattern syllabus (effective 2026-27)',
    courses: cyber as SeBranch['courses'],
  },
  {
    slug: 'te-robotics-and-ai', branch: 'Robotics and Artificial Intelligence', short: 'TE Robotics and AI', motif: 'rai', accent: '#e11d48', year: 'TE',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE_Robotics%20and%20AI_Syllabus_2024%20Pattern%20(1)_13062026.pdf',
    pdfLabel: 'SPPU TE Robotics and Artificial Intelligence 2024 pattern syllabus (June 2026)',
    courses: terai as SeBranch['courses'],
  },
  {
    slug: 'te-mechanical-engineering', branch: 'Mechanical Engineering', short: 'TE Mechanical', motif: 'mech', accent: '#e11d48', year: 'TE',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/R10_%20TE%20(2024%20PATT)%20Mechanical%20Engineering%20Syllabus%20(30.5.2026)_04062026.pdf',
    pdfLabel: 'SPPU TE Mechanical Engineering 2024 pattern syllabus (May 2026)',
    courses: temech as SeBranch['courses'],
  },
  {
    slug: 'te-computer-engineering', branch: 'Computer Engineering', short: 'TE Computer', motif: 'computer', accent: '#e11d48', year: 'TE',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE%20-%20Computer%20Engineering%20-%202024%2022092026.pdf',
    pdfLabel: 'SPPU TE Computer Engineering 2024 pattern syllabus (September 22, 2026, effective 2026-27)',
    courses: tecomp24 as SeBranch['courses'],
  },
  {
    slug: 'te-information-technology', branch: 'Information Technology', short: 'TE IT', motif: 'it', accent: '#e11d48', year: 'TE',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE%20IT%202024%20Pattern%20Final_09102026.pdf',
    pdfLabel: 'SPPU TE Information Technology 2024 pattern syllabus (October 9, 2026, effective 2026-27)',
    courses: teit24 as SeBranch['courses'],
  },
  {
    slug: 'te-electrical', branch: 'Electrical Engineering', short: 'TE Electrical', motif: 'elec', accent: '#e11d48', year: 'TE', pattern: '2019', ccLabel: 'ISE',
    pdf: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2021/Third%20Year%20Engineering%202019%20Pattern_16022022.rar',
    pdfLabel: 'SPPU TE Electrical 2019 course syllabus (TE _Electrical_ Sullabus_2019 Course_28.07.2021, inside the official Third Year Engineering 2019 Pattern archive)',
    courses: teel19 as SeBranch['courses'],
  },
];

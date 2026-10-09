import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'elec',
  slug: 'basic-electrical-engineering',
  title: 'Basic Electrical Engineering Syllabus (ESE-102-ELE) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Basic Electrical Engineering syllabus, 2024 pattern (ESE-102-ELE): 5 units, 6 hours each, marks scheme, course outcomes, lab experiments, books and the NPTEL course.',
  ogTitle: 'Basic Electrical Engineering Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units, outcomes, marks scheme, lab list, books and the NPTEL course for ESE-102-ELE.',
  lead: 'SPPU First Year Engineering, 2024 pattern. Course code ESE-102-ELE. Five units, 30 hours of theory and a practical component, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['3 credits (2 theory + 1 practical)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 6 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 2, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Practical / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are electric charges and fields, Coulomb\u2019s laws, voltage, potential, current, Ohm\u2019s law, magnetism, EMF, Faraday\u2019s laws, alternating current, the AC generator and power. The course covers AC and DC circuit analysis, the working of basic electric machines, wiring components and schemes, and the electricity bill. The practical side is 2 hours a week, and any 8 experiments from a list of 10 are performed.',
  outcomes: [
    'Apply Kirchhoff\u2019s laws, the superposition theorem and network simplification to DC circuit analysis.',
    'Analyse magnetic circuit parameters, self and mutual inductance, and electromotive forces.',
    'Calculate AC quantities using equations, waveforms and phasor diagrams.',
    'Compute the voltage, current and power of 1-phase and 3-phase AC circuits.',
    'Understand the working principle of the 1-phase transformer and of DC and induction motors, and their practical uses.',
  ],
  coUnits: true,
  studyOrder: 'This is a suggestion, not part of the syllabus. Take the units in order. Unit I (DC circuits) gives the circuit-solving habits, Unit II (magnetism and induction) explains the principle behind transformers and motors, and Units III and IV build AC theory step by step: waveforms and phasors first, then R-L-C circuits and three-phase systems. Unit V (transformer and motors) pulls the earlier units together, so it comes last.',
  textBooks: [
    'ABC of Electrical Engineering by B. L. Theraja and A. K. Theraja (S. Chand Publications, 2012)',
    'Basic Electrical Engineering by D. C. Kulshreshtha, 2nd edition, 2019 (McGraw Hill Education)',
  ],
  refBooks: [
    'Basic Electrical Engineering by C. L. Wadhwa, 5th edition, 2024 (New Age International)',
    'Electrical Machines by S. K. Bhattacharya, 2nd edition, 2008 (McGraw Hill Education)',
    'Basic Electrical Engineering by T. K. Nagsarkar and M. S. Sukhija, 2nd edition, 2018 (Oxford University Press)',
  ],
  videos: [{ label: 'NPTEL course 108105112', url: 'https://nptel.ac.in/courses/108105112' }],
  videoNote: 'The syllabus lists one NPTEL course for this subject',
  faq: [
    ['How many credits is Basic Electrical Engineering in the SPPU 2024 pattern?', 'ESE-102-ELE carries 3 credits: 2 for theory (2 hours a week) and 1 for practical (2 hours a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the practical credit.'],
    ['How many units are there?', 'Five units of 6 hours each, 30 hours in total: elementary concepts and DC circuits, electromagnetism, AC fundamentals, AC circuits, and an introduction to electric machines.'],
    ['How many experiments do I have to do?', 'Any 8 from the list of 10 in the syllabus. They include verifying Kirchhoff\u2019s laws and the superposition theorem, a transformer loading test, RLC resonance, three-phase star and delta relations, and reading a single-phase LT electricity bill.'],
    ['Which books does the syllabus list?', 'Two text books (Theraja and Theraja, and Kulshreshtha) and three reference books (Wadhwa, Bhattacharya, and Nagsarkar and Sukhija).'],
    ['Is there an official video course?', 'The syllabus lists one NPTEL course, number 108105112. It is linked on this page.'],
  ],
};
export default config;

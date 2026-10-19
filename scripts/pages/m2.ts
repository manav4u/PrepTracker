import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'm2',
  slug: 'engineering-mathematics-2',
  title: 'Engineering Mathematics-II Syllabus (BSC-151-BES) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Engineering Mathematics-II syllabus, 2024 pattern (BSC-151-BES): 5 units, 8 hours each, marks scheme, course outcomes, books and the NPTEL playlist.',
  ogTitle: 'Engineering Mathematics-II Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units, outcomes, marks scheme, books and the NPTEL playlist for BSC-151-BES.',
  lead: 'SPPU First Year Engineering, 2024 pattern, Semester II. Course code BSC-151-BES. Five units, 40 hours of theory, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['4 credits (3 theory + 1 tutorial)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 8 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 3, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Tutorial / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are integration, differential equations and three-dimensional coordinate systems. The course covers advanced integration, curve tracing, solid geometry, multiple integrals and their applications, and mathematical modelling of physical systems with differential equations. Term work is based on assignments on the units, with performance and continuous internal assessment.',
  outcomes: [
    'Apply reduction formulae, Beta and Gamma functions, differentiation under the integral sign and error functions to evaluate integrals.',
    'Trace curves, measure arc length, and apply solid geometry to the sphere, cone and cylinder.',
    'Evaluate multiple integrals and use them for area, volume, centre of gravity and moment of inertia.',
    'Solve first order ordinary differential equations: exact, reducible to exact, linear and reducible to linear.',
    'Model physical systems with ordinary differential equations: Newton\u2019s law of cooling, electrical circuits, rectilinear motion, mass-spring systems and heat transfer.',
  ],
  coUnits: true,
  studyOrder: 'This is a suggestion, not part of the syllabus. Unit I (reduction formulae, Beta and Gamma functions) gives the integration tools that Unit III (multiple integrals) uses, so do them in that order, with Unit II (curve tracing and solid geometry) between them. Unit IV (solving first order equations) must come before Unit V, which models physical systems with exactly those equations.',
  textBooks: ['Higher Engineering Mathematics by B. V. Ramana (Tata McGraw Hill)', 'Higher Engineering Mathematics by B. S. Grewal (Khanna Publication, Delhi)'],
  refBooks: [
    'Advanced Engineering Mathematics by Erwin Kreyszig (Wiley Eastern Ltd.)',
    'Advanced Engineering Mathematics by M. D. Greenberg (Pearson Education)',
    'Advanced Engineering Mathematics by Peter V. O\u2019Neil (Thomson Learning)',
    'Thomas\u2019 Calculus by George B. Thomas (Addison-Wesley, Pearson)',
    'Applied Mathematics (Vol. I and II) by P. N. Wartikar and J. N. Wartikar (Vidyarthi Griha Prakashan, Pune)',
    'Differential Equations by S. L. Ross (John Wiley and Sons)',
  ],
  videos: [{ label: 'NPTEL / YouTube playlist', url: 'https://youtube.com/playlist?list=PLbRMhDVUMngeVrxtbBz-n8HvP8KAWBpI5' }],
  videoNote: 'The syllabus lists one playlist for this course, the same one it lists for Engineering Mathematics-I',
  faq: [
    ['How many credits is Engineering Mathematics-II in the SPPU 2024 pattern?', 'BSC-151-BES carries 4 credits: 3 for theory (3 hours a week) and 1 for the tutorial (1 hour a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the tutorial credit.'],
    ['How many units are there?', 'Five units of 8 hours each, 40 hours in total: integral calculus, curve tracing and solid geometry, multiple integrals, first order ordinary differential equations, and applications of differential equations.'],
    ['How is term work assessed?', 'Through assignments on the units, based on performance and continuous internal assessment. The syllabus sets tutorial batches of at most 22 students.'],
    ['Which books does the syllabus list?', 'Text books: B. V. Ramana and B. S. Grewal, both titled Higher Engineering Mathematics. Six reference books are listed too, including Kreyszig, Thomas\u2019 Calculus and S. L. Ross on differential equations.'],
  ],
};
export default config;

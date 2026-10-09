import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'm1',
  slug: 'engineering-mathematics-1',
  title: 'Engineering Mathematics-I Syllabus (BSC-101-BES) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Engineering Mathematics-I syllabus, 2024 pattern (BSC-101-BES): 5 units, 8 hours each, marks scheme, course outcomes, books and the official NPTEL playlist.',
  ogTitle: 'Engineering Mathematics-I Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units, outcomes, marks scheme, books and the official NPTEL playlist for BSC-101-BES.',
  lead: 'SPPU First Year Engineering, 2024 pattern. Course code BSC-101-BES. Five units, 40 hours of theory, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['4 credits (3 theory + 1 tutorial)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 8 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 3, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Tutorial / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are differentiation, integration, maxima and minima, matrices and determinants. The course aims to build the calculus, Fourier series and linear algebra needed in later engineering subjects.',
  outcomes: [
  'Apply mean value theorems and their generalizations leading to Taylor and Maclaurin series. Determine the Fourier series representation and harmonic analysis of periodic functions.',
  'Evaluate derivative functions of several variables.',
  'Apply the Jacobian to find partial derivatives of implicit functions and functional dependence. Use partial derivatives for errors, approximations and extreme values.',
  'Use matrices and linear algebra to analyse systems of linear equations, linear dependence and independence, and linear and orthogonal transformations.',
  'Determine eigen values and eigen vectors, diagonalize a matrix and reduce a quadratic form to canonical form.',
],
  coUnits: true,
  studyOrder: "This is a suggestion, not part of the syllabus. Unit II (partial derivatives, Euler's theorem, total derivative) is what Unit III (Jacobian, errors, maxima and minima) builds on, so do them in that order. In the same way, Unit IV (rank, linear systems, transformations) comes before Unit V (eigen values, Cayley-Hamilton, diagonalization). Unit I stands alone, so it is a good starting point or a break between the two blocks.",
  textBooks: ['Higher Engineering Mathematics by B. V. Ramana (Tata McGraw Hill)', 'Higher Engineering Mathematics by B. S. Grewal (Khanna Publication)'],
  refBooks: [
  'Advanced Engineering Mathematics by Erwin Kreyszig (Wiley Eastern Ltd.)',
  'Advanced Engineering Mathematics by M. D. Greenberg (Pearson Education)',
  'Advanced Engineering Mathematics by Peter V. O\u2019Neil (Thomson Learning)',
  'Thomas\u2019 Calculus by George B. Thomas (Addison-Wesley, Pearson)',
  'Applied Mathematics (Vol. I & II) by P. N. Wartikar and J. N. Wartikar (Vidyarthi Griha Prakashan, Pune)',
  'Elementary Linear Algebra by Ron Larson and David C. Falvo (Houghton Mifflin Harcourt)',
],
  videos: [{ label: 'Engineering Mathematics-I playlist', url: 'https://youtube.com/playlist?list=PLbRMhDVUMngeVrxtbBz-n8HvP8KAWBpI5' }],
  videoNote: 'The syllabus lists one NPTEL / YouTube playlist for this course',
  faq: [
  ['How many credits is Engineering Mathematics-I in the SPPU 2024 pattern?', 'BSC-101-BES carries 4 credits: 3 for theory (3 hours a week) and 1 for the tutorial (1 hour a week).'],
  ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the tutorial credit.'],
  ['How many units are there?', 'Five units of 8 hours each, 40 hours in total: single variable calculus and Fourier series, partial differentiation, its applications, matrices and linear systems, and eigen values with diagonalization.'],
  ['What do I need to pass the theory head?', 'The college copy of the SPPU rules asks for at least 12 in CCE, at least 28 in the End-Semester exam and at least 40 in total. Check your own college notice for the exact rule that applies to you.'],
  ['Which books does the syllabus list?', 'Text books: B. V. Ramana and B. S. Grewal, both titled Higher Engineering Mathematics. Six reference books are listed too, including Kreyszig and Thomas\u2019 Calculus.'],
  ['Is there an official video course?', 'The syllabus lists one NPTEL / YouTube playlist for this course. It is linked on this page.'],
],
};
export default config;

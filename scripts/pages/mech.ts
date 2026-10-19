import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'mech',
  slug: 'engineering-mechanics',
  title: 'Engineering Mechanics Syllabus (ESC-104-CVL) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Engineering Mechanics syllabus, 2024 pattern (ESC-104-CVL): 5 units, 6 hours each, marks scheme, course outcomes, lab experiments and books.',
  ogTitle: 'Engineering Mechanics Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units, outcomes, marks scheme, lab list and books for ESC-104-CVL.',
  lead: 'SPPU First Year Engineering, 2024 pattern. Course code ESC-104-CVL. Five units, 30 hours of theory and a practical component, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['3 credits (2 theory + 1 practical)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 6 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 2, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Practical / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are basic calculus, trigonometry, geometrical expressions, laws of motion, the concept of mass and acceleration, with a base in engineering mathematics and physics. The course teaches the basics of mechanics and applies them to forces, loads and moments. The practical side is 2 hours a week: four compulsory experiments, four graphical solutions and an assignment of at least four examples per unit.',
  outcomes: [
    'Understand forces, moments and couples in a two-dimensional force system.',
    'Apply the free body diagram to static equilibrium in a two-dimensional force system.',
    'Analyse practical examples involving friction and two force members.',
    'Analyse rectilinear and curvilinear motion of a particle.',
    'Apply Newton\u2019s second law, the work energy principle and the impulse momentum principle to particles.',
  ],
  coUnits: true,
  studyOrder: 'This is a suggestion, not part of the syllabus. The course splits into statics (Units I to III) and dynamics (Units IV and V). Do the statics block in order: resultants and moment of inertia first, then equilibrium and free body diagrams, then friction and trusses, which use both. Kinematics (Unit IV) describes motion and must come before kinetics (Unit V), which adds forces, energy and momentum.',
  textBooks: [
    'Engineering Mechanics by Ferdinand Singer, 3rd edition (Harper and Row)',
    'Engineering Mechanics (Statics and Dynamics) by R. C. Hibbeler (Pearson Education)',
  ],
  refBooks: [
    'Engineering Mechanics by S. Timoshenko and Young (Tata McGraw Hill Education Pvt. Ltd., New Delhi)',
    'Vector Mechanics for Engineers: Statics by Beer and Johnston (Tata McGraw Hill)',
    'Vector Mechanics for Engineers: Dynamics by Beer and Johnston (Tata McGraw Hill)',
    'Engineering Mechanics: Statics and Dynamics by J. L. Meriam and L. G. Kraige (John Wiley and Sons)',
  ],
  videos: [],
  videoNote: 'The syllabus lists no NPTEL or video resources for this subject',
  faq: [
    ['How many credits is Engineering Mechanics in the SPPU 2024 pattern?', 'ESC-104-CVL carries 3 credits: 2 for theory (2 hours a week) and 1 for practical (2 hours a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the practical credit.'],
    ['How many units are there?', 'Five units of 6 hours each, 30 hours in total: force systems and resultants, equilibrium, friction and trusses, kinematics of a particle, and kinetics of a particle.'],
    ['What does the lab journal contain?', 'Four compulsory experiments (polygon law of forces, support reaction of a beam, coefficient of friction, coefficient of restitution), four graphical solutions (concurrent and parallel equilibrium, truss member forces, moment of inertia) and an assignment of at least four examples on each unit.'],
    ['Which books does the syllabus list?', 'Two text books (Singer, and Hibbeler) and four reference books, including Timoshenko and Young, Beer and Johnston (statics and dynamics) and Meriam and Kraige.'],
  ],
};
export default config;

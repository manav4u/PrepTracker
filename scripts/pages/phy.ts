import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'phy',
  slug: 'engineering-physics',
  title: 'Engineering Physics Syllabus (BSC-102-BES) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Engineering Physics syllabus, 2024 pattern (BSC-102-BES): 5 units, 8 hours each, marks scheme, course outcomes, lab experiments, books and video lectures.',
  ogTitle: 'Engineering Physics Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units, outcomes, marks scheme, lab list, books and video lectures for BSC-102-BES.',
  lead: 'SPPU First Year Engineering, 2024 pattern. Course code BSC-102-BES. Five units, 40 hours of theory and a practical component, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['4 credits (3 theory + 1 practical)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 8 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 3, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Practical / term work', marks: 25, credit: 1 },
  ],
  order: [0, 2, 1, 3, 4],
  prereq: 'The prerequisites listed in the syllabus are Bohr\u2019s atomic theory, properties of mechanical and electromagnetic waves, Huygens\u2019 principle and wavefront, interference and polarization of light, wave particle duality, intrinsic and extrinsic semiconductors, basics of magnetism, trigonometry and calculus. The course aims to teach the fundamentals of physics through hands-on experiments and extend them to engineering applications. The practical side is 2 hours a week, and any 8 experiments from a list of 12 are performed.',
  outcomes: [
    'Develop the understanding of the working principle of lasers and optical fibers and extend it to holography and fiber optic communication.',
    'Deduce Schr\u00f6dinger\u2019s wave equations and apply them to problems on bound states, using the fundamentals of quantum physics.',
    'Explain interference in thin films, polarization and double refraction, and connect them to the anti-reflection coating and LCD.',
    'Understand Fermi level and Fermi energy in semiconductors from Fermi Dirac statistics and relate them to semiconductor devices. Extend ultrasonics to thickness measurement and flaw detection.',
    'Explain the properties of nanoparticles and their engineering applications. Explain superconductivity and its engineering applications.',
  ],
  studyOrder: 'This is a suggestion, not part of the syllabus. Unit I (lasers and optical fibers) and Unit III (wave optics) are both about light, so they pair well. Unit II (quantum physics) gives the wave function and energy-level ideas that Unit IV (Fermi level, semiconductors) and Unit V (quantum confinement, Cooper pairs) lean on, so do it before them. Numerical problems appear in almost every unit, so practise them as you go instead of leaving them to the end.',
  textBooks: [
    'A Textbook of Engineering Physics by M. N. Avadhanulu, P. G. Kshirsagar and TVS Arun Murthy (S. Chand Publications)',
    'Engineering Physics by R. K. Gaur and S. L. Gupta (Dhanpat Rai Publications)',
  ],
  refBooks: [
    'Optics by Ajoy Ghatak (Tata McGraw Hill)',
    'Introduction to Solid State Physics by C. Kittel (Wiley and Sons)',
    'Quantum Mechanics by A. K. Ghatak and S. Lokanathan (Laxmi Publications)',
    'Nanotechnology: Principles and Practices by Dr. S. K. Kulkarni (Capital Publishing)',
    'Physics for Scientists and Engineers with Modern Physics by Serway and Jewett (Cengage Publications)',
  ],
  videos: [
    { label: 'Lectures by Walter Lewin', url: 'https://www.youtube.com/channel/UCiEHVhv0SBMpP75JbzJShqw' },
    { label: 'Quantum Mechanics lecture series by Prof. H. C. Verma', url: 'https://www.youtube.com/playlist?list=PLWweJWdB_GuISnGkAafMpzzDBvTHg02At' },
  ],
  videoNote: 'The syllabus lists two video resources, plus the Feynman Lectures and Beiser\u2019s Concepts of Modern Physics as e-books',
  faq: [
    ['How many credits is Engineering Physics in the SPPU 2024 pattern?', 'BSC-102-BES carries 4 credits: 3 for theory (3 hours a week) and 1 for practical (2 hours a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the practical credit.'],
    ['How many units are there?', 'Five units of 8 hours each, 40 hours in total: photonics, quantum physics, wave optics, semiconductor physics with ultrasonics, and nanoparticles with superconductivity.'],
    ['How many experiments do I have to do?', 'Any 8 from the list of 12 in the syllabus. One of the 8 may be an in-house experiment or a virtual lab experiment instead.'],
    ['Which books does the syllabus list?', 'Text books: Avadhanulu, Kshirsagar and Arun Murthy (S. Chand), and Gaur and Gupta (Dhanpat Rai). Five reference books are listed too, including Ghatak\u2019s Optics and Kittel\u2019s Solid State Physics.'],
    ['Are there official video lectures?', 'The syllabus lists Walter Lewin\u2019s lectures and Prof. H. C. Verma\u2019s quantum mechanics series. Both are linked on this page.'],
  ],
};
export default config;

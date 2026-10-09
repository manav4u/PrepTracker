import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'chem',
  slug: 'engineering-chemistry',
  title: 'Engineering Chemistry Syllabus (BSC-103-BES) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Engineering Chemistry syllabus, 2024 pattern (BSC-103-BES): 5 units, 8 hours each, marks scheme, course outcomes, lab experiments, books and the NPTEL course.',
  ogTitle: 'Engineering Chemistry Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units, outcomes, marks scheme, lab list, books and the NPTEL course for BSC-103-BES.',
  lead: 'SPPU First Year Engineering, 2024 pattern. Course code BSC-103-BES. Five units, 40 hours of theory and a practical component, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['4 credits (3 theory + 1 practical)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 8 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 3, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Practical / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are types of titrations, structure property relationship, classification and properties of polymers, electromagnetic radiation and the electrochemical series. The course covers water quality analysis, electro-analytical techniques, specialty polymers and nanomaterials, fuels, and corrosion. The practical side is 2 hours a week, and any 8 experiments from a list of 11 are performed.',
  outcomes: [
    'Understand the practical approaches and techniques needed to monitor water quality.',
    'Select appropriate electro-analytical techniques for understanding materials.',
    'Demonstrate the structure and properties of advanced engineering materials for technological applications.',
    'Analyse different types of conventional and alternative fuels.',
    'Explain the causes of corrosion and the methods for minimizing it.',
  ],
  coUnits: true,
  studyOrder: 'This is a suggestion, not part of the syllabus. The units are mostly independent, so you can take them in the order they come. Unit I has a lot of numericals (hardness, zeolite), and Unit II (absorption laws) and Unit IV (calorific value, coal analysis) do too, so keep time for problems in those three. Unit V (corrosion) is mostly theory and mechanisms, so it works well as a final revision unit.',
  textBooks: [
    'Textbook of Engineering Chemistry by Dr. S. S. Dara and Dr. S. S. Umare (S. Chand & Company Ltd.)',
    'Engineering Chemistry by O. G. Palanna (Tata McGraw Hill Education Pvt. Ltd.)',
    'Textbook of Engineering Chemistry by Dr. Sunita Rattan (S. K. Kataria & Sons)',
  ],
  refBooks: [
    'Basic Concept of Analytical Chemistry, 2nd ed., by S. M. Khopkar (New Age International)',
    'Instrumental Methods of Chemical Analysis by G. R. Chatwal and S. K. Anand (Himalaya Publishing House)',
    'Spectroscopy of Organic Compounds, 2nd ed., by P. S. Kalsi (New Age International)',
    'Polymer Science by V. R. Gowarikar, N. V. Viswanathan and Jayadev Sreedhar (Wiley Eastern Limited)',
    'Inorganic Chemistry, 5th ed., by Shriver and Atkins (Oxford University Press)',
    'Fundamentals of Nanotechnology by G. L. Hornyak, J. J. Moore, H. F. Tibbals and J. Dutta (CRC Press)',
  ],
  videos: [{ label: 'NPTEL course 113104082', url: 'https://nptel.ac.in/courses/113104082' }],
  videoNote: 'The syllabus lists one NPTEL course for this subject, and two e-books on analytical chemistry and corrosion',
  faq: [
    ['How many credits is Engineering Chemistry in the SPPU 2024 pattern?', 'BSC-103-BES carries 4 credits: 3 for theory (3 hours a week) and 1 for practical (2 hours a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the practical credit.'],
    ['How many units are there?', 'Five units of 8 hours each, 40 hours in total: water technology, instrumental methods of analysis, advanced engineering materials, energy sources, and corrosion and its prevention.'],
    ['How many experiments do I have to do?', 'Any 8 from the list of 11 in the syllabus. They include hardness by EDTA, alkalinity, pH and conductometric titrations, proximate analysis of coal and preparing biodiesel.'],
    ['Which books does the syllabus list?', 'Three text books (Dara and Umare, Palanna, Rattan) and six reference books, including Khopkar, Chatwal and Anand, Kalsi and Shriver and Atkins.'],
    ['Is there an official video course?', 'The syllabus lists one NPTEL course, number 113104082. It is linked on this page.'],
  ],
};
export default config;

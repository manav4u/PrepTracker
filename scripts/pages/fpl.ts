import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'fpl',
  slug: 'fundamentals-of-programming-languages',
  title: 'Fundamentals of Programming Languages Syllabus (ESC-105-COM) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Fundamentals of Programming Languages (C) syllabus, 2024 pattern (ESC-105-COM): 5 units, 6 hours each, marks scheme, course outcomes, lab assignments, mini-projects, books and NPTEL courses.',
  ogTitle: 'Fundamentals of Programming Languages Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units of C programming, outcomes, marks scheme, lab assignments, books and NPTEL courses for ESC-105-COM.',
  lead: 'SPPU First Year Engineering, 2024 pattern. Course code ESC-105-COM. Five units of C programming, 30 hours of theory and a practical component, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['3 credits (2 theory + 1 practical)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 6 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 2, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Practical / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are basics of computers and basic mathematics. The course teaches C programming: algorithms, operators, control flow, arrays and strings, and user defined functions with structures. The practical side is 2 hours a week: any 6 to 8 programming assignments from a list of 10, and the syllabus also suggests four mini-projects such as a calculator, a dice roller and a number guessing game.',
  outcomes: [
    'Design algorithms for simple computational problems.',
    'Use mathematical and logical operators and expressions.',
    'Apply control flow structures for decision making.',
    'Design a solution using arrays, character arrays and strings.',
    'Design and apply user defined functions and structures.',
  ],
  coUnits: true,
  studyOrder: 'This is a suggestion, not part of the syllabus. Take the units in order, because each one uses the last: tokens and data types (Unit I), then operators (II), then if and loops (III), then arrays and strings (IV), then functions, recursion and structures (V). Each unit lists a case study, for example a simple calculator for control flow and matrix multiplication for arrays. Write and run those programs as you go instead of only reading them.',
  textBooks: ['Programming in ANSI C, 8th edition, by E. Balagurusamy'],
  refBooks: [
    'Programming with C (Schaum\u2019s Outline Series), 2nd edition, by B. S. Gottfried (McGraw-Hill, 1996)',
    'Programming in C, 3rd edition, by S. C. Kochan (Sams Publishing, 2004)',
    'The C Programming Language, 2nd edition, by B. W. Kernighan and D. M. Ritchie (Prentice Hall, 1988)',
    'The Practice of Programming by B. W. Kernighan and R. Pike (Addison-Wesley, 1999)',
    'C: How to Program, 8th edition, by H. M. Deitel and P. J. Deitel (Pearson Education, 2015)',
    'C in a Nutshell: The Definitive Reference, 2nd edition, by P. Prinz and T. Crawford (O\u2019Reilly Media, 2016)',
  ],
  videos: [
    { label: 'NPTEL course noc22_cs40', url: 'https://onlinecourses.nptel.ac.in/noc22_cs40/preview' },
    { label: 'NPTEL course noc23_cs53', url: 'https://onlinecourses.nptel.ac.in/noc23_cs53/preview' },
  ],
  videoNote: 'The syllabus lists two NPTEL courses for this subject',
  faq: [
    ['How many credits is Fundamentals of Programming Languages in the SPPU 2024 pattern?', 'ESC-105-COM carries 3 credits: 2 for theory (2 hours a week) and 1 for practical (2 hours a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the practical credit.'],
    ['Which language does the course use?', 'C. The five units cover program planning and the basics of C, operators and expressions, control flow, arrays and strings, and user defined functions with structures.'],
    ['How many lab assignments do I have to do?', 'Any 6 to 8 from the list of 10 in the syllabus. They include prime and factorial programs, a Fibonacci series, array operations, string operations and a structure for employee details. Instructors may also assign a mini-project.'],
    ['Which books does the syllabus list?', 'One text book, Programming in ANSI C by E. Balagurusamy, and six reference books including Kernighan and Ritchie\u2019s The C Programming Language and Deitel and Deitel\u2019s C: How to Program.'],
    ['Are there official video courses?', 'The syllabus lists two NPTEL courses, noc22_cs40 and noc23_cs53. Both are linked on this page.'],
  ],
};
export default config;

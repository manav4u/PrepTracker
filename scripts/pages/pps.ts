import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'pps',
  slug: 'programming-and-problem-solving',
  title: 'Programming and Problem Solving (Python) Syllabus (PCC-151-ITT) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Programming and Problem Solving (Python) syllabus, 2024 pattern (PCC-151-ITT): 5 units, 19 hours, marks scheme, course outcomes, lab practicals and books.',
  ogTitle: 'Programming and Problem Solving (Python) Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units of Python, outcomes, marks scheme, lab practicals and books for PCC-151-ITT.',
  lead: 'SPPU First Year Engineering, 2024 pattern, Semester II. Course code PCC-151-ITT. Five units of Python programming, 19 hours of theory and a practical component, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['3 credits (2 theory + 1 practical)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units, 19 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 2, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Practical / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are basics of computers, basic mathematics and Fundamentals of Programming Languages. The course covers problem solving, then Python: data types, decision control, functions, strings, file handling and object oriented programming. The credit split follows the semester scheme table in the book (2 theory + 1 practical = 3); the course page itself prints a different practical figure, so check your college notice if it matters. The practical side has Group A assignments for each unit, and Group B assignments set by Mechanical, Civil and Electrical faculty in their own application domains.',
  outcomes: [
    'Apply various skills in problem solving.',
    'Choose appropriate programming constructs and features to solve problems in different domains.',
    'Use functions and string manipulation for problem solving.',
    'Demonstrate file handling and dictionaries in Python.',
    'Apply object oriented concepts in Python.',
  ],
  coUnits: true,
  studyOrder: 'This is a suggestion, not part of the syllabus. Take the units in order. Unit I sets up the problem solving approach and the basics of Python, Unit II adds data types and control flow, and Unit III wraps code into functions and works with strings. Unit IV (files and dictionaries) uses all of that, and Unit V (classes and objects) comes last because it organizes everything before it. The syllabus has a practical for every unit, so write the programs while you study.',
  textBooks: [
    'Python Programming Using Problem Solving Approach by Reema Thareja (Oxford University Press)',
    'Core Python Programming by R. Nageswara Rao, 2nd edition (Dreamtech Press)',
  ],
  refBooks: [
    'How to Solve it by Computer by R. G. Dromey (Pearson Education India), and Problem Solving and Programming Concepts by Maureen Spankle (Pearson, 9th edition)',
    'Learning Python by Fabrizio Romano (Packt Publishing)',
    'Head First Python by Paul Barry, 2nd edition (SPD O\u2019Reilly)',
    'Python: The Complete Reference by Martin C. Brown (McGraw Hill Education)',
    'Introduction to Computing and Problem Solving with Python by Jeeva Jose and P. Sojan Lal (Khanna Computer Book Store)',
  ],
  videos: [],
  videoNote: 'The syllabus lists no NPTEL or video resources for this subject',
  faq: [
    ['How many credits is Programming and Problem Solving in the SPPU 2024 pattern?', 'PCC-151-ITT carries 3 credits in the book\u2019s semester scheme table: 2 for theory (2 hours a week) and 1 for practical (2 hours a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the practical credit.'],
    ['Which language does the course use?', 'Python. The five units cover problem solving and Python basics, advanced data types with decision control, functions and strings, file handling with dictionaries, and object oriented programming.'],
    ['Is everything in the syllabus examined in theory?', 'No. The Unit IV case study, on the design, features and use of a popular system built with Python, is excluded from the theory examination.'],
    ['What are the lab assignments?', 'Group A has practicals for each of the five units, from installing Python and operators to string operations, file handling and classes. Group B has assignments from Electrical, Mechanical and Civil application domains, designed with faculty from those branches.'],
    ['Which books does the syllabus list?', 'Two text books (Reema Thareja, and R. Nageswara Rao) and several reference books including Dromey, Fabrizio Romano\u2019s Learning Python and Paul Barry\u2019s Head First Python.'],
  ],
};
export default config;

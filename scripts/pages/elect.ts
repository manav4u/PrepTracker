import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'elect',
  slug: 'basic-electronics-engineering',
  title: 'Basic Electronics Engineering Syllabus (ESC-101-ETC) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Basic Electronics Engineering syllabus, 2024 pattern (ESC-101-ETC): 5 units, 6 hours each, marks scheme, course outcomes, lab experiments, books and NPTEL courses.',
  ogTitle: 'Basic Electronics Engineering Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units, outcomes, marks scheme, lab list, books and NPTEL courses for ESC-101-ETC.',
  lead: 'SPPU First Year Engineering, 2024 pattern. Course code ESC-101-ETC. Five units, 30 hours of theory and a practical component, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['3 credits (2 theory + 1 practical)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 6 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 2, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Practical / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are basic physics and mathematics, semiconductor physics, digital electronics, circuit theory, analog electronics, and sensors and transducers. The course covers diodes, transistors, digital circuits, op-amps with instruments, and sensors with communication systems. The practical side is 2 hours a week, and any 8 experiments from a list of 10 are performed.',
  outcomes: [
    'Know the working of the P-N junction diode and its use as a rectifier and switch, plus the basics of the LED and photodiode.',
    'Understand the working of the BJT and MOSFET, their characteristics, and compare them.',
    'Learn logic gates and how digital circuits are realized.',
    'Understand how an op-amp and the common electronic instruments work.',
    'Select sensors by working principle for specific applications and connect them to a communication system.',
  ],
  coUnits: true,
  studyOrder: 'This is a suggestion, not part of the syllabus. Unit I (diodes) comes first because the rectifier and switch ideas return in Unit II (BJT and MOSFET as switches). Unit III (digital circuits) is separate from the analog units, so it works as a change of pace after Unit II. Unit IV (op-amp and instruments) and Unit V (sensors and communication) are mostly block diagrams and applications, so they suit a final revision pass. Each unit also lists everyday examples such as the IR remote, audio amplifier and digital thermometer; connecting a unit to one of them helps it stick.',
  textBooks: [
    'Electronic Devices by Thomas L. Floyd, 9th edition (Pearson)',
    'Modern Digital Electronics by R. P. Jain, 4th edition (Tata McGraw Hill)',
    'Electronic Instrumentation by H. S. Kalsi, 3rd edition (Tata McGraw Hill)',
    'Sensors and Transducers by D. Patranabis, 2nd edition (PHI)',
    'Electronic Communication Systems by Kennedy and Davis, 4th edition (Tata McGraw Hill)',
    'Mobile Wireless Communication by M. Schwartz (Cambridge University Press)',
  ],
  refBooks: [
    'Digital Fundamentals by Thomas L. Floyd, 11th edition (Pearson)',
    'Mobile Communication by J. Schiller, 2nd edition (Pearson)',
    'Sensors Handbook by S. Soloman, 2nd edition',
    'CMOS Circuit Design, Layout and Simulation by Baker, 2nd edition (Wiley IEEE Press)',
  ],
  videos: [
    { label: 'NPTEL course 117103063', url: 'https://nptel.ac.in/courses/117103063' },
    { label: 'NPTEL course 117103064', url: 'https://nptel.ac.in/courses/117103064' },
    { label: 'NPTEL course 106105166', url: 'https://archive.nptel.ac.in/courses/106/105/106105166/' },
  ],
  videoNote: 'The syllabus lists three NPTEL courses for this subject',
  faq: [
    ['How many credits is Basic Electronics Engineering in the SPPU 2024 pattern?', 'ESC-101-ETC carries 3 credits: 2 for theory (2 hours a week) and 1 for practical (2 hours a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the practical credit.'],
    ['How many units are there?', 'Five units of 6 hours each, 30 hours in total: diodes, transistors and technology, logic gates and digital circuits, op-amp with electronic instruments, and sensors with communication systems.'],
    ['How many experiments do I have to do?', 'Any 8 from the list of 10 in the syllabus. They include component study, CRO and multimeter measurements, diode V-I characteristics, a rectifier power supply, a CE amplifier, op-amp circuits, gate truth tables and sensors.'],
    ['Which books does the syllabus list?', 'Six text books, led by Floyd\u2019s Electronic Devices and Jain\u2019s Modern Digital Electronics, and four reference books including Floyd\u2019s Digital Fundamentals.'],
    ['Are there official video courses?', 'The syllabus lists three NPTEL courses: 117103063, 117103064 and 106105166. All are linked on this page.'],
  ],
};
export default config;

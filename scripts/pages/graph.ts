import type { SubjectPageConfig } from '../syllabusPage';

const config: SubjectPageConfig = {
  id: 'graph',
  slug: 'engineering-graphics',
  title: 'Engineering Graphics Syllabus (ESC-103-MEC) | SPPU FE 2024 Pattern',
  metaDescription: 'Unit-wise SPPU First Year Engineering Graphics syllabus, 2024 pattern (ESC-103-MEC): 5 units, 6 hours each, marks scheme, course outcomes, drawing assignments, books and NPTEL links.',
  ogTitle: 'Engineering Graphics Syllabus, SPPU FE 2024 Pattern',
  ogDescription: 'Five units, outcomes, marks scheme, drawing assignments, books and NPTEL links for ESC-103-MEC.',
  lead: 'SPPU First Year Engineering, 2024 pattern. Course code ESC-103-MEC. Five units, 30 hours of theory and a drawing practical, with the marks scheme, outcomes and books taken from the official syllabus book.',
  chips: ['3 credits (2 theory + 1 practical)', 'CCE 30 + End-Sem 70', 'Term work 25', '5 units x 6 hours'],
  marks: [
    { head: 'Theory: CCE', marks: 30, credit: 2, span: 2 },
    { head: 'Theory: End-Semester', marks: 70 },
    { head: 'Practical / term work', marks: 25, credit: 1 },
  ],
  prereq: 'The prerequisites listed in the syllabus are basic geometric shapes, basic linear and angular measurements and construction, the lines, circles and polygons of coordinate geometry, and computer literacy. The course builds the ability to draw physical objects for engineering communication and introduces drawing and design software. For the practical, the assignments are drawn on A2 sheets, and two problems must be drawn in a CAD software.',
  outcomes: [
    'Explain the fundamentals of engineering graphics and geometric construction, and prepare drawings for points and lines using projections.',
    'Apply the types of projection methods to prepare drawings of planes.',
    'Construct engineering curves, show their applications, and draw the development of the lateral surface of a solid.',
    'Apply orthographic projection to draw several 2D views of an object.',
    'Use visualization skill to draw an isometric projection from given orthographic views.',
  ],
  coUnits: true,
  studyOrder: 'This is a suggestion, not part of the syllabus. Go in order, because the projection units build on each other: points and lines (Unit I), then planes (Unit II). Unit III (engineering curves and development of surfaces) uses constructions you can practise separately. Unit IV (orthographic projection) must come before Unit V, because isometric views are drawn from given orthographic views. This is a drawing subject, so do every unit with a pencil and a sheet in front of you.',
  textBooks: [
    'Engineering Drawing by N. D. Bhatt and V. M. Panchal, 2016 (Charotar Publication, Anand)',
    'Engineering and Graphics by K. Venugopal, 2015 (New Age International, New Delhi)',
    'Engineering Drawing with Introduction to AutoCAD by D. A. Jolhe, 2015 (Tata McGraw Hill, New Delhi)',
    'A First Course in Engineering Drawing by K. Rathnam, 2018 (Springer Nature Singapore)',
  ],
  refBooks: [
    'Engineering Drawing and Design by D. P. Madsen and D. A. Madsen, 2016 (Delmar Publishers)',
    'Machine Drawing by N. D. Bhatt, 2018 (Charotar Publishing House, Anand)',
    'A Textbook of Engineering Drawing by R. K. Dhawan, 2000 (S. Chand, New Delhi)',
    'The Fundamentals of Engineering Drawing: With an Introduction to Interactive Computer Graphics for Design and Production by W. J. Luzadder and J. M. Duff, 1992 (Peachpit Press)',
    'Principles of Engineering Graphics by F. E. Giesecke and others, 1990 (Macmillan Publishing)',
  ],
  videos: [
    { label: 'NPTEL: Engineering Graphics and Design', url: 'https://onlinecourses.nptel.ac.in/noc21_me128/preview' },
    { label: 'NPTEL: Introduction and Geometric Construction', url: 'https://archive.nptel.ac.in/content/storage2/courses/112103019/module1/lec3/1.html' },
  ],
  videoNote: 'The syllabus lists NPTEL resources, including',
  faq: [
    ['How many credits is Engineering Graphics in the SPPU 2024 pattern?', 'ESC-103-MEC carries 3 credits: 2 for theory (2 hours a week) and 1 for practical (2 hours a week).'],
    ['How are the marks split?', 'Theory is graded out of 100: CCE (continuous internal evaluation) 30 and End-Semester 70. Term work is a separate 25 marks tied to the practical credit.'],
    ['How many units are there?', 'Five units of 6 hours each, 30 hours in total: fundamentals with projection of points and lines, projection of planes, engineering curves with development of surfaces, orthographic projection, and isometric projection.'],
    ['What are the drawing assignments?', 'Five sets of two problems each: projection of lines, projection of planes, engineering curves with development of lateral surfaces, orthographic projections and isometric projections. They are drawn on A2 sheets, and two problems must be drawn using CAD software.'],
    ['Which angle of projection is used?', 'The syllabus covers both first angle and third angle methods in orthographic projection. Typical problems are solved by the first angle method, and projection of lines is taught in first angle projection.'],
    ['Which books does the syllabus list?', 'Four text books (Bhatt and Panchal, Venugopal, Jolhe, Rathnam) and five reference books, including Madsen and Madsen, Dhawan and Giesecke.'],
  ],
};
export default config;

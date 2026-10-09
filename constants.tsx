
import { Subject, ExamDate, ResourceItem } from './types';

export const SPPU_MAROON = '#E11D48'; // Modern Crimson

export const getYouTubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const SUBJECTS: Subject[] = [
  {
    id: 'm1',
    name: 'Engineering Mathematics-I',
    code: 'BSC-101-BES',
    credits: 4,
    theoryCredits: 3,
    termWorkCredits: 1,
    units: [
      { 
        id: 'm1-u1', unit_number: 1, hours: 8, title: 'Single Variable Calculus', 
        topics: ['Rolle’s Theorem', 'Mean Value Theorems', "Taylor's and Maclaurin's Series", 'Indeterminate Forms', "L' Hospital's Rule", 'Fourier series (Full range & Half range)', 'Harmonic analysis'] 
      },
      { 
        id: 'm1-u2', unit_number: 2, hours: 8, title: 'Multivariable Calculus – Partial Differentiation', 
        topics: ['Limits & Continuity of several variables', 'Partial Derivatives', "Euler's Theorem on Homogeneous functions", 'Partial derivative of Composite Function', 'Total Derivative', 'Change of Independent variables'] 
      },
      { 
        id: 'm1-u3', unit_number: 3, hours: 8, title: 'Applications of Partial Differentiation', 
        topics: ['Jacobian and its applications', 'Errors and Approximations', 'Maxima and Minima of functions of two variables', "Lagrange's method of undetermined multipliers"] 
      },
      { 
        id: 'm1-u4', unit_number: 4, hours: 8, title: 'Matrices and System of Linear Equations', 
        topics: ['Rank of a Matrix', 'System of Linear Equations', 'Linear Dependence and Independence', 'Linear and Orthogonal Transformations', 'Applications in Engineering'] 
      },
      { 
        id: 'm1-u5', unit_number: 5, hours: 8, title: 'Eigen Values, Eigen Vectors and Diagonalization', 
        topics: ['Eigen Values and Eigen Vectors', 'Cayley Hamilton theorem', 'Diagonalization of a matrix', 'Reduction of Quadratic forms to Canonical form', 'Applications in Engineering'] 
      },
    ]
  },
  {
    id: 'fpl',
    name: 'Fundamentals of Programming Languages',
    code: 'ESC-105-COM',
    credits: 3,
    theoryCredits: 2,
    termWorkCredits: 1,
    units: [
      { 
        id: 'fpl-u1', unit_number: 1, hours: 6, title: 'Intro to Program Planning & C Programming', 
        topics: ['Algorithms & Flowcharts', 'C Tokens, Keywords, Identifiers', 'Constants, Variables, Data types', 'Storage class and symbolic constants', 'Program compilation Process'] 
      },
      { 
        id: 'fpl-u2', unit_number: 2, hours: 6, title: 'Operators and Expressions', 
        topics: ['Arithmetic, Relational, Logical Operators', 'Increment/Decrement Operators', 'Bitwise Operators', 'Operator Precedence', 'Special operators and mathematical functions'] 
      },
      { 
        id: 'fpl-u3', unit_number: 3, hours: 6, title: 'Control Flow', 
        topics: ['If-Else, Switch Statement', 'Loops: While, Do-While, For', 'Break and Continue', 'Goto Statement'] 
      },
      { 
        id: 'fpl-u4', unit_number: 4, hours: 6, title: 'Arrays', 
        topics: ['One Dimensional Arrays', 'Two-dimensional Arrays', 'Character Arrays and Strings', 'String handling Functions', 'Matrix multiplication'] 
      },
      { 
        id: 'fpl-u5', unit_number: 5, hours: 6, title: 'User Defined Functions', 
        topics: ['Function definition & declaration', 'Call by value/reference', 'Recursion', 'Structures (Declaration, Initialization)', 'Tower of Hanoi'] 
      },
    ]
  },
  {
    id: 'phy',
    name: 'Engineering Physics',
    code: 'BSC-102-BES',
    credits: 4,
    theoryCredits: 3,
    termWorkCredits: 1,
    units: [
      { 
        id: 'phy-u1', unit_number: 1, hours: 8, title: 'Fundamentals of Photonics', 
        topics: ['Laser: Spontaneous/Stimulated emission', 'CO2 laser construction & working', 'Holography: Recording & Reconstruction', 'Optical fibers: NA, Attenuation', 'Fiber optic communication advantages'] 
      },
      { 
        id: 'phy-u2', unit_number: 2, hours: 8, title: 'Quantum Physics', 
        topics: ['de Broglie hypothesis & Matter waves', "Schrödinger's time dependent/independent equations", 'Particle in a rigid box', 'Quantum tunneling & STM', 'Quantum computing: Qbits, Superposition, Entanglement'] 
      },
      { 
        id: 'phy-u3', unit_number: 3, hours: 8, title: 'Wave Optics', 
        topics: ['Interference in thin films (Reflected system)', 'Wedge shaped film, ARC and optical flatness', 'Polarization (PPL, CPL, EPL)', "Malu's law", 'Double refraction (Huygens theory)', 'LCDs & 3D Movies'] 
      },
      { 
        id: 'phy-u4', unit_number: 4, hours: 8, title: 'Semiconductor Physics and Ultrasonics', 
        topics: ['Fermi level & Fermi energy', 'PN junction diode (Fermi level basis)', 'Solar cell: IV characteristics & Fill factor', 'Hall effect', 'Ultrasonics: Piezoelectric generation', 'Flaw detection & Thickness measurement'] 
      },
      { 
        id: 'phy-u5', unit_number: 5, hours: 8, title: 'Nanoparticles and Superconductivity', 
        topics: ['Quantum confinement', 'Synthesis: Ball milling, PVD', 'GMR effect & HDD', 'Superconductivity (Type I & II)', 'Meissner effect, Cooper pairs & Josephson effect', 'SQUID & Maglev train'] 
      },
    ]
  },
  {
    id: 'chem',
    name: 'Engineering Chemistry',
    code: 'BSC-103-BES',
    credits: 4,
    theoryCredits: 3,
    termWorkCredits: 1,
    units: [
      { 
        id: 'chem-u1', unit_number: 1, hours: 8, title: 'Water Technology', 
        topics: ['Impurities & Hardness (EDTA method)', 'Alkalinity determination', 'Boiler troubles: Priming, Foaming, Scale, Sludge', 'Zeolite & Demineralization methods', 'Reverse Osmosis & Electrodialysis'] 
      },
      { 
        id: 'chem-u2', unit_number: 2, hours: 8, title: 'Instrumental Methods of Analysis', 
        topics: ['Conductometry (Acid-Base Titrations)', 'pHmetry (Strong Acid-Strong Base)', 'UV-Visible Spectroscopy', "Beer's law & Lambert's law", 'Instrumentation (Double beam)'] 
      },
      { 
        id: 'chem-u3', unit_number: 3, hours: 8, title: 'Advanced Engineering Materials', 
        topics: ['Polymers: Thermoplastics vs Thermosetting', 'Specialty Polymers: Polycarbonate, PHBV', 'Conducting Polymers (Polyacetylene)', 'Nanomaterials: Graphene, CNTs, Quantum dots'] 
      },
      { 
        id: 'chem-u4', unit_number: 4, hours: 8, title: 'Energy Sources', 
        topics: ['Calorific value (Bomb & Boy’s calorimeter)', 'Coal Analysis (Proximate & Ultimate)', 'Biodiesel & Power alcohol', 'Hydrogen gas as a future fuel', 'Lithium Ion Battery'] 
      },
      { 
        id: 'chem-u5', unit_number: 5, hours: 8, title: 'Corrosion and its Prevention', 
        topics: ['Dry & Wet corrosion mechanisms', "Pilling-Bedworth's rule", 'Cathodic Protection (Sacrificial/Impressed current)', 'Electroplating & Hot dipping', 'Anti-corrosive paints'] 
      },
    ]
  },
  {
    id: 'elect',
    name: 'Basic Electronics Engineering',
    code: 'ESC-101-ETC',
    credits: 3,
    theoryCredits: 2,
    termWorkCredits: 1,
    units: [
      { 
        id: 'elect-u1', unit_number: 1, hours: 6, title: 'Diodes and Applications', 
        topics: ['PN Junction Diode Characteristics', 'Rectifiers (Half, Full Wave, Bridge)', 'Evolution of electronics, active and passive components', 'LED & Photodiode', 'Diode as a switch'] 
      },
      { 
        id: 'elect-u2', unit_number: 2, hours: 6, title: 'Transistors and Technology', 
        topics: ['BJT: CE Configuration & Amplifier', 'EMOSFET: Switch & Amplifier', 'VLSI Technology Introduction', 'CMOS Manufacturing (N-Well)'] 
      },
      { 
        id: 'elect-u3', unit_number: 3, hours: 6, title: 'Logic Gates and Digital Circuits', 
        topics: ['Number Systems (Binary, Hex, Octal)', 'Logic Gates (Universal Gates)', 'Half & Full Adders', 'Flip Flops (SR, JK, T, D)', 'Microprocessor and Microcontroller (block diagrams)'] 
      },
      { 
        id: 'elect-u4', unit_number: 4, hours: 6, title: 'Op-Amp and Electronic Instruments', 
        topics: ['Op-Amp Block Diagram', 'Inverting & Non-inverting Amplifier', 'Digital Multimeter', 'Function Generator', 'Digital Storage Oscilloscope (DSO)'] 
      },
      { 
        id: 'elect-u5', unit_number: 5, hours: 6, title: 'Sensors and Communication Systems', 
        topics: ['Sensors: LVDT, Thermocouple, RTD, Strain Gauge', 'IoT Data Acquisition System', 'GSM System Block Diagram', 'Wired vs Wireless Media'] 
      },
    ]
  },
  {
    id: 'elec',
    name: 'Basic Electrical Engineering',
    code: 'ESE-102-ELE',
    credits: 3,
    theoryCredits: 2,
    termWorkCredits: 1,
    units: [
      { 
        id: 'elec-u1', unit_number: 1, hours: 6, title: 'Elementary Concepts and DC Circuits', 
        topics: ['Resistance, EMF, Potential Difference', 'Overview of Power System (Generation, Transmission, Distribution)', 'Kirchhoff’s Laws (KVL/KCL) & Loop Analysis', 'Star-Delta Transformation', 'Superposition Theorem'] 
      },
      { 
        id: 'elec-u2', unit_number: 2, hours: 6, title: 'Electromagnetism', 
        topics: ['Magnetic Circuits (Flux, MMF, Reluctance)', 'Series Magnetic Circuits', "Faraday's Laws of Electromagnetic Induction", "Fleming's Right-hand Rule", 'Statically & Dynamically Induced EMF', 'Self & Mutual Inductance', 'Energy stored in Magnetic Field'] 
      },
      { 
        id: 'elec-u3', unit_number: 3, hours: 6, title: 'AC Fundamentals', 
        topics: ['Generation of Sinusoidal Voltages', 'RMS, Average, Peak, Form Factor', 'Phasor Representation (Rectangular/Polar)', 'Phase Difference (Lagging/Leading)', 'Pure R, L, C Circuits'] 
      },
      { 
        id: 'elec-u4', unit_number: 4, hours: 6, title: 'AC Circuits', 
        topics: ['Series R-L, R-C, R-L-C Circuits', 'Impedance, Power Factor, Phasor Diagrams', 'Active, Reactive, Apparent Power', 'Resonance in RLC Series', 'Three Phase AC (Star & Delta Relations)'] 
      },
      { 
        id: 'elec-u5', unit_number: 5, hours: 6, title: 'Introduction to Electric Machines', 
        topics: ['Single Phase Transformer (Principle, EMF Eq, Efficiency)', 'DC Motors (Construction, Types, Characteristics)', 'Three Phase Induction Motor (RMF principle)', 'Single Phase Induction Motor (Split Phase, Capacitor Types)'] 
      },
    ]
  },
  {
    id: 'mech',
    name: 'Engineering Mechanics',
    code: 'ESC-104-CVL',
    credits: 3,
    theoryCredits: 2,
    termWorkCredits: 1,
    units: [
      { 
        id: 'mech-u1', unit_number: 1, hours: 6, title: 'Force systems and its resultants', 
        topics: ['Resolution & Composition of forces', "Varignon's theorem", 'Couple and resultant of general force system', 'Centroid of composite figures', 'Moment of Inertia (Parallel/Perpendicular axis)'] 
      },
      { 
        id: 'mech-u2', unit_number: 2, hours: 6, title: 'Equilibrium', 
        topics: ['Free body diagram', 'Equilibrium of two forces and three force principle', 'Equilibrium of Concurrent/Parallel/General forces', 'Types of load, support and beam; support reactions'] 
      },
      { 
        id: 'mech-u3', unit_number: 3, hours: 6, title: 'Friction and trusses', 
        topics: ['Laws of Coulomb friction', 'Angle of repose & Cone of friction', 'Ladder & Belt friction', 'Simple Trusses: Method of Joints & Sections'] 
      },
      { 
        id: 'mech-u4', unit_number: 4, hours: 6, title: 'Kinematics of particle', 
        topics: ['Rectilinear motion (Variable acceleration)', 'Curvilinear motion', 'Projectile motion', 'Normal & Tangential components'] 
      },
      { 
        id: 'mech-u5', unit_number: 5, hours: 6, title: 'Kinetics of particle', 
        topics: ["Newton's Second Law", 'Work Energy Principle', 'Impulse Momentum Principle', 'Conservation of energy, impulse momentum and impact'] 
      },
    ]
  },
  {
    id: 'graph',
    name: 'Engineering Graphics',
    code: 'ESC-103-MEC',
    credits: 3,
    theoryCredits: 2,
    termWorkCredits: 1,
    units: [
      { 
        id: 'graph-u1', unit_number: 1, hours: 6, title: 'Fundamentals & Projection of Point/Line', 
        topics: ['Drawing instruments & Sheet layout', 'Dimensioning rules', 'Projection of Points', 'Projection of Lines (Inclined to both planes)', 'Projection of points in all quadrants'] 
      },
      { 
        id: 'graph-u2', unit_number: 2, hours: 6, title: 'Projection of Plane', 
        topics: ['Planes parallel/perpendicular to reference', 'Planes inclined to one plane', 'Planes inclined to both reference planes'] 
      },
      { 
        id: 'graph-u3', unit_number: 3, hours: 6, title: 'Engineering Curves and Development', 
        topics: ['Conic Sections (Ellipse, Parabola, Hyperbola)', 'Helix, Cycloid, Involute, Archimedean Spiral', 'Development of Lateral Surfaces (Prism, Pyramid, Cylinder, Cone)'] 
      },
      { 
        id: 'graph-u4', unit_number: 4, hours: 6, title: 'Orthographic Projection', 
        topics: ['First & Third angle method', 'Hidden features', 'Principle, plane and method of projection', 'Curved and circular features', 'Typical problems by first angle projection'] 
      },
      { 
        id: 'graph-u5', unit_number: 5, hours: 6, title: 'Isometric Projection', 
        topics: ['Isometric lines & planes', 'Isometric scale', 'Construction of Isometric views from Orthographic', 'Isometric Projection vs Isometric View'] 
      },
    ]
  },
  {
    id: 'm2',
    name: 'Engineering Mathematics-II',
    code: 'BSC-151-BES',
    credits: 4,
    theoryCredits: 3,
    termWorkCredits: 1,
    units: [
      {
        id: 'm2-u1', unit_number: 1, hours: 8, title: 'Integral Calculus',
        topics: ['Reduction Formulae', 'Beta and Gamma functions', 'Differentiation Under Integral Sign', 'Error functions']
      },
      {
        id: 'm2-u2', unit_number: 2, hours: 8, title: 'Curve Tracing and Solid Geometry',
        topics: ['Tracing of Curves: Cartesian, Polar and Parametric', 'Rectification of curves', 'Cartesian, Spherical polar and Cylindrical coordinate systems', 'Sphere, Cone and Cylinder']
      },
      {
        id: 'm2-u3', unit_number: 3, hours: 8, title: 'Multiple Integrals and Applications',
        topics: ['Double and Triple integrations', 'Change of order of integration', 'Applications: Area, Volume, Mass', 'Centre of Gravity and Moment of Inertia']
      },
      {
        id: 'm2-u4', unit_number: 4, hours: 8, title: 'First Order Ordinary Differential Equation',
        topics: ['Exact differential equations', 'Equations reducible to exact form', 'Linear differential equations', 'Equations reducible to linear form and Bernoulli’s equation']
      },
      {
        id: 'm2-u5', unit_number: 5, hours: 8, title: 'Applications of Differential Equations',
        topics: ['Orthogonal Trajectories', 'Newton’s Law of Cooling', 'Kirchhoff’s Law of Electrical Circuits', 'Rectilinear Motion and Simple Harmonic Motion', 'One dimensional Conduction of Heat']
      },
    ]
  },
  {
    id: 'pps',
    name: 'Programming and Problem Solving',
    code: 'PCC-151-ITT',
    credits: 3,
    theoryCredits: 2,
    termWorkCredits: 1,
    units: [
      {
        id: 'pps-u1', unit_number: 1, hours: 4, title: 'Problem Solving, Programming and Python Programming',
        topics: ['General problem solving concepts and top-down design', 'Problem solving strategies', 'Features, history and applications of Python', 'Programming paradigms and features of object oriented programming']
      },
      {
        id: 'pps-u2', unit_number: 2, hours: 4, title: 'Advance Data Types and Decision Control Statements',
        topics: ['Tuples, Lists, Sets and Dictionary', 'if, if-else, nested if, if-elif-else', 'while and for loops, nested loops', 'break, continue, pass and else with loops']
      },
      {
        id: 'pps-u3', unit_number: 3, hours: 3, title: 'Functions and Strings',
        topics: ['Function definition, call, scope and lifetime, return', 'Lambda functions and documentation strings', 'Modules, packages and standard library modules', 'String operations, methods and the string module']
      },
      {
        id: 'pps-u4', unit_number: 4, hours: 4, title: 'File Handling and Dictionaries',
        topics: ['File paths, types of files, opening and closing', 'Reading and writing files, file positions', 'Renaming and deleting files, directory methods', 'Dictionaries: creating, accessing, adding and updating values']
      },
      {
        id: 'pps-u5', unit_number: 5, hours: 4, title: 'Object Oriented Programming',
        topics: ['Classes, objects, methods and message passing', 'Inheritance, polymorphism, containership, delegation', 'Data abstraction and encapsulation', '__init__(), class and object variables, public and private members, static methods']
      },
    ]
  }
];

export const SYSTEM_RESOURCES: ResourceItem[] = [
    { id: 'sys_syl', type: 'pdf', title: 'SPPU First Year Engineering (2024 Pattern) syllabus', author: 'SPPU (official)', downloads: '', subject: 'GLOBAL', category: 'notes', url: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/FE%202024%20Pattern%20Syllabus%20-%2016%20July%202024%20(1).pdf', isSystem: true },
    { id: 'sys_rules', type: 'pdf', title: 'SPPU UG credit framework, grading and rules handbook', author: 'SPPU (official)', downloads: '', subject: 'GLOBAL', category: 'notes', url: 'http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/Rev.HANDBOOK-revised%20Rules%20and%20Regulations_27052025.pdf', isSystem: true },
    { id: 'sys_m1', type: 'video', title: 'NPTEL Engineering Mathematics-I (playlist)', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'BSC-101', category: 'lecture streams', url: 'https://youtube.com/playlist?list=PLbRMhDVUMngeVrxtbBz-n8HvP8KAWBpI5', isSystem: true },
    { id: 'sys_m2', type: 'video', title: 'NPTEL Engineering Mathematics-I (playlist, also listed for Maths-II)', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'BSC-151', category: 'lecture streams', url: 'https://youtube.com/playlist?list=PLbRMhDVUMngeVrxtbBz-n8HvP8KAWBpI5', isSystem: true },
    { id: 'sys_phy1', type: 'video', title: 'Quantum Mechanics lecture series by Prof. H. C. Verma', author: 'H. C. Verma, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'BSC-102', category: 'lecture streams', url: 'https://www.youtube.com/playlist?list=PLWweJWdB_GuISnGkAafMpzzDBvTHg02At', isSystem: true },
    { id: 'sys_phy2', type: 'video', title: 'Lectures by Walter Lewin (channel)', author: 'Walter Lewin, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'BSC-102', category: 'lecture streams', url: 'https://www.youtube.com/channel/UCiEHVhv0SBMpP75JbzJShqw', isSystem: true },
    { id: 'sys_chem', type: 'link', title: 'NPTEL Engineering Chemistry course', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'BSC-103', category: 'lecture streams', url: 'https://nptel.ac.in/courses/113104082', isSystem: true },
    { id: 'sys_bxe1', type: 'link', title: 'NPTEL Basic Electronics course (1)', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'ESC-101', category: 'lecture streams', url: 'https://nptel.ac.in/courses/117103063', isSystem: true },
    { id: 'sys_bxe2', type: 'link', title: 'NPTEL Basic Electronics course (2)', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'ESC-101', category: 'lecture streams', url: 'https://nptel.ac.in/courses/117103064', isSystem: true },
    { id: 'sys_bee', type: 'link', title: 'NPTEL Basic Electrical Engineering course', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'ESE-102', category: 'lecture streams', url: 'https://nptel.ac.in/courses/108105112', isSystem: true },
    { id: 'sys_eg', type: 'link', title: 'NPTEL Engineering Graphics and Design', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'ESC-103', category: 'lecture streams', url: 'https://onlinecourses.nptel.ac.in/noc21_me128/preview', isSystem: true },
    { id: 'sys_fpl1', type: 'link', title: 'NPTEL programming course (1)', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'ESC-105', category: 'lecture streams', url: 'https://onlinecourses.nptel.ac.in/noc22_cs40/preview', isSystem: true },
    { id: 'sys_fpl2', type: 'link', title: 'NPTEL programming course (2)', author: 'NPTEL, Listed in SPPU FE 2024 syllabus', downloads: '', subject: 'ESC-105', category: 'lecture streams', url: 'https://onlinecourses.nptel.ac.in/noc23_cs53/preview', isSystem: true },
];

export const EXAM_DATES: ExamDate[] = [
  // Keeping general milestones if needed, but Dashboard now favors specific subject exams
];

export const PYQ_YEARS = [
  { id: '2022d', year: '2022', session: 'Dec', completed: false },
  { id: '2023m', year: '2023', session: 'May', completed: false },
  { id: '2023d', year: '2023', session: 'Dec', completed: false },
  { id: '2024m', year: '2024', session: 'May', completed: false },
];


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
    common: true,
    examDate: '2026-01-23T10:00:00',
    units: [
      { 
        id: 'm1-u1', unit_number: 1, title: 'Single Variable Calculus', 
        topics: ['Rolle’s Theorem', 'Mean Value Theorems', "Taylor's and Maclaurin's Series", 'Indeterminate Forms', "L' Hospital's Rule", 'Fourier series (Full range & Half range)', 'Harmonic analysis'] 
      },
      { 
        id: 'm1-u2', unit_number: 2, title: 'Multivariable Calculus – Partial Differentiation', 
        topics: ['Limits & Continuity of several variables', 'Partial Derivatives', "Euler's Theorem on Homogeneous functions", 'Partial derivative of Composite Function', 'Total Derivative', 'Change of Independent variables'] 
      },
      { 
        id: 'm1-u3', unit_number: 3, title: 'Applications of Partial Differentiation', 
        topics: ['Jacobian and its applications', 'Errors and Approximations', 'Maxima and Minima of functions of two variables', "Lagrange's method of undetermined multipliers"] 
      },
      { 
        id: 'm1-u4', unit_number: 4, title: 'Matrices and System of Linear Equations', 
        topics: ['Rank of a Matrix', 'System of Linear Equations', 'Linear Dependence and Independence', 'Linear and Orthogonal Transformations', 'Applications in Engineering'] 
      },
      { 
        id: 'm1-u5', unit_number: 5, title: 'Eigen Values, Eigen Vectors and Diagonalization', 
        topics: ['Eigen Values and Eigen Vectors', 'Cayley Hamilton theorem', 'Diagonalization of a matrix', 'Reduction of Quadratic forms to Canonical form', 'Applications in Engineering'] 
      },
    ]
  },
  {
    id: 'fpl',
    name: 'Fundamentals of Programming Languages',
    code: 'ESC-105-COM',
    credits: 3,
    common: true,
    examDate: '2026-01-22T10:00:00',
    units: [
      { 
        id: 'fpl-u1', unit_number: 1, title: 'Intro to Program Planning & C Programming', 
        topics: ['Algorithms & Flowcharts', 'C Tokens, Keywords, Identifiers', 'Constants, Variables, Data types', 'Storage Classes', 'Program compilation Process'] 
      },
      { 
        id: 'fpl-u2', unit_number: 2, title: 'Operators and Expressions', 
        topics: ['Arithmetic, Relational, Logical Operators', 'Increment/Decrement Operators', 'Bitwise Operators', 'Operator Precedence', 'Type casting'] 
      },
      { 
        id: 'fpl-u3', unit_number: 3, title: 'Control Flow', 
        topics: ['If-Else, Switch Statement', 'Loops: While, Do-While, For', 'Break and Continue', 'Goto Statement'] 
      },
      { 
        id: 'fpl-u4', unit_number: 4, title: 'Arrays', 
        topics: ['One Dimensional Arrays', 'Two-dimensional Arrays', 'Character Arrays and Strings', 'String handling Functions', 'Matrix multiplication'] 
      },
      { 
        id: 'fpl-u5', unit_number: 5, title: 'User Defined Functions', 
        topics: ['Function definition & declaration', 'Call by value/reference', 'Recursion', 'Structures (Declaration, Initialization)', 'Tower of Hanoi'] 
      },
    ]
  },
  {
    id: 'phy',
    name: 'Engineering Physics',
    code: 'BSC-102-BES',
    credits: 4,
    examDate: '2026-01-24T10:00:00',
    units: [
      { 
        id: 'phy-u1', unit_number: 1, title: 'Fundamentals of Photonics', 
        topics: ['Laser: Spontaneous/Stimulated emission', 'CO2 laser construction & working', 'Holography: Recording & Reconstruction', 'Optical fibers: NA, Attenuation', 'Fiber optic communication advantages'] 
      },
      { 
        id: 'phy-u2', unit_number: 2, title: 'Quantum Physics', 
        topics: ['de Broglie hypothesis & Matter waves', "Schrödinger's time dependent/independent equations", 'Particle in a rigid box', 'Quantum tunneling & STM', 'Quantum computing: Qbits, Superposition, Entanglement'] 
      },
      { 
        id: 'phy-u3', unit_number: 3, title: 'Wave Optics', 
        topics: ['Interference in thin films (Reflected system)', "Newton's rings", 'Polarization (PPL, CPL, EPL)', "Malu's law", 'Double refraction (Huygens theory)', 'LCDs & 3D Movies'] 
      },
      { 
        id: 'phy-u4', unit_number: 4, title: 'Semiconductor Physics and Ultrasonics', 
        topics: ['Fermi level & Fermi energy', 'PN junction diode (Fermi level basis)', 'Solar cell: IV characteristics & Fill factor', 'Hall effect', 'Ultrasonics: Piezoelectric generation', 'Flaw detection & Thickness measurement'] 
      },
      { 
        id: 'phy-u5', unit_number: 5, title: 'Nanoparticles and Superconductivity', 
        topics: ['Quantum confinement', 'Synthesis: Ball milling, PVD', 'GMR effect & HDD', 'Superconductivity (Type I & II)', 'Meissner effect & BCS theory', 'SQUID & Maglev train'] 
      },
    ]
  },
  {
    id: 'chem',
    name: 'Engineering Chemistry',
    code: 'BSC-103-BES',
    credits: 4,
    examDate: '2026-01-27T10:00:00',
    units: [
      { 
        id: 'chem-u1', unit_number: 1, title: 'Water Technology', 
        topics: ['Impurities & Hardness (EDTA method)', 'Alkalinity determination', 'Boiler troubles: Priming, Foaming, Scale, Sludge', 'Zeolite & Demineralization methods', 'Reverse Osmosis & Electrodialysis'] 
      },
      { 
        id: 'chem-u2', unit_number: 2, title: 'Instrumental Methods of Analysis', 
        topics: ['Conductometry (Acid-Base Titrations)', 'pHmetry (Strong Acid-Strong Base)', 'UV-Visible Spectroscopy', "Beer's law & Lambert's law", 'Instrumentation (Double beam)'] 
      },
      { 
        id: 'chem-u3', unit_number: 3, title: 'Advanced Engineering Materials', 
        topics: ['Polymers: Thermoplastics vs Thermosetting', 'Specialty Polymers: Polycarbonate, PHBV', 'Conducting Polymers (Polyacetylene)', 'Nanomaterials: Graphene, CNTs, Quantum dots'] 
      },
      { 
        id: 'chem-u4', unit_number: 4, title: 'Energy Sources', 
        topics: ['Calorific value (Bomb & Boy’s calorimeter)', 'Coal Analysis (Proximate & Ultimate)', 'Biodiesel & Power alcohol', 'Hydrogen fuel cells', 'Lithium Ion Battery'] 
      },
      { 
        id: 'chem-u5', unit_number: 5, title: 'Corrosion and its Prevention', 
        topics: ['Dry & Wet corrosion mechanisms', "Pilling-Bedworth's rule", 'Cathodic Protection (Sacrificial/Impressed current)', 'Electroplating & Hot dipping', 'Anti-corrosive paints'] 
      },
    ]
  },
  {
    id: 'elect',
    name: 'Basic Electronics Engineering',
    code: 'ESC-101-ETC',
    credits: 3,
    examDate: '2026-01-17T10:00:00',
    units: [
      { 
        id: 'elect-u1', unit_number: 1, title: 'Diodes and Applications', 
        topics: ['PN Junction Diode Characteristics', 'Rectifiers (Half, Full Wave, Bridge)', 'Capacitor filter', 'LED & Photodiode', 'Diode as a switch'] 
      },
      { 
        id: 'elect-u2', unit_number: 2, title: 'Transistors and Technology', 
        topics: ['BJT: CE Configuration & Amplifier', 'EMOSFET: Switch & Amplifier', 'VLSI Technology Introduction', 'CMOS Manufacturing (N-Well)'] 
      },
      { 
        id: 'elect-u3', unit_number: 3, title: 'Logic Gates and Digital Circuits', 
        topics: ['Number Systems (Binary, Hex, Octal)', 'Logic Gates (Universal Gates)', 'Half & Full Adders', 'Flip Flops (SR, JK, T, D)', 'Microprocessor vs Microcontroller'] 
      },
      { 
        id: 'elect-u4', unit_number: 4, title: 'Op-Amp and Electronic Instruments', 
        topics: ['Op-Amp Block Diagram', 'Inverting & Non-inverting Amplifier', 'Digital Multimeter', 'Function Generator', 'Digital Storage Oscilloscope (DSO)'] 
      },
      { 
        id: 'elect-u5', unit_number: 5, title: 'Sensors and Communication Systems', 
        topics: ['Sensors: LVDT, Thermocouple, RTD, Strain Gauge', 'IoT Data Acquisition System', 'GSM System Block Diagram', 'Wired vs Wireless Media'] 
      },
    ]
  },
  {
    id: 'elec',
    name: 'Basic Electrical Engineering',
    code: 'ESE-102-ELE',
    credits: 3,
    examDate: '2026-01-19T10:00:00',
    units: [
      { 
        id: 'elec-u1', unit_number: 1, title: 'Elementary Concepts and DC Circuits', 
        topics: ['Resistance, EMF, Potential Difference', 'Overview of Power System (Generation, Transmission, Distribution)', 'Kirchhoff’s Laws (KVL/KCL) & Loop Analysis', 'Star-Delta Transformation', 'Superposition Theorem'] 
      },
      { 
        id: 'elec-u2', unit_number: 2, title: 'Electromagnetism', 
        topics: ['Magnetic Circuits (Flux, MMF, Reluctance)', 'Series Magnetic Circuits', "Faraday's Laws of Electromagnetic Induction", "Fleming's Right-hand Rule", 'Statically & Dynamically Induced EMF', 'Self & Mutual Inductance', 'Energy stored in Magnetic Field'] 
      },
      { 
        id: 'elec-u3', unit_number: 3, title: 'AC Fundamentals', 
        topics: ['Generation of Sinusoidal Voltages', 'RMS, Average, Peak, Form Factor', 'Phasor Representation (Rectangular/Polar)', 'Phase Difference (Lagging/Leading)', 'Pure R, L, C Circuits'] 
      },
      { 
        id: 'elec-u4', unit_number: 4, title: 'AC Circuits', 
        topics: ['Series R-L, R-C, R-L-C Circuits', 'Impedance, Power Factor, Phasor Diagrams', 'Active, Reactive, Apparent Power', 'Resonance in RLC Series', 'Three Phase AC (Star & Delta Relations)'] 
      },
      { 
        id: 'elec-u5', unit_number: 5, title: 'Introduction to Electric Machines', 
        topics: ['Single Phase Transformer (Principle, EMF Eq, Efficiency)', 'DC Motors (Construction, Types, Characteristics)', 'Three Phase Induction Motor (RMF principle)', 'Single Phase Induction Motor (Split Phase, Capacitor Types)'] 
      },
    ]
  },
  {
    id: 'mech',
    name: 'Engineering Mechanics',
    code: 'ESC-104-CVL',
    credits: 3,
    examDate: '2026-01-21T10:00:00',
    units: [
      { 
        id: 'mech-u1', unit_number: 1, title: 'Force systems and its resultants', 
        topics: ['Resolution & Composition of forces', "Varignon's theorem", 'Distributed Forces', 'Centroid of composite figures', 'Moment of Inertia (Parallel/Perpendicular axis)'] 
      },
      { 
        id: 'mech-u2', unit_number: 2, title: 'Equilibrium', 
        topics: ['Free body diagram', 'Three Force Principle (Lami’s)', 'Equilibrium of Concurrent/Parallel/General forces', 'Types of beams, loads & supports'] 
      },
      { 
        id: 'mech-u3', unit_number: 3, title: 'Friction and trusses', 
        topics: ['Laws of Coulomb friction', 'Angle of repose & Cone of friction', 'Ladder & Belt friction', 'Simple Trusses: Method of Joints & Sections'] 
      },
      { 
        id: 'mech-u4', unit_number: 4, title: 'Kinematics of particle', 
        topics: ['Rectilinear motion (Variable acceleration)', 'Curvilinear motion', 'Projectile motion', 'Normal & Tangential components'] 
      },
      { 
        id: 'mech-u5', unit_number: 5, title: 'Kinetics of particle', 
        topics: ["Newton's Second Law", 'Work Energy Principle', 'Impulse Momentum Principle', 'Coefficient of Restitution & Impact'] 
      },
    ]
  },
  {
    id: 'graph',
    name: 'Engineering Graphics',
    code: 'ESC-103-MEC',
    credits: 3,
    examDate: '2026-01-20T10:00:00',
    units: [
      { 
        id: 'graph-u1', unit_number: 1, title: 'Fundamentals & Projection of Point/Line', 
        topics: ['Drawing instruments & Sheet layout', 'Dimensioning rules', 'Projection of Points', 'Projection of Lines (Inclined to both planes)', 'Traces of Lines'] 
      },
      { 
        id: 'graph-u2', unit_number: 2, title: 'Projection of Plane', 
        topics: ['Planes parallel/perpendicular to reference', 'Planes inclined to one plane', 'Planes inclined to both reference planes'] 
      },
      { 
        id: 'graph-u3', unit_number: 3, title: 'Engineering Curves and Development', 
        topics: ['Conic Sections (Ellipse, Parabola, Hyperbola)', 'Helix, Cycloid, Involute, Archimedean Spiral', 'Development of Lateral Surfaces (Prism, Pyramid, Cylinder, Cone)'] 
      },
      { 
        id: 'graph-u4', unit_number: 4, title: 'Orthographic Projection', 
        topics: ['First & Third angle method', 'Hidden features', 'Conversion of 3D to 2D views', 'Sectional Views'] 
      },
      { 
        id: 'graph-u5', unit_number: 5, title: 'Isometric Projection', 
        topics: ['Isometric lines & planes', 'Isometric scale', 'Construction of Isometric views from Orthographic', 'Isometric Projection vs Isometric View'] 
      },
    ]
  }
];

export const SYSTEM_RESOURCES: ResourceItem[] = [
    { id: 'sys_1', type: 'pdf', title: 'Maths-I Unit 1 Handwritten Notes', author: 'Dr. Deshmukh', downloads: '1.4k', subject: 'BSC-101', category: 'notes', url: 'https://drive.google.com', isSystem: true },
    { id: 'sys_2', type: 'video', title: 'Calculus Visualization', author: '3Blue1Brown', downloads: '920', subject: 'BSC-101', category: 'lecture streams', url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM', isSystem: true },
    { id: 'sys_3', type: 'pdf', title: 'Quantum Mechanics Lab Spec', author: 'Physics Dept', downloads: '2.1k', subject: 'BSC-102', category: 'notes', url: 'https://drive.google.com', isSystem: true },
    { id: 'sys_4', type: 'book', title: 'Electrical Engineering PYQs', author: 'EliteAlumni', downloads: '1.8k', subject: 'ESC-101', category: 'solved pyqs', url: 'https://drive.google.com', isSystem: true },
    { id: 'sys_5', type: 'video', title: 'Mechanical Energy Conversion', author: 'Tikles Academy', downloads: '3.4k', subject: 'ESC-104', category: 'lecture streams', url: 'https://www.youtube.com/watch?v=zhL5DCizj5c', isSystem: true },
    { id: 'sys_6', type: 'pdf', title: 'In-Sem 2023 Solved Papers', author: 'PrepTeam', downloads: '5k+', subject: 'GLOBAL', category: 'solved pyqs', url: 'https://drive.google.com', isSystem: true },
    { id: 'sys_7', type: 'book', title: 'Higher Engineering Mathematics', author: 'B.S. Grewal', downloads: '12k', subject: 'BSC-101', category: 'textbooks', url: 'https://drive.google.com', isSystem: true }
];

export const EXAM_DATES: ExamDate[] = [
  // Keeping general milestones if needed, but Dashboard now favors specific subject exams
  { name: 'End-Sem Starts', date: '2026-01-17T10:00:00' }
];

export const PYQ_YEARS = [
  { id: '2022d', year: '2022', session: 'Dec', completed: false },
  { id: '2023m', year: '2023', session: 'May', completed: false },
  { id: '2023d', year: '2023', session: 'Dec', completed: false },
  { id: '2024m', year: '2024', session: 'May', completed: false },
];

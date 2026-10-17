import { Subject } from '../types';

// Second Year Computer Engineering, 2024 pattern (NEP), effective AY 2025-26.
// Source: official SPPU syllabus PDF (collegecirculars.unipune.ac.in, Syllabus2025
// library); verbatim text preserved in docs/raw/SE-Computer-2024-pattern.txt.
// Scope note: only theory courses with a unit-wise syllabus are tracked here.
// Labs, Open Electives, AEC/EEM/VEC/CEP courses have no unit-wise theory
// content in the PDF and are excluded for now.
export const SE_COMPUTER_SUBJECTS: Subject[] = [
  {
    id: 'ds',
    name: 'Data Structures',
    code: 'PCC-201-COM',
    credits: 3,
    theoryCredits: 3,
    termWorkCredits: 0,
    units: [
      { id: 'ds-u1', unit_number: 1, title: 'Introduction to Data Structures and Algorithms',
        topics: ['Abstract Data Types (ADT)', 'Linear, non-linear, static, dynamic, persistent and ephemeral data structures', 'Space and time complexity', 'Asymptotic notation: Big-O, Theta, Omega', 'Step count method', 'Analysis of programming constructs', 'Algorithmic strategies: Divide and Conquer, Greedy'] },
      { id: 'ds-u2', unit_number: 2, title: 'Linear Data Structures, Searching and Sorting',
        topics: ['Array as an ADT, operations and storage representation', 'Multidimensional arrays', 'Sparse matrix representation', 'Sequential, Binary, Fibonacci and Indexed Sequential Search', 'Sorting concepts: stability, efficiency, passes', 'Bubble, Insertion, Selection, Quick, Merge sort'] },
      { id: 'ds-u3', unit_number: 3, title: 'Stacks, Queues and Linked Lists',
        topics: ['Stack operations and multiple stacks', 'Expression conversion: infix, prefix, postfix', 'Postfix expression evaluation', 'Circular and priority queues', 'Linked list primitive operations', 'Singly, circular and doubly linked lists'] },
      { id: 'ds-u4', unit_number: 4, title: 'Hashing',
        topics: ['Hash table concepts: hash function, bucket, collision, probe', 'Open and closed hashing, perfect hash function', 'Load factor and rehashing', 'Collision resolution: open addressing and chaining', 'Extendible hashing', 'Separate chaining'] },
      { id: 'ds-u5', unit_number: 5, title: 'Graphs and Trees',
        topics: ['Graph storage: adjacency matrix and list', 'DFS and BFS traversals', 'Minimum spanning tree: Prim and Kruskal', 'Binary tree properties and traversals', 'Converting general trees to binary trees', 'Binary Search Tree operations'] },
    ]
  },
  {
    id: 'oopcg',
    name: 'Object Oriented Programming and Computer Graphics',
    code: 'PCC-202-COM',
    credits: 3,
    theoryCredits: 3,
    termWorkCredits: 0,
    units: [
      { id: 'oopcg-u1', unit_number: 1, title: 'Introduction to OOP Concepts and Control Structures',
        topics: ['Programming paradigms: procedural, object oriented, functional, logic', 'OOP fundamentals: classes, objects, encapsulation, abstraction, inheritance, polymorphism', 'Java program structure and JVM', 'Data types, operators and expressions', 'Selection and iteration statements'] },
      { id: 'oopcg-u2', unit_number: 2, title: 'Classes, Objects and Arrays',
        topics: ['Defining classes, fields and methods', 'Constructors and the this keyword', 'Method overloading', 'Arrays and multidimensional arrays', 'Command-line arguments', 'Byte and character streams, console I/O'] },
      { id: 'oopcg-u3', unit_number: 3, title: 'Inheritance, Polymorphism, Exception Handling and Multithreading',
        topics: ['Superclasses, subclasses and types of inheritance', 'Abstract classes, final methods, dynamic binding', 'Interfaces', 'try-catch, throw, throws, finally, built-in exceptions', 'Java thread model, creating threads'] },
      { id: 'oopcg-u4', unit_number: 4, title: 'Graphics Primitives, Scan Conversion, Windowing and Clipping',
        topics: ['Graphics primitives: pixel, resolution, aspect ratio, frame buffer', 'Line drawing: DDA, Bresenham', 'Circle drawing: DDA, Bresenham, Midpoint', 'Polygon types and filling: flood, seed, scan line', 'Cohen-Sutherland line clipping', 'Sutherland-Hodgeman polygon clipping'] },
      { id: 'oopcg-u5', unit_number: 5, title: '2D, 3D Transformations and Projections',
        topics: ['2D translation, scaling, rotation, shear', 'Rotation about an arbitrary point', '3D transformations and arbitrary-axis rotation', 'Parallel projections: oblique, orthographic', 'Perspective projections: 1, 2 and 3 point'] },
    ]
  },
  {
    id: 'os',
    name: 'Operating Systems',
    code: 'PCC-203-COM',
    credits: 3,
    theoryCredits: 3,
    termWorkCredits: 0,
    units: [
      { id: 'os-u1', unit_number: 1, title: 'Introduction to Operating Systems',
        topics: ['OS objectives, functions and evolution', 'Types of operating systems', 'System calls and their types', 'Layered, monolithic and microkernel structures', 'Linux components and basic shell commands'] },
      { id: 'os-u2', unit_number: 2, title: 'Process and Thread Management',
        topics: ['Process states, transitions and PCB', 'Context switching', 'Long, short and middle term schedulers', 'User-level vs kernel-level threads', 'FCFS, SJF, RR and priority scheduling', 'Preemptive vs non-preemptive scheduling'] },
      { id: 'os-u3', unit_number: 3, title: 'Interprocess Communication and Deadlock',
        topics: ['Critical section problem', 'Semaphores, mutexes, monitors', 'Producer-consumer, reader-writer, dining philosophers', 'Message passing and shared memory', 'Deadlock conditions, prevention, avoidance, detection, recovery', "Banker's algorithm"] },
      { id: 'os-u4', unit_number: 4, title: 'Memory Management',
        topics: ['Contiguous and non-contiguous allocation', 'Internal and external fragmentation', 'First fit, best fit, worst fit', 'Paging and page table structure', 'Segmentation and demand paging', 'Page replacement: FIFO, LRU, Optimal', 'Thrashing'] },
      { id: 'os-u5', unit_number: 5, title: 'File and Disk Management',
        topics: ['File operations, directories and organization', 'File allocation methods', 'FAT, NTFS, EXT, HFS file systems', 'Disk structure and scheduling: FIFO, SSTF, SCAN, C-SCAN, LOOK, C-LOOK', 'Disk reliability, formatting, boot block, bad blocks'] },
    ]
  },
  {
    id: 'deld',
    name: 'Digital Electronics and Logic Design',
    code: 'MDM-221-COM',
    credits: 2,
    theoryCredits: 2,
    termWorkCredits: 0,
    units: [
      { id: 'deld-u1', unit_number: 1, title: 'Boolean Algebra and Simplification Techniques',
        topics: ['Boolean algebra theorems and properties', "DeMorgan's rules", 'Signed magnitude, 1s and 2s complement', 'SOP and POS forms', 'K-map minimization up to 4 variables'] },
      { id: 'deld-u2', unit_number: 2, title: 'Combinational Logic Design',
        topics: ['Half and full adders and subtractors', 'Binary adder IC 7483, BCD adder', 'Look ahead carry generator', 'Code converters: BCD, Excess-3, Gray', 'Multiplexers and demultiplexers', 'Comparators'] },
      { id: 'deld-u3', unit_number: 3, title: 'Sequential Circuits',
        topics: ['SR, JK, D, T flip-flops', 'Master-slave JK, truth and excitation tables', 'Flip-flop conversions', 'Registers: SISO, SIPO, PISO, PIPO', 'Ring, BCD and Johnson counters'] },
      { id: 'deld-u4', unit_number: 4, title: 'Algorithmic State Machines and Logic Families',
        topics: ['FSM and ASM charts', 'ASM chart construction and realization', 'Unipolar and bipolar logic families', 'Digital IC characteristics: fan-in, fan-out, noise immunity, propagation delay', 'TTL vs CMOS'] },
      { id: 'deld-u5', unit_number: 5, title: 'Programmable Logic Devices',
        topics: ['ROM as a PLD', 'PLA: implementation, construction, working', 'PAL: architecture and programming', 'Designing combinational circuits using PLDs'] },
    ]
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    code: 'PCC-251-COM',
    credits: 3,
    theoryCredits: 3,
    termWorkCredits: 0,
    units: [
      { id: 'dbms-u1', unit_number: 1, title: 'Introduction to DBMS',
        topics: ['Purpose and applications of database systems', 'View of data and database languages', 'Database system structure', 'ER model: entities, attributes, relationships, constraints, keys', 'ER diagrams and extended ER features', 'Converting ER diagrams into tables'] },
      { id: 'dbms-u2', unit_number: 2, title: 'SQL and PL/SQL',
        topics: ['DDL, DML and select queries', 'String, date, numerical and aggregate functions', 'Views, indexes, group by, having', 'Joins, set operations, nested queries', 'DCL and TCL', 'PL/SQL: cursors, stored procedures, functions, triggers'] },
      { id: 'dbms-u3', unit_number: 3, title: 'Relational Database Design',
        topics: ["Relational model and CODD's rules", 'Relational and referential integrity', 'Features of good relational designs', 'Functional dependencies', 'Normalization: 1NF, 2NF, 3NF, BCNF'] },
      { id: 'dbms-u4', unit_number: 4, title: 'Database Transactions',
        topics: ['Transaction concept and ACID properties', 'Schedules and serial schedules', 'Serializability: conflict and view', 'Recoverable and non-recoverable schedules', 'Concurrency control and locking methods'] },
      { id: 'dbms-u5', unit_number: 5, title: 'NoSQL Databases',
        topics: ['NoSQL data models', 'CAP theorem and BASE properties', 'SQL vs NoSQL', 'MongoDB: CRUD operations', 'Indexing and aggregation in MongoDB'] },
    ]
  },
  {
    id: 'dm',
    name: 'Discrete Mathematics',
    code: 'PCC-252-COM',
    credits: 3,
    theoryCredits: 3,
    termWorkCredits: 0,
    units: [
      { id: 'dm-u1', unit_number: 1, title: 'Sets and Propositions',
        topics: ['Propositional logic and equivalences', 'Translating English sentences', 'Mathematical and strong induction', 'Naive and axiomatic set theory', 'Set operations and cardinality', 'Inclusion-exclusion principle', 'Countable and uncountable sets, power set'] },
      { id: 'dm-u2', unit_number: 2, title: 'Relations and Functions',
        topics: ['Relations and their matrix and digraph representations', 'Equivalence relations and partial orderings', 'Hasse diagrams, lattices, chains and anti-chains', "Transitive closure and Warshall's algorithm", 'Injective, surjective, bijective functions', 'Composition, inverse and recursive functions'] },
      { id: 'dm-u3', unit_number: 3, title: 'Introduction to Trees',
        topics: ['Tree properties and decision trees', 'Prefix codes and Huffman coding', 'Trees in file systems', 'Cut sets and max flow-min cut theorem', 'Minimum spanning trees: Prim and Kruskal'] },
      { id: 'dm-u4', unit_number: 4, title: 'Introduction to Graph Theory',
        topics: ['Graph terminology and special graphs', 'Graph isomorphism and connectivity', 'Euler and Hamilton paths', 'Handshaking lemma', "Dijkstra's shortest path", 'Planar graphs and graph colouring'] },
      { id: 'dm-u5', unit_number: 5, title: 'Counting Principles and Algebraic Structures',
        topics: ['Addition and multiplication principles', 'Permutations, combinations, binomial coefficients', 'Pigeonhole principle', 'Generating functions', 'Semigroups, monoids, groups', 'Homomorphism, normal subgroups, rings, integral domains, fields'] },
    ]
  },
  {
    id: 'co',
    name: 'Computer Organization and Microprocessor',
    code: 'PCC-253-COM',
    credits: 2,
    theoryCredits: 2,
    termWorkCredits: 0,
    units: [
      { id: 'co-u1', unit_number: 1, title: 'Computer Evolution and Performance',
        topics: ['Von Neumann and Harvard architecture', 'Evolution of Intel processors, performance assessment', 'Bus interconnection structure', 'ALU and signed number arithmetic', 'Fast adders and carry look ahead', "Booth's multiplication algorithm"] },
      { id: 'co-u2', unit_number: 2, title: 'Memory Management',
        topics: ['Memory system characteristics and hierarchy', 'Cache principles and mapping functions', 'Replacement algorithms and write policy', 'Semiconductor main memory and DRAM', 'Hard disk organization', 'RAID levels 1 to 6'] },
      { id: 'co-u3', unit_number: 3, title: 'Introduction to 8086 Microprocessor',
        topics: ['8086 architecture and pin diagram', 'Programmer model and registers', 'Addressing modes of 8086', 'Data movement and arithmetic instructions', 'Logic, control transfer and string instructions', 'I/O and flag control instructions'] },
      { id: 'co-u4', unit_number: 4, title: 'Memory Organization and Interrupts',
        topics: ['Segmentation and logical to physical address translation', 'Even and odd memory banks', 'Address mapping and decoding', 'Memory mapped vs I/O mapped I/O', 'Interrupt vector table and ISR', '8259 programmable interrupt controller'] },
      { id: 'co-u5', unit_number: 5, title: 'Parallel Organization',
        topics: ['Multiprocessors and clusters', "Flynn's taxonomy", 'Closely and loosely coupled systems', 'SMP organization, UMA, NUMA', 'RISC characteristics and pipelining', 'RISC vs CISC'] },
    ]
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    code: 'MDM-271-COM',
    credits: 2,
    theoryCredits: 2,
    termWorkCredits: 0,
    units: [
      { id: 'iot-u1', unit_number: 1, title: 'Introduction to IoT',
        topics: ['IoT definition, characteristics and evolution', 'M2M communication and IoT challenges', 'Functional blocks of the IoT ecosystem', 'Communication models and APIs', 'IoT enabling technologies: WSN, cloud, big data, embedded systems'] },
      { id: 'iot-u2', unit_number: 2, title: 'Sensors and Actuators',
        topics: ['Sensors and transducers: principles, classifications, types', 'Actuators: principles and types', 'Arduino IDE and boards', 'Raspberry Pi, NodeMCU, ESP32, Beaglebone'] },
      { id: 'iot-u3', unit_number: 3, title: 'Protocols for IoT',
        topics: ['Physical and MAC layers', 'IEEE 802.15.4, 802.11ah, LoRaWAN', 'IPv4, IPv6 and 6LoWPAN', 'Application layer: CoAP and MQTT', 'Zigbee, Bluetooth, BLE, ZWave'] },
      { id: 'iot-u4', unit_number: 4, title: 'Cloud for IoT',
        topics: ['Cloud computing fundamentals', 'Cloud services: AWS, Azure, Adafruit', 'IoT with cloud', 'Challenges and selection of cloud for IoT'] },
      { id: 'iot-u5', unit_number: 5, title: 'IoT Applications',
        topics: ['Smart cities: parking, lighting, roads, surveillance', 'Smart grids and renewable energy', 'Environment: weather, air and noise pollution, forest fire, flood detection', 'Agriculture: smart irrigation, greenhouse control', 'Industry and health: machine diagnostics, wearables'] },
    ]
  },
];

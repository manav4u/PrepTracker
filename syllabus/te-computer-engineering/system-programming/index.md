# System Programming syllabus

PEC361DCOM · Third Year Computer Engineering, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PEC361DCOM 3 h/week theory CCE 30 + End-sem 70

45 hours of theory

05 . units

03 . credits

## Unit-wise syllabus

UNIT I

### Overview of System Software and Language Processors

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Fundamentals of system software and its components, difference between system and application software, basic machine architecture, instruction cycle, addressing modes, and machine/assembly language concepts.
- Overview of language processors including assembler, compiler and interpreter with phases of compilation and Bootstrapping, Assembler design covering symbol, literal and pool tables, directives, forward references, macro processor, and one-pass and two-pass techniques for Assembler and Macro Processor.
- Basics of linker, loader, system utilities, Types of errors, error detection and diagnostics.
- Case Study: Development of System Programming Tools at Microsoft

**Preserved official unit paragraph**

Fundamentals of system software and its components, difference between system and application software, basic machine architecture, instruction cycle, addressing modes, and machine/assembly language concepts. Overview of language processors including assembler, compiler and interpreter with phases of compilation and Bootstrapping, Assembler design covering symbol, literal and pool tables, directives, forward references, macro processor, and one-pass and two-pass techniques for Assembler and Macro Processor. Basics of linker, loader, system utilities, Types of errors, error detection and diagnostics. Case Study: Development of System Programming Tools at Microsoft

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/system-programming/#unit-1)

UNIT II

### Macro Processors, Linkers, Loaders

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Macroprocessors: Introduction, macro definition and macro call, macro expansion, nested macro calls, advanced macro facilities, functions and basic tasks of a macro processor, features and design issues of macro processors, macro processor design options, design of macro preprocessor and macro assembler, one-pass and two-pass macro processors.
- Linkers & Loaders: Introduction to linkers and loaders, relocation and linking concepts, design of a linker, self-relocating programs, linking in MS- DOS, linking of overlay structured programs, static and dynamic linking.
- Loaders and loading process, different loading schemes such as compile-and-go loaders, general loader schemes, direct loaders, absolute loaders.
- Comparison of linkers and loaders.
- Case Study: macro expansion and program relocation using a two-pass macro processor and relocating loader for executing an assembly language program.

**Preserved official unit paragraph**

Macroprocessors: Introduction, macro definition and macro call, macro expansion, nested macro calls, advanced macro facilities, functions and basic tasks of a macro processor, features and design issues of macro processors, macro processor design options, design of macro preprocessor and macro assembler, one-pass and two-pass macro processors. Linkers & Loaders: Introduction to linkers and loaders, relocation and linking concepts, design of a linker, self-relocating programs, linking in MS- DOS, linking of overlay structured programs, static and dynamic linking. Loaders and loading process, different loading schemes such as compile-and-go loaders, general loader schemes, direct loaders, absolute loaders. Comparison of linkers and loaders. Case Study: macro expansion and program relocation using a two-pass macro processor and relocating loader for executing an assembly language program.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/system-programming/#unit-2)

UNIT III

### Scanning, Parsing and Language Translator

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Programming Language Grammars, Classification of Grammar,Ambiguity in Grammatical Specification, Context Free Grammar.
- Lexical analysis: role of lexical analyzer, tokens, patterns and lexemes, lexical errors, and regular definitions for language constructs such as strings, sequences, and comments.
- Transition diagrams and finite automata for token recognition, reserved words and identifiers with suitable examples.
- Scanning, Parsing, Parsing fundamentals, syntax analysis, Top Down Parsing- LL, Bottom up Parsing-LR, syntax-directed translation concepts, and basic error handling and recovery mechanisms.
- Case Study: LEX/FLEX and YACC/BISON—introduction, specification and features, working flow, and applications in compiler construction, language processing, and syntax analysis.

**Preserved official unit paragraph**

Programming Language Grammars, Classification of Grammar,Ambiguity in Grammatical Specification, Context Free Grammar. Lexical analysis: role of lexical analyzer, tokens, patterns and lexemes, lexical errors, and regular definitions for language constructs such as strings, sequences, and comments. Transition diagrams and finite automata for token recognition, reserved words and identifiers with suitable examples. Scanning, Parsing, Parsing fundamentals, syntax analysis, Top Down Parsing- LL, Bottom up Parsing-LR, syntax-directed translation concepts, and basic error handling and recovery mechanisms. Case Study: LEX/FLEX and YACC/BISON—introduction, specification and features, working flow, and applications in compiler construction, language processing, and syntax analysis.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/system-programming/#unit-3)

UNIT IV

### Compilers, Interpreters and Debugger

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Compiler : Introduction, Definition, and Functions of a Compiler
- Structure of a Compiler
- Data Structure used in Compiling, Scope Rules, Memory Allocation,Compilation of Regular Expression, Compilation of Control Structure.
- Phases of a Compiler
- Lexical Analysis, Syntax Analysis, Semantic Analysis, Intermediate Code Generation, Code Optimization, and Target Code Generation.
- Interpreter: Definition and working of interpreter, interpreter vs. compiler, use cases of interpreters, performance considerations, Examples: JavaScript interpreters Debugger: Need for debugging tools, types of program errors, Debugging techniques, Overview of popular debuggers (GDB, IDE debuggers) Case Study: GCC (GNU Compiler Collection)

**Preserved official unit paragraph**

Compiler : Introduction, Definition, and Functions of a Compiler; Structure of a Compiler; Data Structure used in Compiling, Scope Rules, Memory Allocation,Compilation of Regular Expression, Compilation of Control Structure. Phases of a Compiler; Lexical Analysis, Syntax Analysis, Semantic Analysis, Intermediate Code Generation, Code Optimization, and Target Code Generation. Interpreter: Definition and working of interpreter, interpreter vs. compiler, use cases of interpreters, performance considerations, Examples: JavaScript interpreters Debugger: Need for debugging tools, types of program errors, Debugging techniques, Overview of popular debuggers (GDB, IDE debuggers) Case Study: GCC (GNU Compiler Collection)

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/system-programming/#unit-4)

UNIT V

### Device Drivers and Modern Extension

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Device Driver: Introduction, Definition ,Types :Character device drivers, Block device drivers, Network device drivers, Printer and display driver.
- System Utilities : File management utilities, Disk management tools , Backup and recovery utilities, Compression utilities.
- Runtime Support Systems : Runtime libraries, Garbage collectors, Just-In-Time (JIT) compilers , Virtual machines (JVM, .NET CLR) Virtualization and Container Software : Hypervisors (VMware, VirtualBox, KVM), Container engines (Docker) Case Study : Virtualization Using Type-2 Hypervisor: A VirtualBox

**Preserved official unit paragraph**

Device Driver: Introduction, Definition ,Types :Character device drivers, Block device drivers, Network device drivers, Printer and display driver. System Utilities : File management utilities, Disk management tools , Backup and recovery utilities, Compression utilities. Runtime Support Systems : Runtime libraries, Garbage collectors, Just-In-Time (JIT) compilers , Virtual machines (JVM, .NET CLR) Virtualization and Container Software : Hypervisors (VMware, VirtualBox, KVM), Container engines (Docker) Case Study : Virtualization Using Type-2 Hypervisor: A VirtualBox

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/system-programming/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 3 |
| End-semester exam | 70 | 3 |

Prerequisite: Fundamentals of Programming Language and Data Structures.

## Course outcomes

1. CO1 Explain and demonstrate the working principles of system software components, particularly assemblers. •
2. CO2 Analyze and describe the design and functioning of macroprocessors, loaders, and linkers in program execution. •
3. CO3 Design and implement basic lexical analyzers and parsers to identify tokens, recognize grammar structures, and handle simple program errors. •
4. CO4 Analyze and differentiate the various phases of a compiler, interpreter, and debugger. •
5. CO5 Explain and evaluate the roles of device drivers, system utilities, runtime systems, and virtualization tools in modern computing environments.

## Books

### Text books

- D. M. Dhamdhere, System Programming and Operating Systems, McGraw Hill Education.
- Alfred V. Aho, Monica S. Lam, Ravi Sethi & Jeffrey D. Ullman, “Compilers: Principles, Techniques, and Tools (2nd Edition)”, Pearson Education, ISBN-13: 978-0321486813.
- System Software by Santanu Chattopadhyay, Prentice-Hall India,2007

### Reference books

- 1. Leland L. Beck, System Software: An Introduction to Systems Programming, 3rd Edition, Pearson Education.
- Andrew W. Appel, “Modern Compiler Implementation in C”, Cambridge University Press, ISBN- 13: 978-0521607650.
- John J. Donovan, System Programming, Tata McGraw-Hill, ISBN-13: 978-0-07-460482-3.

## FAQ

**How many units are in System Programming?**

System Programming (PEC361DCOM) has 5 units and 45 hours of theory: Unit I Overview of System Software and Language Processors (9 h); Unit II Macro Processors, Linkers, Loaders (9 h); Unit III Scanning, Parsing and Language Translator (9 h); Unit IV Compilers, Interpreters and Debugger (9 h); Unit V Device Drivers and Modern Extension (9 h).

**What is the marks scheme for System Programming?**

The official Computer Engineering 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 3 credits.

**What should I know before System Programming?**

Prerequisite listed in the syllabus: Fundamentals of Programming Language and Data Structures.

---

Source note: Mobile Computing uses PEC321CCOM from the curriculum table; its detailed course heading prints PCC305CCOM. Robotics and Automation is a tutorial/practical course and is excluded from this theory-course list.

Source: [SPPU TE Computer Engineering 2024 pattern syllabus (September 22, 2026, effective 2026-27) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE%20-%20Computer%20Engineering%20-%202024%2022092026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE Computer subjects](https://preptracker.manavdev.site/syllabus/te-computer-engineering/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

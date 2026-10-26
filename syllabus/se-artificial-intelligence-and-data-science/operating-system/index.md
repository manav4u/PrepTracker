# Operating System syllabus

PCC-203-AID · Second Year Artificial Intelligence and Data Science, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PCC-203-AID 3 h/week theory CCE 30 + End-sem 70

45 hours of theory

05 . units

03 . credits

## Unit-wise syllabus

UNIT I

### Introduction to Operating System and Process

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction to operating systems, Types of OS, real time OS, the Linux Operating Systems Process: process abstraction, system calls for process management, process creation: process states, data structures, process execution mechanisms process api, process control and users Case Study : Windows 11/Linux

**Preserved official unit paragraph**

Introduction to operating systems, Types of OS, real time OS, the Linux Operating Systems Process: process abstraction, system calls for process management, process creation: process states, data structures, process execution mechanisms process api, process control and users Case Study : Windows 11/Linux

[Unit permalink](https://preptracker.manavdev.site/syllabus/se-artificial-intelligence-and-data-science/operating-system/#unit-1)

UNIT II

### Scheduling

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Workload assumptions, scheduling metrics, response time, first in, first out (FIFO) shortest job first (SJF), shortest time-to-completion first (STCF), round robin, incorporating I/O, the multi-level feedback queue, the priority boost, attempt, better accounting, multiprocessor scheduling, synchronization, cache affinity, single-queue scheduling multi-queue scheduling, Linux multiprocessor schedulers.
- Case Study - Scheduling and Synchronization in xv6

**Preserved official unit paragraph**

Workload assumptions, scheduling metrics, response time, first in, first out (FIFO) shortest job first (SJF), shortest time-to-completion first (STCF), round robin, incorporating I/O, the multi-level feedback queue, the priority boost, attempt, better accounting, multiprocessor scheduling, synchronization, cache affinity, single-queue scheduling multi-queue scheduling, Linux multiprocessor schedulers. Case Study - Scheduling and Synchronization in xv6

[Unit permalink](https://preptracker.manavdev.site/syllabus/se-artificial-intelligence-and-data-science/operating-system/#unit-2)

UNIT III

### Address Spaces

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Early systems, multiprogramming and time sharing, the address space, virtualization of memory, memory api: types of memory, the malloc() call, the free() call, segmentation, fine-grained vs. coarsegrained segmentation, free-space management, paging, a memory trace, faster translations (TLBs), TLB basic algorithm, TLB issue: context switches, replacement policy, hybrid approach: paging and segments, beyond physical memory: mechanisms, swap space, the page fault, page fault control flow.
- Case Study - Linux/Windows Memory Management

**Preserved official unit paragraph**

Early systems, multiprogramming and time sharing, the address space, virtualization of memory, memory api: types of memory, the malloc() call, the free() call, segmentation, fine-grained vs. coarsegrained segmentation, free-space management, paging, a memory trace, faster translations (TLBs), TLB basic algorithm, TLB issue: context switches, replacement policy, hybrid approach: paging and segments, beyond physical memory: mechanisms, swap space, the page fault, page fault control flow. Case Study - Linux/Windows Memory Management

[Unit permalink](https://preptracker.manavdev.site/syllabus/se-artificial-intelligence-and-data-science/operating-system/#unit-3)

UNIT IV

### Concurrency

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Concurrency, persistence, Shared data, uncontrolled scheduling, the wish for atomicity, thread api : need of threads, thread creation, thread completion Locks: the basic idea, pthread locks, building a lock, evaluating locks, controlling interrupts, failed attempt, just using Semaphores: definition, binary semaphores (locks), semaphores for ordering, the producer/consumer (bounded buffer) problem, reader-writer locks, dining philosophers’ problem, how to implement semaphores, common concurrency problems.
- Case Study : Thread programming Using Pthreads, POSIX

**Preserved official unit paragraph**

Concurrency, persistence, Shared data, uncontrolled scheduling, the wish for atomicity, thread api : need of threads, thread creation, thread completion Locks: the basic idea, pthread locks, building a lock, evaluating locks, controlling interrupts, failed attempt, just using Semaphores: definition, binary semaphores (locks), semaphores for ordering, the producer/consumer (bounded buffer) problem, reader-writer locks, dining philosophers’ problem, how to implement semaphores, common concurrency problems. Case Study : Thread programming Using Pthreads, POSIX

[Unit permalink](https://preptracker.manavdev.site/syllabus/se-artificial-intelligence-and-data-science/operating-system/#unit-4)

UNIT V

### I/O Management

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- System architecture, A Canonical device, The Canonical protocol, CPU virtualization, Lowering CPU Overhead with Interrupts, More efficient data movement With DMA, Methods of device interaction, Fitting into the OS: The device driver, Case Study: A simple IDE disk driver, Hard disk drives, files and directories, The fast file system, file system implementation, disk failure modes, handling latent sector error, detecting corruption: the checksum, using checksums Case Study - I/O Management in Linux/Windows operating system

**Preserved official unit paragraph**

System architecture, A Canonical device, The Canonical protocol, CPU virtualization, Lowering CPU Overhead with Interrupts, More efficient data movement With DMA, Methods of device interaction, Fitting into the OS: The device driver, Case Study: A simple IDE disk driver, Hard disk drives, files and directories, The fast file system, file system implementation, disk failure modes, handling latent sector error, detecting corruption: the checksum, using checksums Case Study - I/O Management in Linux/Windows operating system

[Unit permalink](https://preptracker.manavdev.site/syllabus/se-artificial-intelligence-and-data-science/operating-system/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 3 |
| End-semester exam | 70 | 3 |

Prerequisite: Basic Understanding of Computer Systems, Fundamentals of Programming Languages.

## Course outcomes

1. CO1 Use the concepts of virtualization and process management
2. CO2 Analyse various scheduling algorithms
3. CO3 Discuss various memory management techniques
4. CO4 Describe the working of concurrency and locking mechanism in operating systems
5. CO5 Elaborate I/O management concepts

## Books

### Text books

- Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau “Operating Systems: Three Easy Pieces
- William Stallings, Operating System: Internals and Design Principles, Prentice Hall, ISBN-10: 0-13-380591-3, ISBN-13: 978-0-13-380591-8, 8th Edition

### Reference books

- Silberschatz, A, Galvin, P.B, and Gagne, G., “Operating System Principles”, Eight Edition, John Wiley & Sons, 2008.
- Bach Maurice J. “The Design of the UNIX Operating System”, Second Edition Prentice Hall of India, 2001
- Operating System Concepts, Abraham Silberschatz, Peter Baer Galvin and Greg Gagne, WILEY, ISBN 978-1-118-06333-0, 9th Edition E-Book
- https://repository.dinus.ac.id/docs/ajar/Operating_System.pdf 21

## NPTEL and SWAYAM links

Listed in the official syllabus:

- [onlinecourses.nptel.ac.in/noc20_cs04/preview](https://onlinecourses.nptel.ac.in/noc20_cs04/preview)

## FAQ

**How many units are in Operating System?**

Operating System (PCC-203-AID) has 5 units and 45 hours of theory: Unit I Introduction to Operating System and Process (9 h); Unit II Scheduling (9 h); Unit III Address Spaces (9 h); Unit IV Concurrency (9 h); Unit V I/O Management (9 h).

**What is the marks scheme for Operating System?**

The official Artificial Intelligence and Data Science 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 3 credits.

**What should I know before Operating System?**

Prerequisite listed in the syllabus: Basic Understanding of Computer Systems, Fundamentals of Programming Languages.

---

Source: [SPPU SE AI and Data Science 2024 pattern syllabus (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20-%20AIandDS%20-%202024%20Pattern_18072025.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [SE AI&DS subjects](https://preptracker.manavdev.site/syllabus/se-artificial-intelligence-and-data-science/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

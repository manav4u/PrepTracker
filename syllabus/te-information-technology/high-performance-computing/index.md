# High Performance Computing syllabus

PEC-362B-IT · Third Year Information Technology, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PEC-362B-IT 3 h/week theory CCE 30 + End-sem 70

45 hours of theory

05 . units

03 . credits

## Unit-wise syllabus

UNIT I

### Introduction To Parallel Computing And HPC Architectures

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Overview of High Performance Computing: motivation, history, and applications (scientific simulations, Big Data, AI/ML) Flynn's Taxonomy: SISD, SIMD, MISD, MIMD
- Shared Memory vs. Distributed Memory systems Parallel Computer Architecture: multicore processors, cache coherence (MESI protocol), NUMA architecture.
- Interconnection Networks: bus, crossbar, mesh, hypercube, fat-tree topologies
- bandwidth and latency.
- Performance Metrics: Speedup (Amdahl's Law, Gustafson's Law), Efficiency, Scalability, Flops, TOP500 benchmarks Case Studies: LINPACK benchmark and Exascale computing – Frontier Supercomputer .

**Preserved official unit paragraph**

Overview of High Performance Computing: motivation, history, and applications (scientific simulations, Big Data, AI/ML) Flynn's Taxonomy: SISD, SIMD, MISD, MIMD; Shared Memory vs. Distributed Memory systems Parallel Computer Architecture: multicore processors, cache coherence (MESI protocol), NUMA architecture. Interconnection Networks: bus, crossbar, mesh, hypercube, fat-tree topologies; bandwidth and latency. Performance Metrics: Speedup (Amdahl's Law, Gustafson's Law), Efficiency, Scalability, Flops, TOP500 benchmarks Case Studies: LINPACK benchmark and Exascale computing – Frontier Supercomputer .

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-information-technology/high-performance-computing/#unit-1)

UNIT II

### Shared Memory Programming with OpenMP

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction to Thread-based Parallelism: processes vs. threads, POSIX threads (pthreads) overview OpenMP Programming Model: fork-join model, compiler directives (#pragma omp), execution model Work Sharing Constructs: parallel for, sections, single
- schedule clauses (static, dynamic, guided).
- Synchronization: critical, atomic, barrier, ordered
- data environment: shared, private, first private, reduction, Nested Parallelism, Tasks (OpenMP 3.0+), SIMD directives, and Thread-Affinity Case Studies: OpenMP in HPC weather forecasting (WRF model).

**Preserved official unit paragraph**

Introduction to Thread-based Parallelism: processes vs. threads, POSIX threads (pthreads) overview OpenMP Programming Model: fork-join model, compiler directives (#pragma omp), execution model Work Sharing Constructs: parallel for, sections, single; schedule clauses (static, dynamic, guided). Synchronization: critical, atomic, barrier, ordered; data environment: shared, private, first private, reduction, Nested Parallelism, Tasks (OpenMP 3.0+), SIMD directives, and Thread-Affinity Case Studies: OpenMP in HPC weather forecasting (WRF model).

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-information-technology/high-performance-computing/#unit-2)

UNIT III

### Distributed Memory Programming with MPI

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Distributed Memory Model: message passing concept, MPI overview, program structure and compilation (mpicc/mpirun) Point-to-Point Communication: MPI_Send, MPI_Recv, blocking vs. non-blocking (MPI_Isend, MPI_Irecv), MPI_Sendrecv Collective Communication: MPI_Bcast, MPI_Scatter, MPI_Gather, MPI_Allreduce, MPI_Barrier, MPI_Reduce ,MPI Communicators, Groups, Virtual Topologies (Cartesian grids),Derived-Datatypes Case Studies: MPI-based parallel genome assembly (BLAST onHPC clusters).

**Preserved official unit paragraph**

Distributed Memory Model: message passing concept, MPI overview, program structure and compilation (mpicc/mpirun) Point-to-Point Communication: MPI_Send, MPI_Recv, blocking vs. non-blocking (MPI_Isend, MPI_Irecv), MPI_Sendrecv Collective Communication: MPI_Bcast, MPI_Scatter, MPI_Gather, MPI_Allreduce, MPI_Barrier, MPI_Reduce ,MPI Communicators, Groups, Virtual Topologies (Cartesian grids),Derived-Datatypes Case Studies: MPI-based parallel genome assembly (BLAST onHPC clusters).

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-information-technology/high-performance-computing/#unit-3)

UNIT IV

### GPU Computing with CUDA and OpenCL

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- GPU Architecture: NVIDIA GPU architecture (SM, CUDA cores, warp, warp scheduler), memory hierarchy (global, shared, registers, constant, texture).
- CUDA Programming Model: host-device model, kernels, threads/blocks/grids, thread indexing, CUDA execution model.
- CUDA Memory Management: cudaMalloc, cudaMemcpy, unified memory, memory coalescing, shared memory optimization CUDA Optimization: occupancy, warp divergence, memory bank conflicts, streams and asynchronous execution, CUDA events for profiling OpenCL Framework: platform model, execution model, memory model.
- Case Studies: Deep Learning training acceleration using CUDA and cuDNN (ResNet on CIFAR-10).

**Preserved official unit paragraph**

GPU Architecture: NVIDIA GPU architecture (SM, CUDA cores, warp, warp scheduler), memory hierarchy (global, shared, registers, constant, texture). CUDA Programming Model: host-device model, kernels, threads/blocks/grids, thread indexing, CUDA execution model. CUDA Memory Management: cudaMalloc, cudaMemcpy, unified memory, memory coalescing, shared memory optimization CUDA Optimization: occupancy, warp divergence, memory bank conflicts, streams and asynchronous execution, CUDA events for profiling OpenCL Framework: platform model, execution model, memory model. Case Studies: Deep Learning training acceleration using CUDA and cuDNN (ResNet on CIFAR-10).

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-information-technology/high-performance-computing/#unit-4)

UNIT V

### High Performance Computing Applications

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Scope of Parallel Computing, Parallel Search Algorithms: Depth First Search(DFS), Breadth First Search( BFS), Parallel Sorting: Bubble and Merge, Distributed Computing: Document classification, Frameworks – Kuberbets, GPU Applications, Parallel Computing forAI/ML.Case Studies: Disaster detection and management/ Smart Mobility/Urban planning

**Preserved official unit paragraph**

Scope of Parallel Computing, Parallel Search Algorithms: Depth First Search(DFS), Breadth First Search( BFS), Parallel Sorting: Bubble and Merge, Distributed Computing: Document classification, Frameworks – Kuberbets, GPU Applications, Parallel Computing forAI/ML.Case Studies: Disaster detection and management/ Smart Mobility/Urban planning

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-information-technology/high-performance-computing/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 3 |
| End-semester exam | 70 | 3 |

Prerequisite: Computer Architecture, Operating Systems, Programming in C/C++.

## Course outcomes

1. CO1 Explain parallel computing architectures (SIMD, MIMD, shared/distributed memory) and evaluate their performance characteristics.
2. CO2 Develop parallel programs using OpenMP (shared memory) and MPI (distributed memory) paradigms.
3. CO3 Implement GPU-accelerated solutions using CUDA/OpenCL for compute-intensive applications.
4. CO4 Analyze, measure, and optimize the performance of parallel programs using profiling and benchmarking tools.

## Books

### Text books

- Peter Pacheco, Matthew Malensek, "An Introduction to Parallel Programming", 2nd Edition, Morgan Kaufmann (Elsevier), 2021. ISBN: 978-0128046050
- Kirk, D.B. and Hwu, W.W., "Programming Massively Parallel Processors: A Hands-on Approach", 4th Edition, Morgan Kaufmann, 2022. ISBN: 978-0323912310

### Reference books

- Ananth Grama, Vipin Kumar, Anshul Gupta, George Karypis, "Introduction to Parallel Computing", 2nd Edition, Pearson Education, 2003. ISBN: 978-0201648652
- Michael J. Quinn, "Parallel Programming in C with MPI and OpenMP", McGraw-Hill Education,
- ISBN: 978-0072822564
- Thomas Rauber, Gudula Runger, "Parallel Programming for Multicore and Cluster Systems", 3rd Edition, Springer, 2023. ISBN: 978-3662653005
- Rob Farber, "CUDA Application Design and Development", Morgan Kaufmann, 2011. ISBN: 978- 0123884268

## FAQ

**How many units are in High Performance Computing?**

High Performance Computing (PEC-362B-IT) has 5 units and 45 hours of theory: Unit I Introduction To Parallel Computing And HPC Architectures (9 h); Unit II Shared Memory Programming with OpenMP (9 h); Unit III Distributed Memory Programming with MPI (9 h); Unit IV GPU Computing with CUDA and OpenCL (9 h); Unit V High Performance Computing Applications (9 h).

**What is the marks scheme for High Performance Computing?**

The official Information Technology 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 3 credits.

**What should I know before High Performance Computing?**

Prerequisite listed in the syllabus: Computer Architecture, Operating Systems, Programming in C/C++.

---

Source note: Web Application Development uses PEC-321C-IT Advanced Database Management System uses PEC-321B-IT, and Image Processing Computer Vision uses PEC-321D-IT from the curriculum table. Detailed course headings conflict with that table. The PDF prints only four outcomes for Cloud Computing and High Performance Computing. Unit hours are shown as printed even where they differ from the weekly scheme. Tutorial and lab courses are excluded.

Source: [SPPU TE Information Technology 2024 pattern syllabus (October 9, 2026, effective 2026-27) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE%20IT%202024%20Pattern%20Final_09102026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE IT subjects](https://preptracker.manavdev.site/syllabus/te-information-technology/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

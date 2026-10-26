# Distributed Systems syllabus

PEC361BCOM · Third Year Computer Engineering, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PEC361BCOM 3 h/week theory CCE 30 + End-sem 70

45 hours of theory

05 . units

03 . credits

## Unit-wise syllabus

UNIT I

### Introduction to Distributed Systems, Distributed Architecture

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Definition and Characteristics, Properties of Distributed Systems relation to Computer System, Design goals: Supporting resource sharing, Making distribution transparent, Open, Scalable, Pitfalls.
- Distributed Computing vs other computing models, Types of Distributed Systems, Architectural styles: Layered architectures, Object-based architectures, Publish-Subscribe architectures, Middleware organization: Wrappers, Interceptors, Modifiable middleware.
- System architecture: Centralized, Decentralized, Hybrid, Example architectures – Network File System, Web, Architectures Design Issues and Challenges- Systems perspective, Algorithm perspective, Driven by new applications Case Study: Case Study of Middleware System that includes Design, Architecture and Application.

**Preserved official unit paragraph**

Definition and Characteristics, Properties of Distributed Systems relation to Computer System, Design goals: Supporting resource sharing, Making distribution transparent, Open, Scalable, Pitfalls. Distributed Computing vs other computing models, Types of Distributed Systems, Architectural styles: Layered architectures, Object-based architectures, Publish-Subscribe architectures, Middleware organization: Wrappers, Interceptors, Modifiable middleware. System architecture: Centralized, Decentralized, Hybrid, Example architectures – Network File System, Web, Architectures Design Issues and Challenges- Systems perspective, Algorithm perspective, Driven by new applications Case Study: Case Study of Middleware System that includes Design, Architecture and Application.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/distributed-systems/#unit-1)

UNIT II

### Communicationand Synchronization in Distributed Systems

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction, Layered Protocols, Types of Communication, Remote Procedure Calls, Message Oriented Communication, Stream Oriented Communication, Multicast Communication, Clock Synchronization: Physical Clocks, Global Positioning System,Clock Synchronization Algorithms, Logical Clocks: Lamport’s Logical Clocks, Vector Clocks Mutual Exclusion: A Centralized Algorithm, A Decentralized Algorithm, A Distributed Algorithm, A Token Ring Algorithm, A Comparison of the Four Algorithms Election Algorithm: Traditional Election Algorithms, Elections in Wireless Environments,Elections in Large-Scale Systems Case Study: Message Queuing Systems

**Preserved official unit paragraph**

Introduction, Layered Protocols, Types of Communication, Remote Procedure Calls, Message Oriented Communication, Stream Oriented Communication, Multicast Communication, Clock Synchronization: Physical Clocks, Global Positioning System,Clock Synchronization Algorithms, Logical Clocks: Lamport’s Logical Clocks, Vector Clocks Mutual Exclusion: A Centralized Algorithm, A Decentralized Algorithm, A Distributed Algorithm, A Token Ring Algorithm, A Comparison of the Four Algorithms Election Algorithm: Traditional Election Algorithms, Elections in Wireless Environments,Elections in Large-Scale Systems Case Study: Message Queuing Systems

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/distributed-systems/#unit-2)

UNIT III

### Coordination, Consistency and Replication in Distributed Systems

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- IntroductionData Centric Consistency Models: Continuous Consistency, Consistent Ordering of OperationsClient Centric Consistency Models: Eventual Consistency, Monotonic Reads, Monotonic Writes, Read Your Writes, Writes Follow ReadsConsistency Protocols: Continuous Consistency, Primary-Based Protocols, Replicated-Write Protocols,A Cache-Coherence Protocols, Implementing Client-Centric Consistency Replication: Reasons for Replication, Replication as Scaling Technique, Replica-Server Placement, Content Replication and Placement, Content Distribution Case Study: Services Bayou and Coda

**Preserved official unit paragraph**

IntroductionData Centric Consistency Models: Continuous Consistency, Consistent Ordering of OperationsClient Centric Consistency Models: Eventual Consistency, Monotonic Reads, Monotonic Writes, Read Your Writes, Writes Follow ReadsConsistency Protocols: Continuous Consistency, Primary-Based Protocols, Replicated-Write Protocols,A Cache-Coherence Protocols, Implementing Client-Centric Consistency Replication: Reasons for Replication, Replication as Scaling Technique, Replica-Server Placement, Content Replication and Placement, Content Distribution Case Study: Services Bayou and Coda

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/distributed-systems/#unit-3)

UNIT IV

### Distributed File Systems

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction, Features of Distributed filesystem, File Models, File Accessing Methods, File Sharing Semantics, File Caching Schemes, File Replication, Fault Tolerance, Atomic Transaction, Design Principles, Security.
- Naming: Names, Identifiers, and Addresses, Types: Flat Naming, Structured Naming, Attribute- Based Naming Case Study: DCE Distributed File System, SunNetwork, Andrew File System

**Preserved official unit paragraph**

Introduction, Features of Distributed filesystem, File Models, File Accessing Methods, File Sharing Semantics, File Caching Schemes, File Replication, Fault Tolerance, Atomic Transaction, Design Principles, Security. Naming: Names, Identifiers, and Addresses, Types: Flat Naming, Structured Naming, Attribute- Based Naming Case Study: DCE Distributed File System, SunNetwork, Andrew File System

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/distributed-systems/#unit-4)

UNIT V

### Advancements in Distributed Systems

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Epidemic and gossip-based algorithms, Napster and Gnutella networks, DHTs: Chord, Pastry and BitTorrent, Logical clocks, Mutual Exclusion Algorithms, Distributed Leader Election, Distributed minimum spanning tree, The FLP result,Consistency models and the CAP theorem, Paxos and Raft, Byzantine General’s Problem, Virtual synchrony, Bitcoin and Blockchains, Amazon Dynamo, Case Study: Facebook Cassandra, Google Percolator, Voldemort (LinkedIn), Condor, and Microsoft DryadLINQ (Any one)

**Preserved official unit paragraph**

Epidemic and gossip-based algorithms, Napster and Gnutella networks, DHTs: Chord, Pastry and BitTorrent, Logical clocks, Mutual Exclusion Algorithms, Distributed Leader Election, Distributed minimum spanning tree, The FLP result,Consistency models and the CAP theorem, Paxos and Raft, Byzantine General’s Problem, Virtual synchrony, Bitcoin and Blockchains, Amazon Dynamo, Case Study: Facebook Cassandra, Google Percolator, Voldemort (LinkedIn), Condor, and Microsoft DryadLINQ (Any one)

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/distributed-systems/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 3 |
| End-semester exam | 70 | 3 |

Prerequisite: Good understanding of Programming and Problem Solving concepts.

## Course outcomes

1. CO1 Analyze Distributed Systems types and architectural styles •
2. CO2 Implement communication and Synchronization algorithm mechanism in Distributed Systems •
3. CO3 Apply replication techniques and consistency model in Distributed Systems •
4. CO4 Develop the components of Distributed File System •
5. CO5 Implement different distributed algorithms over current distributed platforms.

## Books

### Text books

- Maarten van Steen, Andrew S. Tanenbaum, “Distributed System Principles and Paradigms”, Third edition, version 3
- George Coulouris, Jean Dollimore, Tim Kindberg, “Distributed Systems Concepts and Design”, Fifth edition

### Reference books

- 1. Kshemkalyani Ajay D, Mukesh Singhal, “Distributed Computing: Principles, Algorithms andSystems”, Cambridge Press, 2011.
- Singhal and Shivaratri, "Advanced Concept in Operating Systems", McGraw Hill
- Vijay K.Garg, “Elements of Distributed Computing”, Wiley

## FAQ

**How many units are in Distributed Systems?**

Distributed Systems (PEC361BCOM) has 5 units and 45 hours of theory: Unit I Introduction to Distributed Systems, Distributed Architecture (9 h); Unit II Communicationand Synchronization in Distributed Systems (9 h); Unit III Coordination, Consistency and Replication in Distributed Systems (9 h); Unit IV Distributed File Systems (9 h); Unit V Advancements in Distributed Systems (9 h).

**What is the marks scheme for Distributed Systems?**

The official Computer Engineering 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 3 credits.

**What should I know before Distributed Systems?**

Prerequisite listed in the syllabus: Good understanding of Programming and Problem Solving concepts.

---

Source note: Mobile Computing uses PEC321CCOM from the curriculum table; its detailed course heading prints PCC305CCOM. Robotics and Automation is a tutorial/practical course and is excluded from this theory-course list.

Source: [SPPU TE Computer Engineering 2024 pattern syllabus (September 22, 2026, effective 2026-27) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE%20-%20Computer%20Engineering%20-%202024%2022092026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE Computer subjects](https://preptracker.manavdev.site/syllabus/te-computer-engineering/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

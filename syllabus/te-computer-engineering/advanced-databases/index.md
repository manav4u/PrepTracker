# Advanced Databases syllabus

PEC362DCOM · Third Year Computer Engineering, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PEC362DCOM 3 h/week theory CCE 30 + End-sem 70

45 hours of theory

05 . units

03 . credits

## Unit-wise syllabus

UNIT I

### Introduction, Basic Concepts and Advanced DBMS Architecture

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction to Advanced DBMS : Review of basic Database Management System (DBMS) concepts, Need for Advanced DBMS, Limitations of Traditional DBMS, Applications of Advanced Database Systems Advanced DBMS System Architecture: Centralized Architecture, Single-Site Database System, Client– Server Architecture (Two-tier Architecture & Three-tier Architecture), Role of Application Server, Advantages and Limitations of Client–Server Systems, Client–Server vs Peer-to-Peer Architecture Data Distribution Techniques: Data Fragmentation, Data Replication Parallel Database Architecture: Overview of Shared Memory Architecture, Shared Disk Architecture, Shared Nothing Architecture, Performance Improvement using Parallelism Cloud Database Architecture: Introduction to Cloud Databases, Database as a Service (DBaaS), Multi-tenant Architecture, Scalability and Elasticity.
- Case Study: Design and implement a Cloud-Based Hospital Management Database System.
- Create ER/EER diagrams and implement the schema in a DBMS.
- The system should support multi-branch data management, patient records, appointments, billing, and data replication.
- Justify the selected database architecture (centralized/distributed/cloud/NoSQL).

**Preserved official unit paragraph**

Introduction to Advanced DBMS : Review of basic Database Management System (DBMS) concepts, Need for Advanced DBMS, Limitations of Traditional DBMS, Applications of Advanced Database Systems Advanced DBMS System Architecture: Centralized Architecture, Single-Site Database System, Client– Server Architecture (Two-tier Architecture & Three-tier Architecture), Role of Application Server, Advantages and Limitations of Client–Server Systems, Client–Server vs Peer-to-Peer Architecture Data Distribution Techniques: Data Fragmentation, Data Replication Parallel Database Architecture: Overview of Shared Memory Architecture, Shared Disk Architecture, Shared Nothing Architecture, Performance Improvement using Parallelism Cloud Database Architecture: Introduction to Cloud Databases, Database as a Service (DBaaS), Multi-tenant Architecture, Scalability and Elasticity. Case Study: Design and implement a Cloud-Based Hospital Management Database System. Create ER/EER diagrams and implement the schema in a DBMS. The system should support multi-branch data management, patient records, appointments, billing, and data replication. Justify the selected database architecture (centralized/distributed/cloud/NoSQL).

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/advanced-databases/#unit-1)

UNIT II

### Query Processing and Optimization

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Query Processing : Overview , Measures of Query Cost , Selection Operation , Sorting ,Join Operation , Evaluation of Expressions , Query Processing in Memory Query Optimization :Overview , Transformation of Relational :Expressions , Estimating Statistics of Expression : Results , Choice of Evaluation Plans , Materialized Views , Advanced Topics in Query : Optimization Parallel and Distributed Query Processing: Parallel Evaluation of Query Plans , Distributed Query Processing Case Study: Online Retail Management System that maintains large volumes of data related to customers, orders, products, and payments.
- The database contains relations such as Customer(CustID, Name, City), Orders(OrderID, CustID, OrderDate), OrderDetails(OrderID, ProdID, Quantity), and Product(ProdID, Category, Price).
- Management frequently executes analytical queries to generate sales reports, customer behavior insights, and inventory statistics.

**Preserved official unit paragraph**

Query Processing : Overview , Measures of Query Cost , Selection Operation , Sorting ,Join Operation , Evaluation of Expressions , Query Processing in Memory Query Optimization :Overview , Transformation of Relational :Expressions , Estimating Statistics of Expression : Results , Choice of Evaluation Plans , Materialized Views , Advanced Topics in Query : Optimization Parallel and Distributed Query Processing: Parallel Evaluation of Query Plans , Distributed Query Processing Case Study: Online Retail Management System that maintains large volumes of data related to customers, orders, products, and payments. The database contains relations such as Customer(CustID, Name, City), Orders(OrderID, CustID, OrderDate), OrderDetails(OrderID, ProdID, Quantity), and Product(ProdID, Category, Price). Management frequently executes analytical queries to generate sales reports, customer behavior insights, and inventory statistics.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/advanced-databases/#unit-2)

UNIT III

### Transaction Management, Concurrency and Recovery

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction to Database Transaction, Serial and Non-Serial Schedules, Serializability – Conflict and View, Cascading Rollback, Recoverable and Non-Recoverable Schedules, Strict and Rigorous Schedules.
- Concurrency Control: Lock-Based Protocols, Timestamp-Based Protocols, Validation-Based Deadlock Handling.
- Recovery System: Failure Classification, Log-Based Recovery, Write-Ahead Logging (WAL), Checkpoints, Recovery with Concurrent Transactions, ARIES (Algorithm for Recovery and Isolation Exploiting Semantics.
- Case Study: E-Commerce Order Processing System:Study of simultaneous order placement, inventory update, and payment processing transactions to illustrate concurrency control, isolation levels, and rollback mechanisms.

**Preserved official unit paragraph**

Introduction to Database Transaction, Serial and Non-Serial Schedules, Serializability – Conflict and View, Cascading Rollback, Recoverable and Non-Recoverable Schedules, Strict and Rigorous Schedules. Concurrency Control: Lock-Based Protocols, Timestamp-Based Protocols, Validation-Based Deadlock Handling. Recovery System: Failure Classification, Log-Based Recovery, Write-Ahead Logging (WAL), Checkpoints, Recovery with Concurrent Transactions, ARIES (Algorithm for Recovery and Isolation Exploiting Semantics. Case Study: E-Commerce Order Processing System:Study of simultaneous order placement, inventory update, and payment processing transactions to illustrate concurrency control, isolation levels, and rollback mechanisms.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/advanced-databases/#unit-3)

UNIT IV

### Advanced Database Models

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction to Parallel Databases - Parallel database architecture, speedup, scale-up I/O parallelism, Inter-query and Intra-query parallelism, Inter-operational and Intra-operational parallelism, parallel query evaluation, Design of parallel systems, Implementation issues of Parallel query evaluation, Introduction to Distributed Databases- Study of DDBMS architectures, Comparison of Homogeneous and Heterogeneous Databases, Analysis of Concurrency control in distributed databases, Implementation of Distributed query processing, distributed data storage.
- XML Technologies- Introduction to XML, Structure of XML Data, XML Schema and DTD, XML Validation, XPath, XQuery and FLWOR Expression, XML Storage and APIs, XML & DTD Implementation Querying and Transformation: XQuery, FLOWR, XPath, XML validation, Web server, API to XML, Storage of XML Data, XML Applications: web services, Web based system, Implementation of XML validations, Use of web servers.
- Case Study: Design a Distributed Banking Database System that simulates multiple branch databases.
- Implement distributed queries and demonstrate parallel query execution concepts.
- Additionally, create and validate XML documents for customer transaction data and perform XML querying using XPath/XQuery.

**Preserved official unit paragraph**

Introduction to Parallel Databases - Parallel database architecture, speedup, scale-up I/O parallelism, Inter-query and Intra-query parallelism, Inter-operational and Intra-operational parallelism, parallel query evaluation, Design of parallel systems, Implementation issues of Parallel query evaluation, Introduction to Distributed Databases- Study of DDBMS architectures, Comparison of Homogeneous and Heterogeneous Databases, Analysis of Concurrency control in distributed databases, Implementation of Distributed query processing, distributed data storage. XML Technologies- Introduction to XML, Structure of XML Data, XML Schema and DTD, XML Validation, XPath, XQuery and FLWOR Expression, XML Storage and APIs, XML & DTD Implementation Querying and Transformation: XQuery, FLOWR, XPath, XML validation, Web server, API to XML, Storage of XML Data, XML Applications: web services, Web based system, Implementation of XML validations, Use of web servers. Case Study: Design a Distributed Banking Database System that simulates multiple branch databases. Implement distributed queries and demonstrate parallel query execution concepts. Additionally, create and validate XML documents for customer transaction data and perform XML querying using XPath/XQuery.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/advanced-databases/#unit-4)

UNIT V

### Database Security and Recent Trends

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Fundamentals of Database Security: Importance of database security, Security challenges Security goals: Confidentiality, Integrity, Availability (CIA), Basic authentication (passwords, roles), Authorization models (privileges, role-based access control),Protection Mechanisms.
- Access control techniques: Database encryption, and Column-level and full-database encryption Monitoring and Threats: Database logging and audit trails, Database Activity Monitoring (Overview), SQL Injection, Privilege escalation and insider threats.
- Privacy and Compliance: Data sanitization, Data masking and anonymization, Recent Trends and Emerging Technologies: Overview of NewSQL, Trends in modern database architectures, Cloud database security, NoSQL security concerns, AI-enhanced security mechanisms Case Study: Develop a Secure University Database System with role-based access control (Admin, Faculty, and Student).
- Implement authentication, authorization, encryption of sensitive data, audit logging, and demonstrate protection against SQL injection.
- Include a brief study of cloud/NoSQL security features.

**Preserved official unit paragraph**

Fundamentals of Database Security: Importance of database security, Security challenges Security goals: Confidentiality, Integrity, Availability (CIA), Basic authentication (passwords, roles), Authorization models (privileges, role-based access control),Protection Mechanisms. Access control techniques: Database encryption, and Column-level and full-database encryption Monitoring and Threats: Database logging and audit trails, Database Activity Monitoring (Overview), SQL Injection, Privilege escalation and insider threats. Privacy and Compliance: Data sanitization, Data masking and anonymization, Recent Trends and Emerging Technologies: Overview of NewSQL, Trends in modern database architectures, Cloud database security, NoSQL security concerns, AI-enhanced security mechanisms Case Study: Develop a Secure University Database System with role-based access control (Admin, Faculty, and Student). Implement authentication, authorization, encryption of sensitive data, audit logging, and demonstrate protection against SQL injection. Include a brief study of cloud/NoSQL security features.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/advanced-databases/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 3 |
| End-semester exam | 70 | 3 |

## Course outcomes

1. CO1 Analyze and compare various advanced DBMS architectures. •
2. CO2 Evaluate query execution plans, estimate query costs, and design optimized query processing strategies for large-scale database applications. •
3. CO3 Analyze transaction schedules, implement appropriate concurrency control techniques, and design recovery mechanisms for real-world database systems. •
4. CO4 Design and evaluate parallel and distributed database systems and implement XML storage, validation, and querying mechanisms. •
5. CO5 Implement database security mechanisms, analyze security threats, and evaluate modern database technologies including cloud and NoSQL systems.

## Books

### Text books

- Silberschatz, Korth, Sudarshan, Database System Concepts, 7th Edition, McGraw-Hill.

### Reference books

- 1. Ramakrishnan&Gehrke, Database Management Systems, 3rd Edition, McGraw-Hill.
- Elmasri, Navathe, Fundamentals of Database Systems, 7th Edition, Pearson.
- Wiese, Lena, Advanced Data Management: For SQL, NoSQL, Cloud and Distributed Databases, 1st Edition, Springer.

## FAQ

**How many units are in Advanced Databases?**

Advanced Databases (PEC362DCOM) has 5 units and 45 hours of theory: Unit I Introduction, Basic Concepts and Advanced DBMS Architecture (9 h); Unit II Query Processing and Optimization (9 h); Unit III Transaction Management, Concurrency and Recovery (9 h); Unit IV Advanced Database Models (9 h); Unit V Database Security and Recent Trends (9 h).

**What is the marks scheme for Advanced Databases?**

The official Computer Engineering 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 3 credits.

---

Source note: Mobile Computing uses PEC321CCOM from the curriculum table; its detailed course heading prints PCC305CCOM. Robotics and Automation is a tutorial/practical course and is excluded from this theory-course list.

Source: [SPPU TE Computer Engineering 2024 pattern syllabus (September 22, 2026, effective 2026-27) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE%20-%20Computer%20Engineering%20-%202024%2022092026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE Computer subjects](https://preptracker.manavdev.site/syllabus/te-computer-engineering/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

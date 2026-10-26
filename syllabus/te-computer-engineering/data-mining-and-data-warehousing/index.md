# Data Mining and Data Warehousing syllabus

PEC321ACOM · Third Year Computer Engineering, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PEC321ACOM 3 h/week theory CCE 30 + End-sem 70

45 hours of theory

05 . units

03 . credits

## Unit-wise syllabus

UNIT I

### Introduction to Data Mining and Data Preprocessing

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Data Mining – Motivation and Applications, Database queries Vs DM queries Data: Data, Information and Knowledge
- The KDD process, Attribute Types: Nominal, Binary, Ordinal and Numeric attributes, Types of Data: Relational, Temporal, Time-series, Spatial, Text and Multimedia, Data streams, www
- Introduction to Data Preprocessing, Data Cleaning: Missing values, Noisy Data
- Data integration: Redundancy and Correlation Analysis only
- Data reduction: Attribute Subset Selection, Sampling
- Data Discretization: Binning, Histogram Analysis, Data Discretization by Data Transformation: Min-max normalization, z-score normalization and decimal scaling
- Dissimilarity of Numeric Data: Minskowski Distance and Euclidean distance Case Study: Download ZOO and Heart Disease Datasets from UCI Machine Learning Repository and study various types of attributes and format of training data.

**Preserved official unit paragraph**

Data Mining – Motivation and Applications, Database queries Vs DM queries Data: Data, Information and Knowledge; The KDD process, Attribute Types: Nominal, Binary, Ordinal and Numeric attributes, Types of Data: Relational, Temporal, Time-series, Spatial, Text and Multimedia, Data streams, www; Introduction to Data Preprocessing, Data Cleaning: Missing values, Noisy Data; Data integration: Redundancy and Correlation Analysis only; Data reduction: Attribute Subset Selection, Sampling; Data Discretization: Binning, Histogram Analysis, Data Discretization by Data Transformation: Min-max normalization, z-score normalization and decimal scaling; Dissimilarity of Numeric Data: Minskowski Distance and Euclidean distance Case Study: Download ZOO and Heart Disease Datasets from UCI Machine Learning Repository and study various types of attributes and format of training data.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/data-mining-and-data-warehousing/#unit-1)

UNIT II

### Data Warehouse

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Data Warehouse: Basic Concepts, What Is a Data Warehouse? Differences between Operational Database Systems and Data Warehouses, Data Warehousing: A Multitiered Architecture, Data Warehouse Models: Enterprise Warehouse, Data Mart, and Virtual Warehouse, Extraction, Transformation, and Loading, Metadata Repository, Data Warehouse Modeling: Data Cube and OLAP , Data Cube: A Multidimensional Data Model
- Stars, Snowflakes, and Fact Constellations: Schemas for Multidimensional Data Models
- Dimensions: The Role of Concept Hierarchies
- Measures: Their Categorization and Computation
- Typical OLAP Operations.
- Case Study: Design a retail sales data warehouse to analyze customer purchases, product performance, and regional sales trends.
- The warehouse should use a star schema with a central Sales Fact table linked to Customer, Product, Store, and Time dimensions, enabling queries on top-selling products, seasonal demand, and promotion impacts.

**Preserved official unit paragraph**

Data Warehouse: Basic Concepts, What Is a Data Warehouse? Differences between Operational Database Systems and Data Warehouses, Data Warehousing: A Multitiered Architecture, Data Warehouse Models: Enterprise Warehouse, Data Mart, and Virtual Warehouse, Extraction, Transformation, and Loading, Metadata Repository, Data Warehouse Modeling: Data Cube and OLAP , Data Cube: A Multidimensional Data Model; Stars, Snowflakes, and Fact Constellations: Schemas for Multidimensional Data Models; Dimensions: The Role of Concept Hierarchies; Measures: Their Categorization and Computation; Typical OLAP Operations. Case Study: Design a retail sales data warehouse to analyze customer purchases, product performance, and regional sales trends. The warehouse should use a star schema with a central Sales Fact table linked to Customer, Product, Store, and Time dimensions, enabling queries on top-selling products, seasonal demand, and promotion impacts.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/data-mining-and-data-warehousing/#unit-2)

UNIT III

### Association Rules Mining and Clustering

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Market basket Analysis, Frequent item set, Closed item set, Association Rules, Apriori Algorithm, Generating Association Rules from Frequent Itemsets, Improving the Efficiency of Apriori, Mining Frequent Itemset without Candidate Generation: FP Growth Algorithm.
- Cluster Analysis: What Is Cluster Analysis? Requirements for Cluster Analysis
- Overview of Basic Clustering Methods, Partitioning Methods: K-Means: A Centroid-Based Technique k-Medoids: A Representative Object-Based Technique
- Distance Measures in Algorithmic Methods, Evaluation of Clustering, Assessing Clustering Tendency, Measuring Clustering Quality.
- Case Study: Apply the Apriori Algorithm to a retail sales dataset to discover frequent itemsets and generate association rules.
- The goal is to identify product combinations often purchased together, enabling insights for market basket analysis, cross-selling strategies, and promotional planning.

**Preserved official unit paragraph**

Market basket Analysis, Frequent item set, Closed item set, Association Rules, Apriori Algorithm, Generating Association Rules from Frequent Itemsets, Improving the Efficiency of Apriori, Mining Frequent Itemset without Candidate Generation: FP Growth Algorithm. Cluster Analysis: What Is Cluster Analysis? Requirements for Cluster Analysis; Overview of Basic Clustering Methods, Partitioning Methods: K-Means: A Centroid-Based Technique k-Medoids: A Representative Object-Based Technique; Distance Measures in Algorithmic Methods, Evaluation of Clustering, Assessing Clustering Tendency, Measuring Clustering Quality. Case Study: Apply the Apriori Algorithm to a retail sales dataset to discover frequent itemsets and generate association rules. The goal is to identify product combinations often purchased together, enabling insights for market basket analysis, cross-selling strategies, and promotional planning.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/data-mining-and-data-warehousing/#unit-3)

UNIT IV

### Classification

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Classification: What Is Classification? Supervised and Unsupervised Learning, General Approach to Classification, Decision Tree Induction, Decision Tree Induction
- Bayes Classification Methods: Bayes’ Theorem, Naive Bayesian Classification
- Rule-Based Classification: Using IF-THEN Rules for Classification, Rule Extraction from a Decision Tree, Rule Induction Using a Sequential Covering Algorithm
- Lazy Learners-k-Nearest- Neighbor Classifiers
- Techniques to Improve Classification Accuracy: Introducing Ensemble Methods, Bagging, Boosting.
- Model Evaluation and Selection: Metrics for Evaluating Classifier Performance, Holdout Method and Random Subsampling, Cross-Validation, Bootstrap.
- Case Study: Download 2-3 Dataset from UCI data repository and try to run some of the classification algorithms on workbench like WEKA.

**Preserved official unit paragraph**

Classification: What Is Classification? Supervised and Unsupervised Learning, General Approach to Classification, Decision Tree Induction, Decision Tree Induction; Bayes Classification Methods: Bayes’ Theorem, Naive Bayesian Classification; Rule-Based Classification: Using IF-THEN Rules for Classification, Rule Extraction from a Decision Tree, Rule Induction Using a Sequential Covering Algorithm; Lazy Learners-k-Nearest- Neighbor Classifiers; Techniques to Improve Classification Accuracy: Introducing Ensemble Methods, Bagging, Boosting. Model Evaluation and Selection: Metrics for Evaluating Classifier Performance, Holdout Method and Random Subsampling, Cross-Validation, Bootstrap. Case Study: Download 2-3 Dataset from UCI data repository and try to run some of the classification algorithms on workbench like WEKA.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/data-mining-and-data-warehousing/#unit-4)

UNIT V

### Introduction of advanced Data Mining Techniques

9 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction to Mining techniques*: Text Mining, Data stream mining, spatial and Temporal mining techniques, web mining and Recommender systems. (*All topics to be discussed at Conceptual Level).
- Mining Complex Data Types: Mining Sequence Data: Time-Series, and Biological Sequences, Mining Graphs and Networks.
- Case Study: Study Stock market prediction using historical price sequences to identify trends and forecast future values.

**Preserved official unit paragraph**

Introduction to Mining techniques*: Text Mining, Data stream mining, spatial and Temporal mining techniques, web mining and Recommender systems. (*All topics to be discussed at Conceptual Level). Mining Complex Data Types: Mining Sequence Data: Time-Series, and Biological Sequences, Mining Graphs and Networks. Case Study: Study Stock market prediction using historical price sequences to identify trends and forecast future values.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-computer-engineering/data-mining-and-data-warehousing/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 3 |
| End-semester exam | 70 | 3 |

Prerequisite: Database Management Systems.

## Course outcomes

1. CO1 Understand basics of data mining and apply appropriate data preprocessing techniques. •
2. CO2 Understand basics of data warehouse and to perform logical modelling of data warehouse. •
3. CO3 Understand and apply Association Rule Mining and Clustering Techniques. •
4. CO4 Understand and apply appropriate data mining algorithm to solve the problems, and explore the patterns in the data. •
5. CO5 Understand some of the advanced data mining techniques.

## Books

### Text books

- Jiawei Han, Micheline Kamber, and Jian Pie, “Data Mining: Concepts and Techniques”, Elsevier Publishers Third Edition, ISBN: 9780123814791.

### Reference books

- 1. Paulraj Ponnian, “Data Warehousing Fundamentals”, John Willey.
- Pang-Ning Tan, Michael Steinbach, Anuj Karpatne, Vipin Kumar “Introduction to Data Mining” (2nd Edition), Pearson Education.
- Dunham, M. H. “Data mining: Introductory and advanced topics”. Pearson Education.
- Daniel T. Larose, O.P. Wali “Data Mining and Predictive Analytics (Indian Adaptation)” Wiley Publishers, ISBN: 9789354247255, 2022.
- Parteek Bhatia, “Data Mining and Data Warehousing: Principles and Practical Techniques” Cambridge University Press.

## FAQ

**How many units are in Data Mining and Data Warehousing?**

Data Mining and Data Warehousing (PEC321ACOM) has 5 units and 45 hours of theory: Unit I Introduction to Data Mining and Data Preprocessing (9 h); Unit II Data Warehouse (9 h); Unit III Association Rules Mining and Clustering (9 h); Unit IV Classification (9 h); Unit V Introduction of advanced Data Mining Techniques (9 h).

**What is the marks scheme for Data Mining and Data Warehousing?**

The official Computer Engineering 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 3 credits.

**What should I know before Data Mining and Data Warehousing?**

Prerequisite listed in the syllabus: Database Management Systems.

---

Source note: Mobile Computing uses PEC321CCOM from the curriculum table; its detailed course heading prints PCC305CCOM. Robotics and Automation is a tutorial/practical course and is excluded from this theory-course list.

Source: [SPPU TE Computer Engineering 2024 pattern syllabus (September 22, 2026, effective 2026-27) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE%20-%20Computer%20Engineering%20-%202024%2022092026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE Computer subjects](https://preptracker.manavdev.site/syllabus/te-computer-engineering/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

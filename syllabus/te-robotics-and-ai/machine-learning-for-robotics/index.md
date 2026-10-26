# Machine Learning for Robotics syllabus

PCC-302-RAI · Third Year Robotics and Artificial Intelligence, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PCC-302-RAI 3 h/week theory CCE 30 + End-sem 70

05 . units

03 . credits

## Unit-wise syllabus

UNIT I

### Foundations of Learning & Probability

7 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction to Machine Learning and PAC Framework: Definition and scope of Machine Learning, Supervised learning, Unsupervised learning, Semi-supervised learning, Reinforcement learning, PAC (Probably Approximately Correct) Learning framework, Hypothesis space, Sample complexity, Generalization error vs. training error, Bias-variance tradeoff.
- Robot Architecture for Learning: Random variables and probability distributions, Conditional probability and Bayes' theorem, Expectation, Variance and covariance, Maximum Likelihood Estimation (MLE) basics, Concept learning and hypothesis spaces, Find-S algorithm, Candidate Elimination algorithm, General-to-specific ordering and boundary sets.

**Preserved official unit paragraph**

Introduction to Machine Learning and PAC Framework: Definition and scope of Machine Learning, Supervised learning, Unsupervised learning, Semi-supervised learning, Reinforcement learning, PAC (Probably Approximately Correct) Learning framework, Hypothesis space, Sample complexity, Generalization error vs. training error, Bias-variance tradeoff. Robot Architecture for Learning: Random variables and probability distributions, Conditional probability and Bayes' theorem, Expectation, Variance and covariance, Maximum Likelihood Estimation (MLE) basics, Concept learning and hypothesis spaces, Find-S algorithm, Candidate Elimination algorithm, General-to-specific ordering and boundary sets.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/machine-learning-for-robotics/#unit-1)

UNIT II

### Regression and Probabilistic Supervised Learning

7 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Linear and Multilinear Regression: Predicting continuous outputs using regression, Simple Linear Regression, MSE cost function, Closed-form solution, Multilinear Regression, Gradient Descent (Batch, Stochastic, Mini-batch), Normal equation method, Ridge (L2) regularization, Lasso (L1) regularization, Overfitting and underfitting.
- Naïve Bayes and Decision Trees: Conditional independence assumption, Bayes' rule for classification, Gaussian, Multinomial and Bernoulli Naïve Bayes, Laplace smoothing, ID3 algorithm using Information Gain and Entropy, CART algorithm using Gini Index, Pre-pruning and post-pruning, Error bounds and generalization.

**Preserved official unit paragraph**

Linear and Multilinear Regression: Predicting continuous outputs using regression, Simple Linear Regression, MSE cost function, Closed-form solution, Multilinear Regression, Gradient Descent (Batch, Stochastic, Mini-batch), Normal equation method, Ridge (L2) regularization, Lasso (L1) regularization, Overfitting and underfitting. Naïve Bayes and Decision Trees: Conditional independence assumption, Bayes' rule for classification, Gaussian, Multinomial and Bernoulli Naïve Bayes, Laplace smoothing, ID3 algorithm using Information Gain and Entropy, CART algorithm using Gini Index, Pre-pruning and post-pruning, Error bounds and generalization.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/machine-learning-for-robotics/#unit-2)

UNIT III

### Advanced Classifiers

7 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Instance-Based and Linear Classifiers: K-Nearest Neighbors (K-NN), Euclidean, Manhattan and Minkowski distances, Curse of dimensionality, Weighted K-NN, Logistic Regression, Sigmoid function, Cross-entropy loss, Softmax regression, Single-layer perceptron, Perceptron convergence, XOR problem limitation.
- Multi-Layer Perceptrons and Support Vector Machines: Multi-Layer Perceptrons (MLP) and hidden layers, Backpropagation algorithm, ReLU, Tanh, Sigmoid and Leaky ReLU activations, Vanishing and exploding gradients, Linear SVM (Hard margin, Soft margin, Hinge loss), Nonlinear SVM using Kernel trick (Polynomial, RBF, Sigmoid kernels), Support vectors.

**Preserved official unit paragraph**

Instance-Based and Linear Classifiers: K-Nearest Neighbors (K-NN), Euclidean, Manhattan and Minkowski distances, Curse of dimensionality, Weighted K-NN, Logistic Regression, Sigmoid function, Cross-entropy loss, Softmax regression, Single-layer perceptron, Perceptron convergence, XOR problem limitation. Multi-Layer Perceptrons and Support Vector Machines: Multi-Layer Perceptrons (MLP) and hidden layers, Backpropagation algorithm, ReLU, Tanh, Sigmoid and Leaky ReLU activations, Vanishing and exploding gradients, Linear SVM (Hard margin, Soft margin, Hinge loss), Nonlinear SVM using Kernel trick (Polynomial, RBF, Sigmoid kernels), Support vectors.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/machine-learning-for-robotics/#unit-3)

UNIT IV

### Unsupervised Learning & Dimensionality Reduction

7 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Clustering Fundamentals and K-Means: Partitional clustering (K-Means, K-Modes), Hierarchical clustering (Agglomerative, Divisive, Dendrograms), Density-based clustering (DBSCAN with eps and minPts), K-Means algorithm steps, Elbow method and Silhouette score, Self-Organizing Maps (SOM) for topological mapping.
- Expectation Maximization and Principal Component Analysis: Soft vs. hard clustering, Gaussian Mixture Models (GMM), Expectation Maximization (EM) algorithm (E-step and M-step), Dimensionality reduction using PCA, Eigenvalues and eigenvectors, Principal components and explained variance, Reconstruction error, Applications of PCA.

**Preserved official unit paragraph**

Clustering Fundamentals and K-Means: Partitional clustering (K-Means, K-Modes), Hierarchical clustering (Agglomerative, Divisive, Dendrograms), Density-based clustering (DBSCAN with eps and minPts), K-Means algorithm steps, Elbow method and Silhouette score, Self-Organizing Maps (SOM) for topological mapping. Expectation Maximization and Principal Component Analysis: Soft vs. hard clustering, Gaussian Mixture Models (GMM), Expectation Maximization (EM) algorithm (E-step and M-step), Dimensionality reduction using PCA, Eigenvalues and eigenvectors, Principal components and explained variance, Reconstruction error, Applications of PCA.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/machine-learning-for-robotics/#unit-4)

UNIT V

### Model Evaluation, Ensemble Learning & ML Practice

7 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Evaluation Metrics and Significance Tests: Confusion Matrix (TP, TN, FP, FN), Accuracy, Precision, Recall, F1-Score, ROC Curves and AUC, MSE, RMSE, R-squared, k-fold cross-validation, Learning curves.
- Ensemble Learning and ML Process in Practice: Bagging and Random Forests (bootstrapping, Outof-bag error), Boosting (Adaboost, XGBoost), Data preprocessing (handling missing values, Normalization, Encoding), Outlier analysis using Z-Score, Hyperparameter tuning (Grid Search, Random Search), Train-validation-test split, Visualization of results.

**Preserved official unit paragraph**

Evaluation Metrics and Significance Tests: Confusion Matrix (TP, TN, FP, FN), Accuracy, Precision, Recall, F1-Score, ROC Curves and AUC, MSE, RMSE, R-squared, k-fold cross-validation, Learning curves. Ensemble Learning and ML Process in Practice: Bagging and Random Forests (bootstrapping, Outof-bag error), Boosting (Adaboost, XGBoost), Data preprocessing (handling missing values, Normalization, Encoding), Outlier analysis using Z-Score, Hyperparameter tuning (Grid Search, Random Search), Train-validation-test split, Visualization of results.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/machine-learning-for-robotics/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 3 |
| End-semester exam | 70 | 3 |

Prerequisite: Programming and Problem Solving (PCC-151-ITT), Basics of Robotics & AI (PCC-201-RAI ).

## Course outcomes

1. CO1 ANALYZE different machine learning paradigms and apply PAC learning concepts along with probability fundamentals to solve basic learning problems.
2. CO2 IMPLEMENT linear and multilinear regression models, Naïve Bayes classifiers, and decision trees (ID3, CART) for supervised learning tasks with appropriate error analysis.
3. CO3 DEVELOP and compare advanced classification models including K-NN, logistic regression, perceptrons, multi-layer neural networks, and support vector machines for both linear and nonlinear data.
4. CO4 APPLY unsupervised learning techniques such as K-Means clustering, hierarchical clustering, DBSCAN, Expectation Maximization, and PCA to discover hidden patterns and reduce data dimensionality.
5. CO5 EVALUATE models using metrics, implement ensemble methods, and execute end-to-end ML workflows.

## Books

### Text books

- Govers, F. X. (2024). Artificial intelligence for robotics: Build intelligent robots using ROS 2, Python, OpenCV, and AI/ML techniques for real-world tasks (2nd Ed.). Packt Publishing Ltd.
- Roth, A., Manocha, D. N., Sriram, R. D., & Tabassi, E. (2024). Explainable and interpretable reinforcement learning for robotics. Springer.
- Ko Jaulin, L. (2019). Mobile robotics (2nd Ed.). Wiley

### Reference books

- Imran, A., & Gopalakrishnan, K. (2025). AI for robotics: Toward embodied and general intelligence in the physical world (1st Ed.). Apress.
- Choset, H., Lynch, K. M., Hutchinson, S., Kantor, G. A., Burgard, W., Kavraki, L. E., & Thrun, S. (2005). Principles of robot motion: Theory, algorithms, and implementations. MIT Press.
- Siciliano, B., & Khatib, O. (Eds.). (2016). Springer handbook of robotics (2nd Ed.). Springer International Publishing.
- Roth, A., Manocha, D. N., Sriram, R. D., & Tabassi, E. (2024). Explainable and interpretable reinforcement learning for robotics. Springer.

## NPTEL and SWAYAM links

Listed in the official syllabus:

- [onlinecourses.nptel.ac.in/e-learning/preview/noc20_cs49](https://onlinecourses.nptel.ac.in/e-learning/preview/noc20_cs49)
- [onlinecourses.nptel.ac.in/noc26_cs74/preview](https://onlinecourses.nptel.ac.in/noc26_cs74/preview)

## FAQ

**How many units are in Machine Learning for Robotics?**

Machine Learning for Robotics (PCC-302-RAI) has 5 units: Unit I Foundations of Learning & Probability (7 h); Unit II Regression and Probabilistic Supervised Learning (7 h); Unit III Advanced Classifiers (7 h); Unit IV Unsupervised Learning & Dimensionality Reduction (7 h); Unit V Model Evaluation, Ensemble Learning & ML Practice (7 h).

**What is the marks scheme for Machine Learning for Robotics?**

The official Robotics and Artificial Intelligence 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 3 credits.

**What should I know before Machine Learning for Robotics?**

Prerequisite listed in the syllabus: Programming and Problem Solving (PCC-151-ITT), Basics of Robotics & AI (PCC-201-RAI ).

---

Source: [SPPU TE Robotics and Artificial Intelligence 2024 pattern syllabus (June 2026) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE_Robotics%20and%20AI_Syllabus_2024%20Pattern%20(1)_13062026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE Robotics and AI subjects](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

# Dynamics and Control of Robotic Systems syllabus

PCC-301-RAI · Third Year Robotics and Artificial Intelligence, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PCC-301-RAI 4 h/week theory CCE 30 + End-sem 70

05 . units

04 . credits

## Unit-wise syllabus

UNIT I

### Foundations of Robot Dynamics

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Lagrangian Dynamics and Inertia Tensors: Introduction to Lagrange's equation, Derivation from Kinetic and potential energy, Link inertia tensor, Jacobian inertia tensor and their role in manipulator dynamics.
- Dynamic Models, Trajectories, and Control: Newton-Euler (recursive) and Lagrange-Euler (closedform) dynamic models, Dynamic modeling of 2-link and 3-link manipulators, Operational space dynamic model, Trajectory planning considerations, Joint interpolated trajectories and interpolation methods, Set point tracking, Introduction to actuator dynamics.

**Preserved official unit paragraph**

Lagrangian Dynamics and Inertia Tensors: Introduction to Lagrange's equation, Derivation from Kinetic and potential energy, Link inertia tensor, Jacobian inertia tensor and their role in manipulator dynamics. Dynamic Models, Trajectories, and Control: Newton-Euler (recursive) and Lagrange-Euler (closedform) dynamic models, Dynamic modeling of 2-link and 3-link manipulators, Operational space dynamic model, Trajectory planning considerations, Joint interpolated trajectories and interpolation methods, Set point tracking, Introduction to actuator dynamics.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/dynamics-and-control-of-robotic-systems/#unit-1)

UNIT II

### State Space Control Systems Analysis

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- State Space Representation and Properties: Introduction to state variables and state space representation, State-space representations of transfer-function systems, Controllability and observability (definitions, Kalman rank condition tests, importance in control design).
- Controller Design in State Space: Design of controllers using root-locus in state space, Pole placement with state feedback (full-state feedback) and with output feedback, Introduction to robust control systems.

**Preserved official unit paragraph**

State Space Representation and Properties: Introduction to state variables and state space representation, State-space representations of transfer-function systems, Controllability and observability (definitions, Kalman rank condition tests, importance in control design). Controller Design in State Space: Design of controllers using root-locus in state space, Pole placement with state feedback (full-state feedback) and with output feedback, Introduction to robust control systems.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/dynamics-and-control-of-robotic-systems/#unit-2)

UNIT III

### Multivariable Control Systems

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- MIMO Modeling, Analysis, and Properties: Modeling, analysis, and design of linear multi-input, Multi-output (MIMO) control systems, Both state space and transfer matrix (frequency domain) approaches, Stability analysis of MIMO LTI systems, Controllability, Sterilizability (stabilizability), observability in MIMO context.
- Realization, Reduction, and Design: Realization theory and model order reduction for MIMO systems, Multivariable control system design methodologies.

**Preserved official unit paragraph**

MIMO Modeling, Analysis, and Properties: Modeling, analysis, and design of linear multi-input, Multi-output (MIMO) control systems, Both state space and transfer matrix (frequency domain) approaches, Stability analysis of MIMO LTI systems, Controllability, Sterilizability (stabilizability), observability in MIMO context. Realization, Reduction, and Design: Realization theory and model order reduction for MIMO systems, Multivariable control system design methodologies.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/dynamics-and-control-of-robotic-systems/#unit-3)

UNIT IV

### Joint Space & Computed Torque Motion Control

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Joint Space Control Methods: Manipulator control problem (challenges: nonlinearity, coupling, uncertainties), Joint space control, Computed torque techniques, Near minimum time control, Feedforward control.
- Existing Control Algorithms for Robots: Survey of existing control algorithms used in controlling robots including PD control with gravity compensation, Inverse dynamics control, Nonlinear decoupled feedback control, Resolved motion control, Adaptive control.

**Preserved official unit paragraph**

Joint Space Control Methods: Manipulator control problem (challenges: nonlinearity, coupling, uncertainties), Joint space control, Computed torque techniques, Near minimum time control, Feedforward control. Existing Control Algorithms for Robots: Survey of existing control algorithms used in controlling robots including PD control with gravity compensation, Inverse dynamics control, Nonlinear decoupled feedback control, Resolved motion control, Adaptive control.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/dynamics-and-control-of-robotic-systems/#unit-4)

UNIT V

### Advanced Robot Control Strategies & Trajectory

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Programming Nonlinear and Adaptive Control Strategies: PD control with gravity compensation, Full inverse dynamics (feedback linearization) control, Nonlinear decoupled feedback control, Resolved motion control in operational space, Adaptive control for robots with unknown or varying parameters.
- Trajectory Programming and Integration: Robot control of trajectory using programming languages (e.g., VAL, RAPID, KRL), Comparison and integration of all motion control strategies.

**Preserved official unit paragraph**

Programming Nonlinear and Adaptive Control Strategies: PD control with gravity compensation, Full inverse dynamics (feedback linearization) control, Nonlinear decoupled feedback control, Resolved motion control in operational space, Adaptive control for robots with unknown or varying parameters. Trajectory Programming and Integration: Robot control of trajectory using programming languages (e.g., VAL, RAPID, KRL), Comparison and integration of all motion control strategies.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/dynamics-and-control-of-robotic-systems/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 4 |
| End-semester exam | 70 | 4 |

Prerequisite: Basics of Robotics AI (PCC-201-RAI), Kinematics of Robot (PCC-252-RAI).

## Course outcomes

1. CO1 DERIVE and COMPUTE dynamic models of serial robot manipulators using Lagrange-Euler and Newton-Euler formulations, and plan joint interpolated trajectories.
2. CO2 DEVELOP state space representations of given transfer functions, and determine controllability and observability of LTI systems.
3. CO3 DESIGN state feedback and output feedback controllers using pole placement, and analyze MIMO control systems for stability, controllability, and observability.
4. CO4 APPLY computed torque control and near minimum time control for joint space motion control of robot manipulators.
5. CO5 IMPLEMENT advanced control strategies (adaptive, resolved motion, inverse dynamics) and program robot trajectories using industrial robot programming languages.

## Books

### Text books

- Craig, J. J. (2018). Introduction to robotics: Mechanics and control (4th ed.). Pearson.
- Kurdila, A. J., & Ben-Tzvi, P. (2020). Dynamics and control of robotic systems (1st ed.). Wiley.
- Siciliano, B., Sciavicco, L., Villani, L., & Oriolo, G. (2010). Robotics: Modelling, planning and control. Springer Science & Business Media.
- Spong, M. W., Hutchinson, S., & Vidyasagar, M. (2020). Robot modeling and control (2nd ed.). Wiley.

### Reference books

- Behera, L., Kumar, S., Patchaikani, P. K., Nair, R. R., & Dutta, S. (2020). Intelligent control of robotic systems. CRC Press.
- Billard, A., Figueroa, N., & Mirrazavi, S. (2022). Learning for adaptive and reactive robot control: A dynamical systems approach. MIT Press.
- Liu, S., & Chen, G. S. (2019). Dynamics and control of robotic manipulators with contact and friction. Wiley.
- Shah, S. V., Saha, S. K., & Dutt, J. K. (2012). Dynamics of tree-type robotic systems. Springer Netherlands.

## NPTEL and SWAYAM links

Listed in the official syllabus:

- [onlinecourses.nptel.ac.in/noc25_me105/preview](https://onlinecourses.nptel.ac.in/noc25_me105/preview)
- [onlinecourses.nptel.ac.in/noc26_me72/preview](https://onlinecourses.nptel.ac.in/noc26_me72/preview)

## FAQ

**How many units are in Dynamics and Control of Robotic Systems?**

Dynamics and Control of Robotic Systems (PCC-301-RAI) has 5 units: Unit I Foundations of Robot Dynamics (8 h); Unit II State Space Control Systems Analysis (8 h); Unit III Multivariable Control Systems (8 h); Unit IV Joint Space & Computed Torque Motion Control (8 h); Unit V Advanced Robot Control Strategies & Trajectory (8 h).

**What is the marks scheme for Dynamics and Control of Robotic Systems?**

The official Robotics and Artificial Intelligence 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 4 credits.

**What should I know before Dynamics and Control of Robotic Systems?**

Prerequisite listed in the syllabus: Basics of Robotics AI (PCC-201-RAI), Kinematics of Robot (PCC-252-RAI).

---

Source: [SPPU TE Robotics and Artificial Intelligence 2024 pattern syllabus (June 2026) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE_Robotics%20and%20AI_Syllabus_2024%20Pattern%20(1)_13062026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE Robotics and AI subjects](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

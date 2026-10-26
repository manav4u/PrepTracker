# Robot Modeling and Simulation syllabus

PCC-303-RAI · Third Year Robotics and Artificial Intelligence, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PCC-303-RAI 4 h/week theory CCE 30 + End-sem 70

05 . units

04 . credits

## Unit-wise syllabus

UNIT I

### Mathematical Modeling & Kinematics

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Mathematical Modeling of Robots: Symbolic representation of manipulators, Configuration space, State space, Workspace, Classification of robots (serial, parallel, hybrid), Accuracy and repeatability, Resolution, Wrist and end effectors, Common kinematic arrangements (articulated, SCARA, delta), underactuated and mobile robots.
- Kinematics of Rigid Bodies: Pose of a rigid body in 3D, Rotation matrices and composition, Euler angles and gimbal lock, Angle-axis representation, Homogeneous transformations, Direct kinematics for typical manipulators, Joint space vs. operational space, Kinematic calibration.

**Preserved official unit paragraph**

Mathematical Modeling of Robots: Symbolic representation of manipulators, Configuration space, State space, Workspace, Classification of robots (serial, parallel, hybrid), Accuracy and repeatability, Resolution, Wrist and end effectors, Common kinematic arrangements (articulated, SCARA, delta), underactuated and mobile robots. Kinematics of Rigid Bodies: Pose of a rigid body in 3D, Rotation matrices and composition, Euler angles and gimbal lock, Angle-axis representation, Homogeneous transformations, Direct kinematics for typical manipulators, Joint space vs. operational space, Kinematic calibration.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-modeling-and-simulation/#unit-1)

UNIT II

### Differential Kinematics, Statics & Trajectory Planning

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Differential Kinematics and Statics: Geometric Jacobian matrix, Jacobian for typical manipulators, Kinematic singularities, Redundancy analysis, Inverse differential kinematics, Analytical Jacobian, Inverse kinematics algorithms, Statics (force/torque mapping).
- Trajectory Planning, Actuators & Sensors: Path vs. trajectory, Operational space and joint space trajectories, Joint actuating systems (electric, hydraulic, pneumatic), Proprioceptive sensors (encoders, tachometers), Exteroceptive sensors (force, tactile, proximity).

**Preserved official unit paragraph**

Differential Kinematics and Statics: Geometric Jacobian matrix, Jacobian for typical manipulators, Kinematic singularities, Redundancy analysis, Inverse differential kinematics, Analytical Jacobian, Inverse kinematics algorithms, Statics (force/torque mapping). Trajectory Planning, Actuators & Sensors: Path vs. trajectory, Operational space and joint space trajectories, Joint actuating systems (electric, hydraulic, pneumatic), Proprioceptive sensors (encoders, tachometers), Exteroceptive sensors (force, tactile, proximity).

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-modeling-and-simulation/#unit-2)

UNIT III

### Dynamics & Control Architecture

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Dynamics of Robot Manipulators: Lagrange formulation, Properties of dynamic models, Dynamic model of simple manipulators, Parameter identification, Direct and inverse dynamics, Dynamic scaling of trajectories, Operational space dynamic model, Dynamic manipulability ellipsoid.
- Control Architecture: Functional architecture (task planning, control loops), Programming environment (simulation vs. real-time), Hardware architecture (microcontrollers, DSPs, industrial PCs).

**Preserved official unit paragraph**

Dynamics of Robot Manipulators: Lagrange formulation, Properties of dynamic models, Dynamic model of simple manipulators, Parameter identification, Direct and inverse dynamics, Dynamic scaling of trajectories, Operational space dynamic model, Dynamic manipulability ellipsoid. Control Architecture: Functional architecture (task planning, control loops), Programming environment (simulation vs. real-time), Hardware architecture (microcontrollers, DSPs, industrial PCs).

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-modeling-and-simulation/#unit-3)

UNIT IV

### Motion Control & Force Control

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Motion Control: Control problem (tracking desired trajectories), Joint space control, Independent joint PID control, Decentralized control with gravity compensation, Computed torque feedforward control, Centralized control using full dynamics, Operational space control.
- Force Control: Need for force control in assembly and contact tasks, Compliance control (passive vs. active), Impedance control (regulating inertia, damping, and stiffness), Force control with direct feedback, Constrained motion with natural and artificial constraints, Hybrid force/motion control.

**Preserved official unit paragraph**

Motion Control: Control problem (tracking desired trajectories), Joint space control, Independent joint PID control, Decentralized control with gravity compensation, Computed torque feedforward control, Centralized control using full dynamics, Operational space control. Force Control: Need for force control in assembly and contact tasks, Compliance control (passive vs. active), Impedance control (regulating inertia, damping, and stiffness), Force control with direct feedback, Constrained motion with natural and artificial constraints, Hybrid force/motion control.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-modeling-and-simulation/#unit-4)

UNIT V

### Visual Servoing, Mobile Robots & Motion Planning

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Introduction to Visual Servoing: PD control with gravity compensation, Full inverse dynamics (feedback linearization) control, Nonlinear decoupled feedback control, Resolved motion control in operational space, Adaptive control for robots with unknown or varying parameters.
- Mobile Robots and Motion Planning: Nonholonomic constraints (no lateral motion), Kinematic models of wheeled robots (differential drive, car-like), Dynamic models, Motion control for trajectory tracking, Odometric localization, Configuration space representation, Planning via retraction, Cell decomposition, Probabilistic planning (RRT, PRM), Planning via artificial potentials.

**Preserved official unit paragraph**

Introduction to Visual Servoing: PD control with gravity compensation, Full inverse dynamics (feedback linearization) control, Nonlinear decoupled feedback control, Resolved motion control in operational space, Adaptive control for robots with unknown or varying parameters. Mobile Robots and Motion Planning: Nonholonomic constraints (no lateral motion), Kinematic models of wheeled robots (differential drive, car-like), Dynamic models, Motion control for trajectory tracking, Odometric localization, Configuration space representation, Planning via retraction, Cell decomposition, Probabilistic planning (RRT, PRM), Planning via artificial potentials.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-modeling-and-simulation/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 4 |
| End-semester exam | 70 | 4 |

Prerequisite: Mathematics for Intelligent Systems (MDM-221-RAI), Kinematics of Robot (PCC-252-RAI).

## Course outcomes

1. CO1 DEVELOP forward and inverse kinematic models for typical robot manipulators using homogeneous transformations and rotation matrices.
2. CO2 COMPUTE Jacobian matrices, identify kinematic singularities, and solve inverse differential kinematics for velocity and static force analysis.
3. CO3 DERIVE dynamic equations of motion using Lagrange formulation and distinguish between direct and inverse dynamics.
4. CO4 IMPLEMENT motion control schemes (joint space and operational space) and force control strategies (impedance, compliance, hybrid) for robot manipulators.
5. CO5 SIMULATE visual servoing systems and motion planning algorithms (including probabilistic methods) for mobile robots and manipulators in a programming environment.

## Books

### Text books

- Corke, P. (2023). Robotics: Fundamental algorithms in Python (1st Ed.). Springer. Springer.
- Craig, J. J. (2018). Introduction to robotics: Mechanics and control (4th Ed.). Pearson Education.
- Spong, M. W., Hutchinson, S., & Vidyasagar, M. (2020). Robot modeling and control (2nd Ed.). Wiley.
- Lynch, K. M., & Park, F. C. (2017). Modern robotics: Mechanics, planning, and control. Cambridge University Press.

### Reference books

- Siciliano, B., & Khatib, O. (Eds.). (2016). Springer handbook of robotics (2nd Ed.). Springer.
- Noda, I., Ando, N., Brugali, D., & Kuffner, J. J. (Eds.). (2012). Simulation, modeling, and programming for autonomous robots. Springer.
- Megahed, S. M. (1993). Principles of robot modelling and simulation. Wiley.
- Khalil, W., & Dombre, E. (2004). Modeling, identification and control of robots. Butterworth- Heinemann. ScienceDirect.

## NPTEL and SWAYAM links

Listed in the official syllabus:

- [onlinecourses.nptel.ac.in/e-learning/preview/noc22_me18](https://onlinecourses.nptel.ac.in/e-learning/preview/noc22_me18)
- [onlinecourses.nptel.ac.in/noc23_me67/preview](https://onlinecourses.nptel.ac.in/noc23_me67/preview)
- [onlinecourses.nptel.ac.in/noc26_ee89/preview](https://onlinecourses.nptel.ac.in/noc26_ee89/preview)

## FAQ

**How many units are in Robot Modeling and Simulation?**

Robot Modeling and Simulation (PCC-303-RAI) has 5 units: Unit I Mathematical Modeling & Kinematics (8 h); Unit II Differential Kinematics, Statics & Trajectory Planning (8 h); Unit III Dynamics & Control Architecture (8 h); Unit IV Motion Control & Force Control (8 h); Unit V Visual Servoing, Mobile Robots & Motion Planning (8 h).

**What is the marks scheme for Robot Modeling and Simulation?**

The official Robotics and Artificial Intelligence 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 4 credits.

**What should I know before Robot Modeling and Simulation?**

Prerequisite listed in the syllabus: Mathematics for Intelligent Systems (MDM-221-RAI), Kinematics of Robot (PCC-252-RAI).

---

Source: [SPPU TE Robotics and Artificial Intelligence 2024 pattern syllabus (June 2026) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE_Robotics%20and%20AI_Syllabus_2024%20Pattern%20(1)_13062026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE Robotics and AI subjects](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

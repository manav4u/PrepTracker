# Robot Operating System syllabus

PCC-353-RAI · Third Year Robotics and Artificial Intelligence, SPPU 2024 pattern. Every unit, the marks scheme, course outcomes and books, copied from the official syllabus PDF.

PCC-353-RAI 4 h/week theory CCE 30 + End-sem 70

05 . units

04 . credits

## Unit-wise syllabus

UNIT I

### Introduction to ROS & Environment Setup

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- ROS Overview: Introduction to robot software development, History and evolution of ROS, Comparison of ROS with other robotics frameworks (Including Webots and CoppeliaSim), Overview of ROS architecture (Master, Nodes, Parameter Server, ROS Core), Applications of ROS in industry and research.
- Environment Setup: Setting up a ROS development environment on Linux (Ubuntu), installing and configuring ROS distributions, creating and managing ROS workspaces (catkin and colcon), introduction to ROS packages and package management (package.xml, CMakeLists.txt), environment variable setup, basic ROS command-line tools (roscd, rosls, rospack, rosrun, rosnode, rostopic, rosservice, rosparam).

**Preserved official unit paragraph**

ROS Overview: Introduction to robot software development, History and evolution of ROS, Comparison of ROS with other robotics frameworks (Including Webots and CoppeliaSim), Overview of ROS architecture (Master, Nodes, Parameter Server, ROS Core), Applications of ROS in industry and research. Environment Setup: Setting up a ROS development environment on Linux (Ubuntu), installing and configuring ROS distributions, creating and managing ROS workspaces (catkin and colcon), introduction to ROS packages and package management (package.xml, CMakeLists.txt), environment variable setup, basic ROS command-line tools (roscd, rosls, rospack, rosrun, rosnode, rostopic, rosservice, rosparam).

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-operating-system/#unit-1)

UNIT II

### ROS Fundamentals & Communication

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Core Concepts: Nodes, Topics, Messages and services in ROS, ROS Communication: Publishers and subscribers (asynchronous), ROS services (synchronous request-reply), ROS actions (long-running tasks), ROS parameters and parameter server, ROS master and roscore functionality.
- Messages and Data Definition: ROS standard message types, Data types and custom message definition with ROS messages (.msg), Service definition files (.srv), Action definition files (. action), introduction to ROS names and naming conventions, Remapping of topics and nodes, ROS bags for data logging and playback (Advanced rosbag analysis workflows – e.g., filtering, time-syncing, extracting data for ML).

**Preserved official unit paragraph**

Core Concepts: Nodes, Topics, Messages and services in ROS, ROS Communication: Publishers and subscribers (asynchronous), ROS services (synchronous request-reply), ROS actions (long-running tasks), ROS parameters and parameter server, ROS master and roscore functionality. Messages and Data Definition: ROS standard message types, Data types and custom message definition with ROS messages (.msg), Service definition files (.srv), Action definition files (. action), introduction to ROS names and naming conventions, Remapping of topics and nodes, ROS bags for data logging and playback (Advanced rosbag analysis workflows – e.g., filtering, time-syncing, extracting data for ML).

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-operating-system/#unit-2)

UNIT III

### Programming with ROS

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Language and Node Creation: Introduction to ROS with Python (rospy) and C++ (roscpp), Creating simple ROS nodes in both languages, Node initialization and shutdown, Rate control and sleep functions, Logging and debugging output.
- Communication Implementation: Publishing and subscribing to topics (Publisher, Subscriber, callback functions), Sending and receiving ROS service requests (ServiceClient and ServiceServer), Working with ROS libraries and APIs, Time handling in ROS (ros::Time, rospy.
- Time), Timers and periodic callbacks, Exception handling in ROS nodes.

**Preserved official unit paragraph**

Language and Node Creation: Introduction to ROS with Python (rospy) and C++ (roscpp), Creating simple ROS nodes in both languages, Node initialization and shutdown, Rate control and sleep functions, Logging and debugging output. Communication Implementation: Publishing and subscribing to topics (Publisher, Subscriber, callback functions), Sending and receiving ROS service requests (ServiceClient and ServiceServer), Working with ROS libraries and APIs, Time handling in ROS (ros::Time, rospy. Time), Timers and periodic callbacks, Exception handling in ROS nodes.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-operating-system/#unit-3)

UNIT IV

### Robot Navigation & Perception

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Robot Navigation: Robot navigation challenges and solutions (SLAM, path planning, localization, obstacle avoidance), ROS navigation frameworks (ROS Navigation Stack, MoveIt, Cartographer), Overview of costmaps, Odometry and sensor fusion, AMCL for localization, ROS enabled autonomous robot movement.
- Robot Perception: Importance of robot perception for navigation and interaction, ROS integration with sensors like LiDAR, cameras, IMUs, and radar, Robot perception (object detection, segmentation, classification), How robots "see" and interpret their environment, Introduction to computer vision libraries in ROS (OpenCV, PCL), Camera calibration.

**Preserved official unit paragraph**

Robot Navigation: Robot navigation challenges and solutions (SLAM, path planning, localization, obstacle avoidance), ROS navigation frameworks (ROS Navigation Stack, MoveIt, Cartographer), Overview of costmaps, Odometry and sensor fusion, AMCL for localization, ROS enabled autonomous robot movement. Robot Perception: Importance of robot perception for navigation and interaction, ROS integration with sensors like LiDAR, cameras, IMUs, and radar, Robot perception (object detection, segmentation, classification), How robots "see" and interpret their environment, Introduction to computer vision libraries in ROS (OpenCV, PCL), Camera calibration.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-operating-system/#unit-4)

UNIT V

### Advanced Tools, Simulation & Hardware Interfacing

8 hours

Derived reading outline. Source text split at semicolons, line breaks and sentence boundaries, not an official topic hierarchy.

- Tools and Simulation: Introduction to ROS tools (rviz, rqt, rqt_graph, rqt_console, rqt_plot, rosbag, Foxglove Studio) for visualization, Debugging and logging, Working with robot simulations in ROS (Gazebo, comparison with Webots and CoppeliaSim), URDF for robot description, TF transform library (tf2) for coordinate frames, Introduction to robot navigation frameworks (MoveIt) and perception pipelines.
- Hardware Interfacing: Introduction to robot sensors (proximity, light, contact) and actuators (DC motors, servo motors, stepper motors), Interfacing sensors and actuators with ROS drivers (UART, I2C, SPI, USB), Reading sensor data and controlling actuators through ROS nodes, Introduction to micro- ROS and rosserial for embedded systems, NVIDIA Jetson and TensorRT for edge inference, CI/CD basics using GitHub Actions / GitLab CI for robotics projects, Docker + ROS for reproducible setups, ROS 2 basics.

**Preserved official unit paragraph**

Tools and Simulation: Introduction to ROS tools (rviz, rqt, rqt_graph, rqt_console, rqt_plot, rosbag, Foxglove Studio) for visualization, Debugging and logging, Working with robot simulations in ROS (Gazebo, comparison with Webots and CoppeliaSim), URDF for robot description, TF transform library (tf2) for coordinate frames, Introduction to robot navigation frameworks (MoveIt) and perception pipelines. Hardware Interfacing: Introduction to robot sensors (proximity, light, contact) and actuators (DC motors, servo motors, stepper motors), Interfacing sensors and actuators with ROS drivers (UART, I2C, SPI, USB), Reading sensor data and controlling actuators through ROS nodes, Introduction to micro- ROS and rosserial for embedded systems, NVIDIA Jetson and TensorRT for edge inference, CI/CD basics using GitHub Actions / GitLab CI for robotics projects, Docker + ROS for reproducible setups, ROS 2 basics.

[Unit permalink](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/robot-operating-system/#unit-5)

## Marks and credits

| Head | Marks | Credit |
| --- | --- | --- |
| CCE (continuous comprehensive evaluation) | 30 | 4 |
| End-semester exam | 70 | 4 |

Prerequisite: Robot Modeling and Simulation (PCC-303-RAI), Robot Programming Lab (PCC-306-RAI).

## Course outcomes

1. CO1 DESCRIBE ROS architecture (Master, Nodes, Parameter Server), history, pros/cons, and realworld applications.
2. CO2 EXPLAIN ROS communication (topics, services, actions, parameters), naming conventions, and rosbag logging.
3. CO3 APPLY programming to develop ROS nodes in Python/C++ with publishers, subscribers, services, timers, and error handling.
4. CO4 ANALYZE navigation (SLAM, AMCL, path planning) and perception (detection, segmentation) using ROS frameworks.
5. CO5 CREATE ROS solutions using Gazebo, rviz, URDF, TF2, and hardware interfacing.

## Books

### Text books

- Hughes, C., & Hughes, T. (2016). Robot programming: A guide to controlling autonomous robots. Que Publishing.
- Quigley, M., Gerkey, B., & Smart, W. D. (2015). Programming robots with ROS: A practical introduction to the Robot Operating System. O'Reilly Media, Inc.
- Siciliano, B., Sciavicco, L., Villani, L., & Oriolo, G. (2010). Robotics: Modelling, planning and control. Springer Publishing Company.

### Reference books

- Martinez, A., & Fernandez, E. (2013). Learning ROS for robotic programming. Packt Publishing.
- O'Kane, J. M. (2014). A gentle introduction to ROS. CreateSpace Independent Publishing Platform.
- Joseph, L. (2013). Mastering ROS for robotics programming: Design, build and simulate complex robots using ROS. Packt Publishing.

## NPTEL and SWAYAM links

Listed in the official syllabus:

- [nptel.ac.in/courses/107106090](https://nptel.ac.in/courses/107106090)
- [onlinecourses.nptel.ac.in/noc21_me76/preview](https://onlinecourses.nptel.ac.in/noc21_me76/preview)
- [onlinecourses.nptel.ac.in/noc26_me72/preview](https://onlinecourses.nptel.ac.in/noc26_me72/preview)

## FAQ

**How many units are in Robot Operating System?**

Robot Operating System (PCC-353-RAI) has 5 units: Unit I Introduction to ROS & Environment Setup (8 h); Unit II ROS Fundamentals & Communication (8 h); Unit III Programming with ROS (8 h); Unit IV Robot Navigation & Perception (8 h); Unit V Advanced Tools, Simulation & Hardware Interfacing (8 h).

**What is the marks scheme for Robot Operating System?**

The official Robotics and Artificial Intelligence 2024 pattern syllabus lists continuous comprehensive evaluation (CCE) for 30 marks and the end-semester exam for 70 marks, for 4 credits.

**What should I know before Robot Operating System?**

Prerequisite listed in the syllabus: Robot Modeling and Simulation (PCC-303-RAI), Robot Programming Lab (PCC-306-RAI).

---

Source: [SPPU TE Robotics and Artificial Intelligence 2024 pattern syllabus (June 2026) (official SPPU PDF)](http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202026/TE_Robotics%20and%20AI_Syllabus_2024%20Pattern%20(1)_13062026.pdf). PrepTracker is an independent student project and is not affiliated with Savitribai Phule Pune University. Always confirm the current syllabus and exam rules with your college.

[PrepTracker home](https://preptracker.manavdev.site/) · [Syllabus](https://preptracker.manavdev.site/syllabus/) · [TE Robotics and AI subjects](https://preptracker.manavdev.site/syllabus/te-robotics-and-ai/) · [Grading and SGPA](https://preptracker.manavdev.site/syllabus/grading-system-sgpa/) · [Privacy](https://preptracker.manavdev.site/privacy/)

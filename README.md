# PrepTracker

![Project Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73C92?style=for-the-badge&logo=vite&logoColor=white)

> **Engineer Your Academic Success.** The definitive operating system for engineering students. Manage syllabus coverage, access curated resources, and track critical deadlines. Zero fluff. Pure efficiency.

---

## 🚀 Live Demo

**[Launch PrepTracker](https://manav4u.github.io/PrepTracker/)**

---

![PrepTracker Dashboard](public/assets/ProjectPrepTracker.png)

## 📖 Overview

**PrepTracker** is a high-performance academic dashboard designed specifically for engineering students following the **SPPU 2024 Pattern**. It replaces scattered PDFs, messy notes, and generic to-do lists with a centralized command center.

Built with an **"Industrial Elite"** design philosophy, the interface prioritizes clarity, speed, and focus. Dark mode is standard, distractions are eliminated, and every pixel serves a purpose—helping you master your coursework efficiently.

### Why PrepTracker?

*   **Precision Tracking:** Forget guessing your progress. We've digitized the entire SPPU syllabus into interactive modules. Mark units as "Pending," "In Progress," or "Mastered" and visualize your velocity.
*   **Curated Resource Vault:** Instant access to high-quality notes, video lectures, and textbooks specific to your current semester subjects.
*   **Privacy First:** Your data belongs to you. PrepTracker uses **Local Storage** exclusively. No cloud accounts, no tracking, no data mining.
*   **Task Command:** A robust Todo system with priority sorting to manage assignments, lab work, and exam prep alongside your daily life.

## ✨ Key Features

### 1. **Smart Syllabus Tracking**
*   **Granular Control:** Track progress at the Unit level for every subject (Maths, Physics, Mechanics, etc.).
*   **Visual Analytics:** Real-time progress bars and completion percentages for each subject.
*   **Status Indicators:** Color-coded states (Pending, In Progress, Mastered) give you an instant health check of your preparation.

### 2. **Resource Vault**
*   **Categorized Library:** Filter resources by subject, type (PDF, Video, Book), and unit.
*   **Direct Links:** One-click access to Google Drive folders, YouTube playlists, and reference materials.
*   **Custom Additions:** Add your own personal study links to the vault (stored locally).

### 3. **Task Command Center**
*   **Priority Matrix:** Sort tasks by High, Medium, or Low priority.
*   **Context Aware:** Tag tasks with specific subjects or categories (Lab, Theory, Assignment).
*   **Persistent State:** Tasks remain saved even if you close the browser.

### 4. **Industrial Elite UI**
*   **Dark Mode Native:** Designed for late-night study sessions with zero eye strain.
*   **Responsive:** Works seamlessly on desktop, tablet, and mobile.
*   **Framer Motion:** Smooth, professional animations for a premium feel.

## 🛠️ Tech Stack

This project is built using modern web technologies to ensure speed, scalability, and maintainability.

*   **Frontend Framework:** [React 18](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for type safety and robust code.
*   **Build Tool:** [Vite](https://vitejs.dev/) for lightning-fast development and optimized production builds.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with a custom configuration for the "Industrial Elite" theme.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid UI interactions.
*   **Routing:** [React Router v6](https://reactrouter.com/) (HashRouter for GitHub Pages compatibility).
*   **Icons:** [Lucide React](https://lucide.dev/) for clean, consistent iconography.
*   **State Management:** React Context API + Custom Hooks.
*   **Persistence:** `localStorage` API for client-side data retention.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/manav4u/PrepTracker.git
    cd PrepTracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in browser:**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

### Deployment

This project is configured for **GitHub Pages**.

1.  Build the project:
    ```bash
    npm run build
    ```
2.  The build artifacts will be in the `dist/` directory.
3.  Deploy using `gh-pages` or manually upload the `dist` folder.

## 📂 Project Structure

```
PrepTracker/
├── public/              # Static assets (images, icons)
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context (Data/State Management)
│   ├── pages/           # Application views (Dashboard, Resources, etc.)
│   ├── types.ts         # TypeScript definitions
│   ├── constants.tsx    # Static data (Syllabus, Defaults)
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for new features, bug fixes, or resource additions:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for Engineers.**

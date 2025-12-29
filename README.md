# PrepTracker

<div align="center">
<img width="1200" height="475" alt="PrepTracker Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/manav4u/PrepTracker)

PrepTracker is a sophisticated academic suite designed for first-year Engineering students at Savitribai Phule Pune University (SPPU). It features an immersive, dark-themed UI with a comprehensive set of tools to manage coursework, track progress, and forecast academic performance.

## ✨ Key Features

*   **Dynamic Dashboard:** Visualize your academic velocity with an overview of aggregate progress, mastery index, and study consistency streaks.
*   **Detailed Syllabus Tracking:** Drill down into each subject with unit and topic breakdowns. Track progress for each unit from "Not Started" to "Mastered", including PYQ completion.
*   **SGPA Forecaster:** A simulation tool to project your final SGPA based on In-Sem and End-Sem marks.
*   **Resource Vault:** A central archive for study materials. Manage system-provided and user-added resources with a built-in viewer featuring a "Cinema Mode" for videos.
*   **Execution Stack:** A dedicated task manager for academic directives, lab work, and submissions, complete with priority and category tagging.
*   **Data Portability & Settings:** A secure settings environment to manage your profile, and backup/restore your entire academic state via JSON. Includes options to re-initialize or format the local application data.

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Routing:** React Router

## 🚀 Run Locally

**Prerequisites:** You must have [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/manav4u/PrepTracker.git
    cd PrepTracker
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project. This is used for "coming soon" AI features.
    ```env
    GEMINI_API_KEY="your_api_key_here"
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  **Open the application:**
    The app will be available at `http://localhost:3000`.

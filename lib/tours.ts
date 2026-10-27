// Spot-illustration scenes rendered inside the walkthrough card. Each id
// names a semantic scene in components/TourArt.tsx; add ids here as more
// steps get their own illustration.
export type TourArtId = "progress-average";
export type TourStep = {
  title: string;
  body: string;
  target?: string;
  fallback?: string;
  dock?: boolean;
  art?: TourArtId;
};
export type TourId =
  "home" | "library" | "tasks" | "review" | "plan" | "settings" | "course";
export const TOUR_VERSION = "pt_walkthrough_v1";
export const TOURS: Record<
  TourId,
  { name: string; intro: string; steps: TourStep[] }
> = {
  home: {
    name: "Home",
    intro: "Your study space, explained.",
    steps: [
      {
        title: "Your progress, at a glance.",
        body: "Overall Progress averages unit states across your selected courses. Start contributes 0, Studying 33 and Done 100. This is not the percentage of topics ticked.",
        target: '[data-tour="overall-progress"]',
        art: "progress-average",
      },
      {
        title: "Small actions build a study day.",
        body: "The daily goal is five study actions. Topic ticks, reviews and other study actions feed activity and streaks. This is separate from the per-subject topic goals in Plan.",
        target: '[data-tour="home-stats"]',
        fallback: '[data-tour="overview"]',
      },
      {
        title: "Look back at a study day.",
        body: "The activity grid records study work by date. Select a day to see its recorded activity. It is your history, not a schedule or an exam timetable.",
        target: '[data-tour="activity"]',
      },
      {
        title: "Start with one course.",
        body: "Open a course to find units, topic checklists and solved-paper ribbons. Course topic coverage is shown inside the course. Your shelf contains only your selected courses.",
        target: '[data-tour="courses"] .grid > :first-child',
        fallback: '[data-tour="courses"]',
      },
      {
        title: "Dates belong to each subject.",
        body: "The exam timeline uses individual subject dates from Settings. Missing dates stay missing. The separate First exam date controls the Home countdown.",
        target: '[data-tour="timeline"]',
      },
      {
        title: "Your next move is always here.",
        body: "Library keeps study links. Tasks organises small jobs. Revise contains Review and daily Plan. Settings holds dates and backups. Each screen has its own walkthrough.",
        target: '[data-tour="navigation"]',
        dock: true,
      },
      {
        title: "Find things without hunting.",
        body: "Search selected courses, units, topics, task text and resource titles or authors. On phone, tap the search icon near your avatar. Announcements come from the bell, not push notifications.",
        target: '[data-tour="header-tools"]',
      },
    ],
  },
  library: {
    name: "Library",
    intro: "Keep useful material close.",
    steps: [
      {
        title: "Narrow the shelf.",
        body: "Search resource titles, then use category and subject filters. Your selected subjects decide the available material. Swipe filter rows sideways on a phone if more choices are off-screen.",
        target: '[data-tour="library-filters"]',
      },
      {
        title: "Choose a subject.",
        body: "All subjects shows the current shelf. A subject chip narrows it further. A low or empty count can simply mean no links match these filters.",
        target: '[data-tour="library-subjects"]',
      },
      {
        title: "Save a useful link.",
        body: "Add Resource opens a form for a title, URL, category and subject. It stores a link in this browser, not an uploaded file. Nothing is added during this walkthrough.",
        target: '[data-tour="library-add"]',
      },
      {
        title: "Open material at its source.",
        body: "Resource cards open the viewer or the original site. Videos, PDFs and outside websites may need internet access. PrepTracker does not automatically download your library for offline use.",
        target: '[data-tour="library-items"] > :nth-child(2)',
        fallback: '[data-tour="library-add"]',
      },
      {
        title: "Remove items from your shelf.",
        body: "Select enters selection mode. Pick items, then Delete and confirm. Custom links are removed; built-in items are hidden from your Library. Back up before large changes.",
        target: '[data-tour="library-select"]',
      },
    ],
  },
  tasks: {
    name: "Tasks",
    intro: "Turn small jobs into clear next steps.",
    steps: [
      {
        title: "Write one clear job.",
        body: "Enter a Task Title. Priority sorts Critical before Normal before Low. Category is a label for the kind of work. Add Task becomes available once there is a title.",
        target: '[data-tour="task-title"]',
      },
      {
        title: "Link it when that helps.",
        body: "Subject and Linked Unit are optional. Choose a subject before a unit. A task can stay general, and completing it does not automatically tick syllabus topics.",
        target: '[data-tour="task-links"]',
      },
      {
        title: "Give it a date, or leave it open.",
        body: "The due date is optional. A past date does not automatically move forward. Add Task creates the job; while editing, Save changes updates that existing job.",
        target: '[data-tour="task-date"]',
      },
      {
        title: "See the right slice of work.",
        body: "All, Active and Completed filter the list. Use the completion control to finish a job, Edit to change it and delete only when it is no longer needed. Completed work sits after active work.",
        target: '[data-tour="task-filters"]',
      },
      {
        title: "Carryover is a decision.",
        body: "Overdue work appears in Carried over. Move to today explicitly moves those due dates. It is not automatic. Removing work offers a short Undo; Clear Completed removes completed jobs.",
        target: '[data-testid="carried-over"]',
        fallback: '[data-tour="task-list"]',
      },
    ],
  },
  review: {
    name: "Review",
    intro: "Remember what you have already studied.",
    steps: [
      {
        title: "Two views, two jobs.",
        body: "Review is for spaced recall of covered topics. Plan chooses topic work from upcoming subject exam dates. Switch here when you want a different kind of session.",
        target: '[aria-label="Revise views"]',
      },
      {
        title: "Keep recall manageable.",
        body: "The queue shows up to eight due topics a day. More due topics wait for another day. Left and done describe today's recall queue, not your whole syllabus.",
        target: '[data-tour="review-stats"]',
      },
      {
        title: "Recall before you answer.",
        body: "Read the topic and try to explain it from memory. Covered topics enter the cycle after three days; the later successful gaps are seven and twenty-one days. An empty queue is normal before anything is due.",
        target: '[data-tour="review-card"]',
        fallback: '[data-tour="review-content"]',
      },
      {
        title: "Be honest: Forgot or Got it.",
        body: "Forgot brings the topic back tomorrow. Got it moves it to the next recall gap. Your answer counts as study activity. Undo restores the last answer while you remain on this screen.",
        target: '[data-tour="review-answer"]',
        fallback: '[data-tour="review-content"]',
      },
      {
        title: "No due topics is not a problem.",
        body: "Up next shows what is coming. If the queue is empty, cover topics in a course or use Plan. The tour never creates a recall answer or changes your review history.",
        target: '[data-tour="review-content"]',
      },
    ],
  },
  plan: {
    name: "Daily Plan",
    intro: "Know what to study today.",
    steps: [
      {
        title: "Plan is built from real dates.",
        body: "Each selected subject needs its own exam date in Settings. The First exam date countdown is not enough. No date means no target for that subject; nothing is guessed.",
        target: '[aria-label="Revise views"]',
      },
      {
        title: "Read the total honestly.",
        body: "Left is the remaining topic target for today. Done is credited against each subject's own goal. Extra topics are shown separately, not used to fill another subject's goal.",
        target: '[data-tour="plan-stats"]',
        fallback: '[data-testid="plan-empty"]',
      },
      {
        title: "Tick only topics you covered.",
        body: "A topic checkbox records actual syllabus progress and study activity. Topics are grouped by subject and unit. Do not tick a topic just to clear the target. This tour does not tick any.",
        target: '[data-tour="plan-subject"]',
        fallback: '[data-testid="plan-empty"]',
      },
      {
        title: "Every subject keeps its own goal.",
        body: "Doing extra Maths cannot replace Physics. A completed goal can still show extra work. Today's and past exams have no new study target; edit incorrect dates in Settings.",
        target: '[data-testid="plan-tab"], [data-testid="plan-empty"]',
      },
      {
        title: "A plan is not a task list.",
        body: "Tasks are your own jobs. Plan is calculated from topic coverage and exam dates, and refreshes for a new day. Missing, today and past exam states are explained on this screen.",
        target: '[aria-label="Revise views"]',
      },
    ],
  },
  settings: {
    name: "Settings",
    intro: "Keep your timetable and data in order.",
    steps: [
      {
        title: "Make it yours.",
        body: "Change your avatar here. Your name and optional Student ID / PRN are browser-local profile fields, not a sign-in account. Edits save as you type.",
        target: '[aria-label="Change avatar"]',
      },
      {
        title: "The first date drives the countdown.",
        body: "First exam date controls Days to Exam. It does not give every course an exam date. Enter only a confirmed date, or leave it blank until the timetable is available.",
        target: "#exam-start",
      },
      {
        title: "Give each subject its own date.",
        body: "Open Exam date per subject and set the actual dates. These drive the timeline and daily Plan. Leaving a date blank is better than inventing one.",
        target: '[aria-controls="exam-dates-panel"]',
      },
      {
        title: "Change courses, not your history.",
        body: "Your subjects lists the active shelf. Change subjects reopens the picker while preserving your profile and stored history. Hidden courses are not a reason to erase everything.",
        target: '[data-tour="settings-subjects"]',
      },
      {
        title: "Your work lives in this browser.",
        body: "There is no automatic account sync. A different browser, profile or device has its own data. Use Save Backup or Share Backup to keep the JSON file somewhere outside this site.",
        target: '[data-tour="backup-save"]',
      },
      {
        title: "Preview before replacing data.",
        body: "Restore Backup reads a JSON backup and shows a preview before confirmation. Restore replaces local saved data; it does not merge. Keep a current backup first. Undo restore is offered when a previous restore snapshot exists.",
        target: '[aria-label="Restore backup from a JSON file"]',
      },
      {
        title: "Erase means erase.",
        body: "Erase all data is permanent for this browser after confirmation. It is not a fix for changing subjects. Clearing browser/site storage can also lose your work, so keep a separate backup.",
        target: '[data-tour="settings-danger"]',
      },
      {
        title: "Replay any walkthrough.",
        body: "Use the walkthrough controls here, or the Walkthrough button on the current screen. Skipping a tour leaves your study work alone. You can turn first-visit prompts off without disabling replay.",
        target: '[data-tour="tour-controls"]',
      },
      {
        title: "Install is not a backup.",
        body: "Your browser may offer Install app or Add to Home Screen. Open needed screens while online first. Cached screens may work offline, but new screens and outside resources can still need a connection.",
        target: '[data-tour="tour-controls"]',
      },
    ],
  },
  course: {
    name: "Course",
    intro: "Turn a syllabus into visible progress.",
    steps: [
      {
        title: "Read real topic coverage.",
        body: "This course summary counts ticked topics and completed units. It is different from Home's unit-state average. The little spines follow each unit's state.",
        target: '[data-testid="subject-progress"]',
      },
      {
        title: "Open a unit like a book.",
        body: "Tap a unit title to show or hide its topics. Completed units may start collapsed. Opening a unit changes only its display, not your study progress.",
        target: '[data-tour="unit-heading"]',
      },
      {
        title: "Choose the unit state carefully.",
        body: "Start, Studying and Done are bulk states. Done ticks the whole unit; Start clears its covered topics. Use individual topic checkboxes for precise coverage.",
        target: '[data-tour="unit-status"]',
      },
      {
        title: "Tick topics as you study.",
        body: "Pages to cover is the real checklist. Ticking a topic records study activity and feeds later review. If this unit is collapsed, close the tour, open its title and replay here to see the checkboxes.",
        target: '[data-tour="unit-topics"]',
        fallback: '[data-tour="unit-heading"]',
      },
      {
        title: "Ribbons mean solved practice.",
        body: "Paper year ribbons mark PYQ practice you solved. They do not open or download question papers. Find paper links and other material in the Library.",
        target: '[data-tour="unit-pyq"]',
        fallback: '[data-tour="unit-heading"]',
      },
      {
        title: "Keep resources beside your course.",
        body: "The resource shelf holds links for this course. Open a link to view its material; external sites may need internet. Add missing links in Library.",
        target: '[data-tour="course-resources"]',
      },
    ],
  },
};

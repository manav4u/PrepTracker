export interface GuideStep {
  title: string;
  body: string;
  image?: string;
  alt?: string;
  caption?: string;
  tip?: string;
  focus?: string;
  diagram?: "local" | "review" | "offline";
}
export interface GuideChapter {
  id: string;
  number: string;
  title: string;
  summary: string;
  category: string;
  minutes: number;
  destination: string;
  destinationLabel: string;
  steps: GuideStep[];
  takeaway: string;
  keywords: string;
}
const PLAN_CHAPTER: GuideChapter[] = [
  {
    id: "daily-plan",
    number: "04",
    title: "Know what to study today.",
    summary:
      "Turn each exam date into a manageable topic target. See what counts, and what does not.",
    category: "Your daily rhythm",
    minutes: 3,
    destination: "/app/revise?tab=plan",
    destinationLabel: "Open Plan",
    keywords: "revise daily goal extra target midnight exam dates",
    takeaway:
      "Each subject has its own goal. Extra work in Maths never fills the Physics goal.",
    steps: [
      {
        title: "Give each subject its own date.",
        body: "In Settings, open Exam date per subject. Set the actual exam date for each course. First exam date controls the Home countdown; it does not replace these individual dates.",
        image: "plan-dates.webp",
        alt: "Settings with separate exam date fields for Engineering Mathematics I and Engineering Physics.",
        caption: "Settings → Your profile → Exam date per subject",
        focus:
          "Expand Exam date per subject, then set a date beside each course.",
        tip: "No date? That subject stays outside Plan. PrepTracker never guesses an exam date.",
      },
      {
        title: "Open Revise, then Plan.",
        body: "Your unticked topics are divided across the study days before each exam. When an exam is at least six days away, two days are kept back for revision. Topics differ in size, so treat the number as an estimate, not a timetable.",
        image: "plan-goal.webp",
        alt: "Example daily Plan showing 4 done of 8, 4 left and 3 extra topics studied.",
        caption: "Revise → Plan · demonstration data",
        tip: "This topic target is different from the 5-study-action goal on Home.",
      },
      {
        title: "Tick the topic you actually covered.",
        body: "Tap a topic in Plan to mark it done. The same tick appears inside the subject on your shelf. You can also study and tick topics from the subject page. Tap again to undo a tick.",
        image: "plan-topics.webp",
        alt: "Plan topic checklist split between Engineering Mathematics I and Engineering Physics.",
        caption: "One shared checklist, wherever you study",
        tip: "A task checkbox is separate. Completing a task does not tick syllabus topics for you.",
      },
      {
        title: "Read the total honestly.",
        body: "Done of counts work up to each subject’s target. Anything beyond a subject’s target appears as +extra, without replacing another subject’s work. The plan updates at local midnight and when you change subjects or exam dates.",
        image: "plan-goal.webp",
        alt: "Daily goal progress bar is half complete even though extra Maths topics have been studied.",
        caption: "4 credited + 3 extra ≠ 7 of 8",
        tip: "On exam day, no new target is set for that subject. Open Review instead. Past dates are shown separately, not called missing.",
      },
    ],
  },
];

const OTHER_CHAPTERS: GuideChapter[] = [
  {
    id: "get-started",
    number: "01",
    title: "Set up your study shelf.",
    summary:
      "Choose the right year and courses. No account or sign-up required.",
    category: "Start here",
    minutes: 2,
    destination: "/onboarding",
    destinationLabel: "Open setup",
    takeaway:
      "Pick the subjects you actually study. Your shelf is personal to this browser.",
    keywords:
      "onboarding first year second third FE SE TE branch semester course elective avatar restore",
    steps: [
      {
        title: "Start with your name.",
        body: "From the landing page, choose Start tracking. Enter the name you want to see in your greeting. Choose avatar is optional. You can change your name and avatar in Settings later.",
        image: "setup-name.webp",
        alt: "PrepTracker example: Start with your name.",
        caption: "Demonstration account · Aarya",
        focus: "Type your name, then choose Continue.",
      },
      {
        title: "Choose your year.",
        body: "First year uses a five-subject picker. Second and third year continue through branch, semester and course choices. Choose only from the available options; an unavailable branch is not a working tracker.",
        image: "setup-year.webp",
        alt: "PrepTracker example: Choose your year.",
        caption: "Demonstration account · Aarya",
        tip: "The app supports the courses shown in setup, not every SPPU course or year.",
      },
      {
        title: "Check the courses before you start.",
        body: "In first year, select one course from each pair. In later years, core courses start selected; choose the courses and electives on your timetable. Only one course in an elective group can be selected. Finish with Start.",
        image: "setup-choice.webp",
        alt: "PrepTracker example: Check the courses before you start.",
        caption: "Demonstration account · Aarya",
        tip: "Already have a backup? Use Been here before? Restore from a backup on the name screen instead of starting again.",
        focus:
          "A light card with a tick is selected. Tap another course to change it.",
      },
    ],
  },
  {
    id: "home",
    number: "02",
    title: "Read your Home at a glance.",
    summary:
      "Unit progress, topic coverage, study actions and dates tell different parts of the story.",
    category: "Find your bearings",
    minutes: 2,
    destination: "/app",
    destinationLabel: "Open Home",
    takeaway:
      "Home is your overview. Open a course to record syllabus progress.",
    keywords:
      "dashboard progress average units mastered activity streak goal heatmap exam timeline",
    steps: [
      {
        title: "Read unit progress as an overview.",
        body: "Overall Progress averages the unit-state scores across your selected subjects: Start contributes 0, Studying 33 and Done 100 per unit. Units Mastered counts units marked Done. This overview is not the topic-coverage percentage shown inside a course.",
        image: "overall-progress.webp",
        alt: "PrepTracker example: Read unit progress as an overview.",
        caption: "Demonstration account · Aarya",
        tip: "Home shows progress. The actual topic checklist lives inside each course.",
      },
      {
        title: "Separate actions from topics.",
        body: "Study Streak shows consecutive study days, plus today’s actions toward a 5-action goal. Ticking a new topic, changing a unit state, marking a PYQ solved or answering a review records activity. Merely opening the app does not.",
        image: "home-stats.webp",
        alt: "PrepTracker example: Separate actions from topics.",
        caption: "Demonstration account · Aarya",
        tip: "The 5-action goal is not your Plan target. One unit Done action can cover several topics.",
      },
      {
        title: "Look back at a study day.",
        body: "The activity calendar shows your study days. Select a day to see the recorded work for that date. Last 7 days is an activity graph, not a forecast or a measure of hours studied.",
        image: "activity.webp",
        alt: "PrepTracker example: Look back at a study day.",
        caption: "Demonstration account · Aarya",
        focus:
          "Tap a day in the activity calendar. Keyboard users can move with arrow keys.",
      },
      {
        title: "Open your next course.",
        body: "Under Active Courses, open a subject card to see its units and topics. The Exam Timeline uses your individual subject dates from Settings. A timeline item opens that subject.",
        image: "courses.webp",
        alt: "PrepTracker example: Open your next course.",
        caption: "Demonstration account · Aarya",
        tip: "Days to Exam uses First exam date. Plan uses each subject’s exam date. Set both where useful.",
      },
    ],
  },
  {
    id: "syllabus",
    number: "03",
    title: "Turn your syllabus into progress.",
    summary:
      "Tick what you have covered, use unit states carefully, and keep paper practice separate.",
    category: "Your daily rhythm",
    minutes: 3,
    destination: "/app",
    destinationLabel: "Open your shelf",
    takeaway:
      "Tick topics for coverage. Done ticks the whole unit; PYQ ribbons only record solved papers.",
    keywords:
      "topics units start studying done mastered status pyq paper ribbons syllabus courses tick untick",
    steps: [
      {
        title: "Open a unit on your shelf.",
        body: "Open a course from Home. Tap a unit title to expand or collapse its topics. Completed units may start collapsed. Pages to cover is your real syllabus checklist.",
        image: "unit-open.webp",
        alt: "PrepTracker example: Open a unit on your shelf.",
        caption: "Demonstration account · Aarya",
        focus: "Tap the unit title to show or hide its topics.",
      },
      {
        title: "Tick topics as you study them.",
        body: "Tap a topic row after covering it. Tap again to untick it. The coverage percentage uses checked topics, not how long you spent studying. All topics checked makes the unit Done; partial coverage becomes Studying.",
        image: "topics-focus.webp",
        alt: "PrepTracker example: Tick topics as you study them.",
        caption: "Demonstration account · Aarya",
        focus: "Each circle belongs to one topic. A tick means it is covered.",
      },
      {
        title: "Use Start, Studying and Done deliberately.",
        body: "Studying changes the unit state without ticking all its topics. Done ticks every topic in that unit. Start clears the unit’s topic ticks. Use individual topic rows if you only need to correct one item.",
        image: "unit-status.webp",
        alt: "PrepTracker example: Use Start, Studying and Done deliberately.",
        caption: "Demonstration account · Aarya",
        tip: "Start is not just a harmless label change: it clears the unit’s topic checklist.",
        focus:
          "Done is a whole-unit action. Only use it when you covered everything.",
      },
      {
        title: "Mark paper practice, not a download.",
        body: "Under Paper ribbons, tap a year to mark that unit’s questions as solved. Tap again to unmark it. The ribbon is a tracker, not a button that opens a paper. For available paper archives and study links, use Library.",
        image: "pyq.webp",
        alt: "PrepTracker example: Mark paper practice, not a download.",
        caption: "Demonstration account · Aarya",
        tip: "A PYQ tick records practice activity; it does not tick syllabus topics.",
        focus: "A red year ribbon means marked solved.",
      },
    ],
  },
  {
    id: "review",
    number: "05",
    title: "Remember it after you study.",
    summary:
      "Use the Review queue for recall, not for new-topic targets or automatic answers.",
    category: "Your daily rhythm",
    minutes: 3,
    destination: "/app/revise",
    destinationLabel: "Open Review",
    takeaway:
      "Recall first, then answer honestly. Forgot returns tomorrow; Got it spaces the next review out.",
    keywords:
      "revise spaced revision forgot got it undo 3 7 21 daily cap queue due reminder",
    steps: [
      {
        title: "Covered topics join the review cycle.",
        body: "Tick topics on your shelf as you study. Their first recall is due after 3 days. After a successful recall, the next wait is 7 days, then 21 days after the next successful recall. These are gaps between reviews, not dates promised from the first study day.",
        tip: "For old progress without a recorded study date, the first due date starts from when the queue can establish a baseline.",
        diagram: "review",
      },
      {
        title: "Recall the topic from memory.",
        body: "Open Revise → Review. Read the topic, then try to explain or solve it without looking. PrepTracker does not generate a quiz or grade an answer. You decide whether you remembered it.",
        image: "review.webp",
        alt: "PrepTracker example: Recall the topic from memory.",
        caption: "Demonstration account · Aarya",
        focus: "Try recall before tapping either answer.",
      },
      {
        title: "Choose Forgot or Got it.",
        body: "Forgot resets that topic to the first stage and brings it back tomorrow. Got it advances the topic; after the final successful review it leaves the cycle. The queue shows up to 8 reviews per day, with the longest-waiting topics first.",
        image: "review.webp",
        alt: "PrepTracker example: Choose Forgot or Got it.",
        caption: "Demonstration account · Aarya",
        tip: "More due topics can wait until tomorrow. No new target in Plan does not mean there are no reviews due.",
        focus: "Forgot = tomorrow. Got it = the next review stage.",
      },
      {
        title: "Take back a mistaken answer.",
        body: "Use Undo beneath the review card to reverse your last answer. On Home, a once-a-day reminder appears when reviews are due. Later dismisses that reminder; you can still open Revise yourself.",
        image: "review-undo.webp",
        alt: "PrepTracker example: Take back a mistaken answer.",
        caption: "Demonstration account · Aarya",
        focus:
          "Undo reverses the most recent review answer, not the whole session.",
      },
    ],
  },
  {
    id: "tasks",
    number: "06",
    title: "Keep the small jobs moving.",
    summary:
      "Create tasks, link them to a subject, and make an explicit choice about overdue work.",
    category: "Organise your prep",
    minutes: 3,
    destination: "/app/tasks",
    destinationLabel: "Open Tasks",
    takeaway:
      "Tasks organise your jobs. They do not automatically update syllabus coverage or move their own due dates.",
    keywords:
      "todo tasks title priority critical normal low category due date edit delete swipe undo carried over move today clear completed",
    steps: [
      {
        title: "Write one clear task.",
        body: "In Tasks, fill Task Title. Pick Priority and Category, and add a due date if needed. Add Task creates it. Critical tasks sort ahead of Normal and Low; completed tasks sit after active ones.",
        image: "task-title.webp",
        alt: "PrepTracker example: Write one clear task.",
        caption: "Demonstration account · Aarya",
        tip: "A task can exist without a subject, unit or due date.",
        focus: "Start with Task Title. The other fields add context.",
      },
      {
        title: "Link a subject or unit if it helps.",
        body: "Choose Subject, then optionally Linked Unit. The subject label stays on the task even when you do not choose a unit. A link adds context; marking the task done does not mark the unit or its topics done.",
        image: "task-link.webp",
        alt: "PrepTracker example: Link a subject or unit if it helps.",
        caption: "Demonstration account · Aarya",
        focus: "Subject comes first. Linked Unit is optional.",
      },
      {
        title: "Finish, edit or remove it.",
        body: "Tap the task’s circle to mark it done or not done. On phone, swipe left on the row for Edit and Delete. On desktop, use the row’s Edit and Delete controls. Edit loads the Add Task form; save your changes there. Filters show All, Active or Completed.",
        image: "task-row.webp",
        alt: "PrepTracker example: Finish, edit or remove it.",
        caption: "Demonstration account · Aarya",
        tip: "Delete and Clear Completed offer a short-lived Undo. Use it before it disappears.",
        focus:
          "Tap the circle to complete. Swipe left on phone to edit or delete.",
      },
      {
        title: "Choose what happens to carried-over work.",
        body: "Unfinished tasks with dates before today appear in Carried over. Their dates stay as you set them. Move to today changes those carried-over tasks to today only when you choose it; nothing is silently rescheduled.",
        image: "task-carry.webp",
        alt: "PrepTracker example: Choose what happens to carried-over work.",
        caption: "Demonstration account · Aarya",
        focus:
          "Move to today is an explicit action, not an automatic rollover.",
      },
    ],
  },
  {
    id: "library",
    number: "07",
    title: "Keep useful material close.",
    summary:
      "Find study links for your courses, add your own, and understand what opens outside the app.",
    category: "Organise your prep",
    minutes: 2,
    destination: "/app/resources",
    destinationLabel: "Open Library",
    takeaway:
      "Library stores links, not uploaded files. External material still belongs to its original website.",
    keywords:
      "resources notes videos pdf books library search subject category add custom link select delete hide",
    steps: [
      {
        title: "Narrow the Library to what you need.",
        body: "Use Search resources, the category row and the subject chips to narrow the list. Resource counts and available material depend on your selected subjects. Scroll a chip row sideways if more options are off-screen.",
        image: "library.webp",
        alt: "PrepTracker example: Narrow the Library to what you need.",
        caption: "Demonstration account · Aarya",
        focus: "Search by title, then use subject and category filters.",
      },
      {
        title: "Add a useful link of your own.",
        body: "Choose Add Resource. Enter Resource Title and a Public Access Link, then choose Category and Subject Core. Add to Library saves that link in this browser. It is not a file-upload service.",
        image: "resource-add.webp",
        alt: "PrepTracker example: Add a useful link of your own.",
        caption: "Demonstration account · Aarya",
        tip: "Use a real https:// or http:// link. A saved link does not make private content public or grant access.",
        focus: "Public Access Link should point to the actual resource.",
      },
      {
        title: "Open material at its source.",
        body: "Open a resource card. External links ask before opening a new tab. Supported YouTube links offer cinema mode or Open Externally. The source website controls availability, access and the content itself.",
        image: "library.webp",
        alt: "PrepTracker example: Open material at its source.",
        caption: "Demonstration account · Aarya",
        tip: "Videos, PDFs and external websites generally need an internet connection.",
      },
      {
        title: "Remove items from your own Library.",
        body: "Choose Select, mark the items you do not want, then Delete and confirm. Custom links are removed; built-in links are hidden locally. This does not delete anything from the source website or from other students’ libraries.",
        image: "library.webp",
        alt: "PrepTracker example: Remove items from your own Library.",
        caption: "Demonstration account · Aarya",
        tip: "There is no separate restore-hidden-items button. Save a backup before bulk changes you might want to reverse.",
      },
    ],
  },
  {
    id: "search-updates",
    number: "08",
    title: "Find things without hunting.",
    summary:
      "Search across your selected courses and personal work. Check product news from the bell.",
    category: "Find your bearings",
    minutes: 2,
    destination: "/app",
    destinationLabel: "Open the app",
    takeaway:
      "Search helps you reach a screen. Announcements are in-app news, not a push-notification service.",
    keywords:
      "global search keyboard arrows enter escape announcements updates bell news unread",
    steps: [
      {
        title: "Search from the app header.",
        body: "On phone, tap the search icon near your avatar. On desktop, use the search field in the top bar. Type at least two characters to search selected subjects, unit titles, topics, task text and resource titles or authors.",
        image: "search.webp",
        alt: "PrepTracker example: Search from the app header.",
        caption: "Demonstration account · Aarya",
        focus: "Type at least 2 characters. Results are grouped by type.",
      },
      {
        title: "Choose a result, then act on its screen.",
        body: "Tap a result to open the subject, Tasks or Library screen. Search does not complete or edit anything for you. On keyboard, use Up and Down to choose a result, Enter to open it and Escape to close search.",
        image: "search.webp",
        alt: "PrepTracker example: Choose a result, then act on its screen.",
        caption: "Demonstration account · Aarya",
        tip: "Search is limited to your selected syllabus and stored content. It is not a web search.",
      },
      {
        title: "Open the announcements bell.",
        body: "The bell in the header opens PrepTracker announcements. A dot indicates unread news. Opening the panel marks the current items seen. Any Open link button goes to that announcement’s external link.",
        image: "announcements.webp",
        alt: "PrepTracker example: Open the announcements bell.",
        caption: "Demonstration account · Aarya",
        tip: "No announcements? The panel says so. It is not a promise of live exam alerts or device notifications.",
        focus: "The bell opens in-app updates. Close the panel to return.",
      },
    ],
  },
  {
    id: "settings",
    number: "09",
    title: "Make the app fit your timetable.",
    summary:
      "Update your profile, set exam dates and change courses without starting from scratch.",
    category: "Look after your data",
    minutes: 2,
    destination: "/app/settings",
    destinationLabel: "Open Settings",
    takeaway:
      "First exam date drives the countdown. Individual subject dates drive the timeline and daily Plan.",
    keywords:
      "settings profile name avatar prn student id exam dates first countdown change subjects preserve history erase",
    steps: [
      {
        title: "Edit your name, PRN or avatar.",
        body: "Open Settings from the nav or your avatar. Your Name and Student ID / PRN save as you type. Tap your avatar to choose a different picture and shape. These details stay in this browser’s saved profile.",
        image: "profile.webp",
        alt: "PrepTracker example: Edit your name, PRN or avatar.",
        caption: "Demonstration account · Aarya",
        tip: "PRN is optional. There is no account to sign in to.",
      },
      {
        title: "Set both kinds of exam dates.",
        body: "First exam date is the Home Days to Exam countdown. Expand Exam date per subject to set actual dates for each course. These build the Exam Timeline and daily Plan. Leave a date blank if you do not know it yet.",
        image: "plan-dates.webp",
        alt: "PrepTracker example: Set both kinds of exam dates.",
        caption: "Demonstration account · Aarya",
        focus:
          "Set each course’s own exam date. The countdown date is separate.",
      },
      {
        title: "Change courses, not your whole history.",
        body: "Under Your subjects, choose Change and confirm. Setup opens again. Pick the new courses and finish. Existing profile details, dates and stored study data are kept; your selected shelf changes. Data for a removed subject is not displayed while it is unselected.",
        image: "subjects-change.webp",
        alt: "PrepTracker example: Change courses, not your whole history.",
        caption: "Demonstration account · Aarya",
        tip: "Save a backup before a major change. Do not use Erase all data to change subjects.",
        focus: "Use Change under Your subjects, not the Danger Zone.",
      },
      {
        title: "Treat Erase all data as permanent.",
        body: "The Danger Zone has a separate Erase all data action and confirmation. It wipes local study data, tasks, links and your profile. It is not a reset of just one course. Without a saved backup, erased history cannot be recovered.",
        image: "danger.webp",
        alt: "PrepTracker example: Treat Erase all data as permanent.",
        caption: "Demonstration account · Aarya",
        tip: "Download a backup first if you might want any of this data back.",
        focus:
          "Stop if you only wanted to edit your courses. Use Change subjects instead.",
      },
    ],
  },
  {
    id: "backup-restore",
    number: "10",
    title: "Keep a copy you can trust.",
    summary:
      "Save your work outside the browser, move it to another device, and preview a restore before replacing data.",
    category: "Look after your data",
    minutes: 3,
    destination: "/app/settings",
    destinationLabel: "Open backup settings",
    takeaway:
      "A backup file is your transfer and recovery path. Restoring replaces local data; it does not merge devices.",
    keywords:
      "backup restore export import json share download local sync lost data storage save failure undo replace",
    steps: [
      {
        title: "Know where your work lives.",
        body: "PrepTracker saves to this browser’s site data. Another device, browser, profile or preview address has its own separate data. There is no automatic account sync. Clearing site data or losing the browser can erase your work.",
        tip: "A bookmark, installed app icon or screenshot is not a backup of your study data.",
        diagram: "local",
      },
      {
        title: "Save a backup outside the browser.",
        body: "In Settings → Data Portability, choose Save Backup. If file sharing is supported, the button reads Share Backup; choose a destination and actually save the JSON file. Download file instead is available there too. Keep a copy somewhere you can find again.",
        image: "backup-controls.webp",
        alt: "PrepTracker example: Save a backup outside the browser.",
        caption: "Demonstration account · Aarya",
        tip: "The file includes your profile, topic progress, tasks, custom links, hidden resources and review schedule, plus any saved marks. Keep it private.",
        focus:
          "Save Backup downloads a JSON file. Share Backup opens your device’s share sheet.",
      },
      {
        title: "Preview a restore before confirming.",
        body: "Choose Restore Backup and select a PrepTracker JSON file. Read the counts and any warnings. Restoring replaces this browser’s saved data; it does not combine it with the file. Cancel if it is not the right backup. On a fresh device, restore is also available on the setup name screen.",
        image: "restore.webp",
        alt: "PrepTracker example: Preview a restore before confirming.",
        caption: "Demonstration account · Aarya",
        tip: "Older backups may lack progress or review history. A restore cannot recreate data that was never in the file.",
        focus:
          "Check the preview, then confirm only if this is the copy you want.",
      },
      {
        title: "Undo a restore or handle a failed save.",
        body: "After a restore, Settings offers Undo last restore using the saved previous copy. This is not unlimited version history. If Settings reports a save failed or storage is full, save a backup of the available data promptly and free browser space carefully. Do not clear this site before saving a usable copy.",
        image: "backup.webp",
        alt: "PrepTracker example: Undo a restore or handle a failed save.",
        caption: "Demonstration account · Aarya",
        tip: "Preview data and production data are separate. A guide screenshot is never a recovery copy.",
      },
    ],
  },
  {
    id: "offline-privacy",
    number: "11",
    title: "Use it on your own terms.",
    summary:
      "Understand installation, offline limits and privacy before relying on them.",
    category: "Look after your data",
    minutes: 2,
    destination: "/app",
    destinationLabel: "Open the app",
    takeaway:
      "Local data is not cloud sync. Cached screens are not offline copies of every linked resource.",
    keywords:
      "offline install pwa home screen safari chrome privacy cookies consent analytics data troubleshoot browser missing course",
    steps: [
      {
        title: "Install through your browser, if offered.",
        body: "PrepTracker has a web app manifest. A compatible browser may offer Install app or Add to Home Screen in its menu or share sheet. The label and availability depend on your browser and device. Installation does not create an account or add cloud backup.",
        tip: "If no install option appears, keep using the website. The guide does not promise a native app-store app.",
        diagram: "offline",
      },
      {
        title: "Open the screens you need while online.",
        body: "The app caches its shell and fetched build files. After an online visit, some previously loaded screens can reopen offline. New screens, uncached course data, guide pictures, videos and external resources may still need the internet. Do not rely on your first visit working offline.",
        tip: "Before going offline, visit the screens you need, check them offline on your device and keep a backup.",
        diagram: "offline",
      },
      {
        title: "Choose optional analytics for yourself.",
        body: "The cookie banner lets you Accept, Reject or review choices. Optional analytics stays off until accepted. Necessary browser storage holds study data. Local storage means your study tracker is local; it does not mean the site makes no network requests.",
        image: "consent.webp",
        alt: "PrepTracker example: Choose optional analytics for yourself.",
        caption: "Demonstration account · Aarya",
        tip: "External resource sites have their own privacy terms. Check the site’s privacy policy for details.",
      },
      {
        title: "If something looks missing, check the basics.",
        body: "Confirm you are using the same site address, browser and browser profile. Check selected courses in Settings and filters in Library or Tasks. A missing course is not evidence that the whole browser history is lost. If the data really is gone, restore your saved backup; there is no server account copy to fetch.",
        tip: "Do not erase site data as your first troubleshooting step. Save what you still have first.",
        diagram: "local",
      },
    ],
  },
];
export const GUIDE_CHAPTERS = [...OTHER_CHAPTERS, ...PLAN_CHAPTER].sort(
  (a, b) => a.number.localeCompare(b.number),
);

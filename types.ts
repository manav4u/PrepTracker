
export enum UnitStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  REVISION = 'Revision',
  MASTERED = 'Mastered'
}

export interface Unit {
  id: string;
  unit_number: number;
  title: string;
  weightage?: number; 
  hours?: number;
  topics: string[]; 
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  theoryCredits?: number; // credits for the theory head (CCE 30 + end-sem 70); FE only
  termWorkCredits?: number; // credits for the term work head (25 marks); FE only
  units: Unit[];
  common?: boolean;
  // Present on catalog courses (SE and TE). First-year subjects in constants.tsx omit them.
  year?: 'FE' | 'SE' | 'TE';
  branch?: string;
  branchSlug?: string;
  semester?: number;
  type?: string; // Core, Minor, Elective
  electiveGroup?: string; // one course per group
  trackerReady?: boolean; // false = reference only
  draft?: boolean;
  source?: string; // official SPPU PDF the text comes from
  sourceLabel?: string;
}

export interface PYQ {
  id: string;
  year: string;
  session: 'Dec' | 'May';
  completed: boolean;
}

export interface UserProgress {
  unitId: string;
  status: UnitStatus;
  pyqsCompleted: string[]; 
  topicsDone?: string[];
}

export interface StudyEvent {
  day: string; // local day key YYYY-MM-DD
  subjectId: string;
  unitId?: string;
  topic?: string; // topic name, or PYQ year for kind 'pyq'
  kind: 'topic' | 'unit' | 'pyq' | 'review';
}

export interface Profile {
  name: string;
  prn?: string;
  theme: 'light' | 'dark';
  selectedSubjects: string[]; 
  setupComplete: boolean;
  group?: 'A' | 'B'; 
  streak: number;
  lastStudyDate: string; // ISO date string
  activity?: Record<string, number>; // study actions per local day, last 60 days
  events?: StudyEvent[]; // what was studied, per action, last 60 days
  examStartDate?: string; // YYYY-MM-DD, set by the student
  examDates?: Record<string, string>; // subjectId -> YYYY-MM-DD, set by the student
}

export interface ResourceItem {
  id: string;
  type: 'video' | 'pdf' | 'book' | 'link';
  title: string;
  author: string;
  downloads: string;
  subject: string;
  category: string;
  url: string;
  isSystem?: boolean;
  /** Branch archive link: matches every course in this branch file. */
  branchSlug?: string;
}

export type Priority = 'CRITICAL' | 'NORMAL' | 'LOW';
export type TaskCategory = 'EXAM' | 'LAB' | 'SUBMISSION' | 'GENERAL';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: TaskCategory;
  dueDate?: string;
  unitId?: string; // optional link to a syllabus unit
  createdAt: string;
}

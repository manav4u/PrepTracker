
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
  topics: string[]; 
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  theoryCredits: number; // credits for the theory head (CCE 30 + end-sem 70)
  termWorkCredits: number; // credits for the term work head (25 marks)
  units: Unit[];
  common?: boolean;
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

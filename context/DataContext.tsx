import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { Profile, UserProgress, Task, ResourceItem } from "../types";
import { SYSTEM_RESOURCES } from "../constants";
import { migrateLearning } from "../lib/learning.mjs";
import { KEYS } from "../lib/backup.mjs";
import { persistStudy } from "../lib/study-storage.mjs";
import { writeLocal, writeLocalBatch } from "../lib/local-write.mjs";

export type PlanEntry = {
  id: string;
  topicId: string;
  courseId: string;
  label: string;
  date: string;
  minutes: number;
  reason: string;
  status: "planned" | "done" | "skipped";
};
export type RecallOutcome = "again" | "hint" | "solo";
export type TopicState = {
  status?: "not-started" | "studying" | "done";
  confidence?: "low" | "medium" | "high";
  lastRevised?: string;
  lastAttempt?: string;
  outcome?: RecallOutcome;
  nextReview?: string | null;
};
export type ComparisonReference = {
  kind: "user" | "reviewed";
  label: string;
  text: string;
  url?: string;
};
export type AttemptRecord = {
  id: string;
  topicId: string;
  courseId: string;
  unitId: string;
  goal: string;
  answer: string;
  paper: boolean;
  outcome: RecallOutcome;
  reference: ComparisonReference;
  day: string;
  at: string;
  review: string | null;
  before: TopicState | null;
};
export type StudyState = {
  schemaVersion?: 2;
  attempts?: AttemptRecord[];
  marksConfig?: { semester: 1 | 2; workshop: "workshop" | "design" };
  plan?: PlanEntry[];
  budget?: { minutes: number; sessionMinutes: number };
  topics: Record<string, TopicState>;
  events: {
    id: string;
    topicId: string;
    day: string;
    at: string;
    kind: "revision";
    confidence: "low" | "medium" | "high";
  }[];
};
interface DataContextType {
  study: StudyState;
  commitStudy: React.Dispatch<React.SetStateAction<StudyState>>;
  setStudy: React.Dispatch<React.SetStateAction<StudyState>>;
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  userProgress: UserProgress[];
  setUserProgress: (progress: UserProgress[]) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  resources: ResourceItem[];
  addResource: (resource: ResourceItem) => void;
  deleteResources: (ids: string[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [study, setStudyState] = useState<StudyState>(() => {
    try {
      return migrateLearning(
        JSON.parse(
          localStorage.getItem(KEYS.study) || '{"topics":{},"events":[]}',
        ),
      );
    } catch {
      return { topics: {}, events: [] };
    }
  });
  const studyRef = useRef(study);
  const [studyError, setStudyError] = useState("");
  const commitStudy = useCallback<
    React.Dispatch<React.SetStateAction<StudyState>>
  >((action) => {
    const next =
      typeof action === "function" ? action(studyRef.current) : action;
    persistStudy(localStorage, next);
    studyRef.current = next;
    setStudyState(next);
    setStudyError("");
  }, []);
  const setStudy = useCallback<
    React.Dispatch<React.SetStateAction<StudyState>>
  >(
    (action) => {
      try {
        commitStudy(action);
      } catch (e) {
        setStudyError(
          e instanceof Error ? e.message : "Could not save study changes.",
        );
      }
    },
    [commitStudy],
  );
  const [profile, setProfileState] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem(KEYS.profile);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse profile from local storage", e);
      return null;
    }
  });

  const [userProgress, setUserProgressState] = useState<UserProgress[]>(() => {
    try {
      const saved = localStorage.getItem(KEYS.progress);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse progress from local storage", e);
      return [];
    }
  });

  const [tasks, setTasksState] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(KEYS.tasks);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse tasks from local storage", e);
      return [];
    }
  });

  const [customResources, setCustomResources] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem(KEYS.resources);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse custom resources from local storage", e);
      return [];
    }
  });

  const [deletedResourceIds, setDeletedResourceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(KEYS.hiddenResourceIds);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(
        "Failed to parse deleted resource ids from local storage",
        e,
      );
      return [];
    }
  });

  // Computed resources: System (minus deleted) + Custom
  const resources = [
    ...SYSTEM_RESOURCES.filter((r) => !deletedResourceIds.includes(r.id)),
    ...customResources,
  ];

  const profileRef = useRef(profile),
    progressRef = useRef(userProgress),
    tasksRef = useRef(tasks),
    resourcesRef = useRef(customResources),
    hiddenRef = useRef(deletedResourceIds);
  const setProfile = (p: Profile) => {
    try {
      writeLocal(localStorage, KEYS.profile, p);
      profileRef.current = p;
      setProfileState(p);
      setStudyError("");
    } catch (e) {
      setStudyError((e as Error).message);
    }
  };
  const setUserProgress = (p: UserProgress[]) => {
    try {
      writeLocal(localStorage, KEYS.progress, p);
      progressRef.current = p;
      setUserProgressState(p);
      setStudyError("");
    } catch (e) {
      setStudyError((e as Error).message);
    }
  };
  const setTasks: React.Dispatch<React.SetStateAction<Task[]>> = (action) => {
    const next =
      typeof action === "function" ? action(tasksRef.current) : action;
    writeLocal(localStorage, KEYS.tasks, next);
    tasksRef.current = next;
    setTasksState(next);
    setStudyError("");
  };
  const addResource = (res: ResourceItem) => {
    const next = [res, ...resourcesRef.current];
    writeLocal(localStorage, KEYS.resources, next);
    resourcesRef.current = next;
    setCustomResources(next);
  };
  const deleteResources = (ids: string[]) => {
    const next = resourcesRef.current.filter((r) => !ids.includes(r.id)),
      hidden = Array.from(
        new Set([
          ...hiddenRef.current,
          ...ids.filter((id) => SYSTEM_RESOURCES.some((r) => r.id === id)),
        ]),
      );
    writeLocalBatch(localStorage, [
      [KEYS.resources, next],
      [KEYS.hiddenResourceIds, hidden],
    ]);
    resourcesRef.current = next;
    hiddenRef.current = hidden;
    setCustomResources(next);
    setDeletedResourceIds(hidden);
  };

  return (
    <DataContext.Provider
      value={{
        study,
        setStudy,
        commitStudy,
        profile,
        setProfile,
        userProgress,
        setUserProgress,
        tasks,
        setTasks,
        resources,
        addResource,
        deleteResources,
      }}
    >
      {studyError && (
        <p className="study-storage-error" role="alert">
          {studyError}
        </p>
      )}
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

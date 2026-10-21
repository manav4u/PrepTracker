
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, UserProgress, Task, ResourceItem } from '../types';
import { SYSTEM_RESOURCES } from '../constants';
import { MarksMap, cleanMarks } from '../lib/grading';
import { Reviews, cleanReviews } from '../lib/revision';
import { persist } from '../lib/persist';

interface DataContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  userProgress: UserProgress[];
  setUserProgress: (progress: UserProgress[]) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  reviews: Reviews;
  setReviews: React.Dispatch<React.SetStateAction<Reviews>>;
  marks: MarksMap;
  setMarks: React.Dispatch<React.SetStateAction<MarksMap>>;
  resources: ResourceItem[];
  storageFull: boolean;
  addResource: (resource: ResourceItem) => void;
  deleteResources: (ids: string[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// The landing prerenders server-side at build time, where localStorage does
// not exist; initializers skip it quietly instead of tripping the catch.
const storageAvailable = () => typeof localStorage !== 'undefined';

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<Profile | null>(() => {
    try {
      if (!storageAvailable()) return null;
      const saved = localStorage.getItem('sppu_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse profile from local storage", e);
      return null;
    }
  });

  const [userProgress, setUserProgressState] = useState<UserProgress[]>(() => {
    try {
      if (!storageAvailable()) return [];
      const saved = localStorage.getItem('sppu_progress');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse progress from local storage", e);
        return [];
    }
  });

  const [tasks, setTasksState] = useState<Task[]>(() => {
    try {
      if (!storageAvailable()) return [];
      const saved = localStorage.getItem('sppu_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse tasks from local storage", e);
        return [];
    }
  });

  const [marks, setMarks] = useState<MarksMap>(() => {
    try {
      if (!storageAvailable()) return {};
      const saved = localStorage.getItem('sppu_calculator_marks');
      return saved ? cleanMarks(JSON.parse(saved)) : {};
    } catch (e) {
      console.error("Failed to parse calculator marks from local storage", e);
      return {};
    }
  });

  const [reviews, setReviews] = useState<Reviews>(() => {
    try {
      if (!storageAvailable()) return {};
      const saved = localStorage.getItem('sppu_reviews');
      return saved ? cleanReviews(JSON.parse(saved)) : {};
    } catch (e) {
      console.error("Failed to parse reviews from local storage", e);
      return {};
    }
  });

  const [customResources, setCustomResources] = useState<ResourceItem[]>(() => {
    try {
      if (!storageAvailable()) return [];
      const saved = localStorage.getItem('sppu_custom_resources');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse custom resources from local storage", e);
        return [];
    }
  });

  const [deletedResourceIds, setDeletedResourceIds] = useState<string[]>(() => {
    try {
      if (!storageAvailable()) return [];
      const saved = localStorage.getItem('sppu_deleted_system_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse deleted resource ids from local storage", e);
        return [];
    }
  });

  // Computed resources: System (minus deleted) + Custom
  const resources = [
    ...SYSTEM_RESOURCES.filter(r => !deletedResourceIds.includes(r.id)),
    ...customResources
  ];

  // Persistence Effects. A refused save is remembered per key so the app can say so once.
  const [failed, setFailed] = useState<string[]>([]);
  const save = (key: string, value: unknown) => {
    const ok = persist(localStorage, key, value);
    setFailed(f => (ok ? (f.includes(key) ? f.filter(k => k !== key) : f) : (f.includes(key) ? f : [...f, key])));
  };
  useEffect(() => {
    if (profile) save('sppu_profile', profile);
  }, [profile]);

  useEffect(() => {
    save('sppu_progress', userProgress);
  }, [userProgress]);

  useEffect(() => {
    save('sppu_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    save('sppu_calculator_marks', marks);
  }, [marks]);

  useEffect(() => {
    save('sppu_reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    save('sppu_custom_resources', customResources);
  }, [customResources]);

  useEffect(() => {
    save('sppu_deleted_system_ids', deletedResourceIds);
  }, [deletedResourceIds]);


  // Wrappers
  const setProfile = (p: Profile) => setProfileState(p);
  const setUserProgress = (p: UserProgress[]) => setUserProgressState(p);
  const setTasks = setTasksState; // directly expose setState

  const addResource = (res: ResourceItem) => {
    setCustomResources(prev => [res, ...prev]);
  };

  const deleteResources = (ids: string[]) => {
    // Separate into custom and system
    const customIdsToDelete = ids.filter(id => customResources.some(r => r.id === id));
    const systemIdsToDelete = ids.filter(id => SYSTEM_RESOURCES.some(r => r.id === id));

    if (customIdsToDelete.length > 0) {
      setCustomResources(prev => prev.filter(r => !customIdsToDelete.includes(r.id)));
    }

    if (systemIdsToDelete.length > 0) {
      setDeletedResourceIds(prev => [...prev, ...systemIdsToDelete]);
    }
  };

  return (
    <DataContext.Provider value={{
      profile,
      setProfile,
      userProgress,
      setUserProgress,
      tasks,
      setTasks,
      reviews,
      setReviews,
      marks,
      setMarks,
      resources,
      storageFull: failed.length > 0,
      addResource,
      deleteResources
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

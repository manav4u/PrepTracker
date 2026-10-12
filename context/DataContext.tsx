
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, UserProgress, Task, ResourceItem } from '../types';
import { SYSTEM_RESOURCES } from '../constants';

interface DataContextType {
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
  const [profile, setProfileState] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem('sppu_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse profile from local storage", e);
      return null;
    }
  });

  const [userProgress, setUserProgressState] = useState<UserProgress[]>(() => {
    try {
      const saved = localStorage.getItem('sppu_progress');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse progress from local storage", e);
        return [];
    }
  });

  const [tasks, setTasksState] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('sppu_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse tasks from local storage", e);
        return [];
    }
  });

  const [customResources, setCustomResources] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem('sppu_custom_resources');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse custom resources from local storage", e);
        return [];
    }
  });

  const [deletedResourceIds, setDeletedResourceIds] = useState<string[]>(() => {
    try {
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

  // Persistence Effects
  useEffect(() => {
    if (profile) localStorage.setItem('sppu_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sppu_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('sppu_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sppu_custom_resources', JSON.stringify(customResources));
  }, [customResources]);

  useEffect(() => {
    localStorage.setItem('sppu_deleted_system_ids', JSON.stringify(deletedResourceIds));
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
      resources,
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

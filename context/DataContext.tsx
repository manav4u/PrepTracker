
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, UserProgress, Task, Mark, ResourceItem } from '../types';
import { SYSTEM_RESOURCES } from '../constants';

interface DataContextType {
  profile: Profile | null;
  userProgress: UserProgress[];
  tasks: Task[];
  marks: Record<string, Mark>;
  resources: ResourceItem[];
  setProfile: (profile: Profile | null) => void;
  setUserProgress: (progress: UserProgress[]) => void;
  setTasks: (tasks: Task[]) => void;
  setMarks: (marks: Record<string, Mark>) => void;
  addResource: (resource: ResourceItem) => void;
  deleteResources: (ids: string[]) => void;
  refreshData: () => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [userProgress, setUserProgressState] = useState<UserProgress[]>([]);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [marks, setMarksState] = useState<Record<string, Mark>>({});
  const [resources, setResourcesState] = useState<ResourceItem[]>([]);

  const loadData = () => {
    // 1. Profile
    const savedProfile = localStorage.getItem('sppu_profile');
    if (savedProfile) setProfileState(JSON.parse(savedProfile));

    // 2. Progress
    const savedProgress = localStorage.getItem('sppu_user_progress');
    if (savedProgress) setUserProgressState(JSON.parse(savedProgress));

    // 3. Tasks
    const savedTasks = localStorage.getItem('sppu_tasks');
    if (savedTasks) setTasksState(JSON.parse(savedTasks));

    // 4. Marks
    const savedMarks = localStorage.getItem('sppu_calculator_marks');
    if (savedMarks) setMarksState(JSON.parse(savedMarks));

    // 5. Resources (System + Custom - DeletedSystem)
    const deletedSystemIdsRaw = localStorage.getItem('sppu_deleted_system_ids');
    const deletedSystemIds: string[] = deletedSystemIdsRaw ? JSON.parse(deletedSystemIdsRaw) : [];

    const savedCustomRaw = localStorage.getItem('sppu_custom_resources');
    const customResources: ResourceItem[] = savedCustomRaw ? JSON.parse(savedCustomRaw) : [];

    const activeSystemResources = SYSTEM_RESOURCES.filter(r => !deletedSystemIds.includes(r.id));
    setResourcesState([...activeSystemResources, ...customResources]);
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('sppu_')) {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setProfile = (newProfile: Profile | null) => {
    setProfileState(newProfile);
    if (newProfile) {
      localStorage.setItem('sppu_profile', JSON.stringify(newProfile));
    } else {
      localStorage.removeItem('sppu_profile');
    }
  };

  const setUserProgress = (newProgress: UserProgress[]) => {
    setUserProgressState(newProgress);
    localStorage.setItem('sppu_user_progress', JSON.stringify(newProgress));
  };

  const setTasks = (newTasks: Task[]) => {
    setTasksState(newTasks);
    localStorage.setItem('sppu_tasks', JSON.stringify(newTasks));
  };

  const setMarks = (newMarks: Record<string, Mark>) => {
    setMarksState(newMarks);
    localStorage.setItem('sppu_calculator_marks', JSON.stringify(newMarks));
  };

  const addResource = (resource: ResourceItem) => {
    const savedCustomRaw = localStorage.getItem('sppu_custom_resources');
    const customResources: ResourceItem[] = savedCustomRaw ? JSON.parse(savedCustomRaw) : [];
    const updated = [...customResources, resource];
    localStorage.setItem('sppu_custom_resources', JSON.stringify(updated));
    loadData();
  };

  const deleteResources = (ids: string[]) => {
    // Handle custom resources
    const savedCustomRaw = localStorage.getItem('sppu_custom_resources');
    const customResources: ResourceItem[] = savedCustomRaw ? JSON.parse(savedCustomRaw) : [];
    const updatedCustom = customResources.filter(r => !ids.includes(r.id));
    localStorage.setItem('sppu_custom_resources', JSON.stringify(updatedCustom));

    // Handle system resources
    const systemIdsToDelete = SYSTEM_RESOURCES.filter(r => ids.includes(r.id)).map(r => r.id);
    if (systemIdsToDelete.length > 0) {
      const deletedSystemIdsRaw = localStorage.getItem('sppu_deleted_system_ids');
      const deletedSystemIds: string[] = deletedSystemIdsRaw ? JSON.parse(deletedSystemIdsRaw) : [];
      const updatedSystemDeletions = Array.from(new Set([...deletedSystemIds, ...systemIdsToDelete]));
      localStorage.setItem('sppu_deleted_system_ids', JSON.stringify(updatedSystemDeletions));
    }

    loadData();
  };

  const clearAllData = () => {
    localStorage.removeItem('sppu_profile');
    localStorage.removeItem('sppu_user_progress');
    localStorage.removeItem('sppu_tasks');
    localStorage.removeItem('sppu_calculator_marks');
    localStorage.removeItem('sppu_custom_resources');
    localStorage.removeItem('sppu_deleted_system_ids');
    setProfileState(null);
    setUserProgressState([]);
    setTasksState([]);
    setMarksState({});
    setResourcesState(SYSTEM_RESOURCES);
  };

  return (
    <DataContext.Provider value={{
      profile, userProgress, tasks, marks, resources,
      setProfile, setUserProgress, setTasks, setMarks, addResource, deleteResources,
      refreshData: loadData,
      clearAllData
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

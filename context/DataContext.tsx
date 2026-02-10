
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, UserProgress, Task, Mark } from '../types';

interface DataContextType {
  profile: Profile | null;
  userProgress: UserProgress[];
  tasks: Task[];
  marks: Record<string, Mark>;
  setProfile: (profile: Profile | null) => void;
  setUserProgress: (progress: UserProgress[]) => void;
  setTasks: (tasks: Task[]) => void;
  setMarks: (marks: Record<string, Mark>) => void;
  refreshData: () => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [userProgress, setUserProgressState] = useState<UserProgress[]>([]);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [marks, setMarksState] = useState<Record<string, Mark>>({});

  const loadData = () => {
    const savedProfile = localStorage.getItem('sppu_profile');
    if (savedProfile) setProfileState(JSON.parse(savedProfile));

    const savedProgress = localStorage.getItem('sppu_user_progress');
    if (savedProgress) setUserProgressState(JSON.parse(savedProgress));

    const savedTasks = localStorage.getItem('sppu_tasks');
    if (savedTasks) setTasksState(JSON.parse(savedTasks));

    const savedMarks = localStorage.getItem('sppu_calculator_marks');
    if (savedMarks) setMarksState(JSON.parse(savedMarks));
  };

  useEffect(() => {
    loadData();

    // Optional: Listen for storage events for multi-tab sync (though less critical for SPA)
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
  };

  return (
    <DataContext.Provider value={{
      profile, userProgress, tasks, marks,
      setProfile, setUserProgress, setTasks, setMarks,
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

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Subject } from '../types';
import { SUBJECTS } from '../constants';
import { branchesFor } from '../lib/catalog';
import { CATALOG_INDEX, loadBranch } from '../lib/catalogLoader';
import { useData } from './DataContext';

// Every subject the app can show: first year from constants.tsx, and the branches the student picked,
// loaded on demand. `ready` is true once every picked branch has arrived (or failed).
interface SubjectsContextType {
  subjects: Subject[];
  ready: boolean;
  failed: string[];
  retry: () => void;
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export const SubjectsProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useData();
  const picked = profile?.selectedSubjects;
  const needed = useMemo(() => branchesFor(CATALOG_INDEX, picked || []), [picked]);
  const [loaded, setLoaded] = useState<Record<string, Subject[]>>({});
  const [failed, setFailed] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    for (const slug of needed) {
      if (loaded[slug]) continue;
      loadBranch(slug).then(
        subs => { if (live) { setLoaded(l => (l[slug] ? l : { ...l, [slug]: subs })); setFailed(f => f.filter(x => x !== slug)); } },
        () => { if (live) setFailed(f => (f.includes(slug) ? f : [...f, slug])); },
      );
    }
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needed, attempt]);

  const subjects = useMemo(() => [...SUBJECTS, ...Object.values(loaded).flat()], [loaded]);
  const ready = needed.every(s => loaded[s] || failed.includes(s));
  const value = useMemo(() => ({ subjects, ready, failed, retry: () => setAttempt(a => a + 1) }), [subjects, ready, failed]);

  return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>;
};

export const useSubjects = () => {
  const ctx = useContext(SubjectsContext);
  if (!ctx) throw new Error('useSubjects must be used within a SubjectsProvider');
  return ctx;
};

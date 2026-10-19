import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SYSTEM_RESOURCES } from '../../constants';
import { useSubjects } from '../../context/SubjectsContext';
import { useData } from '../../context/DataContext';
import { recordStudy } from '../../lib/activity';
import { resourceMatchesSubject } from '../../lib/resources';
import { ResourceItem, UnitStatus } from '../../types';

/** All subject-page state and mutations, shared by the page concepts. */
export function useSubjectDetail() {
  const { id } = useParams();
  const { userProgress, setUserProgress, profile, setProfile } = useData();
  const { subjects: allSubjects, ready: subjectsReady } = useSubjects();
  const subject = allSubjects.find(s => s.id === id);

  const [subjectResources, setSubjectResources] = useState<ResourceItem[]>([]);
  const [viewResource, setViewResource] = useState<ResourceItem | null>(null);
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!subject) return;
    const relevantSystem = SYSTEM_RESOURCES.filter(r => resourceMatchesSubject(r, subject));
    let relevantCustom: ResourceItem[] = [];
    try {
      const savedCustomRaw = localStorage.getItem('sppu_custom_resources');
      if (savedCustomRaw) {
        const allCustom: ResourceItem[] = JSON.parse(savedCustomRaw);
        relevantCustom = allCustom.filter(r => resourceMatchesSubject(r, subject));
      }
    } catch (e) {}
    let finalSystem = relevantSystem;
    try {
      const deletedIdsRaw = localStorage.getItem('sppu_deleted_system_ids');
      if (deletedIdsRaw) {
        const deletedIds: string[] = JSON.parse(deletedIdsRaw);
        finalSystem = relevantSystem.filter(r => !deletedIds.includes(r.id));
      }
    } catch (e) {}
    setSubjectResources([...finalSystem, ...relevantCustom]);
  }, [subject]);

  const totalTopics = subject ? subject.units.reduce((n, u) => n + (u.topics?.length || 0), 0) : 0;
  const coveredTopics = subject
    ? subject.units.reduce((n, u) => n + (userProgress.find(p => p.unitId === u.id)?.topicsDone || []).filter(t => (u.topics || []).includes(t)).length, 0)
    : 0;
  const coveredPct = totalTopics ? Math.round((coveredTopics / totalTopics) * 100) : 0;
  const masteredUnits = subject ? subject.units.filter(u => userProgress.find(p => p.unitId === u.id)?.status === UnitStatus.MASTERED).length : 0;

  const getProg = (uId: string) =>
    userProgress.find(p => p.unitId === uId) || { unitId: uId, status: UnitStatus.NOT_STARTED, pyqsCompleted: [] as string[], topicsDone: [] as string[] };

  const updateStatus = (uId: string, status: UnitStatus) => {
    if (!subject) return;
    const idx = userProgress.findIndex(p => p.unitId === uId);
    let next: typeof userProgress = [];
    const unitTopics = subject.units.find(u => u.id === uId)?.topics || [];
    const patch = status === UnitStatus.MASTERED ? { topicsDone: [...unitTopics] } : status === UnitStatus.NOT_STARTED ? { topicsDone: [] as string[] } : {};
    if (idx > -1) {
      next = [...userProgress];
      next[idx] = { ...next[idx], status, ...patch };
    } else {
      next = [...userProgress, { unitId: uId, status, pyqsCompleted: [], ...patch }];
    }
    setUserProgress(next);
    if (profile) setProfile(recordStudy(profile, new Date(), { subjectId: subject.id, unitId: uId, kind: 'unit' }));
  };

  const toggleTopic = (uId: string, topic: string, allTopics: string[]) => {
    if (!subject) return;
    const idx = userProgress.findIndex(p => p.unitId === uId);
    const cur = idx > -1 ? userProgress[idx] : { unitId: uId, status: UnitStatus.NOT_STARTED, pyqsCompleted: [] as string[], topicsDone: [] as string[] };
    const done = cur.topicsDone || [];
    const nowDone = done.includes(topic);
    const topicsDone = nowDone ? done.filter(t => t !== topic) : [...done, topic];
    let status = cur.status;
    if (topicsDone.length === allTopics.length) status = UnitStatus.MASTERED;
    else if (topicsDone.length > 0) status = UnitStatus.IN_PROGRESS;
    else if (status === UnitStatus.MASTERED) status = UnitStatus.IN_PROGRESS;
    const row = { ...cur, status, topicsDone };
    const next = idx > -1 ? userProgress.map((p, i) => (i === idx ? row : p)) : [...userProgress, row];
    setUserProgress(next);
    if (!nowDone && profile) setProfile(recordStudy(profile, new Date(), { subjectId: subject.id, unitId: uId, topic, kind: 'topic' }));
  };

  const togglePyq = (uId: string, year: string) => {
    if (!subject) return;
    const idx = userProgress.findIndex(p => p.unitId === uId);
    let next: typeof userProgress = [];
    let marked = false;
    if (idx > -1) {
      next = [...userProgress];
      const currentPyqs = next[idx].pyqsCompleted || [];
      const isCompleted = currentPyqs.includes(year);
      marked = !isCompleted;
      next[idx] = { ...next[idx], pyqsCompleted: isCompleted ? currentPyqs.filter(y => y !== year) : [...currentPyqs, year] };
    } else {
      marked = true;
      next = [...userProgress, { unitId: uId, status: UnitStatus.NOT_STARTED, pyqsCompleted: [year] }];
    }
    setUserProgress(next);
    if (marked && profile) setProfile(recordStudy(profile, new Date(), { subjectId: subject.id, unitId: uId, topic: year, kind: 'pyq' }));
  };

  const isCollapsed = (uId: string, defaultWhenUnset?: boolean) =>
    collapsedUnits[uId] ?? defaultWhenUnset ?? getProg(uId).status === UnitStatus.MASTERED;
  const toggleCollapsed = (uId: string, defaultWhenUnset?: boolean) =>
    setCollapsedUnits(prev => ({ ...prev, [uId]: !isCollapsed(uId, defaultWhenUnset) }));

  return {
    subject, subjectsReady, subjectResources, viewResource, setViewResource,
    totalTopics, coveredTopics, coveredPct, masteredUnits,
    getProg, updateStatus, toggleTopic, togglePyq, isCollapsed, toggleCollapsed,
  };
}

export type SubjectDetailState = ReturnType<typeof useSubjectDetail>;

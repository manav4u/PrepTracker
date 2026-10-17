
import { recordStudy } from '../lib/activity';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  List,
  X,
  Timer,
  Check,
  FileQuestion,
  FileText,
  Video,
  BookOpen,
  Link as LinkIcon,
  Search,
  ArrowUpRight,
  HardDrive, ChevronDown} from 'lucide-react';
import { SUBJECTS, SYSTEM_RESOURCES, getYouTubeID } from '../constants';
import { UnitStatus, ResourceItem } from '../types';
import { useData } from '../context/DataContext';
import ResourceViewerModal from '../components/ResourceViewerModal';

const SubjectDetail: React.FC = () => {
  const { id } = useParams();
  const subject = SUBJECTS.find(s => s.id === id);
  const { userProgress, setUserProgress, profile, setProfile } = useData();

  // Resource State
  const [subjectResources, setSubjectResources] = useState<ResourceItem[]>([]);
  const [viewResource, setViewResource] = useState<ResourceItem | null>(null);
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  // Coming Soon State


  // Load Resources for this subject
  useEffect(() => {
      const fetchResources = async () => {
          if (!subject) return;

          const relevantSystem = SYSTEM_RESOURCES.filter(r =>
              subject.code.startsWith(r.subject) || r.subject === 'GLOBAL'
          );

          let relevantCustom: ResourceItem[] = [];
          try {
              const savedCustomRaw = localStorage.getItem('sppu_custom_resources');
              if (savedCustomRaw) {
                  const allCustom: ResourceItem[] = JSON.parse(savedCustomRaw);
                  relevantCustom = allCustom.filter(r =>
                      subject.code.startsWith(r.subject) || r.subject === 'GLOBAL'
                  );
              }
          } catch(e) {}

          let finalSystem = relevantSystem;
          try {
              const deletedIdsRaw = localStorage.getItem('sppu_deleted_system_ids');
              if (deletedIdsRaw) {
                  const deletedIds: string[] = JSON.parse(deletedIdsRaw);
                  finalSystem = relevantSystem.filter(r => !deletedIds.includes(r.id));
              }
          } catch(e) {}

          setSubjectResources([...finalSystem, ...relevantCustom]);
      };

      fetchResources();
  }, [subject]);

  if (!subject) return <div className="p-20 text-center text-white font-display">Subject not found</div>;

  const totalTopics = subject.units.reduce((n, u) => n + (u.topics?.length || 0), 0);
  const coveredTopics = subject.units.reduce((n, u) => n + (userProgress.find(p => p.unitId === u.id)?.topicsDone || []).filter(t => (u.topics || []).includes(t)).length, 0);
  const coveredPct = totalTopics ? Math.round((coveredTopics / totalTopics) * 100) : 0;

  const getProg = (uId: string) => userProgress.find(p => p.unitId === uId) || { unitId: uId, status: UnitStatus.NOT_STARTED, pyqsCompleted: [] };

  const updateStatus = (uId: string, status: UnitStatus) => {
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

    if (profile) setProfile(recordStudy(profile));
  };

  const toggleTopic = (uId: string, topic: string, allTopics: string[]) => {
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
    if (!nowDone && profile) setProfile(recordStudy(profile));
  };

  const togglePyq = (uId: string, year: string) => {
    const idx = userProgress.findIndex(p => p.unitId === uId);
    let next: typeof userProgress = [];
    let marked = false;
    if (idx > -1) {
        next = [...userProgress];
        const currentPyqs = next[idx].pyqsCompleted || [];
        const isCompleted = currentPyqs.includes(year);
        marked = !isCompleted;
        next[idx] = {
            ...next[idx],
            pyqsCompleted: isCompleted
                ? currentPyqs.filter(y => y !== year)
                : [...currentPyqs, year]
        };
    } else {
        marked = true;
        next = [...userProgress, { unitId: uId, status: UnitStatus.NOT_STARTED, pyqsCompleted: [year] }];
    }
    setUserProgress(next);
    // Finishing a PYQ set is real study work: count it like ticking a topic.
    if (marked && profile) setProfile(recordStudy(profile));
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 relative pb-20">
      
      <ResourceViewerModal isOpen={!!viewResource} onClose={() => setViewResource(null)} resource={viewResource} />

      <div className="mb-8 lg:mb-10">
        <Link to="/app" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
          <div className="max-w-4xl">
            <span className="text-[#F63C49] text-[10px] font-bold tracking-[0.25em] uppercase mb-2 block flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D61A40] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D61A40]"></span>
              </span>
              {subject.code} • {subject.credits} Credits • <HardDrive size={10} className="inline mr-1" /> Local
            </span>
            <h1 className="text-3xl lg:text-5xl font-display font-bold text-white leading-[0.95] tracking-tighter text-balance">
              {subject.name}
            </h1>
            <div className="mt-5 max-w-md" data-testid="subject-progress">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                <span>Syllabus covered</span>
                <span className="text-white font-mono">{coveredTopics}/{totalTopics} topics • {coveredPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={coveredPct} aria-label="Syllabus covered">
                <div className="h-full rounded-full bg-[#D61A40] transition-all duration-500" style={{ width: `${coveredPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters: editorial unit sections with oversized numerals */}
      <div className="max-w-5xl space-y-5">
        {subject.units.map((unit, i) => {
          const p = getProg(unit.id);
          const isActive = p.status !== UnitStatus.NOT_STARTED;
          const isMastered = p.status === UnitStatus.MASTERED;
          const completedPyqs = p.pyqsCompleted || [];
          const isCollapsed = collapsedUnits[unit.id] ?? isMastered;
          const topicsTotal = unit.topics?.length || 0;
          const topicsDone = (p.topicsDone || []).filter(x => (unit.topics || []).includes(x)).length;

          return (
            <section key={unit.id} className="relative flex gap-4 lg:gap-6 group">
              {/* Chapter numeral */}
              <div className="hidden sm:flex w-14 lg:w-20 shrink-0 justify-center pt-5">
                <span className={`font-display font-bold leading-none tracking-tighter text-4xl lg:text-6xl transition-colors duration-300 ${
                  isMastered ? 'text-[#F63C49]' : isActive ? 'text-white/30' : 'text-white/10'
                }`}>
                  {String(unit.unit_number).padStart(2, '0')}
                </span>
              </div>

              <div className={`flex-1 surface-1 rounded-3xl overflow-hidden transition-all hover:border-white/15 ${isMastered ? 'border-[#F63C49]/20' : ''}`}>
                {/* Unit header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 lg:px-6 lg:py-5">
                  <button
                    type="button"
                    onClick={() => setCollapsedUnits(prev => ({ ...prev, [unit.id]: !isCollapsed }))}
                    aria-expanded={!isCollapsed}
                    className="text-left flex items-center gap-3 min-w-0 group/title"
                  >
                    <span className="sm:hidden font-display font-bold text-lg leading-none text-white/20">{String(unit.unit_number).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                        Unit {unit.unit_number}{topicsTotal > 0 && <> <span className="text-slate-700">/</span> {topicsDone} of {topicsTotal} topics</>}
                      </span>
                      <h2 className={`text-lg lg:text-xl font-display font-bold mt-1 transition-colors tracking-tight ${isMastered ? 'text-[#F63C49]' : 'text-white group-hover/title:text-[#F63C49]'}`}>{unit.title}</h2>
                    </span>
                    <ChevronDown size={18} className={`shrink-0 text-slate-500 transition-transform duration-300 ${isCollapsed ? '-rotate-90' : ''}`} />
                  </button>

                  <div className="flex bg-white/5 p-1 rounded-xl shrink-0 self-start sm:self-center">
                    {[
                        { status: UnitStatus.NOT_STARTED, icon: Circle, label: 'Start' },
                        { status: UnitStatus.IN_PROGRESS, icon: Timer, label: 'Study' },
                        { status: UnitStatus.MASTERED, icon: CheckCircle2, label: 'Done' }
                    ].map((item) => {
                         const isSelected = p.status === item.status;
                         return (
                            <button
                                key={item.status}
                                onClick={() => updateStatus(unit.id, item.status)}
                                aria-label={`Mark unit as ${item.label}`}
                                aria-pressed={isSelected}
                                title={item.label}
                                className={`relative px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                                    isSelected
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon size={13} className={isSelected ? 'text-black' : 'text-current'} strokeWidth={2.5} />
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'block' : 'hidden sm:block'}`}>
                                    {item.label}
                                </span>
                            </button>
                         );
                    })}
                  </div>
                </div>

                {!isCollapsed && (
                <div className="px-5 pb-5 lg:px-6 lg:pb-6 pt-0 grid grid-cols-1 lg:grid-cols-5 gap-5 border-t border-white/5">
                  {/* Topics */}
                  {unit.topics && (
                     <div className="lg:col-span-3 pt-5">
                       <h3 className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                         <List size={11} /> Key Topics <span className="ml-auto font-mono text-slate-500">{topicsDone}/{topicsTotal}</span>
                       </h3>
                       <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5">
                         {unit.topics.map((t, idx) => {
                           const done = (p.topicsDone || []).includes(t);
                           return (
                             <li key={idx}>
                               <button
                                 type="button"
                                 role="checkbox"
                                 aria-checked={done}
                                 onClick={() => toggleTopic(unit.id, t, unit.topics)}
                                 className={`w-full text-left text-sm flex items-start gap-3 p-1.5 -m-1.5 rounded-lg transition-colors hover:bg-white/5 ${done ? 'text-slate-500' : 'text-slate-300'}`}
                               >
                                 <span className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${done ? 'bg-[#D61A40] border-[#F63C49]' : 'border-white/20'}`}>
                                   {done && <Check size={10} strokeWidth={3.5} className="text-white" />}
                                 </span>
                                 <span className={`leading-relaxed font-medium ${done ? 'line-through decoration-white/20' : ''}`}>{t}</span>
                               </button>
                             </li>
                           );
                         })}
                       </ul>
                     </div>
                  )}

                  {/* PYQ strip */}
                  <div className={`${unit.topics ? 'lg:col-span-2' : 'lg:col-span-5'} pt-5 flex flex-col`}>
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <FileQuestion size={11} /> PYQs solved
                     </span>
                     <div className="grid grid-cols-3 gap-2 content-start">
                       {['2022', '2023', '2024'].map(year => {
                         const isSolved = completedPyqs.includes(year);
                         return (
                           <button
                             key={year}
                             onClick={() => togglePyq(unit.id, year)}
                             aria-label={`${year} question paper, ${unit.title}: ${isSolved ? 'solved' : 'not solved'}`}
                             aria-pressed={isSolved}
                             className={`group px-3 py-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                               isSolved
                                 ? 'bg-[#F63C49]/10 border-[#F63C49]/30 text-[#F63C49]'
                                 : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                             }`}
                           >
                              <span className="text-[10px] font-bold font-mono tracking-wider">{year}</span>
                              {isSolved ? (
                                 <Check size={11} strokeWidth={3} />
                              ) : (
                                 <div className="w-2.5 h-2.5 rounded-full border border-white/20 group-hover:border-white/50"></div>
                              )}
                           </button>
                         );
                       })}
                     </div>
                  </div>
                </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Resources: full-width index, matches Library */}
      <div className="max-w-5xl mt-12">
        <div className="flex items-center gap-3 mb-3 px-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">Resources for this subject</span>
          <span className="text-[9px] font-mono text-slate-600">{subjectResources.length}</span>
          <div className="flex-1 h-px bg-white/5"></div>
          <Link to="/app/resources" aria-label="Open the resource library" className="text-slate-500 hover:text-[#F63C49] transition-colors">
             <ArrowUpRight size={12} />
          </Link>
        </div>
        {subjectResources.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
            {subjectResources.map(resource => {
                const isYoutube = getYouTubeID(resource.url);
                return (
                    <button
                        type="button"
                        key={resource.id}
                        onClick={() => setViewResource(resource)}
                        className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                    >
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                            isYoutube || resource.type === 'video'
                            ? 'bg-[#F63C49]/10 border-[#F63C49]/20 text-[#F63C49]'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}>
                            {isYoutube || resource.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-100 truncate">{resource.title}</p>
                            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 truncate">{resource.category} <span className="text-slate-700">/</span> {resource.author}</p>
                        </div>
                        <ArrowUpRight size={14} className="shrink-0 text-slate-600 group-hover:text-[#F63C49] transition-colors" />
                    </button>
                )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 border border-dashed border-white/10 rounded-2xl text-center p-4">
               <Search size={18} className="text-slate-600 mb-3" />
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No resources yet</p>
               <Link to="/app/resources" className="text-[10px] text-[#F63C49] mt-2 font-mono hover:underline">
                   Add one in the Library
               </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default SubjectDetail;

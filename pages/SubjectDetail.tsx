
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  BrainCircuit,
  List,
  X,
  Send,
  Timer,
  Check,
  FileQuestion,
  FileText,
  Video,
  BookOpen,
  Link as LinkIcon,
  Search,
  ArrowUpRight,
  HardDrive
} from 'lucide-react';
import { SUBJECTS, SYSTEM_RESOURCES, getYouTubeID } from '../constants';
import { UnitStatus, ResourceItem } from '../types';
import { useData } from '../context/DataContext';
import ResourceViewerModal from '../components/ResourceViewerModal';
import ComingSoonModal from '../components/ComingSoonModal';

const SubjectDetail: React.FC = () => {
  const { id } = useParams();
  const subject = SUBJECTS.find(s => s.id === id);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: `Hello! I'm your AI Tutor for ${subject?.name || 'this subject'}. Ask me anything about Unit 1 or specific concepts.`}
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { userProgress, setUserProgress, profile, setProfile } = useData();

  // Resource State
  const [subjectResources, setSubjectResources] = useState<ResourceItem[]>([]);
  const [viewResource, setViewResource] = useState<ResourceItem | null>(null);

  // Coming Soon State
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, showChat]);

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

  if (!subject) return <div className="p-20 text-center text-white font-display">SUBJECT_NOT_FOUND</div>;

  const getProg = (uId: string) => userProgress.find(p => p.unitId === uId) || { unitId: uId, status: UnitStatus.NOT_STARTED, pyqsCompleted: [] };

  const updateStatus = (uId: string, status: UnitStatus) => {
    const idx = userProgress.findIndex(p => p.unitId === uId);
    let next: typeof userProgress = [];
    if (idx > -1) {
        next = [...userProgress];
        next[idx] = { ...next[idx], status };
    } else {
        next = [...userProgress, { unitId: uId, status, pyqsCompleted: [] }];
    }
    setUserProgress(next);

    // Update Streak logic in profile
    if (profile) {
        const today = new Date().toDateString();
        const lastDate = profile.lastStudyDate ? new Date(profile.lastStudyDate).toDateString() : '';

        if (lastDate !== today) {
            setProfile({
                ...profile,
                streak: (profile.streak || 0) + 1,
                lastStudyDate: new Date().toISOString()
            });
        }
    }
  };

  const togglePyq = (uId: string, year: string) => {
    const idx = userProgress.findIndex(p => p.unitId === uId);
    let next: typeof userProgress = [];
    if (idx > -1) {
        next = [...userProgress];
        const currentPyqs = next[idx].pyqsCompleted || [];
        const isCompleted = currentPyqs.includes(year);
        next[idx] = {
            ...next[idx],
            pyqsCompleted: isCompleted
                ? currentPyqs.filter(y => y !== year)
                : [...currentPyqs, year]
        };
    } else {
        next = [...userProgress, { unitId: uId, status: UnitStatus.NOT_STARTED, pyqsCompleted: [year] }];
    }
    setUserProgress(next);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text: chatInput }]);
    const userQ = chatInput;
    setChatInput('');
    setTimeout(() => {
        let response = "That's a great question. Based on the syllabus, this concept is covered in Unit 2. It usually carries 6-8 marks in the End-Sem exam.";
        if (userQ.toLowerCase().includes('syllabus')) response = "The syllabus covers 5-6 units depending on the subject. You can check the timeline on the left.";
        setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 relative pb-20">
      
      <ResourceViewerModal isOpen={!!viewResource} onClose={() => setViewResource(null)} resource={viewResource} />
      <ComingSoonModal isOpen={!!comingSoon} onClose={() => setComingSoon(null)} feature={comingSoon || ''} />

      <div className="mb-12 lg:mb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
          <div className="max-w-4xl">
            <span className="text-[#E11D48] text-[10px] font-bold tracking-[0.25em] uppercase mb-4 block flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
              </span>
              {subject.code} • {subject.credits} Credits • <HardDrive size={10} className="inline mr-1" /> Local
            </span>
            <h1 className="text-4xl lg:text-8xl font-display font-bold text-white leading-[0.9] tracking-tighter text-balance">
              {subject.name}
            </h1>
          </div>
          <div className="flex gap-4 w-full lg:w-auto shrink-0">
            <button 
              onClick={() => setComingSoon('Syllabus Database')}
              className="flex-1 lg:flex-none px-8 py-4 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all"
            >
              Syllabus PDF
            </button>
            <button 
              onClick={() => setComingSoon('Assessment Engine')}
              className="flex-1 lg:flex-none px-8 py-4 rounded-xl bg-[#E11D48] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#be123c] transition-all shadow-xl shadow-red-900/20"
            >
              Quick Test
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Timeline / Unit List */}
        <div className="lg:col-span-8 relative">
          <div className="absolute left-6 top-8 bottom-8 w-px bg-white/5"></div>
          
          <div className="space-y-8">
            {subject.units.map((unit, i) => {
              const p = getProg(unit.id);
              const isActive = p.status !== UnitStatus.NOT_STARTED;
              const isMastered = p.status === UnitStatus.MASTERED;
              const completedPyqs = p.pyqsCompleted || [];

              return (
                <div key={unit.id} className="relative pl-16 group">
                  {/* Timeline Node */}
                  <div className={`absolute left-[1.1rem] top-8 w-5 h-5 rounded-full border-[3px] transition-all duration-300 z-10 bg-[#030303] ${
                    isMastered ? 'border-[#E11D48] bg-[#E11D48] shadow-[0_0_15px_#E11D48]' : isActive ? 'border-white bg-white' : 'border-white/10'
                  }`}></div>

                  <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-6 sm:gap-0">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Unit 0{unit.unit_number}</span>
                        <h3 className={`text-2xl font-display font-bold mt-1 transition-colors tracking-tight ${isMastered ? 'text-[#E11D48]' : 'text-white'}`}>{unit.title}</h3>
                      </div>
                      
                      <div className="flex bg-white/5 p-1 rounded-xl">
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
                                    className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                                        isSelected 
                                        ? 'bg-white text-black shadow-lg' 
                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <item.icon size={14} className={isSelected ? 'text-black' : 'text-current'} strokeWidth={2.5} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'block' : 'hidden lg:block'}`}>
                                        {item.label}
                                    </span>
                                </button>
                             );
                        })}
                      </div>
                    </div>

                    {/* Topics List */}
                    {unit.topics && (
                       <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/5">
                         <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                           <List size={12} /> Key Topics
                         </h4>
                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                           {unit.topics.map((t, idx) => (
                             <li key={idx} className="text-sm text-slate-300 flex items-start gap-3">
                               <span className="w-1 h-1 rounded-full bg-[#E11D48] mt-2 shrink-0"></span>
                               <span className="leading-relaxed font-medium">{t}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                    )}

                    {/* Functional PYQ Tracker */}
                    <div className="flex flex-col gap-3">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <FileQuestion size={12} /> PYQ Tracker
                       </span>
                       <div className="grid grid-cols-3 gap-3">
                         {['2022', '2023', '2024'].map(year => {
                           const isSolved = completedPyqs.includes(year);
                           return (
                             <button
                               key={year}
                               onClick={() => togglePyq(unit.id, year)}
                               className={`group px-4 py-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                                 isSolved
                                   ? 'bg-[#E11D48]/10 border-[#E11D48]/30 text-[#E11D48]'
                                   : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                               }`}
                             >
                                <span className="text-[11px] font-bold font-mono tracking-wider">{year}</span>
                                {isSolved ? (
                                   <Check size={12} strokeWidth={3} />
                                ) : (
                                   <div className="w-3 h-3 rounded-full border border-white/20 group-hover:border-white/50"></div>
                                )}
                             </button>
                           );
                         })}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-8 rounded-3xl bg-gradient-to-br from-[#E11D48]/10 to-transparent border border-[#E11D48]/20 text-center relative overflow-hidden">
              <div className="relative z-10">
                <BrainCircuit size={32} className="mx-auto text-[#E11D48] mb-6" />
                <h3 className="text-xl font-display font-bold text-white mb-2 tracking-tight">AI Assistant</h3>
                <p className="text-sm text-slate-400 mb-8 font-medium leading-relaxed">Ask questions about {subject.name} and get instant answers sourced from approved textbooks.</p>
                <button 
                    onClick={() => setComingSoon('AI Study Assistant')}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase text-[10px] tracking-[0.25em] hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
                >
                    Open Neural Chat
                </button>
              </div>
           </div>

           <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 min-h-[300px]">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 px-1 flex items-center justify-between">
                Recommended Resources
                <Link to="/resources" className="text-white hover:text-[#E11D48] transition-colors flex items-center gap-1">
                   <ArrowUpRight size={10} />
                </Link>
              </h4>
              
              <div className="space-y-4">
                {subjectResources.length > 0 ? (
                    subjectResources.map(resource => {
                        const isYoutube = getYouTubeID(resource.url);
                        return (
                            <div 
                                key={resource.id} 
                                onClick={() => setViewResource(resource)}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group border border-transparent hover:border-white/10"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    isYoutube || resource.type === 'video' 
                                    ? 'bg-red-500/10 text-red-500 group-hover:bg-red-500/20' 
                                    : 'bg-white/5 text-white/40 group-hover:text-white'
                                }`}>
                                    {isYoutube || resource.type === 'video' ? <PlayCircle size={20} /> : <FileText size={20} />}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-white truncate mb-0.5">{resource.title}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{resource.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{resource.author}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/10 rounded-2xl text-center p-4">
                         <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Search size={20} className="text-slate-600" />
                         </div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No Resources Found</p>
                         <Link to="/resources" className="text-[10px] text-[#E11D48] mt-2 font-mono hover:underline">
                             Add to Vault -&gt;
                         </Link>
                    </div>
                )}
              </div>
           </div>
        </div>
      </div>

      {/* AI Chat Overlay */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden flex flex-col h-[80vh] sm:h-[650px] shadow-2xl relative">
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                    <div className="flex items-center gap-3">
                        <BrainCircuit size={18} className="text-[#E11D48]" />
                        <span className="font-bold text-sm text-white uppercase tracking-widest">AI Tutor Node</span>
                    </div>
                    <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-5 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-white text-black rounded-2xl rounded-tr-sm font-bold' 
                                : 'bg-white/10 text-slate-200 rounded-2xl rounded-tl-sm font-medium'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>

                <form onSubmit={handleChatSubmit} className="p-5 border-t border-white/10 bg-[#0a0a0a]">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask a doubt..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-sm text-white focus:border-white/20 outline-none transition-all placeholder:text-slate-600 font-medium"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#E11D48] rounded-xl text-white hover:scale-105 transition-transform">
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default SubjectDetail;

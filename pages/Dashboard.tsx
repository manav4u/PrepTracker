
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import SubjectCard from '../components/SubjectCard';
import { UnitStatus } from '../types';
import { ChevronRight, Sparkles, CalendarDays, TrendingUp, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import ComingSoonModal from '../components/ComingSoonModal';

const SHORT_NAMES: Record<string, string> = {
  'm1': 'M1',
  'm2': 'M2',
  'fpl': 'FPL',
  'pps': 'PPS',
  'phy': 'PHY',
  'chem': 'CHEM',
  'elect': 'BXE',
  'elec': 'BEE',
  'mech': 'MECH',
  'graph': 'EG'
};

const StatPill = ({ label, value, sub, active = false, gradient = false, icon: Icon = Activity }: any) => (
  <div className={`p-6 rounded-3xl flex flex-col justify-between h-36 lg:h-40 transition-all duration-300 group hover:-translate-y-1 ${
    gradient 
      ? 'bg-gradient-to-br from-[#E11D48] to-[#9f1239] shadow-[0_10px_40px_-10px_rgba(225,29,72,0.4)] border-none' 
      : active 
        ? 'bg-white text-black border-none shadow-xl' 
        : 'bg-[#0a0a0a] border border-white/5 hover:border-white/10'
  }`}>
    <div className="flex justify-between items-start">
      <span className={`text-[9px] uppercase tracking-[0.25em] font-bold ${
        gradient ? 'text-white/80' : active ? 'text-black/50' : 'text-slate-500'
      }`}>{label}</span>
      <Icon size={16} className={gradient ? 'text-white' : active ? 'text-black' : 'text-[#E11D48]'} />
    </div>
    <div>
      <h3 className={`text-4xl lg:text-5xl font-display font-bold tracking-tighter mb-2 ${
        gradient ? 'text-white' : active ? 'text-black' : 'text-white'
      }`}>{value}</h3>
      <p className={`text-[10px] lg:text-[11px] font-bold uppercase tracking-widest ${
        gradient ? 'text-white/80' : active ? 'text-black/50' : 'text-slate-500'
      }`}>{sub}</p>
    </div>
  </div>
);

const ProgressGraphCard = ({ data, labels }: { data: number[], labels: string[] }) => {
    // Ensure we have data points to render
    const hasData = data.length > 0;

    // Y-Axis Padding Logic: 
    // Map 0% -> 85 (Bottom with padding)
    // Map 100% -> 15 (Top with padding)
    const mapY = (val: number) => 85 - (val * 0.7); 

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1 || 1)) * 100;
        const y = mapY(val);
        return `${x},${y}`;
    }).join(' ');

    const fillPath = `M 0,100 ${data.map((val, i) => {
         const x = (i / (data.length - 1 || 1)) * 100;
         const y = mapY(val);
         return `L ${x},${y}`;
    }).join(' ')} L 100,100 Z`;

    return (
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 flex flex-col justify-between h-36 lg:h-40 relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex justify-between items-start z-10">
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-500">Study Activity</span>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E11D48]"></span>
                    </span>
                    <Activity size={16} className="text-white/20 group-hover:text-[#E11D48] transition-colors" />
                </div>
            </div>
            
            {hasData ? (
                <div className="absolute inset-0 top-0 bottom-0 w-full h-full px-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                         <defs>
                            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#E11D48" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
                            </linearGradient>
                         </defs>
                         
                         {/* Grid Lines */}
                         <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="2 2" />
                         <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="2 2" />
                         <line x1="0" y1="85" x2="100" y2="85" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="2 2" />

                         {/* Area Fill */}
                         <path d={fillPath} fill="url(#grad)" className="transition-all duration-700 ease-in-out" />
                         
                         {/* Stroke Line */}
                         <polyline 
                            points={points} 
                            fill="none" 
                            stroke="#E11D48" 
                            strokeWidth="2" 
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-[0_0_8px_rgba(225,29,72,0.5)] transition-all duration-700 ease-in-out"
                         />
                         
                         {/* Data Points */}
                         {data.map((val, i) => {
                             const x = (i / (data.length - 1 || 1)) * 100;
                             const y = mapY(val);
                             return (
                                <circle 
                                    key={i} 
                                    cx={x} 
                                    cy={y} 
                                    r="2" 
                                    className="fill-[#0a0a0a] stroke-[#E11D48] stroke-[1px] transition-all duration-700 ease-in-out" 
                                />
                             );
                         })}
                    </svg>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[10px] font-mono text-slate-600">NO_SIGNAL</p>
                </div>
            )}
            
            <div className="flex justify-between items-end relative z-10 mt-auto px-1">
                 {labels.map((l, i) => (
                     <span key={i} className="text-[7px] font-mono font-bold text-slate-500 uppercase w-full text-center truncate">{l}</span>
                 ))}
            </div>
    
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 pointer-events-none"></div>
        </div>
    );
}

const Dashboard: React.FC = () => {
  const { profile, userProgress } = useData();
  // Coming Soon Modal State
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  if (!profile) return null;

  const selectedIds = profile.selectedSubjects || [];

  // Calculate Progress
  const getSubjectProgress = (subjectId: string) => {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject) return { percentage: 0, mastered: 0 };
    const subjectUnitIds = subject.units.map(u => u.id);
    const progForSub = userProgress.filter(p => subjectUnitIds.includes(p.unitId));
    let score = 0;
    let mastered = 0;
    subjectUnitIds.forEach(uId => {
      const p = progForSub.find(x => x.unitId === uId);
      if (p) {
        if (p.status === UnitStatus.IN_PROGRESS) score += 33;
        if (p.status === UnitStatus.REVISION) score += 66;
        if (p.status === UnitStatus.MASTERED) { score += 100; mastered++; }
      }
    });
    return { percentage: Math.round(score / subject.units.length), mastered };
  };

  // Filter Active Subjects
  const filtered = SUBJECTS.filter(s => selectedIds.includes(s.id));
  
  // Aggregate Metrics
  const avgProgress = filtered.length > 0 
    ? Math.round(filtered.reduce((a, s) => a + getSubjectProgress(s.id).percentage, 0) / filtered.length)
    : 0;
  
  const totalMastered = filtered.reduce((a, s) => a + getSubjectProgress(s.id).mastered, 0);
  const totalUnits = filtered.reduce((a, s) => a + s.units.length, 0);

  // Exam Schedule
  const sortedExams = filtered
    .filter(s => s.examDate)
    .map(s => ({
      name: s.name,
      code: s.code,
      date: new Date(s.examDate!),
      id: s.id
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const upcomingExams = sortedExams.filter(e => e.date.getTime() > Date.now());
  const nextExam = upcomingExams[0];
  const daysToNextExam = nextExam 
    ? Math.ceil((nextExam.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) 
    : 0;

  // Streak Validation Logic
  const getValidStreak = () => {
      if (!profile.lastStudyDate) return 0;
      
      const lastStudy = new Date(profile.lastStudyDate);
      const today = new Date();
      
      // Reset hours to compare dates only
      lastStudy.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      
      const diffTime = Math.abs(today.getTime() - lastStudy.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Streak breaks if more than 1 day passed (i.e. missed yesterday)
      if (diffDays > 1) return 0;
      
      return profile.streak;
  };

  const validStreak = getValidStreak();

  // Graph Data Preparation
  // Ensure we display something even if 0
  const graphData = filtered.slice(0, 5).map(s => getSubjectProgress(s.id).percentage);
  // Using SHORT_NAMES for better visual fit
  const graphLabels = filtered.slice(0, 5).map(s => SHORT_NAMES[s.id] || s.code.split('-')[1] || s.code.slice(0,3));

  return (
    <div className="space-y-12 lg:space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <ComingSoonModal isOpen={!!comingSoon} onClose={() => setComingSoon(null)} feature={comingSoon || ''} />

      {/* HUD Header */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-[#0a0a0a] border border-white/5 p-8 lg:p-10 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48]">
                    System Active
                </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-white mb-2 leading-[0.9] tracking-tighter">
              Study <br/><span className="text-white/40">Progress</span>
            </h1>
          </div>
          
          <div className="relative z-10 mt-8">
               <div className="flex justify-between items-end mb-4">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Overall Progress</span>
                 <span className="text-4xl font-display font-bold text-white tracking-tighter">{avgProgress}%</span>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-[#E11D48] to-[#be123c] shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" style={{ width: `${avgProgress}%` }}></div>
               </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4 lg:gap-6">
           <StatPill label="Units Mastered" value={totalMastered} sub={`/ ${totalUnits} Units`} gradient={true} icon={Sparkles} />
           
           {/* Dynamic Graph Replacement for Forecast */}
           <ProgressGraphCard data={graphData} labels={graphLabels} />
           
           <StatPill label="Days to Exam" value={`${daysToNextExam}d`} sub={nextExam ? nextExam.code : 'No Exams'} icon={CalendarDays} />
           <StatPill label="Study Streak" value={validStreak} sub="Day Streak" icon={TrendingUp} active={validStreak > 2} />
        </div>
      </section>

      {/* Main Grid */}
      <section>
        <div className="flex items-end justify-between mb-8 px-1">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Active Courses</h2>
            <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Real-time Syllabus Tracking</p>
          </div>
          <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 hover:bg-white/5">
            View All <ChevronRight size={12} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filtered.map(sub => {
            const { percentage, mastered } = getSubjectProgress(sub.id);
            return <SubjectCard key={sub.id} subject={sub} progress={percentage} masteredCount={mastered} />;
          })}
        </div>
      </section>

      {/* Footer / Deadlines */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10 border-t border-white/5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <CalendarDays size={18} className="text-[#E11D48]" />
            <h3 className="text-lg font-display font-bold text-white tracking-tight">Exam Timeline</h3>
          </div>
          
          <div className="space-y-3">
            {upcomingExams.length > 0 ? upcomingExams.map((exam, i) => (
              <Link to={`/subject/${exam.id}`} key={i} className="group flex items-center gap-5 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
                {/* Date Ticket */}
                <div className="w-14 h-14 rounded-xl bg-[#0a0a0a] border border-white/10 flex flex-col items-center justify-center shrink-0 group-hover:border-[#E11D48] transition-colors">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{exam.date.toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-xl font-display font-bold text-white leading-none mt-0.5">{exam.date.getDate()}</span>
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold text-white truncate pr-2 group-hover:text-[#E11D48] transition-colors">{exam.name}</p>
                      {i === 0 && <span className="w-2 h-2 rounded-full bg-[#E11D48] shadow-[0_0_10px_#E11D48]"></span>}
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{exam.code}</span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">10:00 AM</span>
                   </div>
                </div>
              </Link>
            )) : (
              <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center">
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">No Active Schedules</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
            <h3 className="text-lg font-display font-bold text-white mb-8 flex items-center gap-3 tracking-tight">
               <span className="text-[#E11D48]"><Sparkles size={18} /></span>
               AI Study Assistant
            </h3>
            <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/5 p-8 lg:p-12 group">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#E11D48]/10 to-transparent blur-[120px] rounded-full translate-x-1/3 -translate-y-1/2"></div>
               
               <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                  <div className="max-w-lg">
                     <h4 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">Need help with a topic?</h4>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Ask our AI Tutor for instant, syllabus-aligned explanations of complex topics.
                        Optimized for Engineering Physics and Mathematics.
                     </p>
                  </div>
                  <button 
                    onClick={() => setComingSoon('AI Study Assistant')}
                    className="shrink-0 px-8 py-4 rounded-xl bg-white text-black font-bold uppercase text-[10px] tracking-[0.25em] hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                  >
                     <Sparkles size={14} />
                     Initialize
                  </button>
               </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

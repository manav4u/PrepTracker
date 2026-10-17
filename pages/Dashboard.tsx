
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import SubjectCard from '../components/SubjectCard';
import { UnitStatus } from '../types';
import { ChevronRight, Sparkles, CalendarDays, TrendingUp, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import { currentStreak, lastDays } from '../lib/activity';
import { subjectExamList, nextExamIndex } from '../lib/exams';

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

const StatPill = ({ label, value, sub, active = false, gradient = false, icon: Icon = Activity, to }: any) => {
  const Wrap: any = to ? Link : 'div';
  return (
  <Wrap {...(to ? { to } : {})} className={`p-6 rounded-3xl flex flex-col justify-between h-36 lg:h-40 transition-all duration-300 group hover:-translate-y-1 ${
    gradient 
      ? 'bg-gradient-to-br from-[#F63C49] to-[#9f1239] shadow-[0_10px_40px_-10px_rgba(246,60,73,0.4)] border-none' 
      : active 
        ? 'bg-white text-black border-none shadow-xl' 
        : 'bg-[#0a0a0a] border border-white/5 hover:border-white/10'
  }`}>
    <div className="flex justify-between items-start">
      <span className={`text-[9px] uppercase tracking-[0.25em] font-bold ${
        gradient ? 'text-white/80' : active ? 'text-black/70' : 'text-slate-500'
      }`}>{label}</span>
      <Icon size={16} className={gradient ? 'text-white' : active ? 'text-black' : 'text-[#F63C49]'} />
    </div>
    <div>
      <p className={`text-4xl lg:text-5xl font-display font-bold tracking-tighter mb-2 ${
        gradient ? 'text-white' : active ? 'text-black' : 'text-white'
      }`}>{value}</p>
      <p className={`text-[10px] lg:text-[11px] font-bold uppercase tracking-widest ${
        gradient ? 'text-white/80' : active ? 'text-black/70' : 'text-slate-500'
      }`}>{sub}</p>
    </div>
  </Wrap>
  );
};

const ProgressGraphCard = ({ data, labels, total }: { data: number[], labels: string[], total: number }) => {
    const hasData = total > 0;

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
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-500">Last 7 days</span>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D61A40] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D61A40]"></span>
                    </span>
                    <Activity size={16} className="text-white/20 group-hover:text-[#F63C49] transition-colors" />
                </div>
            </div>
            
            {hasData ? (
                <div className="absolute inset-0 top-0 bottom-0 w-full h-full px-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                         <defs>
                            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#F63C49" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#F63C49" stopOpacity="0" />
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
                            stroke="#F63C49" 
                            strokeWidth="2" 
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-[0_0_8px_rgba(246,60,73,0.5)] transition-all duration-700 ease-in-out"
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
                                    className="fill-[#0a0a0a] stroke-[#F63C49] stroke-[1px] transition-all duration-700 ease-in-out" 
                                />
                             );
                         })}
                    </svg>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">No study yet</p>
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

  // Exam timeline: only dates the student set themselves in Settings (built-in
  // schedules go stale every cycle, so PrepTracker never invents exam dates).
  const timelineExams = subjectExamList(profile, SUBJECTS);
  const nextIdx = nextExamIndex(timelineExams);
  // Days to exam comes from the date the student sets in Settings.
  const examStart = profile.examStartDate ? new Date(`${profile.examStartDate}T00:00:00`) : null;
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const examDiff = examStart && !isNaN(examStart.getTime())
    ? Math.round((examStart.getTime() - startOfToday.getTime()) / 86400000)
    : null;
  const examValue = examDiff === null ? '--' : examDiff > 0 ? `${examDiff}d` : examDiff === 0 ? 'Today' : 'Now';
  const examSub = examDiff === null ? 'Set exam date' : examDiff >= 0 && examStart
    ? `Starts ${examStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
    : 'Exams started';

  // Streak Validation Logic
  const validStreak = currentStreak(profile);

  // Graph Data Preparation
  // Ensure we display something even if 0
  const week = lastDays(profile, 7);
  const weekMax = Math.max(3, ...week.counts);
  const graphData = week.counts.map(c => Math.round((c / weekMax) * 100));
  const graphLabels = week.labels;
  const weekTotal = week.counts.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-12 lg:space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* HUD Header */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-[#0a0a0a] border border-white/5 p-8 lg:p-10 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D61A40] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D61A40]"></span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#F63C49]">
                    Hi, {profile.name}
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
                 <div className="h-full bg-gradient-to-r from-[#F63C49] to-[#D61A40] shadow-[0_0_20px_rgba(246,60,73,0.5)] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" style={{ width: `${avgProgress}%` }}></div>
               </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4 lg:gap-6">
           <StatPill label="Units Mastered" value={totalMastered} sub={`/ ${totalUnits} Units`} gradient={true} icon={Sparkles} />
           
           {/* Dynamic Graph Replacement for Forecast */}
           <ProgressGraphCard data={graphData} labels={graphLabels} total={weekTotal} />
           
           <StatPill label="Days to Exam" value={examValue} sub={examSub} icon={CalendarDays} to={examDiff === null ? '/settings' : undefined} />
           <StatPill label="Study Streak" value={validStreak} sub="Day Streak" icon={TrendingUp} active={validStreak > 2} />
        </div>
      </section>

      {/* Main Grid */}
      <section>
        <div className="flex items-end justify-between mb-8 px-1">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Active Courses</h2>
            <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Syllabus Tracking</p>
          </div>

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
        <div className="lg:col-span-3 max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <CalendarDays size={18} className="text-[#F63C49]" />
            <h3 className="text-lg font-display font-bold text-white tracking-tight">Exam Timeline</h3>
          </div>
          
          <div className="space-y-3">
            {timelineExams.length > 0 ? timelineExams.map((exam, i) => (
              <Link to={`/app/subject/${exam.subjectId}`} key={exam.subjectId} className={`group flex items-center gap-5 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 ${i !== nextIdx && nextIdx !== -1 && i < nextIdx ? 'opacity-40' : ''}`}>
                {/* Date Ticket */}
                <div className="w-14 h-14 rounded-xl bg-[#0a0a0a] border border-white/10 flex flex-col items-center justify-center shrink-0 group-hover:border-[#F63C49] transition-colors">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{exam.date.toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-xl font-display font-bold text-white leading-none mt-0.5">{exam.date.getDate()}</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold text-white truncate pr-2 group-hover:text-[#F63C49] transition-colors">{exam.name}</p>
                      {i === nextIdx && <span className="w-2 h-2 rounded-full bg-[#D61A40] shadow-[0_0_10px_#F63C49]"></span>}
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{exam.code}</span>
                      {nextIdx !== -1 && i < nextIdx && <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Done</span>}
                   </div>
                </div>
              </Link>
            )) : (
              <Link to="/app/settings" className="block p-6 rounded-2xl border border-dashed border-white/10 text-center hover:border-[#F63C49]/40 transition-colors group">
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-widest group-hover:text-slate-300">No exam dates set</p>
                 <p className="text-[10px] font-mono text-[#F63C49] mt-2 uppercase tracking-widest">Set them in Settings</p>
              </Link>
            )}
          </div>
        </div>
        
      </section>
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSubjects } from '../context/SubjectsContext';
import SubjectCard from '../components/SubjectCard';
import { UnitStatus } from '../types';
import { CalendarDays, Flame, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import { currentStreak, lastDays, todayCount, DAILY_GOAL } from '../lib/activity';
import { DailyRevisePrompt } from '../components/ReviseSheet';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { subjectExamList, nextExamIndex } from '../lib/exams';
import { usePlan } from '../components/PlanTab';

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

const BLOCK_LIMIT = 40;

const MasteryCard = ({ mastered, total, style }: { mastered: number; total: number; style?: React.CSSProperties }) => (
  <div style={style} className="p-4 rounded-2xl flex flex-col justify-between h-28 lg:h-32 surface-1 transition-colors duration-200 hover:border-white/10">
    <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-slate-500">Units Mastered</span>
    <p className="flex items-baseline gap-1 text-white">
      <span className="text-3xl lg:text-4xl font-display font-bold tracking-tighter tabular-nums leading-none">{mastered}</span>
      <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">of {total} {total === 1 ? 'unit' : 'units'}</span>
    </p>
    <div className="flex gap-1.5" style={{ height: '16px' }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`flex-1 rounded-full transition-colors duration-200 ${i < mastered ? 'bg-[#F63C49]' : 'bg-white/10'}`}></span>
      ))}
    </div>
  </div>
);

const StatPill = ({ label, value, sub, foot, active = false, icon: Icon = Activity, to, style }: any) => {
  const isLink = !!to;
  const Wrap: any = isLink ? Link : 'div';
  const sharedClasses = `p-5 rounded-2xl flex flex-col justify-between h-32 lg:h-36 transition-all duration-200 group hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 ${active ? 'surface-1 ring-1 ring-[#F63C49]/40' : 'surface-1 hover:border-white/15'}`;
  return (
  <Wrap
    {...(isLink ? { to } : { role: 'button', tabIndex: 0 })}
    style={style}
    className={sharedClasses}
  >
    <div className="flex justify-between items-start">
      <span className={`text-[9px] uppercase tracking-[0.15em] font-bold ${
        active ? 'text-[#F63C49]' : 'text-slate-500'
      }`}>{label}</span>
      <Icon size={16} className={active ? 'text-[#F63C49]' : 'text-slate-400'} />
    </div>
    <div>
      <p className={`text-3xl lg:text-4xl font-display font-bold tracking-tighter mb-1 ${
        active ? 'text-white' : 'text-white'
      }`}>{value}</p>
      <p className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.15em] ${
        active ? 'text-[#F63C49]/90' : 'text-slate-500'
      }`}>{sub}</p>
      {foot && <p className="mt-1 text-[9px] lg:text-[10px] font-bold tracking-wide text-slate-200 group-hover:text-white">{foot} <span aria-hidden="true">›</span></p>}
    </div>
  </Wrap>
  );
};

const StreakCard = ({ streak, today, goal, style }: any) => {
  const goalPct = Math.min(100, Math.round((today / goal) * 100));
  return (
    <div style={style} className="relative p-4 rounded-2xl flex flex-col justify-between h-28 lg:h-32 overflow-hidden">
      <div className="relative flex items-center gap-1.5">
        <span className="text-[#F63C49] text-[9px] -mt-0.5">⏱</span>
        <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-slate-400">Study Streak</span>
      </div>

      <div className="relative flex items-end gap-2">
        <p className="text-4xl lg:text-5xl font-display font-bold tracking-tighter text-white">{streak}</p>
        <span className="text-[9px] lg:text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300">Day Streak</span>
      </div>

      <div className="relative">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300">Today</span>
          <span className="text-[9px] lg:text-[9px] font-bold font-mono text-slate-300">{today}/{goal}</span>
        </div>
        <div className="h-1 w-full rounded-full bg-black/[0.06] overflow-hidden">
          <div className="h-1 rounded-full bg-[#F63C49]" style={{ width: `${goalPct}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const ProgressGraphCard = ({ data, labels, total }: { data: number[], labels: string[], total: number }) => {
  const hasData = total > 0;

  const mapY = (val: number) => 56 - (val * 0.30);

  const mapX = (i: number) => 8 + (i / (data.length - 1 || 1)) * 80;

  const points = data.map((val, i) => `${mapX(i)},${mapY(val)}`).join(' ');

  const fillPath = `M 0,${mapY(data[0])} ${data.map((val, i) => `L ${mapX(i)},${mapY(val)}`).join(' ')} L 100,${mapY(data[data.length - 1])} L 100,0 L 0,0 Z`;

  return (
    <div className="p-4 rounded-2xl surface-1 flex flex-col justify-between h-28 lg:h-32 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500" style={{ animationDelay: '90ms' }}>
      <div className="flex justify-between items-start">
        <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-slate-500">Last 7 days</span>
        <span className="text-[8px] text-slate-400">
          <Flame size={12} className="text-[#F63C49]"/>&nbsp;
          <span>{total > 0 ? total + ' sessions' : ''}</span>
        </span>
      </div>
      
      {hasData ? (
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={fillPath} fill="#F63C49" opacity={0.3} className="transition-all duration-500 ease-in-out" />
          <polyline 
             points={points} 
             fill="none" 
             stroke="#F63C49" 
             strokeWidth="1.5" 
             vectorEffect="non-scaling-stroke"
             strokeLinecap="round"
             strokeLinejoin="round"
          />
        </svg>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.15em]">No study yet</p>
        </div>
      )}
      
      <div className="flex justify-between items-end px-1">
        {labels.map((l, i) => (
          <span key={i} className="text-[7px] font-mono font-bold text-slate-400 uppercase w-full text-center truncate">{l}</span>
        ))}
      </div>
    </div>
  );
}

const Dashboard: React.FC = () => {
  const { profile, userProgress } = useData();
  const { subjects: allSubjects } = useSubjects();

  if (!profile) return null;

  const selectedIds = profile.selectedSubjects || [];

  const getSubjectProgress = (subjectId: string) => {
    const subject = allSubjects.find(s => s.id === subjectId);
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

  const filtered = allSubjects.filter(s => selectedIds.includes(s.id));
  
  const avgProgress = filtered.length > 0 
    ? Math.round(filtered.reduce((a, s) => a + getSubjectProgress(s.id).percentage, 0) / filtered.length)
    : 0;
  
  const totalMastered = filtered.reduce((a, s) => a + getSubjectProgress(s.id).mastered, 0);
  const totalUnits = filtered.reduce((a, s) => a + s.units.length, 0);

  const timelineExams = subjectExamList(profile, allSubjects);
  const nextIdx = nextExamIndex(timelineExams);
  const examStart = profile.examStartDate ? new Date(`${profile.examStartDate}T00:00:00`) : null;
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const examDiff = examStart && !isNaN(examStart.getTime())
    ? Math.round((examStart.getTime() - startOfToday.getTime()) / 86400000)
    : null;
  const plan = usePlan();
  const planFoot = plan.subjects.length === 0 ? '' : plan.nothingLeft ? 'Plan: all ticked' : plan.remaining === 0 ? 'Plan: done today' : `${plan.remaining} ${plan.remaining === 1 ? 'topic' : 'topics'} left today`;
  const examValue = examDiff === null ? '--' : examDiff > 0 ? `${examDiff}d` : examDiff === 0 ? 'Today' : 'Now';
  const examSub = examDiff === null ? 'Set exam date' : examDiff >= 0 && examStart
    ? `Starts ${examStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
    : 'Exams started';

  const validStreak = currentStreak(profile);
  const todayActions = todayCount(profile);

  const week = lastDays(profile, 7);
  const weekMax = Math.max(3, ...week.counts);
  const graphData = week.counts.map(c => Math.round((c / weekMax) * 100));
  const graphLabels = week.labels;
  const weekTotal = week.counts.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 lg:space-y-16">
      <DailyRevisePrompt />

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div data-tour="overview" className="lg:col-span-2 rounded-2xl surface-1 p-6 lg:p-8 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="rounded-full bg-[#F63C49]"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F63C49]"></span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#F63C49]">
              {(() => { const h = new Date().getHours(); const g = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night'; return `${g}, ${profile.name}`; })()}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-2 leading-[0.9] tracking-tighter">
            Study <br/><span className="text-white/40">Progress</span>
          </h1>
          
          <div data-tour="overall-progress" className="mt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em]">Overall Progress</span>
              <span className="text-3xl font-display font-bold text-white tracking-tighter">{avgProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-1.5 bg-[#F63C49]" style={{ width: `${avgProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div data-tour="home-stats" className="lg:col-span-2 grid grid-cols-2 gap-4 lg:gap-6">
          <MasteryCard mastered={totalMastered} total={totalUnits} />
          <ProgressGraphCard data={graphData} labels={graphLabels} total={weekTotal} />
          <StatPill label="Days to Exam" value={examValue} sub={examSub} foot={planFoot} icon={CalendarDays} to={planFoot ? '/app/revise?tab=plan' : examDiff === null ? '/app/settings' : undefined} style={{ animationDelay: '120ms' }} />
          <StreakCard streak={validStreak} today={todayActions} goal={DAILY_GOAL} style={{ animationDelay: '180ms' }} />
        </div>
      </section>

      <section data-tour="activity">
        <ActivityHeatmap profile={profile} style={{ animationDelay: '200ms' }} />
      </section>

      <section data-tour="courses">
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-1 tracking-tight">Active Courses</h2>
            <p className="text-slate-500 text-xs font-bold tracking-[0.15em] uppercase">Syllabus Tracking</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {filtered.map((sub) => {
            const { percentage, mastered } = getSubjectProgress(sub.id);
            return <SubjectCard key={sub.id} subject={sub} progress={percentage} masteredCount={mastered} />;
          })}
        </div>
      </section>

      <section data-tour="timeline" className="pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <CalendarDays size={18} className="text-[#F63C49]" />
          <h3 className="text-lg font-display font-bold text-white tracking-tight">Exam Timeline</h3>
        </div>
        <div className="space-y-3">
          {timelineExams.length > 0 ? timelineExams.map((exam, i) => (
            <Link to={`/app/subject/${exam.subjectId}`} key={exam.subjectId} style={{ animationDelay: `${i * 50}ms` }} className={`flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 ${i !== nextIdx && nextIdx !== -1 && i < nextIdx ? 'opacity-40' : ''}`}>
              <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:border-[#F63C49] transition-colors">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">{exam.date.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-xl font-display font-bold text-white leading-none mt-0.5">{exam.date.getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-white truncate pr-2 group-hover:text-[#F63C49] transition-colors">{exam.name}</p>
                  {i === nextIdx && <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-1 py-0.5 rounded border border-white/5">{exam.code}</span>
                  {nextIdx !== -1 && i < nextIdx && <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Done</span>}
                </div>
              </div>
            </Link>
          )) : (
            <Link to="/app/settings" className="block p-4 rounded-xl text-center hover:border-[#F63C49]/40 transition-colors group">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-[0.15em] group-hover:text-slate-300">No exam dates set</p>
              <p className="text-[9px] font-mono text-[#F63C49] mt-1 uppercase tracking-[0.15em]">Set them in Settings</p>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

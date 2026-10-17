
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectsFor } from '../lib/curriculum';
import { UnitStatus } from '../types';
import { CalendarDays, Flame } from 'lucide-react';
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

const StreakCard = ({ streak, counts, labels, style }: any) => {
  const todayIdx = counts.length - 1;
  return (
    <div style={style} className="relative p-5 rounded-3xl flex flex-col justify-between h-36 lg:h-40 overflow-hidden group hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 bg-[linear-gradient(180deg,#FDFBF6_0%,#F6F1E8_52%,#EEE8DC_100%)] shadow-[0_1px_2px_rgba(0,0,0,0.45),0_18px_38px_-22px_rgba(0,0,0,0.85),0_0_34px_-10px_rgba(255,247,235,0.22)]">
      {/* Ivory material: bright top sheen, warm bottom vignette, crisp inner highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-black/[0.05] pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.05)] pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl ring-1 ring-black/[0.06] pointer-events-none"></div>

      {/* Label row: flame sits inline as a small mark, no floating chip */}
      <div className="relative flex items-center gap-1.5">
        <Flame size={10} strokeWidth={2.5} className="text-[#F63C49] -mt-px" />
        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#8a8172]">Study Streak</span>
      </div>

      {/* Hero figure with quiet baseline caption */}
      <div className="relative flex items-end gap-2">
        <p className="text-5xl lg:text-6xl font-display font-bold tracking-tighter text-[#17171c] leading-[0.85]">{streak}</p>
        <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-[#4a443a] mb-0.5 whitespace-nowrap">Day Streak</p>
      </div>

      {/* Week strip: full-width capsule bars, today taller, mono letters beneath */}
      <div className="relative flex items-end gap-1.5">
        {counts.map((c: number, i: number) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className={`w-full rounded-full ${i === todayIdx ? 'h-[22px] lg:h-[26px]' : 'h-[16px] lg:h-[20px]'} ${c > 0 ? 'bg-[#F63C49] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_8px_-2px_rgba(246,60,73,0.55)]' : 'bg-black/[0.03] ring-1 ring-inset ring-black/15'}`}></span>
            <span className={`text-[7px] lg:text-[8px] font-mono font-bold uppercase leading-none ${i === todayIdx ? 'text-[#4a443a]' : 'text-[#b0a895]'}`}>{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { profile, userProgress } = useData();

  if (!profile) return null;

  const SUBJECTS = subjectsFor(profile);

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
    <div className="space-y-12 lg:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* The Deck: one flat instrument panel, hairline-divided readouts */}
      <section className="rounded-3xl surface-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Semester progress */}
          <div className="lg:col-span-5 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between gap-8">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D61A40] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D61A40]"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#F63C49]">Hi, {profile.name}</span>
            </div>
            <div>
              <div className="flex items-end gap-4 mb-4">
                <span className="text-7xl lg:text-8xl font-display font-bold text-white tracking-tighter leading-none">{avgProgress}<span className="text-3xl lg:text-4xl text-white/40">%</span></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2">Semester<br/>Progress</span>
              </div>
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F63C49] to-[#D61A40] shadow-[0_0_20px_rgba(246,60,73,0.5)] transition-all duration-1000" style={{ width: `${avgProgress}%` }}></div>
              </div>
              <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-slate-600">{totalMastered} of {totalUnits} units mastered</p>
            </div>
          </div>

          {/* Flat readouts */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/5 divide-y divide-white/5 flex flex-col">
            <Link to="/app/library" className="flex-1 p-8 lg:p-10 group hover:bg-white/[0.02] transition-colors flex flex-col justify-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">Units Mastered</span>
              <p className="text-5xl font-display font-bold text-white tracking-tighter group-hover:text-[#F63C49] transition-colors">{totalMastered}<span className="text-xl text-white/30"> / {totalUnits}</span></p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-2">Open library</p>
            </Link>
            <Link to="/app/settings" className="flex-1 p-8 lg:p-10 group hover:bg-white/[0.02] transition-colors flex flex-col justify-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">Days to Exam</span>
              <p className="text-5xl font-display font-bold text-white tracking-tighter group-hover:text-[#F63C49] transition-colors">{examValue}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-2">{examSub}</p>
            </Link>
          </div>

          {/* Streak */}
          <div className="lg:col-span-3 p-6 lg:p-8 flex">
            <StreakCard streak={validStreak} counts={week.counts} labels={week.labels} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* 7-day focus strip */}
        <div className="border-t border-white/5 p-8 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">Last 7 days</span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-600">{weekTotal} topics touched</span>
          </div>
          <div className="flex items-end gap-2 lg:gap-4">
            {week.counts.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[9px] font-mono text-slate-500">{c > 0 ? c : ''}</span>
                <div className="w-full h-16 lg:h-20 rounded-md bg-white/5 flex items-end overflow-hidden">
                  <div className={`w-full rounded-md transition-all duration-700 ${i === week.counts.length - 1 ? 'bg-[#F63C49] shadow-[0_0_14px_rgba(246,60,73,0.45)]' : 'bg-white/15'}`} style={{ height: `${Math.max(4, (c / weekMax) * 100)}%` }}></div>
                </div>
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{week.labels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Roster */}
      <section>
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Course Roster</h2>
            <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Syllabus Tracking</p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">{filtered.length} subjects</span>
        </div>

        <div className="border-t border-white/10">
          {filtered.map((sub, i) => {
            const { percentage, mastered } = getSubjectProgress(sub.id);
            return (
              <Link to={`/app/subject/${sub.id}`} key={sub.id} className="group flex items-center gap-4 lg:gap-6 py-5 border-b border-white/5 px-2 -mx-2 rounded hover:bg-white/[0.02] transition-colors">
                <span className="text-sm font-mono font-bold text-slate-600 w-7 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="hidden sm:block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 shrink-0 w-16 text-center">{sub.code}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-[#F63C49] transition-colors">{sub.name}</p>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate-600 mt-0.5">{mastered} / {sub.units.length} units</p>
                </div>
                <div className="hidden md:block w-48 h-1.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                  <div className="h-full bg-[#F63C49] rounded-full transition-all duration-700" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className={`text-sm font-display font-bold tracking-tight w-10 text-right shrink-0 ${percentage > 0 ? 'text-white' : 'text-slate-600'}`}>{percentage}%</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Exam Timeline: horizontal strip */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-1">
          <CalendarDays size={16} className="text-[#F63C49]" />
          <h3 className="text-lg font-display font-bold text-white tracking-tight">Exam Timeline</h3>
        </div>
        {timelineExams.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {timelineExams.map((exam, i) => (
              <Link to={`/app/subject/${exam.subjectId}`} key={exam.subjectId}
                className={`shrink-0 w-40 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${i === nextIdx ? 'border-[#F63C49]/50 bg-[#F63C49]/5 shadow-[0_0_30px_-10px_rgba(246,60,73,0.5)]' : 'border-white/10 surface-1 hover:border-white/20'} ${nextIdx !== -1 && i < nextIdx ? 'opacity-40' : ''}`}>
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-2xl font-display font-bold text-white tracking-tight">{exam.date.getDate()}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{exam.date.toLocaleString('default', { month: 'short' })}</span>
                </div>
                <p className="text-[11px] font-bold text-white truncate mb-1">{exam.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-500">{exam.code}</span>
                  {i === nextIdx && <span className="text-[8px] font-bold uppercase tracking-widest text-[#F63C49]">Next</span>}
                  {nextIdx !== -1 && i < nextIdx && <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">Done</span>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Link to="/app/settings" className="block p-6 rounded-2xl border border-dashed border-white/10 text-center hover:border-[#F63C49]/40 transition-colors group">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest group-hover:text-slate-300">No exam dates set</p>
            <p className="text-[10px] font-mono text-[#F63C49] mt-2 uppercase tracking-widest">Set them in Settings</p>
          </Link>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import { Subject, UnitStatus } from '../types';
import { ArrowRight, Layers } from 'lucide-react';
import { useData } from '../context/DataContext';

interface SubjectCardProps {
  subject: Subject;
  progress: number;
  masteredCount: number;
  style?: React.CSSProperties;
}

/** Segmented progress: one bar per unit, filled red when mastered. The design he asked to keep. */
const SegmentedProgress: React.FC<{ subject: Subject }> = ({ subject }) => {
  const { userProgress } = useData();
  return (
    <div className="flex gap-1.5">
      {subject.units.map(u => {
        const st = userProgress.find(p => p.unitId === u.id)?.status;
        const done = st === UnitStatus.MASTERED;
        return (
          <span
            key={u.id}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${done ? 'bg-[#F63C49]' : 'bg-white/[0.12]'}`}
          />
        );
      })}
    </div>
  );
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, progress, masteredCount, style }) => {
  const totalUnits = subject.units.length;
  const activeUnitIdx = Math.min(masteredCount, totalUnits - 1);
  const activeUnitTitle = subject.units[activeUnitIdx]?.title || 'Revision Phase';
  const pct = Math.round((masteredCount / totalUnits) * 100);

  return (
    <Link
      to={`/app/subject/${subject.id}`}
      className="group relative flex flex-col justify-between h-[280px] rounded-3xl surface-1 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 hover:border-white/20 transition-[border-color] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={style}
    >
      <div className="relative z-10 p-7 flex flex-col h-full">
        <div className="flex justify-between items-start mb-auto">
           <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                <Layers size={10} className="text-white/40" />
                <span className="text-[10px] font-bold font-display text-white/70 tracking-wider uppercase">{subject.code}</span>
              </div>
              {masteredCount > 0 && (
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D61A40]"></span>
                    <span className="text-[10px] font-bold tracking-widest text-[#F63C49] uppercase">Active</span>
                </div>
              )}
           </div>

           <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-[#D61A40] group-hover:text-white group-hover:border-[#D61A40] transition-[background-color,color,border-color] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
             <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]" />
           </div>
        </div>

        <div className="mt-6 mb-8">
            <h3 className="text-2xl font-display font-bold text-white leading-[1.1] mb-2 tracking-tight">
            {subject.name}
            </h3>
            <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">
            {subject.credits} Credits - {totalUnits} Units
            </p>
        </div>

        <div className="mt-auto">
            <div className="flex justify-between items-end mb-3">
                <div className="max-w-[70%]">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Current focus</p>
                     <p className="text-sm text-white font-bold truncate">{activeUnitTitle}</p>
                </div>
                <span className="text-2xl font-display font-bold text-white/50">{pct}%</span>
            </div>
            <SegmentedProgress subject={subject} />
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;

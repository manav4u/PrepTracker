import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Subject, UnitStatus } from '../types';
import { ArrowRight, Layers } from 'lucide-react';
import { conceptFromSearch } from '../pages/SubjectDetail';
import { useData } from '../context/DataContext';

interface SubjectCardProps {
  subject: Subject;
  progress: number;
  masteredCount: number;
  style?: React.CSSProperties;
}

/** Per-unit blocks: filled red where mastered. Used by concepts b and c. */
const UnitBlocks: React.FC<{ subject: Subject; filled: number }> = ({ subject, filled }) => (
  <div className="flex gap-1 h-1">
    {subject.units.map((u, i) => (
      <div key={u.id} className={`flex-1 rounded-sm transition-colors duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${i < filled ? 'bg-[#D61A40]' : 'bg-white/10'}`} />
    ))}
  </div>
);

/** Mini shelf for concept b: one small spine per unit, filled by real status. */
const MiniShelf: React.FC<{ subject: Subject }> = ({ subject }) => {
  const { userProgress } = useData();
  return (
    <div>
      <div className="flex items-end gap-1">
        {subject.units.map(u => {
          const st = userProgress.find(p => p.unitId === u.id)?.status;
          return (
            <span key={u.id} className="w-2.5 h-6 rounded-t-[2px] bg-white/[0.08] relative overflow-hidden">
              {st === UnitStatus.MASTERED && <span className="absolute inset-0 bg-[#D61A40]" />}
              {st === UnitStatus.IN_PROGRESS && <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[#D61A40]" />}
            </span>
          );
        })}
      </div>
      <div className="h-[2px] rounded-full bg-white/[0.12] mt-px" />
    </div>
  );
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, progress, masteredCount, style }) => {
  const [params] = useSearchParams();
  const concept = conceptFromSearch(params.toString() ? `?${params.toString()}` : '');
  const totalUnits = subject.units.length;
  const activeUnitIdx = Math.min(masteredCount, totalUnits - 1);
  const activeUnitTitle = subject.units[activeUnitIdx]?.title || 'Revision Phase';
  const pct = Math.round((masteredCount / totalUnits) * 100);

  return (
    <Link
      to={`/app/subject/${subject.id}${concept === 'a' ? '' : `?c=${concept}`}`}
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

        {/* Bottom Section - per concept */}
        <div className="mt-auto">
            <div className="flex justify-between items-end mb-3">
                <div className="max-w-[70%]">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                       {concept === 'c' ? 'Up next' : 'Current focus'}
                     </p>
                     <p className="text-sm text-white font-bold truncate">{activeUnitTitle}</p>
                </div>
                {concept === 'a' ? (
                  <span className="font-mono text-xs text-slate-400">{masteredCount}/{totalUnits}</span>
                ) : (
                  <span className="text-2xl font-display font-bold text-white/50">{pct}%</span>
                )}
            </div>
            {concept === 'a' ? (
              <div className="flex items-baseline gap-3">
                <span className="flex-1 border-b border-dotted border-white/15 -translate-y-1" />
                <span className="font-mono text-[10px] text-slate-600">{pct}%</span>
              </div>
            ) : concept === 'b' ? (
              <MiniShelf subject={subject} />
            ) : (
              <UnitBlocks subject={subject} filled={masteredCount} />
            )}
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Subject } from '../types';
import { ArrowRight, Layers } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  progress: number;
  masteredCount: number;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, progress, masteredCount }) => {
  const totalUnits = subject.units.length;
  const activeUnitIdx = Math.min(masteredCount, totalUnits - 1);
  const activeUnitTitle = subject.units[activeUnitIdx]?.title || 'Revision Phase';

  return (
    <Link to={`/subject/${subject.id}`} className="group relative flex flex-col justify-between h-[280px] rounded-3xl bg-[#080808] border border-white/5 overflow-hidden hover:border-[#E11D48]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#E11D48]/10">
      
      {/* Dynamic Gradient Glow - Restored */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E11D48] opacity-0 blur-[100px] rounded-full group-hover:opacity-25 group-hover:scale-125 transition-all duration-700 ease-in-out pointer-events-none"></div>
      
      {/* Subtle Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Top Section */}
      <div className="relative z-10 p-7 flex flex-col h-full">
        <div className="flex justify-between items-start mb-auto">
           <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 backdrop-blur-md flex items-center gap-2 group-hover:bg-white/10 transition-colors">
                <Layers size={10} className="text-white/40 group-hover:text-[#E11D48] transition-colors" />
                <span className="text-[10px] font-bold font-display text-white/70 tracking-wider uppercase">{subject.code}</span>
              </div>
              {masteredCount > 0 && (
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse"></span>
                    <span className="text-[10px] font-bold tracking-widest text-[#E11D48] uppercase">Active</span>
                </div>
              )}
           </div>
           
           <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-[#E11D48] group-hover:text-white group-hover:border-[#E11D48] transition-all duration-300 shadow-lg shadow-transparent group-hover:shadow-[#E11D48]/20">
             <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
           </div>
        </div>

        <div className="mt-6 mb-8">
            <h3 className="text-2xl font-display font-bold text-white leading-[1.1] mb-2 group-hover:translate-x-1 transition-transform duration-300 tracking-tight">
            {subject.name}
            </h3>
            <p className="text-xs text-slate-500 font-bold tracking-wide group-hover:text-slate-400 transition-colors uppercase">
            {subject.credits} Credits • {totalUnits} Units Sequence
            </p>
        </div>

        {/* Bottom Section - Progress */}
        <div className="mt-auto">
            <div className="flex justify-between items-end mb-3">
                <div className="max-w-[70%]">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1 group-hover:text-[#E11D48] transition-colors">Current Focus</p>
                     <p className="text-sm text-white font-bold truncate">{activeUnitTitle}</p>
                </div>
                <span className="text-2xl font-display font-bold text-white/20 group-hover:text-white transition-colors">
                    {Math.round((masteredCount / totalUnits) * 100)}%
                </span>
            </div>

            {/* Architectural Progress Bar */}
            <div className="flex gap-1 h-1">
                {Array.from({length: totalUnits}).map((_, i) => (
                <div 
                    key={i} 
                    className={`flex-1 rounded-sm transition-all duration-500 ${
                    i < masteredCount 
                        ? 'bg-[#E11D48] shadow-[0_0_8px_#E11D48]' 
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}
                ></div>
                ))}
            </div>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;

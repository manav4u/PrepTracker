
import React from 'react';
import { MapPin, Globe, PiggyBank, Keyboard, Settings, LogOut, X, Check, Trash, Upload, Eye, Book, Folder, Mic } from 'lucide-react';

interface SubjectCardProps {
  subject: { id: string; name: string; code: string; units: { id: string; title: string }[] };
  progress: number;
  masteredCount: number;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, progress, masteredCount }) => {
  const unitProgresses = subject.units.map((unit) => {
    // Progress is already computed externally, use average based on progress prop
    return 50; // placeholder - progress is displayed externally
  });

  return (
    <div className="rounded-2xl surface-1 p-4 lg:p-5 border border-white/10 hover:border-[#F63C49]/40 transition-colors duration-200 group hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="text-[#F63C49] h-5 w-5" />
        <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-slate-500">{subject.name}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl lg:text-4xl font-display font-bold tracking-tighter text-white">{progress}</span>
        <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500">of {subject.units.length} units</span>
      </div>

      <div className="flex gap-1.5" style={{ height: '16px' }}>
        {subject.units.map((_, i) => (
          <span key={i} className={`flex-1 rounded-full transition-colors duration-200 bg-white/10}`}></span>
        ))}
      </div>

      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-2">Mastered: {masteredCount}</p>
    </div>
  );
};

export default SubjectCard;

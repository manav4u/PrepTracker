import React from 'react';
import { Check } from 'lucide-react';
import { UnitStatus } from '../../types';

export const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

const STEPS = [
  { status: UnitStatus.NOT_STARTED, label: 'Start' },
  { status: UnitStatus.IN_PROGRESS, label: 'Studying' },
  { status: UnitStatus.MASTERED, label: 'Done' },
];

/** The three unit states, three looks. Same clicks everywhere. */
export const StatusSteps: React.FC<{
  value: UnitStatus;
  onChange: (s: UnitStatus) => void;
  look: 'text' | 'pill' | 'segments';
}> = ({ value, onChange, look }) => {
  if (look === 'text') {
    return (
      <div className="flex items-center gap-2" role="group" aria-label="Unit status">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.status}>
            {i > 0 && <span className="text-white/15 select-none">/</span>}
            <button
              type="button"
              onClick={() => onChange(s.status)}
              aria-pressed={value === s.status}
              aria-label={`Mark unit as ${s.label}`}
              className={`text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${EASE} ${
                value === s.status ? 'text-[#F63C49]' : 'text-slate-600 hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  }
  if (look === 'pill') {
    return (
      <div className="flex rounded-full border border-white/10 p-0.5" role="group" aria-label="Unit status">
        {STEPS.map(s => (
          <button
            key={s.status}
            type="button"
            onClick={() => onChange(s.status)}
            aria-pressed={value === s.status}
            aria-label={`Mark unit as ${s.label}`}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-[background-color,color] ${EASE} ${
              value === s.status ? 'bg-white text-black' : 'text-slate-500 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-white/10" role="group" aria-label="Unit status">
      {STEPS.map((s, i) => (
        <button
          key={s.status}
          type="button"
          onClick={() => onChange(s.status)}
          aria-pressed={value === s.status}
          aria-label={`Mark unit as ${s.label}`}
          className={`py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-[background-color,color] ${EASE} ${i > 0 ? 'border-l border-white/10' : ''} ${
            value === s.status ? 'bg-[#D61A40] text-white' : 'bg-white/[0.03] text-slate-500 hover:text-white'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

/** Topic checklist. */
export const TopicList: React.FC<{
  topics: string[];
  done: string[];
  onToggle: (t: string) => void;
  look: 'lines' | 'page' | 'grid';
}> = ({ topics, done, onToggle, look }) => (
  <ul className={look === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1' : 'flex flex-col'}>
    {topics.map((t, idx) => {
      const isDone = done.includes(t);
      return (
        <li key={idx} className={look === 'lines' ? 'border-b border-white/[0.06] last:border-0' : ''}>
          <button
            type="button"
            role="checkbox"
            aria-checked={isDone}
            onClick={() => onToggle(t)}
            className={`w-full text-left text-sm flex items-start gap-3 py-2.5 rounded-lg transition-colors ${EASE} hover:bg-white/[0.04] px-2 -mx-2 ${
              isDone ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            <span className={`mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center border transition-[background-color,border-color] ${EASE} ${
              look === 'page' ? 'rounded-full' : 'rounded'
            } ${isDone ? 'bg-[#D61A40] border-[#D61A40]' : 'border-white/20'}`}>
              {isDone && <Check size={10} strokeWidth={3.5} className="text-white" />}
            </span>
            <span className={`leading-relaxed font-medium ${isDone ? 'line-through decoration-white/20' : ''}`}>{t}</span>
          </button>
        </li>
      );
    })}
  </ul>
);

/** PYQ year toggles. */
export const PyqRow: React.FC<{
  years: string[];
  solved: string[];
  onToggle: (y: string) => void;
  labelFor: (y: string) => string;
  look: 'tags' | 'ribbon' | 'chips';
}> = ({ years, solved, onToggle, labelFor, look }) => (
  <div className={look === 'ribbon' ? 'flex gap-4' : 'flex gap-2'}>
    {years.map(year => {
      const isSolved = solved.includes(year);
      if (look === 'ribbon') {
        // Bookmark ribbon: a tab with a notch cut from the bottom edge.
        return (
          <button
            key={year}
            type="button"
            onClick={() => onToggle(year)}
            aria-label={labelFor(year)}
            aria-pressed={isSolved}
            className={`px-3 pt-2 pb-3 text-[11px] font-bold font-mono tracking-wider transition-[background-color,color] ${EASE} ${
              isSolved ? 'bg-[#D61A40] text-white' : 'bg-white/[0.06] text-slate-500 hover:text-white'
            }`}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 7px), 0 100%)' }}
          >
            {year}
          </button>
        );
      }
      return (
        <button
          key={year}
          type="button"
          onClick={() => onToggle(year)}
          aria-label={labelFor(year)}
          aria-pressed={isSolved}
          className={`flex items-center gap-2 px-3 py-2 text-[11px] font-bold font-mono tracking-wider transition-[background-color,border-color,color] ${EASE} ${
            look === 'tags' ? 'rounded-md border' : 'rounded-full border'
          } ${
            isSolved
              ? 'bg-[#D61A40] border-[#D61A40] text-white'
              : 'bg-transparent border-white/15 text-slate-500 hover:border-white/40 hover:text-white'
          }`}
        >
          {year}
          {isSolved && <Check size={10} strokeWidth={3.5} />}
        </button>
      );
    })}
  </div>
);

import React from 'react';
import { Check } from 'lucide-react';
import { UnitStatus } from '../../types';

export const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

const STEPS = [
  { status: UnitStatus.NOT_STARTED, label: 'Start' },
  { status: UnitStatus.IN_PROGRESS, label: 'Studying' },
  { status: UnitStatus.MASTERED, label: 'Done' },
];

/** The three unit states as a small pill control. */
export const StatusSteps: React.FC<{
  value: UnitStatus;
  onChange: (s: UnitStatus) => void;
}> = ({ value, onChange }) => (
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

/** Topic checklist: page lines with round ticks. */
export const TopicList: React.FC<{
  topics: string[];
  done: string[];
  onToggle: (t: string) => void;
}> = ({ topics, done, onToggle }) => (
  <ul className="flex flex-col">
    {topics.map((t, idx) => {
      const isDone = done.includes(t);
      return (
        <li key={idx}>
          <button
            type="button"
            role="checkbox"
            aria-checked={isDone}
            onClick={() => onToggle(t)}
            className={`w-full text-left text-sm flex items-start gap-3 py-2.5 rounded-lg transition-colors ${EASE} hover:bg-white/[0.04] px-2 -mx-2 ${
              isDone ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            <span className={`mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center border rounded-full transition-[background-color,border-color] ${EASE} ${
              isDone ? 'bg-[#D61A40] border-[#D61A40]' : 'border-white/20'
            }`}>
              {isDone && <Check size={10} strokeWidth={3.5} className="text-white" />}
            </span>
            <span className={`leading-relaxed font-medium ${isDone ? 'line-through decoration-white/20' : ''}`}>{t}</span>
          </button>
        </li>
      );
    })}
  </ul>
);

/** PYQ years as notched bookmark ribbons. */
export const PyqRow: React.FC<{
  years: string[];
  solved: string[];
  onToggle: (y: string) => void;
  labelFor: (y: string) => string;
}> = ({ years, solved, onToggle, labelFor }) => (
  <div className="flex gap-4">
    {years.map(year => {
      const isSolved = solved.includes(year);
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
    })}
  </div>
);

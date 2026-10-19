import React from 'react';
import StepArt from './StepArt';
import CheckRing from './CheckRing';

const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';
const STEPS = [
  { at: 10, label: 'Saving your profile' },
  { at: 30, label: 'Setting up your subjects' },
  { at: 60, label: 'Saving preferences' },
  { at: 85, label: 'Building your dashboard' },
];

/** The "setting up" screen: drawing, one solid progress bar, and a checklist that ticks as it goes. */
const SetupScreen: React.FC<{ percent: number; title: string; log?: string; checklist?: boolean }> = ({ percent, title, log, checklist }) => (
  <div className="w-full max-w-md mx-auto flex flex-col items-center text-center pt-10 pb-6">
    <StepArt kind="build" className="w-40 h-40 lg:w-48 lg:h-48" />
    <h2 className="mt-6 font-display font-bold text-4xl lg:text-5xl tracking-tight text-white leading-none">{title}<span className="text-[#F63C49]">.</span></h2>
    <p className="mt-3 h-5 text-sm text-slate-500">{log}</p>

    <div className="mt-8 w-full">
      <div className="flex items-end justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Progress</span>
        <span className="font-display font-bold text-2xl leading-none text-white tabular-nums">{Math.min(100, Math.round(percent))}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/[0.06] border border-white/10 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)} aria-label="Setup progress">
        <div className={`h-full rounded-full bg-[#F63C49] transition-[width] ${EASE}`} style={{ width: `${percent}%` }} />
      </div>
    </div>

    {checklist && (
      <ul className="mt-8 w-full space-y-2.5 text-left">
        {STEPS.map(s => {
          const done = percent >= s.at;
          return (
            <li key={s.label} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${EASE} ${done ? 'border-white/[0.14] bg-[#18181d] text-white' : 'border-white/5 bg-white/[0.02] text-slate-600'}`}>
              <CheckRing on={done} className={done ? '!bg-[#F63C49] !border-[#F63C49]' : ''} />
              <span className="text-sm font-medium">{s.label}</span>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

export default SetupScreen;

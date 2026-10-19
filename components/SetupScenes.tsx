import React from 'react';
import { CATALOG_INDEX } from '../lib/catalogLoader';

export interface SetupSummary { name: string; year: string; branch: string; sem: number | null; courses: { code: string; name: string }[]; count: number }

export function buildSummary(name: string, ids: string[]): SetupSummary {
  const found = ids.map(id => CATALOG_INDEX.courses.find(c => c.id === id)).filter(Boolean) as typeof CATALOG_INDEX.courses;
  const first = found[0];
  return {
    name: name.trim() || 'Student',
    year: first ? (first.year === 'SE' ? 'Second year' : 'Third year') : 'First year',
    branch: first ? first.branch : '',
    sem: first?.semester ?? null,
    courses: found.map(c => ({ code: c.code, name: c.name })),
    count: ids.length,
  };
}

const line = (s: SetupSummary) => [s.year, s.branch, s.sem ? `Semester ${s.sem}` : '', `${s.count} ${s.count === 1 ? 'course' : 'courses'}`].filter(Boolean).join(' - ');

const HEIGHTS = [82, 96, 76, 100, 88, 80, 98, 84];

/** His real courses stand up on a shelf, one more with each step. Spines carry the full subject name. */
export const Shelf: React.FC<{ s: SetupSummary; percent: number }> = ({ s, percent }) => {
  const n = Math.max(s.count, 1);
  const shown = Math.min(n, Math.ceil((percent / 100) * n));
  const wide = n <= 5;
  return (
    <div className="w-full">
      <div className="flex items-end gap-2 lg:gap-2.5 h-[17rem] lg:h-[19rem] px-1">
        <svg aria-hidden="true" viewBox="0 0 28 60" className="w-6 shrink-0 self-end" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 58V6M4 58h20M4 6h6" /></svg>
        <div className="flex-1 min-w-0 flex items-end justify-center gap-1.5 lg:gap-2 h-full">
          {Array.from({ length: n }).map((_, i) => {
            const c = s.courses[i];
            const label = c ? c.name : `Subject ${i + 1}`;
            const on = i < shown;
            const newest = on && i === shown - 1 && percent < 100;
            const h = HEIGHTS[i % HEIGHTS.length];
            return (
              <div key={i} className="h-full flex items-end" style={{ flex: '1 1 0', maxWidth: wide ? '4.2rem' : '3.2rem' }}>
                {on ? (
                  <div style={{ height: `${h}%`, animationDelay: `${(i % 3) * 70}ms` }} title={label} className={`pt-grow relative w-full rounded-t-lg border border-b-0 overflow-hidden transition-colors duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${newest ? 'bg-[#F63C49] border-[#F63C49] text-white' : 'bg-[#18181d] border-white/[0.14] text-white'} shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_3px_0_0_rgba(255,255,255,0.04),0_14px_22px_-8px_rgba(0,0,0,1)]`}>
                    <span className={`absolute inset-x-0 top-2.5 h-px ${newest ? 'bg-white/40' : 'bg-white/15'}`} />
                    <span className={`absolute inset-x-0 top-4 h-px ${newest ? 'bg-white/40' : 'bg-white/15'}`} />
                    <span className={`absolute inset-x-0 bottom-3 h-px ${newest ? 'bg-white/40' : 'bg-white/15'}`} />
                    <span className={`absolute inset-x-0 top-7 bottom-6 flex items-center justify-center`}>
                      <span className={`block max-h-full font-display font-bold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis [writing-mode:vertical-rl] rotate-180 ${wide ? 'text-[13px]' : 'text-[11.5px]'}`}>{label}</span>
                    </span>
                  </div>
                ) : <div style={{ height: `${h}%` }} className="w-full rounded-t-lg border-2 border-b-0 border-dashed border-white/10" />}
              </div>
            );
          })}
        </div>
        <svg aria-hidden="true" viewBox="0 0 32 60" className="w-7 shrink-0 self-end" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 58V30h20v28M6 30l2-4h16l2 4" /><path d="M12 26l-1-14M18 26l1-18M23 26l4-12" stroke="#F63C49" /></svg>
      </div>
      <div className="h-2 rounded-t-md bg-[#2a2a31] border border-white/[0.14] border-b-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]" />
      <div className="h-4 rounded-b-xl bg-[#18181d] border border-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_24px_-10px_rgba(0,0,0,1)]" />
      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{s.name}'s shelf - {shown} of {n}</span>
      </div>
      <p className="mt-2 text-center text-xs text-slate-600">{[s.year, s.branch, s.sem ? `Semester ${s.sem}` : ""].filter(Boolean).join(" - ")}</p>
    </div>
  );
};

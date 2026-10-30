import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useModalA11y } from './useModalA11y';
import { useData } from '../context/DataContext';
import { useSubjects } from '../context/SubjectsContext';
import { buildQueue, dayOf } from '../lib/revision';

const PROMPT_KEY = 'sppu_revise_prompt'; // local day the prompt was last shown

const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

/** Once-a-day prompt. Bottom sheet on phone, centered card on desktop. */
const ReviseSheet: React.FC<{ count: number; subjects: string[]; onClose: () => void }> = ({ count, subjects, onClose }) => {
  const ref = useModalA11y(true, onClose);
  // Focus the dialog itself, not a button, so no control shows a focus ring on open.
  useLayoutEffect(() => { ref.current?.focus(); }, [ref]);
  const shown = subjects.slice(0, 3);
  return (
    <div className="fixed inset-0 z-[80] flex items-end lg:items-center justify-center">
      <div onClick={onClose} aria-hidden="true" className={`absolute inset-0 bg-black/70 animate-in fade-in ${EASE}`}></div>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="revise-sheet-title"
        tabIndex={-1}
        className={`relative outline-none w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl border border-white/10 surface-1 p-6 lg:p-8 pb-8 animate-in fade-in slide-in-from-bottom-8 ${EASE}`}
      >
        <p id="revise-sheet-title" className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {count === 1 ? 'Topic to revise today' : 'Topics to revise today'}
        </p>
        <p className="mt-2 leading-none text-7xl lg:text-8xl tabular-nums text-[#F63C49]" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{count}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          {shown.map((n) => (
            <span key={n} className="inline-flex items-center h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300 max-w-full truncate">{n}</span>
          ))}
          {subjects.length > shown.length && (
            <span className="inline-flex items-center h-7 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">+{subjects.length - shown.length} more {subjects.length - shown.length === 1 ? 'subject' : 'subjects'}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-7">
          <button
            type="button"
            onClick={onClose}
            className={`h-14 rounded-full border border-white/15 text-xs font-bold uppercase tracking-[0.14em] text-slate-200 whitespace-nowrap transition-colors ${EASE} hover:border-white/40 hover:text-white active:bg-white/5`}
          >
            Later
          </button>
          <Link
            to="/app/revise"
            onClick={onClose}
            className={`h-14 rounded-full bg-[#F63C49] flex items-center justify-center text-xs font-bold uppercase tracking-[0.14em] text-white whitespace-nowrap transition-colors ${EASE} hover:bg-[#ff5560] active:bg-[#d92f3b]`}
          >
            Start
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReviseSheet;

/** Opens the sheet on the first Dashboard visit of the day, only when reviews are due. */
export const DailyRevisePrompt: React.FC = () => {
  const { profile, userProgress, reviews } = useData();
  const { subjects: allSubjects } = useSubjects();
  const [open, setOpen] = useState(false);
  const queue = useMemo(
    () => buildQueue(allSubjects, profile?.selectedSubjects || [], userProgress, profile?.events || [], reviews).today,
    [allSubjects, profile?.selectedSubjects, profile?.events, userProgress, reviews]
  );
  const subjects = useMemo(() => Array.from(new Set(queue.map((i) => i.subjectName))), [queue]);
  const [snapshot, setSnapshot] = useState<{ count: number; subjects: string[] }>({ count: 0, subjects: [] });

  useEffect(() => {
    if (open || queue.length === 0 || document.documentElement.classList.contains("pt-tour-open")) return;
    let seen: string | null = null;
    try { seen = localStorage.getItem(PROMPT_KEY); } catch { /* storage blocked: show once per visit */ }
    const today = dayOf(new Date());
    if (seen === today) return;
    try { localStorage.setItem(PROMPT_KEY, today); } catch { /* ignore */ }
    setSnapshot({ count: queue.length, subjects });
    setOpen(true);
  }, [queue.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;
  return <ReviseSheet count={snapshot.count} subjects={snapshot.subjects} onClose={() => setOpen(false)} />;
};

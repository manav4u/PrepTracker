import React, { useMemo, useState } from 'react';
import { Zap } from 'lucide-react';
import { CATALOG_INDEX } from '../lib/catalogLoader';
import type { CatalogEntry } from '../lib/catalog';

type Year = 'SE' | 'TE';
const SEMESTERS: Record<Year, number[]> = { SE: [3, 4], TE: [5, 6] };

const chip = (on: boolean, off = false) =>
  `w-full text-left px-5 py-4 rounded-2xl border transition-colors duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
    off
      ? 'bg-black border-white/5 text-slate-600 cursor-default'
      : on
        ? 'bg-white text-black border-white'
        : 'bg-black border-white/10 text-slate-300 hover:border-white/30'
  }`;

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-3">
    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{children}</span>
    <div className="h-px bg-white/10 flex-1" />
  </div>
);

/** Pick year, branch, semester and courses for second and third year. Calls onDone with the course ids. */
const CoursePicker: React.FC<{ year: Year; onDone: (ids: string[]) => void }> = ({ year, onDone }) => {
  const [branch, setBranch] = useState<string | null>(null);
  const [sem, setSem] = useState<number | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  const branches = useMemo(() => {
    const m = new Map<string, { slug: string; name: string; ready: boolean }>();
    for (const c of CATALOG_INDEX.courses) {
      if (c.year !== year) continue;
      const cur = m.get(c.branchSlug) || { slug: c.branchSlug, name: c.branch, ready: false };
      if (c.trackerReady) cur.ready = true;
      m.set(c.branchSlug, cur);
    }
    return [...m.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [year]);

  const courses = useMemo(
    () => CATALOG_INDEX.courses.filter(c => c.branchSlug === branch && c.semester === sem && c.trackerReady),
    [branch, sem]
  );

  const groups = useMemo(() => {
    const g = new Map<string, CatalogEntry[]>();
    for (const c of courses) if (c.electiveGroup) g.set(c.electiveGroup, [...(g.get(c.electiveGroup) || []), c]);
    return g;
  }, [courses]);
  const fixed = courses.filter(c => !c.electiveGroup);

  const pickBranch = (slug: string) => { setBranch(slug); setSem(null); setPicked([]); };
  const pickSem = (s: number) => {
    setSem(s);
    // Core courses start selected; electives and minors are the student's choice.
    setPicked(CATALOG_INDEX.courses.filter(c => c.branchSlug === branch && c.semester === s && c.trackerReady && !c.electiveGroup && c.type !== 'Minor').map(c => c.id));
  };
  const toggle = (c: CatalogEntry) => setPicked(p => {
    if (p.includes(c.id)) return p.filter(x => x !== c.id);
    // one elective per group: choosing another replaces the earlier one
    const rest = c.electiveGroup ? p.filter(id => CATALOG_INDEX.courses.find(x => x.id === id)?.electiveGroup !== c.electiveGroup) : p;
    return [...rest, c.id];
  });

  return (
    <div className="space-y-8">
      <div>
        <Label>Branch</Label>
        <div className="space-y-2">
          {branches.map(b => (
            <button key={b.slug} disabled={!b.ready} onClick={() => pickBranch(b.slug)} className={chip(branch === b.slug, !b.ready)}>
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold">{b.name}</span>
                {!b.ready && <span className="text-[9px] font-mono uppercase tracking-widest">Reference only</span>}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
          More branches are coming.{branches.some(b => !b.ready) && ' Reference only means tracking is not set up for that branch yet.'}
        </p>
      </div>

      {branch && (
        <div>
          <Label>Semester</Label>
          <div className="grid grid-cols-2 gap-3">
            {SEMESTERS[year].map(s => (
              <button key={s} onClick={() => pickSem(s)} className={chip(sem === s)}>
                <span className="text-sm font-bold">Semester {s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {sem && (
        <div className="space-y-6">
          <div>
            <Label>Courses</Label>
            <div className="space-y-2">
              {fixed.map(c => (
                <button key={c.id} onClick={() => toggle(c)} className={chip(picked.includes(c.id))} aria-pressed={picked.includes(c.id)}>
                  <span className="block text-[9px] font-mono uppercase tracking-widest opacity-60 mb-1">{c.code}{c.type === 'Minor' ? ' - optional' : ''}</span>
                  <span className="text-sm font-bold">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          {[...groups.entries()].map(([g, list]) => (
            <div key={g}>
              <Label>{g} - pick one</Label>
              <div className="space-y-2">
                {list.map(c => (
                  <button key={c.id} onClick={() => toggle(c)} className={chip(picked.includes(c.id))} aria-pressed={picked.includes(c.id)}>
                    <span className="block text-[9px] font-mono uppercase tracking-widest opacity-60 mb-1">{c.code}</span>
                    <span className="text-sm font-bold">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {picked.length} subject{picked.length === 1 ? '' : 's'} - you can change them later in Settings
          </p>
          <button
            disabled={picked.length === 0}
            onClick={() => onDone(picked)}
            className="w-full py-5 bg-[#D61A40] text-white font-bold uppercase tracking-[0.2em] rounded-xl transition-colors duration-[250ms] hover:bg-[#B3123B] disabled:opacity-40 flex items-center justify-center gap-3"
          >
            <Zap size={18} className="fill-white" /> Start PrepTracker
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePicker;

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useSubjects } from '../context/SubjectsContext';
import { useData } from '../context/DataContext';

interface Hit { key: string; title: string; sub: string; to: string; group: 'Syllabus' | 'Tasks' | 'Resources'; }

const GlobalSearch: React.FC<{ selectedSubjects: string[]; overlay?: boolean; onNavigate?: () => void }> = ({ selectedSubjects, overlay = false, onNavigate }) => {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(overlay);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { tasks, resources } = useData();
  const { subjects: allSubjects } = useSubjects();

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const out: Hit[] = [];
    for (const s of allSubjects.filter(x => selectedSubjects.includes(x.id))) {
      if (s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term)) {
        out.push({ key: s.id, title: s.name, sub: s.code, to: `/app/subject/${s.id}`, group: 'Syllabus' });
      }
      for (const u of s.units) {
        if (u.title.toLowerCase().includes(term)) out.push({ key: u.id, title: u.title, sub: `${s.code} · Unit ${u.unit_number}`, to: `/app/subject/${s.id}`, group: 'Syllabus' });
        for (const t of u.topics || []) {
          if (t.toLowerCase().includes(term)) out.push({ key: `${u.id}:${t}`, title: t, sub: `${s.code} · Unit ${u.unit_number}`, to: `/app/subject/${s.id}`, group: 'Syllabus' });
        }
      }
    }
    for (const t of tasks) {
      if (t.text.toLowerCase().includes(term)) {
        out.push({ key: `task:${t.id}`, title: t.text, sub: `Task · ${(t.priority || 'NORMAL').toLowerCase()}${t.completed ? ' · done' : ''}`, to: '/app/tasks', group: 'Tasks' });
      }
    }
    for (const r of resources) {
      if (r.title.toLowerCase().includes(term) || r.author.toLowerCase().includes(term)) {
        out.push({ key: `res:${r.id}`, title: r.title, sub: `Resource · ${r.subject}`, to: '/app/resources', group: 'Resources' });
      }
    }
    return out.slice(0, 10);
  }, [q, selectedSubjects, tasks, resources, allSubjects]);

  useEffect(() => {
    if (overlay) return; // overlay mode closes via its own button
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [overlay]);

  const go = (h: Hit) => { navigate(h.to); setQ(''); setOpen(overlay); onNavigate?.(); };

  let lastGroup = '';

  return (
    <div className={`relative group ${overlay ? 'w-full' : ''}`} ref={ref}>
      <Search className="absolute left-4 top-4 text-white/30 group-focus-within:text-white transition-colors pointer-events-none" size={18} />
      <input
        type="text"
        aria-label="Search subjects, units, topics, tasks and resources"
        placeholder="Search subjects, tasks, resources..."
        value={q}
        autoFocus={overlay}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, hits.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
          else if (e.key === 'Enter' && hits[active]) go(hits[active]);
          else if (e.key === 'Escape') { setOpen(false); onNavigate?.(); }
        }}
        className={`bg-white/5 border border-white/5 rounded-full pl-12 pr-6 py-3 text-xs font-medium focus:bg-white/10 focus:border-white/10 outline-none transition-all placeholder:text-white/20 ${
          overlay ? 'w-full' : 'w-64 focus:w-80'
        }`}
      />
      {open && q.trim().length >= 2 && (
        <div className={overlay
          ? 'mt-3 w-full bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden'
          : 'absolute right-0 top-[calc(100%+8px)] w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden'
        } role="listbox">
          {hits.length === 0 ? (
            <p className="px-4 py-3 text-xs text-slate-500">No match in your subjects, tasks or resources.</p>
          ) : hits.map((h, i) => {
            const header = h.group !== lastGroup ? (lastGroup = h.group, h.group) : null;
            return (
              <React.Fragment key={h.key}>
                {header && <p className="px-4 pt-3 pb-1 text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-slate-600">{header}</p>}
                <button
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(h)}
                  className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors ${i === active ? 'bg-white/10' : ''}`}
                >
                  <span className="text-xs font-bold text-white truncate">{h.title}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{h.sub}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;

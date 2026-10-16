import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SUBJECTS } from '../constants';

interface Hit { key: string; subjectId: string; title: string; sub: string; }

const GlobalSearch: React.FC<{ selectedSubjects: string[] }> = ({ selectedSubjects }) => {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const out: Hit[] = [];
    for (const s of SUBJECTS.filter(x => selectedSubjects.includes(x.id))) {
      if (s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term)) {
        out.push({ key: s.id, subjectId: s.id, title: s.name, sub: s.code });
      }
      for (const u of s.units) {
        if (u.title.toLowerCase().includes(term)) out.push({ key: u.id, subjectId: s.id, title: u.title, sub: `${s.code} · Unit ${u.unit_number}` });
        for (const t of u.topics || []) {
          if (t.toLowerCase().includes(term)) out.push({ key: `${u.id}:${t}`, subjectId: s.id, title: t, sub: `${s.code} · Unit ${u.unit_number}` });
        }
      }
    }
    return out.slice(0, 8);
  }, [q, selectedSubjects]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (h: Hit) => { navigate(`/subject/${h.subjectId}`); setQ(''); setOpen(false); };

  return (
    <div className="relative group" ref={ref}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={18} />
      <input
        type="text"
        aria-label="Search subjects, units and topics"
        placeholder="Search subjects, units, topics..."
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, hits.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
          else if (e.key === 'Enter' && hits[active]) go(hits[active]);
          else if (e.key === 'Escape') setOpen(false);
        }}
        className="bg-white/5 border border-white/5 rounded-full pl-12 pr-6 py-3 text-xs font-medium w-64 focus:w-80 focus:bg-white/10 focus:border-white/10 outline-none transition-all placeholder:text-white/20"
      />
      {open && q.trim().length >= 2 && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden" role="listbox">
          {hits.length === 0 ? (
            <p className="px-4 py-3 text-xs text-slate-500">No match in your subjects.</p>
          ) : hits.map((h, i) => (
            <button
              key={h.key}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(h)}
              className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors ${i === active ? 'bg-white/10' : ''}`}
            >
              <span className="text-xs font-bold text-white truncate">{h.title}</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{h.sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Subject } from '../types';
import { useSubjects } from '../context/SubjectsContext';
import {
  ActivityProfile,
  StudyEvent,
  eventsForDay,
  heatmapWeeks,
  dayKey,
  type HeatLevel,
} from '../lib/activity';

const LEVEL_CLASS: Record<HeatLevel, string> = {
  0: 'bg-white/[0.05]',
  1: 'bg-[#F63C49]/25',
  2: 'bg-[#F63C49]/45',
  3: 'bg-[#F63C49]/70',
  4: 'bg-[#F63C49] shadow-[0_0_8px_rgba(246,60,73,0.5)]',
};

const eventLine = (e: StudyEvent, allSubjects: Subject[]): { title: string; sub: string } => {
  const subject = allSubjects.find(s => s.id === e.subjectId);
  const subjectName = subject?.name || e.subjectId;
  const unit = subject?.units.find(u => u.id === e.unitId);
  const unitLabel = unit ? `Unit ${unit.unit_number}` : '';
  if (e.kind === 'topic') {
    return { title: `Ticked "${e.topic}"`, sub: [subjectName, unitLabel].filter(Boolean).join(' - ') };
  }
  if (e.kind === 'review') {
    return { title: `Revised "${e.topic}"`, sub: [subjectName, unitLabel].filter(Boolean).join(' - ') };
  }
  if (e.kind === 'pyq') {
    return { title: `PYQ ${e.topic} completed`, sub: [subjectName, unitLabel].filter(Boolean).join(' - ') };
  }
  return { title: `${unitLabel || 'Unit'} status updated`, sub: subjectName };
};

const ActivityHeatmap: React.FC<{ profile: ActivityProfile; style?: React.CSSProperties }> = ({ profile, style }) => {
  const { subjects: allSubjects } = useSubjects();
  const today = dayKey(new Date());
  const [selected, setSelected] = useState(today);
  const weeks = useMemo(() => heatmapWeeks(profile, 3), [profile]);
  // Roving tabindex: the day grid is one tab stop, arrow keys move between days.
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const flatDays = useMemo(() => weeks.flatMap(w => w.cells), [weeks]);
  const cellCount = flatDays.length;
  const todayIdx = Math.max(0, flatDays.findIndex(c => c.day === today));
  const [focusedCell, setFocusedCell] = useState(todayIdx);
  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long' });
  const selectedEvents = eventsForDay(profile, selected);
  const listRef = useRef<HTMLDivElement>(null);
  // Bottom vignette strength: 1 while more rows sit below the fold, easing to 0 at the end.
  const updateFade = () => {
    const el = listRef.current;
    if (!el) return;
    const left = el.scrollHeight - el.clientHeight - el.scrollTop;
    el.style.setProperty('--fade', String(Math.max(0, Math.min(1, left / 24))));
  };
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
    updateFade();
  }, [selected, selectedEvents.length]);
  const selectedCount = profile.activity?.[selected] || 0;
  const selectedDate = new Date(`${selected}T00:00:00`);
  const selectedLabel = isNaN(selectedDate.getTime())
    ? selected
    : selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div
      style={style}
      className="relative rounded-3xl surface-1 p-5 lg:p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
    >
      {/* Header */}
      <div className="relative flex items-center gap-3 mb-4">
        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-500">Activity</span>
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-600">{monthLabel}</span>
      </div>

      {/* Grid + day detail: side by side on desktop, stacked on phone */}
      <div className="relative flex flex-col lg:flex-row lg:items-stretch gap-5">
        <div className="w-full lg:w-[340px] lg:flex-none min-w-0 lg:flex lg:flex-col">
          {/* 4 rows x 7 columns: each row is one week, Monday to Sunday */}
          <div className="flex flex-col gap-[2px] lg:flex-1" role="group" aria-label="Activity days. Use arrow keys to move between days.">
            {(() => { let idx = -1; return weeks.map((w, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-[2px] lg:flex-1">
                {w.cells.map((c) => {
                  idx++;
                  const cellIdx = idx;
                  const isToday = c.day === today;
                  const isSelected = c.day === selected;
                  return (
                    <button
                      key={c.day}
                      type="button"
                      ref={(el) => { cellRefs.current[cellIdx] = el; }}
                      tabIndex={cellIdx === focusedCell ? 0 : -1}
                      onFocus={() => setFocusedCell(cellIdx)}
                      onKeyDown={(e) => {
                        const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
                        const d = moves[e.key];
                        if (d === undefined) return;
                        e.preventDefault();
                        const next = Math.min(cellCount - 1, Math.max(0, cellIdx + d));
                        setFocusedCell(next);
                        cellRefs.current[next]?.focus();
                      }}
                      aria-label={`${c.day}: ${c.future ? 'upcoming' : c.count + ' study actions'}`}
                      onClick={() => !c.future && setSelected(c.day)}
                      className={`w-full h-[26px] lg:h-auto lg:min-h-[28px] rounded-[3px] transition-all duration-200 ${LEVEL_CLASS[c.level]}
                        ${c.future ? 'opacity-25 cursor-default' : 'hover:scale-105 cursor-pointer'}
                        ${isToday ? 'ring-1 ring-white/80' : ''}
                        ${isSelected && !isToday ? 'ring-1 ring-[#F63C49]' : ''}`}
                    />
                  );
                })}
              </div>
            )); })()}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-[8px] font-mono uppercase text-slate-600 mr-1">Less</span>
            {([0, 1, 2, 3, 4] as HeatLevel[]).map(l => (
              <span key={l} className={`w-2.5 h-2.5 rounded-[3px] ${LEVEL_CLASS[l]}`}></span>
            ))}
            <span className="text-[8px] font-mono uppercase text-slate-600 ml-1">More</span>
          </div>
        </div>

        {/* Day detail: fixed height sized for five rows, scrolls inside, bottom vignette */}
        <div className="relative rounded-2xl surface-2 p-5 lg:p-7 w-full lg:flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 lg:mb-4 shrink-0">
            <p className="text-sm lg:text-lg font-display font-bold text-white tracking-tight">{selectedLabel}</p>
            <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {selectedCount === 0 ? 'No study' : `${selectedCount} action${selectedCount === 1 ? '' : 's'}`}
            </span>
          </div>
          <div
            ref={listRef}
            onScroll={updateFade}
            className="actions-scroll h-[300px] lg:h-[280px] overflow-y-auto overscroll-contain"
          >
            {selectedEvents.length > 0 ? (
              <ul>
                {selectedEvents.map((e, i) => {
                  const line = eventLine(e, allSubjects);
                  return (
                    <li key={i} className="flex items-start gap-3 lg:gap-4 h-[60px] lg:h-[56px]">
                      <span className="mt-1.5 lg:mt-2 w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-[2px] bg-[#F63C49] shrink-0"></span>
                      <div className="min-w-0">
                        <p className="text-xs lg:text-base font-medium text-white truncate">{line.title}</p>
                        <p className="text-[10px] lg:text-xs font-mono uppercase tracking-wider text-slate-500 truncate mt-0.5">{line.sub}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="h-full flex items-center">
                <p className="text-xs lg:text-sm text-slate-500">
                  {selectedCount > 0
                    ? `${selectedCount} study action${selectedCount === 1 ? '' : 's'} this day. Per-topic detail starts with the new study log.`
                    : 'No study recorded this day.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;

import React, { useMemo, useState } from 'react';
import { SUBJECTS } from '../constants';
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

const eventLine = (e: StudyEvent): { title: string; sub: string } => {
  const subject = SUBJECTS.find(s => s.id === e.subjectId);
  const subjectName = subject?.name || e.subjectId;
  const unit = subject?.units.find(u => u.id === e.unitId);
  const unitLabel = unit ? `Unit ${unit.unit_number}` : '';
  if (e.kind === 'topic') {
    return { title: `Ticked "${e.topic}"`, sub: [subjectName, unitLabel].filter(Boolean).join(' - ') };
  }
  if (e.kind === 'pyq') {
    return { title: `PYQ ${e.topic} completed`, sub: [subjectName, unitLabel].filter(Boolean).join(' - ') };
  }
  return { title: `${unitLabel || 'Unit'} status updated`, sub: subjectName };
};

const ActivityHeatmap: React.FC<{ profile: ActivityProfile; style?: React.CSSProperties }> = ({ profile, style }) => {
  const today = dayKey(new Date());
  const [selected, setSelected] = useState(today);
  const weeks = useMemo(() => heatmapWeeks(profile, 3), [profile]);
  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long' });
  const selectedEvents = eventsForDay(profile, selected);
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
      <div className="relative flex flex-col lg:flex-row lg:items-start gap-5">
        <div className="w-full lg:w-[340px] lg:flex-none min-w-0">
          {/* 4 rows x 7 columns: each row is one week, Monday to Sunday */}
          <div className="flex flex-col gap-[2px]">
            {weeks.map((w, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-[2px]">
                {w.cells.map((c) => {
                  const isToday = c.day === today;
                  const isSelected = c.day === selected;
                  return (
                    <button
                      key={c.day}
                      type="button"
                      aria-label={`${c.day}: ${c.future ? 'upcoming' : c.count + ' study actions'}`}
                      onClick={() => !c.future && setSelected(c.day)}
                      className={`w-full h-[26px] lg:h-[28px] rounded-[3px] transition-all duration-200 ${LEVEL_CLASS[c.level]}
                        ${c.future ? 'opacity-25 cursor-default' : 'hover:scale-105 cursor-pointer'}
                        ${isToday ? 'ring-1 ring-white/80' : ''}
                        ${isSelected && !isToday ? 'ring-1 ring-[#F63C49]' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
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

        {/* Day detail */}
        <div className="relative rounded-2xl surface-2 p-5 w-full lg:flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-display font-bold text-white tracking-tight">{selectedLabel}</p>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              {selectedCount === 0 ? 'No study' : `${selectedCount} action${selectedCount === 1 ? '' : 's'}`}
            </span>
          </div>
          {selectedEvents.length > 0 ? (
            <ul className="space-y-2.5">
              {selectedEvents.map((e, i) => {
                const line = eventLine(e);
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-[2px] bg-[#F63C49] shrink-0"></span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">{line.title}</p>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 truncate">{line.sub}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : selectedCount > 0 ? (
            <p className="text-xs text-slate-500">
              {selectedCount} study action{selectedCount === 1 ? '' : 's'} this day. Per-topic detail starts with the new study log.
            </p>
          ) : (
            <p className="text-xs text-slate-500">No study recorded this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;

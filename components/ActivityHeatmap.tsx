import React, { useMemo, useState } from 'react';
import { SUBJECTS } from '../constants';
import {
  ActivityProfile,
  StudyEvent,
  eventsForDay,
  lastNDays,
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
  const days = useMemo(() => lastNDays(profile, 30), [profile]);
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
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-600">Last 30 days</span>
      </div>

      {/* Horizontal strip: 30 cells, oldest left, today right */}
      <div className="relative flex gap-[3px]">
        {days.map((c) => {
          const isToday = c.day === today;
          const isSelected = c.day === selected;
          return (
            <button
              key={c.day}
              type="button"
              aria-label={`${c.day}: ${c.count} study actions`}
              onClick={() => setSelected(c.day)}
              className={`flex-1 aspect-square rounded-[3px] transition-all duration-200 ${LEVEL_CLASS[c.level]}
                hover:scale-110 cursor-pointer
                ${isToday ? 'ring-1 ring-white/80' : ''}
                ${isSelected && !isToday ? 'ring-1 ring-[#F63C49]' : ''}`}
            />
          );
        })}
      </div>

      {/* Day detail */}
      <div className="relative rounded-2xl surface-2 p-5 mt-5">
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
  );
};

export default ActivityHeatmap;

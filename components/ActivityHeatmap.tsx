import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityProfile,
  heatmapWeeks,
  type HeatLevel,
} from '../lib/activity';

// GitHub contribution-grid geometry: 10px cells, 3px gap, 2px radius.
const CELL = 10;
const GAP = 3;
const PITCH = CELL + GAP;

const LEVEL_CLASS: Record<HeatLevel, string> = {
  0: 'bg-white/[0.06]',
  1: 'bg-[#F63C49]/25',
  2: 'bg-[#F63C49]/45',
  3: 'bg-[#F63C49]/70',
  4: 'bg-[#F63C49] shadow-[0_0_6px_rgba(246,60,73,0.5)]',
};

interface Tip {
  day: string;
  count: number;
  x: number;
  topRow: boolean;
  pinned: boolean;
}

const tipText = (day: string, count: number): string => {
  const d = new Date(`${day}T00:00:00`);
  const when = isNaN(d.getTime()) ? day : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return count === 0 ? `No study on ${when}` : `${count} study action${count === 1 ? '' : 's'} on ${when}`;
};

const ActivityHeatmap: React.FC<{ profile: ActivityProfile; style?: React.CSSProperties }> = ({ profile, style }) => {
  const weeks = useMemo(() => heatmapWeeks(profile, 30), [profile]);
  const [tip, setTip] = useState<Tip | null>(null);
  const gridWidth = weeks.length * PITCH - GAP;

  const show = (day: string, count: number, col: number, row: number, pinned: boolean) => {
    const cx = col * PITCH + CELL / 2;
    setTip({ day, count, x: Math.min(Math.max(cx, 70), gridWidth - 70), topRow: row <= 1, pinned });
  };
  const hide = () => setTip(t => (t && t.pinned ? t : null));

  return (
    <div
      style={style}
      className="relative rounded-3xl surface-1 p-5 lg:p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
      onMouseLeave={hide}
    >
      {/* Header */}
      <div className="relative flex items-center gap-3 mb-4">
        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-500">Activity</span>
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-600">Last 30 days</span>
      </div>

      {/* GitHub-style grid: week columns, Sunday at the top of each column */}
      <div className="relative" style={{ width: gridWidth }}>
        <div
          className="grid grid-flow-col"
          style={{ gridTemplateRows: `repeat(7, ${CELL}px)`, gap: GAP }}
          onClick={() => setTip(null)}
        >
          {weeks.map((week, col) =>
            week.map((cell, row) =>
              cell === null ? (
                <span key={`${col}-${row}`} style={{ width: CELL, height: CELL }} />
              ) : (
                <button
                  key={cell.day}
                  type="button"
                  aria-label={tipText(cell.day, cell.count)}
                  onMouseEnter={() => show(cell.day, cell.count, col, row, false)}
                  onMouseLeave={hide}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tip?.pinned && tip.day === cell.day) setTip(null);
                    else show(cell.day, cell.count, col, row, true);
                  }}
                  style={{ width: CELL, height: CELL }}
                  className={`rounded-[2px] transition-transform duration-150 cursor-pointer hover:ring-1 hover:ring-white/60 ${LEVEL_CLASS[cell.level]}`}
                />
              )
            )
          )}
        </div>

        {/* Tooltip, GitHub style */}
        {tip && (
          <div
            className={`pointer-events-none absolute z-10 left-0 whitespace-nowrap rounded-md bg-[#0d0f12] border border-white/10 px-2.5 py-1.5 text-[10px] font-medium text-slate-200 shadow-lg
              ${tip.topRow ? 'top-full mt-1.5' : '-translate-y-1.5'}`}
            style={{ left: tip.x, transform: `translateX(-50%)${tip.topRow ? '' : ' translateY(-6px)'}`, top: tip.topRow ? undefined : -8 }}
          >
            {tipText(tip.day, tip.count)}
            <span
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#0d0f12] border-white/10
                ${tip.topRow ? '-top-1 border-l border-t' : '-bottom-1 border-r border-b'}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHeatmap;

import React from 'react';

const MAX_WORDS = 4;
const MAX_LEN = 14;

/** His name as chunky tiles. Each word gets its own centred row; a space starts the next row. */
const NameTiles: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => {
  const words = name.toUpperCase().split(/\s+/).filter(Boolean).slice(0, MAX_WORDS).map(w => w.slice(0, MAX_LEN));
  const pending = /\s$/.test(name) && name.trim().length > 0 && words.length < MAX_WORDS; // a space was typed: show the next empty row
  const rows: string[][] = words.map(w => w.split(''));
  if (pending) rows.push(['']);
  if (rows.length === 0) rows.push(['', '', '', '', '']);
  const longest = Math.max(...rows.map(r => r.length));
  const gap = 0.6;
  const w = `min(var(--tb), calc((100% - ${((longest - 1) * gap).toFixed(2)}rem) / ${longest}))`;
  const lastRow = words.length - 1;
  const typing = !pending && words.length > 0;
  return (
    <div aria-hidden="true" className={`flex flex-col items-center [--tb:3.1rem] lg:[--tb:4.2rem] ${className}`}>
      <div className="w-full flex flex-col items-center gap-3 min-h-[4rem]">
        {rows.map((row, ri) => (
          <div key={ri} className="w-full flex justify-center" style={{ gap: `${gap}rem` }}>
            {row.map((ch, ci) => {
              const base = 'shrink-0 aspect-[4/5] rounded-[0.8rem] flex items-center justify-center [container-type:inline-size]';
              if (!ch) return <span key={ci} className={`${base} border-2 border-dashed border-white/15`} style={{ width: w }} />;
              const newest = typing && ri === lastRow && ci === row.length - 1;
              return (
                <span key={`${ri}-${ci}-${ch}`} style={{ width: w }} className={`${base} pt-drop font-display font-bold leading-none ${newest ? 'bg-[#F63C49] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_0_#a8212d,0_16px_22px_-8px_rgba(0,0,0,1)]' : 'bg-white text-black shadow-[inset_0_1px_0_#fff,0_4px_0_#b9b9c0,0_16px_22px_-8px_rgba(0,0,0,1)]'}`}>
                  <span style={{ fontSize: '58cqw' }}>{ch}</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-6 h-3 w-full max-w-md rounded-full bg-[#18181d] border border-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_14px_24px_-10px_rgba(0,0,0,1)]" />
      <div className="mt-2 h-[3px] w-24 rounded-full bg-[#F63C49]" />
    </div>
  );
};

export default NameTiles;

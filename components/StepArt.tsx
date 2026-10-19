import React, { useEffect, useState } from 'react';

export type ArtKind = 'name' | 'year' | 'branch' | 'semester' | 'courses' | 'build';

// Same language as the Revise doodles: one stroke weight, round caps, slate lines with one red accent,
// drawn once in 250ms ease. Reduced motion shows them at once.
const circle = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
const SHAPES: Record<ArtKind, { d: string; accent?: boolean }[]> = {
  name: [
    { d: 'M60 20v14' },
    { d: 'M52 20h16' },
    { d: 'M24 38h72v62H24Z' },
    { d: circle(46, 62, 9) },
    { d: 'M30 90c2-10 10-14 16-14s14 4 16 14' },
    { d: 'M72 58h16M72 70h12' },
    { d: 'M72 84h16', accent: true },
  ],
  build: [
    { d: 'M20 100h80' },
    { d: 'M30 100V80h14v20M53 100V64h14v36' },
    { d: 'M76 100V44h14v56', accent: true },
    { d: 'M30 56l23-16 23 4 16-18' },
    { d: 'M92 26h-8M92 26v8', accent: true },
  ],
  year: [
    { d: 'M20 104h80' },
    { d: 'M24 104V88h72v16M24 96h72' },
    { d: 'M34 88V72h52v16M34 80h52' },
    { d: 'M44 72V56h32v16M44 64h32', accent: true },
    { d: 'M60 44V32M54 38h12', accent: true },
  ],
  branch: [
    { d: 'M60 100V66' },
    { d: 'M60 66L34 44M60 66L86 44' },
    { d: 'M60 66V32' , accent: true },
    { d: circle(34, 38, 7) },
    { d: circle(86, 38, 7) },
    { d: circle(60, 24, 7), accent: true },
    { d: circle(60, 104, 5) },
  ],
  semester: [
    { d: 'M24 36h72v64H24Z' },
    { d: 'M24 54h72' },
    { d: 'M42 28v14M78 28v14' },
    { d: 'M38 68h6M56 68h6M74 68h6M38 84h6M56 84h6' },
    { d: 'M74 84h6', accent: true },
  ],
  courses: [
    { d: 'M60 42C48 34 32 34 20 38V92C32 88 48 88 60 96C72 88 88 88 100 92V38C88 34 72 34 60 42Z' },
    { d: 'M60 42V96' },
    { d: 'M30 52h20M30 64h20M30 76h14' },
    { d: 'M70 52h20M70 64h14', accent: true },
  ],
};

const EASE = 'cubic-bezier(0.4,0,0.2,1)';

const BOOKS = ['M24 104V88h72v16M24 96h72', 'M34 88V72h52v16M34 80h52', 'M44 72V56h32v16M44 64h32'];
const stack = (n: number) => [
  { d: 'M20 104h80' },
  ...BOOKS.slice(0, n).map((d, i) => ({ d, accent: i === n - 1 })),
];

const StepArt: React.FC<{ kind: ArtKind; level?: 1 | 2 | 3; className?: string; faint?: boolean }> = ({ kind, level, className = '', faint }) => {
  const shapes: { d: string; accent?: boolean }[] = kind === 'year' && level ? stack(level) : SHAPES[kind];
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState(still);
  useEffect(() => {
    if (still) return;
    setOn(false);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(id);
  }, [kind, still]);
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" fill="none" strokeWidth={faint ? 1 : 2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {shapes.map((s, i) => (
        <path
          key={`${kind}-${level || 0}-${i}`}
          d={s.d}
          pathLength={1}
          stroke={s.accent ? '#F63C49' : '#475569'}
          style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 250ms ${EASE} ${i * 60}ms` }}
        />
      ))}
    </svg>
  );
};

export default StepArt;

import React, { useEffect, useState } from 'react';
import type { TourArtId } from '../lib/tours';

// Tour step spot illustrations, in the same hand-drawn language as StepArt
// and the Revise doodles: one stroke weight, round caps, slate lines with a
// single red accent, drawn once (ease, staggered). Reduced motion shows the
// finished scene at once. Each scene explains its step's idea instead of
// decorating the card.
const circle = (x: number, y: number, r: number) =>
  `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
const spine = (x: number) =>
  `M${x + 4} 34h12a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-44a4 4 0 0 1 4-4Z`;

const SCENES: Record<TourArtId, { d: string; accent?: boolean }[]> = {
  // Home step 1: Overall Progress averages unit states. Three unit spines
  // (Start = empty, Studying = part way, Done = checked) merge into one
  // gauge whose red arc is the averaged value.
  'progress-average': [
    { d: 'M20 92h90' },
    { d: spine(26) },
    { d: circle(36, 60, 4) },
    { d: spine(54) },
    { d: 'M59 60h10' },
    { d: spine(82) },
    { d: 'M87 60l4 4 8-9' },
    { d: 'M104 44C114 44 118 52 126 58' },
    { d: 'M104 60H126' },
    { d: 'M104 76C114 76 118 68 126 62' },
    { d: circle(128, 60, 2.5) },
    { d: 'M132 60H146' },
    { d: 'M141 54L148 60L141 66' },
    { d: circle(188, 60, 30) },
    { d: 'M188 33v5M215 60h-5M188 87v-5M161 60h5' },
    { d: 'M188 30A30 30 0 0 1 199 87.9', accent: true },
  ],
};

const EASE = 'cubic-bezier(0.4,0,0.2,1)';

const TourArt: React.FC<{ kind: TourArtId; className?: string }> = ({ kind, className = '' }) => {
  const shapes = SCENES[kind];
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState(still);
  useEffect(() => {
    if (still) return;
    setOn(false);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(id);
  }, [kind, still]);
  if (!shapes) return null;
  return (
    <svg viewBox="0 12 240 96" aria-hidden="true" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {shapes.map((s, i) => (
        <path
          key={`${kind}-${i}`}
          d={s.d}
          pathLength={1}
          stroke={s.accent ? '#F63C49' : '#475569'}
          style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 260ms ${EASE} ${i * 55}ms` }}
        />
      ))}
    </svg>
  );
};

export default TourArt;

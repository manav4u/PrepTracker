import React, { useEffect, useState } from 'react';

type Kind = 'moon' | 'sprout';

// Line drawings: one stroke weight, round caps, slate lines with a single red accent.
// They draw themselves once when they appear (250ms ease); reduced motion shows them at once.
const SHAPES: Record<Kind, { d: string; accent?: boolean }[]> = {
  moon: [
    { d: 'M60 20A30 30 0 1 0 78 66A24 24 0 0 1 60 20Z' },
    { d: 'M24 24v12M18 30h12' },
    { d: 'M78 24v8M74 28h8', accent: true },
  ],
  sprout: [
    { d: 'M20 80h56' },
    { d: 'M48 80V48' },
    { d: 'M48 60C48 46 38 40 26 40C26 54 36 60 48 60Z' },
    { d: 'M48 50C48 36 58 28 72 28C72 44 62 50 48 50Z', accent: true },
  ],
};

const EASE = 'cubic-bezier(0.4,0,0.2,1)';

const Doodle: React.FC<{ kind: Kind; className?: string }> = ({ kind, className = '' }) => {
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState(still);
  useEffect(() => {
    if (still) return;
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, [still]);
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {SHAPES[kind].map((s, i) => (
        <path
          key={i}
          d={s.d}
          pathLength={1}
          stroke={s.accent ? '#F63C49' : '#475569'}
          style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 250ms ${EASE} ${i * 60}ms` }}
        />
      ))}
    </svg>
  );
};

export default Doodle;

import React from 'react';

const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

const CheckRing = ({ on, className = '' }: { on: boolean; className?: string }) => (
  <span aria-hidden="true" className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center transition-colors ${EASE} ${on ? 'bg-black border-black' : 'border-white/20'} ${on ? 'shadow-[0_2px_6px_rgba(0,0,0,0.35)]' : ''} ${className}`}>
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 250ms cubic-bezier(0.4,0,0.2,1) ${on ? '60ms' : '0ms'}` }} />
    </svg>
  </span>
);

export default CheckRing;

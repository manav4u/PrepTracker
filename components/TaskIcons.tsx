import React from 'react';

// Duotone set for the Tasks page: a soft 22% fill layer under a 1.8 stroke,
// all in currentColor. One shape language: rounded joins, no hard corners.
// Motion plays only when `play` flips on (see .pt-* in index.css).

type IconProps = { size?: number; className?: string; play?: boolean };

const base = (size: number | undefined, className: string | undefined) => ({
  width: size ?? 16,
  height: size ?? 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
  'aria-hidden': true,
});

export const FlameIcon = ({ size, className, play }: IconProps) => (
  <svg {...base(size, className)}>
    <g className={play ? 'pt-flicker' : ''} style={{ transformOrigin: '12px 21px' }}>
      <path d="M12 2.8c.4 3 4.6 5.1 4.6 9.7a4.6 4.6 0 0 1-9.2 0c0-2 .9-3.3 2-4.3.2 1.3.8 2 1.5 2.3C10.7 7.7 11.2 5 12 2.8z" fill="currentColor" fillOpacity=".22" />
      <path d="M12 13.6c1.4 1 2 1.9 2 3a2 2 0 0 1-4 0c0-.8.5-1.7 2-3z" fill="currentColor" fillOpacity=".5" stroke="none" />
    </g>
  </svg>
);

export const FlaskIcon = ({ size, className, play }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M9.6 3h4.8M10.4 3v5.6L5.3 17.8A2.2 2.2 0 0 0 7.2 21h9.6a2.2 2.2 0 0 0 1.9-3.2l-5.1-9.2V3" />
    <path d="M7.6 15.2h8.8l1.9 3.4A1.5 1.5 0 0 1 17 20.5H7a1.5 1.5 0 0 1-1.3-1.9z" fill="currentColor" fillOpacity=".22" stroke="none" />
    <g className={play ? 'pt-bubble' : ''}>
      <circle cx="10.6" cy="17.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="16.2" r=".8" fill="currentColor" stroke="none" />
    </g>
  </svg>
);

export const PaperStampIcon = ({ size, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M6.5 3h7.2L18 7.3V12M6.5 3A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21H12" fill="currentColor" fillOpacity=".22" />
    <path d="M13.5 3.2V7.5H18M8 11h5M8 14.5h3" />
    <circle cx="17" cy="17" r="3.6" />
    <path d="m15.4 17 1.2 1.2 2-2.2" />
  </svg>
);

export const OpenBookIcon = ({ size, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 6.5C10.3 5 7.6 4.5 4 4.8v12.6c3.6-.3 6.3.2 8 1.7 1.7-1.5 4.4-2 8-1.7V4.8c-3.6-.3-6.3.2-8 1.7z" fill="currentColor" fillOpacity=".22" />
    <path d="M12 6.5v12.6" />
  </svg>
);

// Signal bars: level 1..3. Lit bars use currentColor, unlit sit at 25%.
export const SignalBars = ({ level, size, className }: { level: 1 | 2 | 3; size?: number; className?: string }) => {
  const bars = [{ x: 4.5, y: 14, h: 6 }, { x: 10.5, y: 9.5, h: 10.5 }, { x: 16.5, y: 4, h: 16 }];
  return (
    <svg width={size ?? 16} height={size ?? 16} viewBox="0 0 24 24" className={className} aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width="3.6" height={b.h} rx="1.6" fill="currentColor" opacity={i < level ? 1 : 0.25} />
      ))}
    </svg>
  );
};

export const TickDraw = ({ size, className, play }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={3}>
    <path d="m5 12.5 4.5 4.5L19 7.5" className={play ? 'pt-tickdraw' : ''} pathLength={1} strokeDasharray="1" />
  </svg>
);

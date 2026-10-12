import React from "react";

/* Hand-drawn ink marks. Pure vector, decorative, never placed over text.
   Paths are hand-authored so the wobble is uneven; strokes keep a constant
   width at any size (non-scaling-stroke). */
const PATHS = {
  title: [
    "M3 8.5 C31 4.2 58 10.6 96 6.4 S171 4.6 214 8.2 S268 6 297 7.6",
    "M22 12.4 C74 9.4 138 12.8 201 10.6",
  ],
  heading: [
    "M2 9 C40 5.2 76 11 124 6.8 S205 5.4 252 9.4 S290 6.8 298 8.4",
    "M30 12.8 C92 10.2 160 13.4 232 11.2",
  ],
} as const;

export function HandUnderline({ kind = "title" }: { kind?: keyof typeof PATHS }) {
  const [main, second] = PATHS[kind];
  return (
    <svg className={`hand-underline hand-underline-${kind}`} viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="hand-stroke" pathLength={1} d={main} />
      <path className="hand-stroke hand-stroke-thin" pathLength={1} d={second} />
    </svg>
  );
}

export function HandArrow() {
  return (
    <svg className="hand-arrow" viewBox="0 0 76 30" aria-hidden="true" focusable="false">
      <path className="hand-stroke" pathLength={1} d="M72 9.5 C58 21.5 34 24 9.5 16.5" />
      <path className="hand-stroke hand-stroke-head" pathLength={1} d="M18.5 8.2 C15 11 11.5 13.6 8.6 16.2 C11.8 19.2 14.6 22.2 16.8 26" />
    </svg>
  );
}

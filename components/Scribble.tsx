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

/* Loose pen loop that overshoots where it closes, like a real circling stroke. */
export function HandCircle() {
  return (
    <svg className="hand-circle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="hand-stroke" pathLength={1} d="M18 6.5 C42 0.8 82 2.4 93.5 14 C100 22 88 35.5 52 37 C22 38.2 3.2 30.4 3.6 19.5 C4 9.6 25 3.2 56 2.8 C70 2.6 79 4.4 85 7.4" />
    </svg>
  );
}

export function HandArrowDown() {
  return (
    <svg className="hand-arrow-down" viewBox="0 0 30 46" aria-hidden="true" focusable="false">
      <path className="hand-stroke" pathLength={1} d="M5 3.5 C21 8.5 25 22 15.5 40" />
      <path className="hand-stroke hand-stroke-head" pathLength={1} d="M8.5 31.5 C11 34.5 13.6 38 15.4 41.2 C18.8 38.4 22.4 36.2 26.2 34.6" />
    </svg>
  );
}

/* An empty week, drawn by hand: seven open day boxes, nothing planned yet. */
export function HandWeek() {
  const boxes = [
    "M4 8.5 C20 6.8 38 7.6 52 7.2 C52.8 22 52.2 38 51.4 52 C37 53.4 20 52.6 5 53.4 C4.4 38 4.9 22 4.1 8.6",
    "M66 7 C80 8.2 98 6.8 113 7.8 C113.6 22 112.8 38 113.4 53 C98 52.2 80 53.6 65.6 52.4 C66.4 38 65.8 22 66.2 7.4",
    "M127 8 C143 6.6 160 8.2 175 7 C174.4 22 175.6 38 174.6 52.6 C160 53.8 142 52.2 128 53.4 C127.4 38 128.2 22 126.8 8.4",
    "M189 7.4 C205 8.6 222 7 236 8.2 C236.8 22 235.6 38 236.4 53.2 C222 52 204 53.6 190 52.4 C188.6 38 189.6 22 189.2 7.6",
    "M250 8.4 C266 6.8 283 8 297 7.2 C297.8 22 296.6 38 297.6 52.8 C283 53.6 265 52.2 251 53.4 C249.8 38 250.6 22 250.2 8.6",
    "M311 7.2 C327 8.4 344 6.8 358 8 C358.6 22 357.8 38 358.4 53 C344 52.2 326 53.4 312 52.4 C310.8 38 311.6 22 311.2 7.4",
    "M372 8 C388 6.6 405 8.2 419 7 C419.8 22 418.6 38 419.6 52.6 C405 53.6 387 52.4 373 53.2 C371.6 38 372.6 22 372.2 8.4",
  ];
  return (
    <svg className="hand-week" viewBox="0 0 424 62" aria-hidden="true" focusable="false">
      {boxes.map((d, i) => (
        <path key={i} className="hand-stroke hand-stroke-week" pathLength={1} d={d} style={{ animationDelay: `${0.2 + i * 0.09}s` }} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <text key={i} className="hand-week-num" x={12 + i * 61} y={23}>
          {i + 1}
        </text>
      ))}
    </svg>
  );
}

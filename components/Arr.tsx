import React from "react";

/* Drawn arrows. Unicode arrows turn into colour emoji on some phones, so every
   arrow in the app is a small stroked SVG that follows the text colour. */
const D = {
  ne: ["M3.5 12.5 C6 10 9 7 12 4", "M5.2 3.8 C7.4 4.2 10 4 12.2 3.8 C12.2 6 12 8.8 12.4 10.8"],
  right: ["M2.5 8.2 C5.5 7.8 9 8.4 13 8", "M9.2 4 C10.6 5.6 12 6.9 13.4 8 C12 9.2 10.6 10.5 9.2 12"],
  left: ["M13.5 8 C10.4 8.4 7 7.7 3 8.1", "M6.8 4 C5.4 5.6 4 6.9 2.6 8 C4 9.2 5.4 10.5 6.8 12"],
  down: ["M8 2.5 C8.4 5.5 7.7 9 8.1 13", "M4 9.2 C5.6 10.6 6.9 12 8 13.4 C9.2 12 10.5 10.6 12 9.2"],
  redo: ["M12.6 8.6 C12.2 11.4 9.8 13 7.6 12.8 C4.8 12.6 3.2 10.2 3.4 7.8 C3.7 5.2 5.9 3.4 8.4 3.6 C10 3.7 11.2 4.6 12 5.8", "M12.2 2.6 C12.2 3.8 12.1 5 12 6 C10.8 6 9.4 5.9 8.4 5.8"],
  play: ["M4.5 3 C7.5 4.6 10.6 6.4 13 8 C10.4 9.6 7.4 11.4 4.4 13 C4.6 9.6 4.5 6.4 4.5 3"],
} as const;

export default function Arr({ d, lead = false }: { d: keyof typeof D; lead?: boolean }) {
  return (
    <svg className={`arr arr-${d}${lead ? " arr-lead" : ""}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {D[d].map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

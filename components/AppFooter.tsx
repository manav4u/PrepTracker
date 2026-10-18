import React from 'react';

/** End-of-page footer: a flat, full-width wordmark with one small line under it. */
const AppFooter: React.FC = () => (
  <footer className="mt-16 lg:mt-auto pt-10 lg:pt-8 [container-type:inline-size]">
    <p
      aria-hidden="true"
      className="[--wm:23.5cqw] select-none whitespace-nowrap text-slate-100 leading-[0.8] tracking-tight"
      style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--wm)' }}
    >
      PrepTracker<span className="text-[#F63C49]">.</span>
    </p>
    <p className="mt-4 lg:mt-5 pt-4 border-t border-white/10 text-xs text-slate-500">Built for SPPU students</p>
  </footer>
);

export default AppFooter;

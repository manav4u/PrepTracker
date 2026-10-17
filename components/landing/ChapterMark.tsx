import React from 'react';
import { gsap } from '../../lib/scroll';

/**
 * Gen-3 chapter marker: turns section kickers into numbered chapters,
 * like a syllabus document. Stamps in once when the section enters view
 * (animation lives in the owning section's useGSAP).
 */
type ChapterMarkProps = {
  n: string;
  label: string;
  dark?: boolean;
};

const ChapterMark: React.FC<ChapterMarkProps> = ({ n, label, dark = false }) => (
  <p className="ch-mark flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.28em] will-change-transform">
    <span className={dark ? 'text-[#F63C49]' : 'text-[#D61A40]'}>{n}</span>
    <span aria-hidden="true" className={`inline-block w-10 h-px translate-y-[-3px] ${dark ? 'bg-[#F7F5F2]/25' : 'bg-[#141419]/20'}`} />
    <span className={dark ? 'text-[#F7F5F2]/70' : 'text-[#5A5A66]'}>{label}</span>
  </p>
);

/** Stamp-in animation for every .ch-mark in scope. Call inside a section's
 *  useGSAP after the reduceMotion guard. Hit fast, tiny overshoot, settle. */
export const stampChapterMarks = (): void => {
  gsap.utils.toArray<HTMLElement>('.ch-mark').forEach((mark) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: mark, start: 'top 88%', once: true } });
    tl.fromTo(
      mark,
      { scale: 1.5, rotate: -7, autoAlpha: 0, transformOrigin: '0% 100%' },
      { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.2, ease: 'power3.in' }
    )
      .to(mark, { scale: 1.05, duration: 0.07, ease: 'power1.out' })
      .to(mark, { scale: 1, duration: 0.2, ease: 'power2.out' });
  });
};

export default ChapterMark;

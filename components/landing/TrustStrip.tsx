import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduceMotion } from '../../lib/scroll';

const stats = [
  { value: 10, label: 'first-year subjects', sub: 'SPPU 2024 pattern' },
  { value: 50, label: 'units mapped', sub: 'from the official syllabus' },
  { value: 318, label: 'topics to tick off', sub: 'nothing left to guess' },
  { value: 30, label: 'verified resources', sub: 'notes, playlists and PYQs' },
];

const TrustStrip: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduceMotion()) return;
    const nums = gsap.utils.toArray<HTMLElement>('.ts-num');
    nums.forEach((el) => {
      const target = Number(el.dataset.value || '0');
      const state = { v: 0 };
      gsap.to(state, {
        v: target,
        duration: 1.6,
        ease: 'power3.out',
        onUpdate: () => { el.textContent = String(Math.round(state.v)); },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
    gsap.fromTo(
      '.ts-cell',
      { y: 28, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
      }
    );
    // hairline draws itself across
    gsap.fromTo(
      '.ts-rule',
      { scaleX: 0 },
      {
        scaleX: 1, duration: 1.2, ease: 'power3.inOut', transformOrigin: 'left center',
        scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
      }
    );
  }, { scope: root });

  return (
    <section ref={root} aria-label="PrepTracker in numbers" className="relative bg-[#F7F5F2] px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="ts-rule h-px bg-black/10 mb-10 md:mb-14" aria-hidden="true" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`ts-cell text-center ${i > 0 ? 'md:border-l md:border-black/10' : ''} ${i % 2 === 1 ? 'max-md:border-l max-md:border-black/10' : ''}`}
            >
              <span
                className="ts-num block text-5xl md:text-6xl font-bold tracking-[-0.03em] text-[#141419] tabular-nums"
                data-value={s.value}
              >
                {s.value}
              </span>
              <p className="mt-2 text-sm font-semibold text-[#141419] tracking-tight">{s.label}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#6E6E78]">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="ts-rule h-px bg-black/10 mt-10 md:mt-14" aria-hidden="true" />
      </div>
    </section>
  );
};

export default TrustStrip;

import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { initScroll, destroyScroll, gsap, ScrollTrigger, reduceMotion } from '../../lib/scroll';

const HEADLINE = 'Know exactly what\u2019s left before your exam.';

const HeroScene: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => destroyScroll();
  }, []);

  useGSAP(() => {
    if (reduceMotion()) return;

    // Masked word reveal, once
    const words = gsap.utils.toArray<HTMLElement>('.hs-word');
    gsap.fromTo(
      words,
      { yPercent: 112, autoAlpha: 0, filter: 'blur(8px)' },
      { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out', stagger: 0.045, delay: 0.15 }
    );
    gsap.fromTo(
      ['.hs-kicker', '.hs-sub', '.hs-cta', '.hs-meta'],
      { y: 22, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.55 }
    );

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      // Scrubbed product shot: arrives oversized + tilted, settles as you scroll
      gsap.fromTo(
        '.hs-shot',
        { scale: 1.14, rotateX: 14, y: 90, transformPerspective: 1400 },
        {
          scale: 1, rotateX: 0, y: 0, ease: 'none',
          scrollTrigger: { trigger: '.hs-stage', start: 'top 88%', end: 'top 22%', scrub: 1 },
        }
      );
      gsap.to('.hs-glow', {
        yPercent: 26, ease: 'none',
        scrollTrigger: { trigger: '.hs-stage', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      // Headline drifts slower than scroll for depth
      gsap.to('.hs-copy', {
        yPercent: -8, autoAlpha: 0.25, ease: 'none',
        scrollTrigger: { trigger: '.hs-stage', start: 'top top', end: '55% top', scrub: true },
      });
    });
  }, { scope: root });

  return (
    <div ref={root} className="hs-stage relative overflow-hidden px-6 pt-36 md:pt-44 pb-10 md:pb-16">
      <div
        aria-hidden="true"
        className="hs-glow absolute -top-56 left-1/2 -translate-x-1/2 w-[62rem] h-[34rem] rounded-full bg-[#E11D48]/[0.08] blur-[120px] pointer-events-none"
      />
      <div className="relative max-w-6xl mx-auto">
        <div className="hs-copy text-center max-w-4xl mx-auto">
          <p className="hs-kicker font-mono text-[11px] uppercase tracking-[0.28em] text-[#6E6E78]">
            SPPU First Year &middot; 2024 Pattern
          </p>
          <h1
            aria-label={HEADLINE}
            className="mt-6 font-bold tracking-[-0.03em] leading-[1.02] text-[#141419] text-[13.5vw] sm:text-6xl md:text-7xl lg:text-[5.2rem]"
          >
            {HEADLINE.split(' ').map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-top pb-[0.08em] -mb-[0.08em]" aria-hidden="true">
                <span className="hs-word inline-block will-change-transform">
                  {w === 'left' ? <span className="text-[#BE123C]">{w}</span> : w}
                  {'\u00A0'}
                </span>
              </span>
            ))}
          </h1>
          <p className="hs-sub mt-6 text-lg md:text-xl text-[#5A5A66] leading-relaxed max-w-2xl mx-auto">
            PrepTracker turns the whole syllabus into a checklist you can actually finish.
          </p>
          <div className="hs-cta mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/onboarding"
              className="px-8 py-4 rounded-full bg-[#141419] text-white font-semibold text-sm tracking-tight hover:bg-black transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_18px_36px_-14px_rgba(20,20,25,0.5)]"
            >
              Start tracking
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6E6E78]">
              Free &middot; no account &middot; a minute to set up
            </span>
          </div>
        </div>

        <div className="hs-shot-wrap mt-14 md:mt-20 [perspective:1400px]">
          <div className="hs-shot relative max-w-5xl mx-auto rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-[0_48px_96px_-32px_rgba(20,20,25,0.45)] will-change-transform bg-[#0B0B10]">
            <img
              src="/landing/dash-desktop.png"
              alt="The PrepTracker dashboard: overall progress, units mastered, days to exam and streak"
              className="w-full h-auto block"
              width={1440}
              height={900}
              fetchPriority="high"
            />
          </div>
          <p className="hs-meta mt-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#6E6E78]">
            The real dashboard &middot; your data never leaves this browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroScene;

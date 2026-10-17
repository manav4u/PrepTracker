import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { initScroll, destroyScroll, gsap, ScrollTrigger, reduceMotion } from '../../lib/scroll';
import LogoMark, { MARK_PATH } from '../LogoMark';

const HEADLINE_LABEL = 'Know exactly what\u2019s left before your exam.';

/**
 * Gen-3 hero: the headline is the visual. Oversized display type with scale
 * contrast, the Progress Path mark drawing itself once on load, and the real
 * dashboard framed like a specimen on paper with one red-ink annotation.
 */
const HeroScene: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => destroyScroll();
  }, []);

  useGSAP(() => {
    if (reduceMotion()) {
      // Static brand state: fill visible, no stroke pass.
      gsap.set('.hs-mark-fill', { autoAlpha: 1 });
      gsap.set('.hs-mark-stroke', { autoAlpha: 0 });
      return;
    }

    // The mark draws its own outline once, then the gradient fill lands.
    const tl = gsap.timeline({ delay: 0.25 });
    tl.fromTo(
      '.hs-mark-stroke',
      { strokeDashoffset: 1, autoAlpha: 1 },
      { strokeDashoffset: 0, duration: 1.15, ease: 'power2.inOut' }
    ).fromTo(
      '.hs-mark-fill',
      { autoAlpha: 0, scale: 0.985, transformOrigin: '50% 50%' },
      { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'power2.out' },
      '-=0.15'
    ).to('.hs-mark-stroke', { autoAlpha: 0, duration: 0.35 }, '<');

    // Masked line reveal, once
    const lines = gsap.utils.toArray<HTMLElement>('.hs-line');
    gsap.fromTo(
      lines,
      { yPercent: 112, autoAlpha: 0, filter: 'blur(8px)' },
      { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out', stagger: 0.09, delay: 0.3 }
    );
    gsap.fromTo(
      ['.hs-kicker', '.hs-sub', '.hs-cta', '.hs-meta'],
      { y: 22, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.7 }
    );
    gsap.fromTo(
      '.hs-note',
      { autoAlpha: 0, scale: 0.9 },
      { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)', delay: 1.6 }
    );

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      // Scrubbed specimen: arrives oversized + tilted, settles as you scroll
      gsap.fromTo(
        '.hs-shot',
        { scale: 1.12, rotateX: 12, y: 80, transformPerspective: 1400 },
        {
          scale: 1, rotateX: 0, y: 0, ease: 'none',
          scrollTrigger: { trigger: '.hs-stage', start: 'top 88%', end: 'top 22%', scrub: 1 },
        }
      );
      gsap.to('.hs-glow', {
        yPercent: 26, ease: 'none',
        scrollTrigger: { trigger: '.hs-stage', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      // Mark drifts slightly slower than the copy for depth.
      gsap.to('.hs-mark', {
        yPercent: -14, ease: 'none',
        scrollTrigger: { trigger: '.hs-stage', start: 'top top', end: '+=600', scrub: true },
      });
      // Copy dissolves on scroll (opacity only keeps the h1 perceivable for axe).
      gsap.to('.hs-copy', {
        yPercent: -6, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hs-stage', start: 'top top', end: '+=600', scrub: true },
      });
      gsap.to(['.hs-cta', '.hs-meta'], {
        autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: '.hs-stage', start: 'top top', end: '+=600', scrub: true },
      });
    });
  }, { scope: root });

  return (
    <div ref={root} className="hs-stage relative overflow-hidden px-6 pt-32 md:pt-40 pb-10 md:pb-16">
      <div
        aria-hidden="true"
        className="hs-glow absolute -top-56 left-1/4 w-[62rem] h-[34rem] rounded-full bg-[#F63C49]/[0.08] blur-[120px] pointer-events-none"
      />
      <div className="relative max-w-7xl mx-auto">
        <div className="hs-copy relative">
          <p className="hs-kicker font-mono text-[11px] uppercase tracking-[0.28em] text-[#5A5A66]">
            SPPU First Year &middot; 2024 Pattern
          </p>

          <div className="mt-8 flex flex-col-reverse md:flex-row md:items-end md:justify-between gap-10">
            <h1
              aria-label={HEADLINE_LABEL}
              className="font-bold tracking-[-0.04em] leading-[0.95] text-[#141419]"
            >
              <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]" aria-hidden="true">
                <span className="hs-line block will-change-transform text-[15.5vw] md:text-[8.2rem] lg:text-[9.5rem]">
                  Know exactly
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]" aria-hidden="true">
                <span className="hs-line block will-change-transform text-[15.5vw] md:text-[8.2rem] lg:text-[9.5rem]">
                  what&rsquo;s <span className="text-[#D61A40]">left.</span>
                </span>
              </span>
              <span className="block overflow-hidden mt-3 md:mt-5" aria-hidden="true">
                <span className="hs-line block will-change-transform text-[7vw] md:text-[2.5rem] lg:text-[2.9rem] font-semibold tracking-[-0.02em] text-[#8A8A94]">
                  before your exam.
                </span>
              </span>
            </h1>

            {/* The mark draws itself once on load, then rests. */}
            <div className="hs-mark relative shrink-0 w-28 md:w-56 lg:w-64" aria-hidden="true">
              <svg viewBox="0 0 149 146" className="w-full h-auto block overflow-visible">
                <path
                  className="hs-mark-stroke"
                  d={MARK_PATH}
                  fill="none"
                  stroke="#141419"
                  strokeWidth="2.25"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray={1}
                  opacity={0}
                />
              </svg>
              <div className="hs-mark-fill absolute inset-0">
                <LogoMark size={999} className="w-full h-auto block" />
              </div>
            </div>
          </div>

          <p className="hs-sub mt-8 md:mt-10 text-lg md:text-xl text-[#5A5A66] leading-relaxed max-w-xl">
            PrepTracker turns the whole syllabus into a checklist you can actually finish.
          </p>
          <div className="hs-cta mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/onboarding"
              className="px-8 py-4 rounded-full bg-[#141419] text-white font-semibold text-sm tracking-tight hover:bg-black transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_18px_36px_-14px_rgba(20,20,25,0.5)]"
            >
              Start tracking
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5A5A66]">
              Free &middot; no account &middot; a minute to set up
            </span>
          </div>
        </div>

        {/* The real dashboard, framed like a specimen on paper. */}
        <div className="hs-shot-wrap mt-16 md:mt-24 [perspective:1400px]">
          <div className="hs-shot relative max-w-5xl mx-auto will-change-transform">
            <div className="rounded-lg bg-white p-2.5 md:p-3.5 ring-1 ring-black/10 shadow-[0_48px_96px_-32px_rgba(20,20,25,0.4)]">
              <div className="rounded-md overflow-hidden ring-1 ring-black/10 bg-[#0B0B10]">
                <img
                  src="/landing/dash-desktop.webp"
                  alt="The PrepTracker dashboard: overall progress, units mastered, days to exam and streak"
                  className="w-full h-auto block"
                  width={1440}
                  height={900}
                  fetchPriority="high"
                />
              </div>
            </div>
            {/* Red-ink annotation */}
            <div className="hs-note absolute -top-7 right-4 md:-right-8 flex items-center gap-2 rotate-[-4deg]">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D61A40] bg-[#F7F5F2]/85 backdrop-blur-sm px-2 py-1 rounded">
                your whole syllabus, one checklist
              </span>
              <svg width="34" height="30" viewBox="0 0 34 30" fill="none" aria-hidden="true">
                <path d="M30 2C22 6 12 12 6 24" stroke="#D61A40" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 20l3 5 5-2" stroke="#D61A40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <p className="hs-meta mt-5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#5A5A66]">
            The real dashboard &middot; your data never leaves this browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroScene;

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, reduceMotion } from '../../lib/scroll';
import { ArrowRight } from 'lucide-react';
import LogoMark from '../LogoMark';

const FinalCta: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduceMotion()) return;
    // Panel grows into its final size/roundness as it enters
    gsap.fromTo(
      '.fc-panel',
      { scale: 0.94, borderRadius: '3.5rem', y: 60 },
      {
        scale: 1, borderRadius: '2.5rem', y: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 92%', end: 'top 45%', scrub: 1 },
      }
    );
    gsap.fromTo(
      ['.fc-mark05', '.fc-line', '.fc-sub', '.fc-btn'],
      { y: 30, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      }
    );
    // Ghost mark drifts slower than the panel for depth.
    gsap.to('.fc-ghost', {
      yPercent: -12, rotate: -4, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.fc-glow', {
      yPercent: -20, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }, { scope: root });

  return (
    <section ref={root} aria-label="Get started" className="relative bg-[#F7F5F2] px-4 md:px-6 pt-8 pb-24 md:pb-32 overflow-hidden">
      <div className="fc-panel relative max-w-7xl mx-auto rounded-[2.5rem] bg-[linear-gradient(135deg,#F63C49_0%,#D61A40_100%)] text-white px-8 py-20 md:px-16 md:py-28 overflow-hidden will-change-transform">
        <div
          aria-hidden="true"
          className="fc-glow absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
        />
        {/* Ghost mark, cropped by the panel edge */}
        <div aria-hidden="true" className="fc-ghost absolute -right-16 md:-right-10 -bottom-24 md:-bottom-16 w-64 md:w-[26rem] opacity-[0.16] pointer-events-none">
          <LogoMark size={416} variant="white" className="w-full h-auto block" />
        </div>

        <p className="fc-mark05 relative font-mono text-[11px] uppercase tracking-[0.28em] text-[#141419]">
          05 <span aria-hidden="true" className="inline-block w-10 h-px bg-[#141419]/40 align-middle mx-3" /> The last page
        </p>
        <div className="relative mt-10 md:mt-14">
          <h2 className="fc-line font-bold tracking-[-0.04em] leading-[0.96] text-[11.5vw] sm:text-7xl md:text-8xl lg:text-[7.2rem] max-w-5xl">
            Walk in knowing exactly what&rsquo;s left.
          </h2>
          <p className="fc-sub mt-8 text-lg md:text-2xl text-white leading-relaxed max-w-2xl">
            Free. No account. Set up in under a minute, and your data never leaves this browser.
          </p>
          <div className="fc-btn mt-12">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-3 px-9 py-5 bg-white text-[#141419] rounded-full font-bold tracking-tight hover:bg-[#F7F5F2] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)]"
            >
              Start tracking now
              <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;

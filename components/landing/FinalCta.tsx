import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, reduceMotion } from '../../lib/scroll';
import { ArrowRight } from 'lucide-react';

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
      ['.fc-line', '.fc-sub', '.fc-btn'],
      { y: 30, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      }
    );
    gsap.to('.fc-glow', {
      yPercent: -20, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }, { scope: root });

  return (
    <section ref={root} aria-label="Get started" className="relative bg-[#F7F5F2] px-4 md:px-6 pt-8 pb-24 md:pb-32 overflow-hidden">
      <div className="fc-panel relative max-w-6xl mx-auto rounded-[2.5rem] bg-[linear-gradient(135deg,#F63C49_0%,#D61A40_100%)] text-white px-8 py-16 md:px-16 md:py-24 overflow-hidden will-change-transform">
        <div
          aria-hidden="true"
          className="fc-glow absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
        />
        <div className="relative max-w-2xl">
          <h2 className="fc-line text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.02]">
            Walk in knowing exactly what&rsquo;s left.
          </h2>
          <p className="fc-sub mt-6 text-lg md:text-xl text-white leading-relaxed">
            Free. No account. Set up in under a minute, and your data never leaves this browser.
          </p>
          <div className="fc-btn mt-10">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#141419] rounded-full font-bold tracking-tight hover:bg-[#F7F5F2] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)]"
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

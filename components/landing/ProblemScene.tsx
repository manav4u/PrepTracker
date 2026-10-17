import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduceMotion } from '../../lib/scroll';

const beats = [
  { kicker: 'Pain 01', line: 'The syllabus is a 40-page PDF you opened once in July.' },
  { kicker: 'Pain 02', line: 'Easy units feel like progress. The hard ones stay invisible.' },
  { kicker: 'Pain 03', line: 'Notes in Drive, playlists on YouTube, PYQs in WhatsApp forwards.' },
];

const CLOSE = 'None of this is a motivation problem. It\u2019s a visibility problem.';

const ProblemScene: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduceMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=2600',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
      const lines = gsap.utils.toArray<HTMLElement>('.ps-line');
      lines.forEach((el, i) => {
        const at = i * 2;
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 60, filter: 'blur(10px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'none' },
          at
        ).to(el, { autoAlpha: 0, y: -60, filter: 'blur(10px)', duration: 0.7, ease: 'none' }, at + 1.3);
      });
      tl.fromTo(
        '.ps-close',
        { autoAlpha: 0, y: 50, filter: 'blur(8px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'none' },
        lines.length * 2 - 0.4
      );
    });
  }, { scope: root });

  return (
    <section
      ref={root}
      aria-label="The problem PrepTracker solves"
      className="relative bg-[#141419] text-[#F7F5F2] overflow-hidden md:h-screen md:min-h-[42rem] px-6 py-24 md:py-0"
    >
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-[#F63C49]/10 blur-3xl pointer-events-none"
      />
      {/* Desktop: pinned kinetic beats */}
      <div className="relative max-w-5xl mx-auto h-full hidden md:flex flex-col justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#F63C49] mb-10">The real problem</p>
        <div className="relative min-h-[16rem]">
          {beats.map((b) => (
            <div key={b.kicker} className="ps-line absolute inset-x-0 top-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#AFAFBA] mb-4">{b.kicker}</p>
              <p className="text-4xl lg:text-[3.4rem] font-bold tracking-[-0.025em] leading-[1.08] max-w-4xl">{b.line}</p>
            </div>
          ))}
          <div className="ps-close absolute inset-x-0 top-0">
            <p className="text-4xl lg:text-[3.4rem] font-bold tracking-[-0.025em] leading-[1.08] max-w-4xl">
              None of this is a motivation problem.
              <span className="text-[#F63C49]"> It&rsquo;s a visibility problem.</span>
            </p>
          </div>
        </div>
      </div>
      {/* Mobile / fallback: stacked, static */}
      <div className="relative max-w-3xl mx-auto md:hidden">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#F63C49] mb-10">The real problem</p>
        <div className="space-y-12">
          {beats.map((b) => (
            <div key={b.kicker}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#AFAFBA] mb-3">{b.kicker}</p>
              <p className="text-2xl font-bold tracking-[-0.02em] leading-[1.15]">{b.line}</p>
            </div>
          ))}
          <p className="text-2xl font-bold tracking-[-0.02em] leading-[1.15]">
            None of this is a motivation problem.
            <span className="text-[#F63C49]"> It&rsquo;s a visibility problem.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemScene;

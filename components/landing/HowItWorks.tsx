import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import ChapterMark, { stampChapterMarks } from './ChapterMark';
import { gsap, reduceMotion } from '../../lib/scroll';

const steps = [
  {
    num: '01',
    title: 'Tell it your subjects',
    body: 'Pick your pattern and your ten FE subjects once, in under a minute. No account, no email, no password.',
  },
  {
    num: '02',
    title: 'Tick topics as you study',
    body: 'Every unit has four honest states: not started, in progress, revision, mastered. The bars move when you do.',
  },
  {
    num: '03',
    title: 'See what the exam week looks like',
    body: 'One dashboard: overall percentage, units mastered, days to your exam, and what to open next.',
  },
];

const HowItWorks: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduceMotion()) return;
    stampChapterMarks();
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      // Scrubbed activation: each step lights up in turn; phone drifts with it
      const items = gsap.utils.toArray<HTMLElement>('.hw-step');
      items.forEach((el) => {
        const title = el.querySelector('.hw-title');
        const body = el.querySelector('.hw-body');
        const setState = (active: boolean) => {
          if (title) (title as HTMLElement).style.color = active ? '#141419' : '#4A4A52';
          if (body) (body as HTMLElement).style.color = active ? '#5A5A66' : '#6E6E78';
        };
        setState(false);
        gsap.fromTo(
          { t: 0 },
          { t: 0 },
          {
            t: 1, ease: 'none',
            scrollTrigger: {
              trigger: el, start: 'top 62%', end: 'bottom 34%', scrub: true,
              onToggle: (self) => setState(self.isActive),
              onUpdate: (self) => setState(self.isActive),
            },
          }
        );
      });
      gsap.fromTo(
        '.hw-phone',
        { rotate: -3.5, y: 40 },
        {
          rotate: 0, y: 0, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center center', scrub: 1 },
        }
      );
      gsap.to('.hw-glow', {
        yPercent: 30, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      // progress rail fills with section scroll
      gsap.fromTo(
        '.hw-rail-fill',
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none', transformOrigin: 'top center',
          scrollTrigger: { trigger: '.hw-steps', start: 'top 60%', end: 'bottom 40%', scrub: true },
        }
      );
    });
    // gentle enter for all viewports
    gsap.fromTo(
      '.hw-head',
      { y: 30, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      }
    );
  }, { scope: root });

  return (
    <section ref={root} aria-label="How PrepTracker works" className="relative bg-[#F7F5F2] text-[#141419] px-6 py-24 md:py-36 overflow-hidden">
      <p aria-hidden="true" className="hidden xl:block absolute right-8 top-28 font-mono text-[10px] uppercase tracking-[0.34em] text-[#D61A40] [writing-mode:vertical-rl]">no account · no upload</p>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
        <div>
          <div className="hw-head lg:sticky lg:top-32 relative z-10 -mx-3 px-3 pb-8 bg-[#F7F5F2]">
            <div className="mb-2"><ChapterMark n="03" label="From zero to tracked" /></div>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-[-0.025em] leading-[1.08]">
              Set up in a minute. Useful the same day.
            </h2>
          </div>
          <div className="hw-steps relative mt-14 pl-8">
            <div className="absolute left-0 top-1 bottom-1 w-px bg-black/10" aria-hidden="true">
              <div className="hw-rail-fill absolute inset-0 bg-[#D61A40]" />
            </div>
            <ol className="space-y-14">
              {steps.map((s) => (
                <li key={s.num} className="hw-step">
                  <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#D61A40]" aria-hidden="true">
                    {s.num}
                  </p>
                  <h3 className="hw-title mt-2 text-xl md:text-2xl font-bold tracking-[-0.02em] text-[#141419]">{s.title}</h3>
                  <p className="hw-body mt-2 leading-relaxed max-w-md text-[#5A5A66]">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="relative">
          <div className="lg:sticky lg:top-40">
            <div
              aria-hidden="true"
              className="hw-glow absolute -inset-8 rounded-[3rem] bg-[#F63C49]/[0.07] blur-2xl"
            />
            <div className="hw-phone relative mx-auto w-full max-w-[20rem] rounded-[2.2rem] overflow-hidden ring-1 ring-black/10 shadow-[0_32px_64px_-24px_rgba(20,20,25,0.35)] will-change-transform">
              <img
                src="/landing/subj-mobile.webp"
                alt="PrepTracker on a phone: a subject's units with topics ticked off"
                className="w-full h-auto block"
                loading="lazy"
                width={640}
                height={1386}
              />
            </div>
            <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#6E6E78]">
              The real app, mid-semester
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

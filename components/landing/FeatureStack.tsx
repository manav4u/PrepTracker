import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import ChapterMark, { stampChapterMarks } from './ChapterMark';
import { gsap, reduceMotion } from '../../lib/scroll';

const features = [
  {
    id: 'syllabus',
    dark: false,
    kicker: 'Syllabus',
    title: 'The whole syllabus, as a checklist',
    body: 'Every unit of all 10 subjects with four honest states - not started, in progress, revision, mastered. Tick topics as you study and the bars move.',
    img: '/landing/feat-checklist.png',
    alt: "A subject's units in PrepTracker with topics being ticked off",
  },
  {
    id: 'progress',
    dark: true,
    kicker: 'Progress',
    title: 'Progress you can watch',
    body: 'Overall percentage, units mastered, days to your exam and your streak - one glance, no guessing.',
    img: '/landing/dash-desktop.png',
    alt: 'The PrepTracker dashboard with overall progress and days to exam',
  },
  {
    id: 'vault',
    dark: false,
    kicker: 'Resources',
    title: '30 verified resources, inside',
    body: 'Notes, lecture playlists, textbooks and solved PYQs next to the unit they test - every link checked. No more WhatsApp archaeology.',
    img: '/landing/feat-library.png',
    alt: 'The PrepTracker resource library',
  },
  {
    id: 'tasks',
    dark: true,
    kicker: 'Tasks',
    title: 'A task list that knows your units',
    body: 'Plan the week and link a task to the exact unit it belongs to. Done is done, and the bar agrees. Works offline - everything stays on this device.',
    img: '/landing/feat-tasks.png',
    alt: 'The PrepTracker task list linked to units',
  },
];

const FeatureStack: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduceMotion()) return;
    stampChapterMarks();
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.fs-card');
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        // Covered cards recede as clean sheets: chrome (bg + ring) stays put,
        // only the content dissolves. No alpha-dimmed text resting on screen -
        // opacity-0 text is both invisible and out of the contrast audit.
        gsap.to(card, {
          scale: 0.94 + i * 0.015,
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: next,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(card.querySelector('.fs-inner'), {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: next,
            start: 'top 88%',
            end: 'top 72%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    });
    gsap.utils.toArray<HTMLElement>('.fs-card').forEach((card) => {
      gsap.fromTo(
        card,
        { y: 48, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        }
      );
    });
  }, { scope: root });

  return (
    <section ref={root} aria-label="What PrepTracker gives you" className="relative bg-[#F7F5F2] px-4 md:px-6 py-24 md:py-32">
      <p aria-hidden="true" className="hidden xl:block absolute right-8 top-28 font-mono text-[10px] uppercase tracking-[0.34em] text-[#D61A40] [writing-mode:vertical-rl]">every unit, one checkbox</p>
      <div className="max-w-6xl mx-auto">
        <div className="mb-2"><ChapterMark n="02" label="The fix" /></div>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-[-0.025em] leading-[1.08] text-[#141419] max-w-3xl">
          Everything you need to see the whole board.
        </h2>
        <div className="mt-14 md:mt-20 space-y-6 md:space-y-8">
          {features.map((f, i) => (
            <article
              key={f.id}
              id={f.id}
              className={`fs-card md:sticky rounded-3xl overflow-hidden ring-1 scroll-mt-24 will-change-transform ${
                f.dark
                  ? 'bg-[#141419] text-[#F7F5F2] ring-black/20 shadow-[0_32px_64px_-24px_rgba(20,20,25,0.45)]'
                  : 'bg-white text-[#141419] ring-black/[0.08] shadow-[0_24px_48px_-20px_rgba(20,20,25,0.18)]'
              }`}
              style={{ top: `${88 + i * 14}px` }}
            >
              <div className="fs-inner grid md:grid-cols-2 items-center gap-6 md:gap-10 p-7 md:p-12">
                <div>
                  <p className={`font-mono text-[11px] uppercase tracking-[0.22em] ${f.dark ? 'text-[#F63C49]' : 'text-[#D61A40]'}`}>
                    {String(i + 1).padStart(2, '0')} &middot; {f.kicker}
                  </p>
                  <h3 className="mt-4 text-2xl md:text-4xl font-bold tracking-[-0.02em] leading-[1.1]">{f.title}</h3>
                  <p className={`mt-4 leading-relaxed max-w-md ${f.dark ? 'text-[#B8B8C2]' : 'text-[#5A5A66]'}`}>{f.body}</p>
                </div>
                <div className={`rounded-xl overflow-hidden ring-1 ${f.dark ? 'ring-white/10' : 'ring-black/10'}`}>
                  <img src={f.img} alt={f.alt} className="w-full h-auto block" loading="lazy" width={1280} height={800} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStack;

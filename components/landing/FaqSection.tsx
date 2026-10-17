import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import ChapterMark, { stampChapterMarks } from './ChapterMark';
import { gsap, reduceMotion } from '../../lib/scroll';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'Is it actually free?',
    a: "Yes. There's no pricing page, no trial, no card form anywhere in the app. It costs nothing because there's no server to pay for.",
  },
  {
    q: 'Do I need an account?',
    a: 'No. No email, no password, no sign-in wall. You pick your subjects and start.',
  },
  {
    q: 'Where does my data go?',
    a: "Nowhere. Your progress is saved in this browser's local storage, on this device. Clearing your browser data wipes it, so don't.",
  },
  {
    q: 'Does it work offline?',
    a: 'Yes. After the first load it works without internet - the app caches itself on your device.',
  },
  {
    q: 'Which syllabus does it follow?',
    a: 'SPPU First Year Engineering, 2024 pattern. All ten subjects, every unit, plus a resource library with notes, playlists, textbooks and solved PYQs for both 2019 and 2024 patterns.',
  },
  {
    q: 'Who built this?',
    a: 'One SPPU first year who got tired of not knowing how much syllabus was left. It does one job and tries to do it well.',
  },
];

const FaqSection: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(() => {
    if (reduceMotion()) return;
    stampChapterMarks();
    gsap.fromTo(
      '.fq-head',
      { y: 28, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
      }
    );
    gsap.fromTo(
      '.fq-row',
      { y: 24, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06,
        scrollTrigger: { trigger: '.fq-list', start: 'top 85%', once: true },
      }
    );
    gsap.fromTo(
      '.fq-rule',
      { scaleX: 0 },
      {
        scaleX: 1, duration: 1, ease: 'power3.inOut', stagger: 0.07, transformOrigin: 'left center',
        scrollTrigger: { trigger: '.fq-list', start: 'top 85%', once: true },
      }
    );
  }, { scope: root });

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);
    if (next !== null) {
      const el = root.current?.querySelector<HTMLElement>(`.fq-a[data-i="${next}"]`);
      if (el && !reduceMotion()) {
        gsap.fromTo(el, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.55, ease: 'power3.out' });
        const icon = root.current?.querySelector(`.fq-icon[data-i="${next}"]`);
        if (icon) gsap.to(icon, { rotate: 45, duration: 0.4, ease: 'power3.out' });
      }
    }
    if (open !== null && open !== next) {
      const prev = root.current?.querySelector(`.fq-icon[data-i="${open}"]`);
      if (prev && !reduceMotion()) gsap.to(prev, { rotate: 0, duration: 0.4, ease: 'power3.out' });
    }
    if (next === null) {
      const icon = root.current?.querySelector(`.fq-icon[data-i="${open}"]`);
      if (icon && !reduceMotion()) gsap.to(icon, { rotate: 0, duration: 0.4, ease: 'power3.out' });
    }
  };

  return (
    <section ref={root} aria-label="Frequently asked questions" className="relative bg-[#F7F5F2] text-[#141419] px-6 py-24 md:py-32">
      <p aria-hidden="true" className="hidden xl:block absolute right-8 top-28 font-mono text-[10px] uppercase tracking-[0.34em] text-[#D61A40] [writing-mode:vertical-rl]">your data never leaves this browser</p>
      <div className="max-w-3xl mx-auto">
        <div className="fq-head"><ChapterMark n="04" label="Fair questions" /></div>
        <h2 className="fq-head mt-4 text-3xl md:text-5xl font-bold tracking-[-0.025em] leading-[1.08]">
          Free means free. Offline means offline.
        </h2>
        <div className="fq-list mt-12">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="fq-row">
                <div className="fq-rule h-px bg-black/10" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                >
                  <span className="text-base md:text-lg font-semibold tracking-[-0.01em] transition-all duration-300 group-hover:text-[#D61A40] group-hover:translate-x-1">
                    {f.q}
                  </span>
                  <span
                    className="fq-icon shrink-0 w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-[#5A5A66] transition-colors group-hover:border-[#D61A40]/40 group-hover:text-[#D61A40]"
                    data-i={i}
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                    aria-hidden="true"
                  >
                    <Plus size={16} strokeWidth={2} />
                  </span>
                </button>
                <div className="fq-a overflow-hidden" data-i={i} style={isOpen ? undefined : { display: 'none' }}>
                  <p className="pb-7 pr-12 text-[#5A5A66] leading-relaxed max-w-xl">{f.a}</p>
                </div>
              </div>
            );
          })}
          <div className="fq-rule h-px bg-black/10" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

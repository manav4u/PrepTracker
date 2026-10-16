import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
  const reduce = useReducedMotion();
  return (
    <section aria-label="How PrepTracker works" className="relative bg-[#F7F5F2] text-[#141419] px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="text-xs font-mono tracking-[0.2em] uppercase text-[#E11D48]"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 110, damping: 18, delay: reduce ? 0 : 0.08 }}
            className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]"
          >
            Set up in a minute. Useful the same day.
          </motion.h2>
          <ol className="mt-12 space-y-0">
            {steps.map((s, i) => (
              <motion.li
                key={s.num}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 110, damping: 18, delay: reduce ? 0 : 0.12 + i * 0.08 }}
                className="flex gap-6 py-7 border-t border-black/[0.08] last:border-b"
              >
                <span className="font-mono text-sm font-semibold text-[#E11D48] pt-1" aria-hidden="true">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-lg md:text-xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-[#5A5A66] leading-relaxed max-w-md">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', stiffness: 90, damping: 18, delay: reduce ? 0 : 0.15 }}
          className="relative mx-auto w-full max-w-[20rem]"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-[3rem] bg-[#E11D48]/[0.07] blur-2xl"
          />
          <div className="relative rounded-[2.2rem] overflow-hidden ring-1 ring-black/10 shadow-[0_32px_64px_-24px_rgba(20,20,25,0.35)]">
            <img
              src="/landing/subj-mobile.png"
              alt="PrepTracker on a phone: a subject's units with topics ticked off"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
          <p className="mt-5 text-center text-xs font-mono text-[#6E6E78]">
            The real app, mid-semester
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

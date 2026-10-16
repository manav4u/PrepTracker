import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const pains = [
  {
    title: 'The syllabus is a 40-page PDF',
    body: 'Unit lists buried in a document you opened once in July and never again. What you have actually finished lives in your head - sort of.',
  },
  {
    title: 'Easy units feel like progress',
    body: 'You re-read what you already know because it is comfortable. The untouched units stay invisible until the week before the exam.',
  },
  {
    title: 'Material is scattered everywhere',
    body: 'Notes in Drive, playlists on YouTube, PYQs in WhatsApp forwards. Exam week turns into a scavenger hunt instead of a revision plan.',
  },
];

const ProblemSection: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section aria-label="The problem PrepTracker solves" className="relative bg-[#141419] text-[#F7F5F2] px-6 py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-[#E11D48]/10 blur-3xl pointer-events-none"
      />
      <div className="relative max-w-5xl mx-auto">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="text-xs font-mono tracking-[0.2em] uppercase text-[#E11D48]"
        >
          The real problem
        </motion.p>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 110, damping: 18, delay: reduce ? 0 : 0.08 }}
          className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] max-w-3xl"
        >
          You are not behind. You just can't see the whole board.
        </motion.h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {pains.map((p, i) => (
            <motion.div
              key={p.title}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 130, damping: 20, delay: reduce ? 0 : 0.12 + i * 0.1 }}
              className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 md:p-7"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#F7F5F2]/60">{p.body}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.5 }}
          className="mt-12 md:mt-16 text-center text-lg md:text-xl text-[#F7F5F2]/75 font-medium"
        >
          None of this is a motivation problem. It is a visibility problem.
        </motion.p>
      </div>
    </section>
  );
};

export default ProblemSection;

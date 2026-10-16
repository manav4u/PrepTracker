import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const stats = [
  { value: '10', label: 'first-year subjects', note: 'SPPU 2024 pattern' },
  { value: '50', label: 'units mapped', note: 'from the official syllabus' },
  { value: '318', label: 'topics to tick off', note: 'nothing left to guess' },
  { value: '30', label: 'verified resources', note: 'notes, playlists and PYQs' },
];

const TrustStrip: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section aria-label="What PrepTracker covers" className="relative bg-[#F7F5F2] text-[#141419] px-6 pb-20 -mt-px">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="max-w-5xl mx-auto border-y border-black/10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 140, damping: 20, delay: reduce ? 0 : i * 0.08 }}
              className={`px-6 py-8 md:py-10 text-center ${i > 0 ? 'border-l border-black/10' : ''} ${i > 1 ? 'max-md:border-t max-md:border-black/10' : ''} ${i === 2 ? 'max-md:border-l-0' : ''}`}
            >
              <div className="text-4xl md:text-5xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-1.5 text-sm font-semibold">{s.label}</div>
              <div className="mt-0.5 text-xs text-[#141419]/50">{s.note}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <p className="max-w-5xl mx-auto mt-6 text-center text-xs text-[#141419]/45">
        Every unit and topic checked against the official SPPU first-year syllabus. Free, no account, works offline.
      </p>
    </section>
  );
};

export default TrustStrip;

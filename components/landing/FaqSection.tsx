import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-label="Frequently asked questions" className="relative bg-[#F7F5F2] text-[#141419] px-6 py-24 md:py-32">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="text-xs font-mono tracking-[0.2em] uppercase text-[#E11D48]"
        >
          Fair questions
        </motion.p>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 110, damping: 18, delay: reduce ? 0 : 0.08 }}
          className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]"
        >
          Asked before, answered straight.
        </motion.h2>
        <div className="mt-12">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, delay: reduce ? 0 : i * 0.05 }}
                className="border-t border-black/[0.08] last:border-b"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                >
                  <span className="text-base md:text-lg font-semibold tracking-tight group-hover:text-[#E11D48] transition-colors">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="shrink-0 w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-[#5A5A66]"
                    aria-hidden="true"
                  >
                    <Plus size={16} strokeWidth={2} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduce ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pr-12 text-[#5A5A66] leading-relaxed max-w-xl">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

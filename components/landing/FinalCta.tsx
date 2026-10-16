import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FinalCta: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section aria-label="Get started" className="relative bg-[#F7F5F2] px-6 pt-8 pb-24 md:pb-32">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        className="max-w-6xl mx-auto rounded-[2.5rem] bg-[#BE123C] text-white px-8 py-16 md:px-16 md:py-24 relative overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
        />
        <div className="relative max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Walk in knowing exactly what's left.
          </h2>
          <p className="mt-6 text-lg md:text-xl text-white leading-relaxed">
            Free. No account. Set up in under a minute, and your data never leaves this browser.
          </p>
          <div className="mt-10">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#141419] rounded-full font-bold tracking-tight hover:bg-[#F7F5F2] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)]"
            >
              Start tracking now
              <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCta;

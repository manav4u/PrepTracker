import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, Flame, CalendarDays } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: spring },
};

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

const FloatChip: React.FC<{
  icon: React.ReactNode;
  title: string;
  sub: string;
  className: string;
  delay: number;
}> = ({ icon, title, sub, className, delay }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...spring, delay: 0.7 + delay }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay }}
        className="flex items-center gap-3 bg-white rounded-2xl border border-black/5 shadow-[0_16px_40px_-12px_rgba(20,20,25,0.18)] px-4 py-3"
      >
        <span className="w-9 h-9 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center shrink-0">
          {icon}
        </span>
        <span className="text-left">
          <span className="block text-sm font-bold text-[#141419] leading-tight">{title}</span>
          <span className="block text-[11px] text-[#71717a] leading-tight mt-0.5">{sub}</span>
        </span>
      </motion.div>
    </motion.div>
  );
};

const HeroV2: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const shotY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#F7F5F2] text-[#141419]">
      {/* soft color fields, not flat paper */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[#E11D48]/[0.07] blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 -left-40 w-[420px] h-[420px] bg-[#2563EB]/[0.05] blur-[110px] rounded-full pointer-events-none"></div>
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      ></div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl mx-auto px-6 pt-32 md:pt-40 text-center"
      >
        <motion.p
          variants={item}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/10 text-[11px] font-semibold tracking-wide text-[#141419]/70 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
          Built for SPPU first year · 2024 pattern
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-7 font-display font-bold tracking-[-0.035em] leading-[1.02] text-[2.7rem] md:text-[4.6rem] text-[#141419]"
        >
          Know exactly what&rsquo;s left before your exam.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 text-base md:text-lg leading-relaxed text-[#55555e] max-w-xl mx-auto"
        >
          PrepTracker turns the whole first-year syllabus into a checklist you can
          actually finish. Tick topics as you study, open real notes and PYQs, and
          watch the progress bar move. Free. No account. Saved on this device.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/onboarding"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#E11D48] text-white font-semibold text-sm tracking-tight shadow-[0_18px_36px_-12px_rgba(225,29,72,0.5)] hover:bg-[#c81e42] hover:shadow-[0_22px_44px_-12px_rgba(225,29,72,0.6)] active:scale-[0.98] transition-all duration-200"
          >
            Start tracking - it takes a minute
            <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <a
            href="#syllabus"
            className="text-sm font-semibold text-[#141419]/70 hover:text-[#141419] underline decoration-[#141419]/20 underline-offset-4 hover:decoration-[#141419]/50 transition-all"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p variants={item} className="mt-8 text-[12px] font-medium text-[#8b8b93] tracking-wide">
          10 subjects · 30 verified resources · Works offline
        </motion.p>
      </motion.div>

      {/* Product shot */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mt-16 md:mt-20 pb-28 md:pb-36">
        <motion.div style={{ y: shotY }} className="relative">
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.45 }}
            className="relative rounded-2xl md:rounded-[1.4rem] bg-white border border-black/10 shadow-[0_50px_100px_-30px_rgba(20,20,25,0.35)] overflow-hidden"
          >
            {/* browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5 bg-white">
              <span className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]"></span>
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]"></span>
                <span className="w-3 h-3 rounded-full bg-[#28C840]"></span>
              </span>
              <span className="mx-auto flex items-center gap-1.5 text-[11px] font-medium text-[#71717a] bg-[#F7F5F2] border border-black/5 rounded-full px-4 py-1">
                preptracker.manavdev.site
              </span>
              <span className="w-10"></span>
            </div>
            <img
              src="/landing/dash-desktop.png"
              alt="The real PrepTracker dashboard: overall progress, units mastered, last 7 days of study activity, days to exam and streak, followed by course cards."
              className="block w-full"
            />
          </motion.div>

          <FloatChip
            icon={<CheckCircle2 size={18} />}
            title="Unit 1 mastered"
            sub="Single Variable Calculus"
            className="hidden md:flex -left-8 top-16"
            delay={0.15}
          />
          <FloatChip
            icon={<Flame size={18} />}
            title="4-day streak"
            sub="Real study activity"
            className="hidden md:flex -right-6 top-40"
            delay={0.3}
          />
          <FloatChip
            icon={<CalendarDays size={18} />}
            title="Exam in 11 days"
            sub="You set the dates"
            className="hidden md:flex left-10 -bottom-6"
            delay={0.45}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroV2;

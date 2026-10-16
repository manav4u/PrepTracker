import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

type Card = {
  id?: string;
  title: string;
  body: string;
  img?: string;
  imgAlt?: string;
  span: string;
  icon?: React.ReactNode;
};

const cards: Card[] = [
  {
    id: 'syllabus',
    title: 'The whole syllabus, as a checklist',
    body: 'Every unit of all 10 subjects with four honest states - not started, in progress, revision, mastered. Tick topics as you study and the bars move.',
    img: '/landing/feat-checklist.png',
    imgAlt: 'Subject view showing units of Engineering Mathematics-I with start, study and done states',
    span: 'md:col-span-7',
  },
  {
    title: 'Progress you can watch',
    body: 'Overall percentage, units mastered, days to your exam and your streak - one glance, no guessing.',
    img: '/landing/dash-desktop.png',
    imgAlt: 'Dashboard showing overall progress, units mastered, days to exam and study streak',
    span: 'md:col-span-5',
  },
  {
    id: 'vault',
    title: '30 verified resources, inside',
    body: 'Notes, lecture playlists, textbooks and solved PYQs next to the unit they test - every link checked. No more WhatsApp archaeology.',
    img: '/landing/feat-library.png',
    imgAlt: 'Resource library with filters and cards for question papers, notes and lecture streams',
    span: 'md:col-span-4',
  },
  {
    id: 'tasks',
    title: 'A task list that knows your units',
    body: 'Plan the week and link a task to the exact unit it belongs to. Done is done, and the bar agrees.',
    img: '/landing/feat-tasks.png',
    imgAlt: 'Task list with tasks like revising a theorem and solving a past paper',
    span: 'md:col-span-4',
  },
  {
    title: 'Offline and yours',
    body: 'No account, no sync, no server. Everything is saved on this device and works without internet.',
    icon: <WifiOff size={22} strokeWidth={1.8} />,
    span: 'md:col-span-4',
  },
];

const FeaturesBento: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section aria-label="What PrepTracker gives you" className="relative bg-[#F7F5F2] text-[#141419] px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="text-xs font-mono tracking-[0.2em] uppercase text-[#E11D48]"
        >
          The fix
        </motion.p>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 110, damping: 18, delay: reduce ? 0 : 0.08 }}
          className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] max-w-2xl"
        >
          Everything you need to see the whole board.
        </motion.h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-4">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              id={c.id}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 130, damping: 20, delay: reduce ? 0 : (i % 3) * 0.08 }}
              className={`${c.span} scroll-mt-28 rounded-3xl bg-white border border-black/[0.06] p-7 md:p-8 flex flex-col overflow-hidden shadow-[0_1px_2px_rgba(20,20,25,0.04)] hover:shadow-[0_12px_32px_-12px_rgba(20,20,25,0.15)] hover:-translate-y-0.5 transition-all duration-300`}
            >
              {c.icon ? (
                <div className="w-11 h-11 rounded-xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center" aria-hidden="true">
                  {c.icon}
                </div>
              ) : null}
              <h3 className={`${c.icon ? 'mt-5' : ''} text-xl font-semibold tracking-tight`}>{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#141419]/60">{c.body}</p>
              {c.img ? (
                <div className="mt-6 -mb-2 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                  <img
                    src={c.img}
                    alt={c.imgAlt}
                    loading="lazy"
                    className="w-full h-48 md:h-56 object-cover object-top"
                  />
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBento;

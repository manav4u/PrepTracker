import Doodle from '../components/Doodle';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useSubjects } from '../context/SubjectsContext';
import { recordStudy, currentStreak } from '../lib/activity';
import type { Profile } from '../types';
import { buildQueue, answer, STEPS, type ReviewItem, type ReviewEntry } from '../lib/revision';

const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';
const SHOWN_UP_NEXT = 4;

const dayLabel = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const Revise: React.FC = () => {
  const { profile, setProfile, userProgress, reviews, setReviews } = useData();
  const { subjects: allSubjects } = useSubjects();
  const [stopLine, setStopLine] = useState(false);
  // The last tap, kept so one tap can be taken back.
  const [last, setLast] = useState<{ item: ReviewItem; recalled: boolean; prev: ReviewEntry | undefined; profile: Profile | null } | null>(null);

  const queue = useMemo(
    () => buildQueue(allSubjects, profile?.selectedSubjects || [], userProgress, profile?.events || [], reviews),
    [allSubjects, profile?.selectedSubjects, profile?.events, userProgress, reviews]
  );

  const [current, ...rest] = queue.today;
  const left = queue.today.length;
  const total = left + queue.doneToday;
  const pct = total === 0 ? 0 : Math.round((queue.doneToday / total) * 100);
  const streak = profile ? currentStreak(profile) : 0;

  const respond = (item: ReviewItem, recalled: boolean) => {
    const now = new Date();
    setLast({ item, recalled, prev: reviews[item.key], profile });
    setReviews((r) => ({ ...r, [item.key]: answer(r[item.key], recalled, now) }));
    // A review is study work: it counts toward the day and the streak like ticking a topic.
    if (profile) setProfile(recordStudy(profile, now, { subjectId: item.subjectId, unitId: item.unitId, topic: item.topic, kind: 'review' }));
  };

  const undo = () => {
    if (!last) return;
    setReviews((r) => {
      const next = { ...r };
      if (last.prev) next[last.item.key] = last.prev;
      else delete next[last.item.key];
      return next;
    });
    if (last.profile) setProfile(last.profile);
    setLast(null);
  };

  const undoRow = last && (
    <div className="flex items-center justify-between gap-3 mt-4 min-h-9">
      <p className="text-xs text-slate-500 truncate">{last.recalled ? 'Got it' : 'Forgot'}: {last.item.topic}</p>
      <button type="button" onClick={undo} className={`shrink-0 h-9 px-4 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200 transition-colors ${EASE} hover:border-white/40 hover:text-white`}>
        Undo
      </button>
    </div>
  );

  const nextLine = queue.tomorrow > 0
    ? `${queue.tomorrow} ${queue.tomorrow === 1 ? 'topic comes' : 'topics come'} back tomorrow.`
    : queue.nextDue
      ? `Next review is ${dayLabel(queue.nextDue)}.`
      : '';

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="relative mb-6 lg:mb-12">
        <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>Daily revision
        </span>
        <h1 className="text-white leading-[0.95]">
          <span className="block text-6xl lg:text-8xl tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Revise
            <span onClick={() => setStopLine((v) => !v)} className="inline-block text-[#F63C49] cursor-default">.</span>
          </span>
        </h1>
        <p aria-hidden="true" className={`absolute left-0 -bottom-6 text-xs text-slate-500 transition-opacity ${EASE} ${stopLine ? 'opacity-100' : 'opacity-0'}`}>Little and often beats all night.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-x-8 lg:gap-y-5 items-start">
        {/* Compact stats: a strip above the topic card on phone, top of the right column on desktop */}
        <section
          aria-live="polite"
          className="order-1 lg:col-start-8 lg:col-span-5 lg:row-start-1 rounded-2xl lg:rounded-3xl border border-white/10 surface-1 px-4 py-3.5 lg:px-6 lg:py-5"
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="flex items-baseline gap-2 text-sm lg:text-base text-slate-400">
              <span className={`text-4xl lg:text-5xl leading-none tabular-nums ${left > 0 ? 'text-[#F63C49]' : 'text-slate-700'}`} style={{ fontFamily: "'Instrument Serif', serif" }}>{left}</span>
              left
            </p>
            <p className="text-sm lg:text-base text-slate-400 tabular-nums text-right">
              <span className="text-white font-semibold">{queue.doneToday}</span> done
              {streak > 0 && <> · <span className="text-white font-semibold">{streak}</span>-day streak</>}
            </p>
          </div>
          <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={queue.doneToday} aria-label="Reviews done today">
            <div className={`h-full rounded-full bg-[#F63C49] transition-[width] ${EASE}`} style={{ width: `${pct}%` }}></div>
          </div>
          {queue.waiting > 0 && <p className="mt-2 text-right text-xs text-slate-500 tabular-nums">{queue.waiting} more tomorrow</p>}
        </section>

        <div className="order-2 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:row-span-2 space-y-5">
          {current ? (
            <section key={current.key} className={`rounded-3xl border border-white/10 surface-1 p-5 lg:p-8 animate-in fade-in ${EASE}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300 max-w-full truncate">{current.subjectName}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 whitespace-nowrap">Unit {current.unitNumber}</span>
              </div>
              <p className="mt-5 lg:mt-8 text-3xl lg:text-5xl leading-[1.1] text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>{current.topic}</p>
              <p className="mt-3 text-xs text-slate-500 tabular-nums">
                Topic {queue.doneToday + 1} of {total}
                {current.shaky && ' · you forgot it last time'}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5 lg:mt-8">
                <button
                  type="button"
                  onClick={() => respond(current, false)}
                  className={`h-14 rounded-full border border-white/15 text-xs font-bold uppercase tracking-[0.14em] text-slate-200 whitespace-nowrap transition-colors ${EASE} hover:border-white/40 hover:text-white active:bg-white/5`}
                >
                  Forgot
                </button>
                <button
                  type="button"
                  onClick={() => respond(current, true)}
                  className={`h-14 rounded-full bg-[#F63C49] text-xs font-bold uppercase tracking-[0.14em] text-white whitespace-nowrap transition-colors ${EASE} hover:bg-[#ff5560] active:bg-[#d92f3b]`}
                >
                  Got it
                </button>
              </div>
              {last ? undoRow : <p className="mt-4 text-xs text-slate-500 leading-relaxed min-h-9 flex items-center">Recall it from memory, then tap. Forgot comes back tomorrow.</p>}
            </section>
          ) : queue.trackedTopics === 0 && queue.doneToday === 0 ? (
            <section className="rounded-3xl border border-white/10 surface-1 p-5 lg:p-8 relative">
              <Doodle kind="sprout" className="absolute right-5 bottom-5 lg:right-8 lg:bottom-8 w-20 h-20 lg:w-28 lg:h-28" />
              <p className="text-2xl lg:text-3xl text-white leading-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>Nothing to revise yet.</p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-md">
                Tick topics as you study them. Each one comes back here after {STEPS.slice(0, -1).join(', ')} and {STEPS[STEPS.length - 1]} days.
              </p>
              <Link to="/app" className={`mt-6 inline-flex items-center h-11 px-5 rounded-full border border-white/15 text-xs font-bold uppercase tracking-[0.14em] text-slate-200 transition-colors ${EASE} hover:border-white/40 hover:text-white`}>
                Open your subjects
              </Link>
            </section>
          ) : (
            <section className="rounded-3xl border border-white/10 surface-1 p-5 lg:p-8 relative">
              <Doodle kind={queue.doneToday > 0 ? 'moon' : 'sprout'} className="absolute right-5 bottom-5 lg:right-8 lg:bottom-8 w-20 h-20 lg:w-28 lg:h-28" />
              <p className="text-2xl lg:text-3xl text-white leading-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {queue.doneToday > 0 ? 'All done for today.' : 'Nothing due today.'}
              </p>
              {nextLine && <p className="mt-3 text-sm text-slate-400 leading-relaxed">{nextLine}</p>}
              {undoRow}
            </section>
          )}
        </div>
        {rest.length > 0 && (
          <section className="order-3 lg:col-start-8 lg:col-span-5 lg:row-start-2">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-3 px-1">Up next</h2>
            <ul className="rounded-3xl border border-white/10 surface-1 divide-y divide-white/5 overflow-hidden">
              {rest.slice(0, SHOWN_UP_NEXT).map((i) => (
                <li key={i.key} className="px-5 py-3.5 min-w-0">
                  <p className="text-sm text-white truncate">{i.topic}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1 truncate">{i.subjectName} · Unit {i.unitNumber}</p>
                </li>
              ))}
              {rest.length > SHOWN_UP_NEXT && (
                <li className="px-5 py-3.5 text-xs text-slate-500 tabular-nums">and {rest.length - SHOWN_UP_NEXT} more today</li>
              )}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default Revise;

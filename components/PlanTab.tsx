import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useSubjects } from '../context/SubjectsContext';
import { recordStudy } from '../lib/activity';
import { buildPlan, msToMidnight, toggleTopicProgress } from '../lib/plan';
import { UnitStatus } from '../types';

const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';
const STATUSES = { notStarted: UnitStatus.NOT_STARTED, inProgress: UnitStatus.IN_PROGRESS, mastered: UnitStatus.MASTERED };

const shortDate = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

/** The current time, refreshed at local midnight and when the tab comes back into view. */
export const useNow = (): Date => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => { clearTimeout(timer); timer = setTimeout(() => { setNow(new Date()); arm(); }, msToMidnight() + 1000); };
    const refresh = () => { if (document.visibilityState === 'visible') { setNow(new Date()); arm(); } };
    arm();
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', refresh); window.removeEventListener('focus', refresh); };
  }, []);
  return now;
};

export const usePlan = () => {
  const { profile, userProgress } = useData();
  const { subjects } = useSubjects();
  const now = useNow();
  const dayStamp = now.toDateString();
  return useMemo(
    () => buildPlan(subjects, profile?.selectedSubjects || [], profile?.examDates, userProgress, profile?.events || [], now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subjects, profile?.selectedSubjects, profile?.examDates, profile?.events, userProgress, dayStamp]
  );
};

const PlanTab: React.FC = () => {
  const { profile, setProfile, userProgress, setUserProgress } = useData();
  const { subjects } = useSubjects();
  const now = useNow();
  const plan = usePlan();
  const pct = plan.target === 0 ? 0 : Math.round((plan.creditedToday / plan.target) * 100);

  const toggle = (subjectId: string, unitId: string, topic: string) => {
    const unit = subjects.find((s) => s.id === subjectId)?.units.find((u) => u.id === unitId);
    if (!unit) return;
    const { next, nowTicked } = toggleTopicProgress(userProgress, unitId, topic, unit.topics, STATUSES);
    setUserProgress(next);
    if (nowTicked && profile) setProfile(recordStudy(profile, new Date(), { subjectId, unitId, topic, kind: 'topic' }));
  };

  const dayText = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const dateNotices = <>
    {plan.examsToday.length > 0 && (
      <p className="mt-3 text-sm text-slate-300 leading-relaxed">Exam today: {plan.examsToday.map(s => s.name).join(', ')}. No new study target is set on exam day. <Link to="/app/revise" className="text-slate-200 underline underline-offset-2">Open Review</Link></p>
    )}
    {plan.pastExams.length > 0 && (
      <p className="mt-3 text-sm text-slate-400 leading-relaxed">Past exam dates: {plan.pastExams.map(s => s.name).join(', ')}. These subjects are not in today's plan. <Link to="/app/settings" className="text-slate-200 underline underline-offset-2">Edit dates</Link></p>
    )}
  </>;

  if (plan.subjects.length === 0) {
    const hasDates = plan.examsToday.length > 0 || plan.pastExams.length > 0;
    return (
      <section className="rounded-3xl border border-white/10 surface-1 p-5 lg:p-8 max-w-2xl" data-testid="plan-empty">
        <p className="text-2xl lg:text-3xl text-white leading-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
          {plan.examsToday.length > 0 ? 'Exam day.' : hasDates ? 'No upcoming exams to plan for.' : 'Add an exam date to get a plan.'}
        </p>
        {dateNotices}
        {(!hasDates || plan.undated.length > 0) && <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          Each subject is planned on its own exam date. PrepTracker never guesses one.
          {plan.undated.length > 0 && <> Missing a date: {plan.undated.map((u) => u.name).join(', ')}.</>}
        </p>}
        <Link to={plan.examsToday.length > 0 ? '/app/revise' : '/app/settings'} className={`mt-6 inline-flex items-center h-11 px-5 rounded-full border border-white/15 text-xs font-bold uppercase tracking-[0.14em] text-slate-200 transition-colors ${EASE} hover:border-white/40 hover:text-white`}>
          {plan.examsToday.length > 0 ? 'Open Review' : hasDates ? 'Edit exam dates' : 'Open Settings'}
        </Link>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-x-8 items-start" data-testid="plan-tab">
      <section aria-live="polite" className="order-1 lg:order-2 lg:col-span-5 rounded-2xl lg:rounded-3xl border border-white/10 surface-1 px-4 py-3.5 lg:px-6 lg:py-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="flex items-baseline gap-2 text-sm lg:text-base text-slate-300">
            <span className={`text-4xl lg:text-5xl leading-none tabular-nums ${plan.remaining > 0 ? 'text-[#F63C49]' : 'text-slate-500'}`} style={{ fontFamily: "'Instrument Serif', serif" }}>{plan.remaining}</span>
            left
          </p>
          <p className="text-sm lg:text-base text-slate-300 tabular-nums text-right">
            <span className="text-white font-semibold">{plan.creditedToday}</span> done of {plan.target}
          </p>
        </div>
        <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={plan.target} aria-valuenow={plan.creditedToday} aria-label="Daily topic goals completed">
          <div className={`h-full rounded-full bg-[#F63C49] transition-[width] ${EASE}`} style={{ width: `${Math.min(100, pct)}%` }}></div>
        </div>
        {dateNotices}
        {plan.extraToday > 0 && (
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">+{plan.extraToday} extra {plan.extraToday === 1 ? 'topic' : 'topics'} studied. Extra work in one subject does not replace another subject's goal.</p>
        )}
        {plan.nothingLeft ? (
          <p className="mt-3 text-xs text-slate-300 leading-relaxed">Every topic is ticked for your dated subjects.</p>
        ) : (
          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
            To cover every topic before your exam dates, you need about {plan.target} topics a day. Topics differ in size, so this is an estimate.
          </p>
        )}
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">Plan for {dayText}. It updates at midnight, and when you change exam dates or subjects.</p>
        {plan.undated.length > 0 && (
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Not planned, no exam date: {plan.undated.map((u) => u.name).join(', ')}. <Link to="/app/settings" className="text-slate-200 underline underline-offset-2">Add a date</Link>
          </p>
        )}
      </section>

      <div className="order-2 lg:order-1 lg:col-span-7 rounded-3xl border border-white/10 surface-1 p-4 lg:p-6 space-y-5">
        {plan.subjects.map((s) => (
          <div key={s.subjectId}>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 truncate">{s.name}</h2>
              <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">Exam {shortDate(s.examDate)}</p>
            </div>
            {s.topics.length === 0 ? (
              <p className="py-3 text-sm text-slate-300">{s.left === 0 ? 'All topics ticked.' : 'Done for today.'}</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {s.topics.map((t) => (
                  <li key={t.key}>
                    <button
                      type="button"
                      onClick={() => toggle(s.subjectId, t.unitId, t.topic)}
                      aria-pressed={t.done}
                      aria-label={`${t.done ? 'Mark not done' : 'Mark done'}: ${t.topic}`}
                      className="w-full flex items-center gap-3 py-3 text-left min-h-11"
                    >
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${EASE} ${t.done ? 'bg-[#F63C49] border-[#F63C49] text-white' : 'border-white/30 text-transparent'}`}>
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span className={`text-sm min-w-0 ${t.done ? 'text-slate-400 line-through' : 'text-slate-100'}`}>{t.topic}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <p className="text-xs text-slate-400">Topic counts are an estimate. Topics differ in size.</p>
      </div>
    </div>
  );
};

export default PlanTab;

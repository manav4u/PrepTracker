import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, FileText, PlayCircle } from 'lucide-react';
import { getYouTubeID } from '../../constants';
import { UnitStatus } from '../../types';
import ResourceViewerModal from '../ResourceViewerModal';
import { SubjectDetailState } from './useSubjectDetail';
import { EASE, PyqRow, StatusSteps, TopicList } from './shared';

const YEARS = ['2022', '2023', '2024'];

/** One small book spine for the header shelf. Fill follows the unit's state. */
const Spine: React.FC<{ status: UnitStatus }> = ({ status }) => (
  <span className="w-3.5 h-9 rounded-t-[3px] bg-white/[0.07] border border-white/10 border-b-0 relative overflow-hidden shrink-0">
    {status === UnitStatus.MASTERED && <span className="absolute inset-0 bg-[#D61A40]" />}
    {status === UnitStatus.IN_PROGRESS && <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[#D61A40]" />}
  </span>
);

/** Concept B - Open shelf. Continues the setup story: the books on your shelf open.
 *  Each unit is a book with a spine strip; opening it shows its pages (topics) and ribbons (PYQs). */
const ConceptB: React.FC<{ s: SubjectDetailState }> = ({ s }) => {
  const { subject } = s;
  if (!subject) return null;
  const allDone = s.masteredUnits === subject.units.length;

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <ResourceViewerModal isOpen={!!s.viewResource} onClose={() => s.setViewResource(null)} resource={s.viewResource} />

      <Link to="/app" className={`inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors ${EASE} mb-8`}>
        <ArrowLeft size={12} /> Your shelf
      </Link>

      <header className="relative mb-12">
        <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>
          From your shelf - {subject.code} - {subject.credits} credits
        </span>
        <h1 className="font-display font-bold text-4xl lg:text-6xl tracking-tight text-white leading-[0.95] text-balance">
          {subject.name}<span className="text-[#F63C49]">.</span>
        </h1>

        {/* Mini shelf: one spine per unit, filled by state */}
        <div className="mt-8" data-testid="subject-progress">
          <div className="flex items-end gap-1.5 pb-0" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.coveredPct} aria-label="Syllabus covered">
            {subject.units.map(u => <Spine key={u.id} status={s.getProg(u.id).status} />)}
          </div>
          <div className="h-[3px] rounded-full bg-white/[0.12] shadow-[0_2px_0_rgba(0,0,0,0.6)]" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-mono">
            {s.masteredUnits} of {subject.units.length} units done - {s.coveredTopics}/{s.totalTopics} topics - {s.coveredPct}%
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* The books */}
        <div className="lg:col-span-8 space-y-6">
          {allDone && (
            <section className="surface-1 rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
              <div className="flex justify-center gap-1.5 mb-6" aria-hidden>
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} className="pt-burst-dot w-1.5 h-1.5 rounded-full bg-[#F63C49]" style={{ ['--a' as string]: `${i * 72 - 144}deg`, animationDelay: `${i * 40}ms` }} />
                ))}
              </div>
              <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight text-white">
                All units cleared<span className="text-[#F63C49]">.</span>
              </h2>
              <p className="text-sm text-slate-500 mt-2">Revise, solve papers, sleep. You earned it.</p>
            </section>
          )}
          {subject.units.map(unit => {
            const p = s.getProg(unit.id);
            const isMastered = p.status === UnitStatus.MASTERED;
            const isActive = p.status !== UnitStatus.NOT_STARTED;
            const open = !s.isCollapsed(unit.id);
            const topicsDone = (p.topicsDone || []).filter(t => (unit.topics || []).includes(t)).length;
            return (
              <article key={unit.id} className="surface-1 rounded-2xl relative overflow-hidden">
                {/* Spine strip: dark, half red, full red */}
                <span className="absolute inset-y-0 left-0 w-2.5 bg-[#1c1c21]" aria-hidden>
                  {isMastered && <span className="absolute inset-0 bg-[#D61A40]" />}
                  {!isMastered && isActive && <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[#D61A40]" />}
                </span>

                <div className="pl-7 pr-5 lg:pl-9 lg:pr-7 py-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button data-tour="unit-heading" type="button" onClick={() => s.toggleCollapsed(unit.id)} aria-expanded={open} className="text-left min-w-0 group">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                        Unit {String(unit.unit_number).padStart(2, '0')} - {topicsDone}/{(unit.topics || []).length} topics
                      </span>
                      <h2 className={`font-display font-bold text-xl lg:text-2xl tracking-tight transition-colors ${EASE} ${isMastered ? 'text-[#F63C49]' : 'text-white group-hover:text-[#F63C49]'}`}>
                        {unit.title}
                      </h2>
                    </button>
                    <div data-tour="unit-status"><StatusSteps value={p.status} onChange={st => s.updateStatus(unit.id, st)} /></div>
                  </div>

                  {open && (
                    <div className="mt-6">
                      {unit.topics && unit.topics.length > 0 && (
                        <div data-tour="unit-topics" className="border-l-2 border-[#D61A40]/60 pl-5 ml-1 mb-6">
                          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Pages to cover</h3>
                          <TopicList topics={unit.topics} done={p.topicsDone || []} onToggle={t => s.toggleTopic(unit.id, t, unit.topics)} />
                        </div>
                      )}
                      <div data-tour="unit-pyq" className="flex items-center gap-4 ml-1">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Paper ribbons</h3>
                        <PyqRow
                          years={YEARS}
                          solved={p.pyqsCompleted || []}
                          onToggle={y => s.togglePyq(unit.id, y)}
                          labelFor={y => `${y} question paper, ${unit.title}: ${(p.pyqsCompleted || []).includes(y) ? 'solved' : 'not solved'}`}
                         
                        />
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* From the library */}
        <aside data-tour="course-resources" className="lg:col-span-4">
          <div className="surface-1 rounded-2xl p-6 lg:sticky lg:top-24">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-5 flex items-center justify-between">
              From the library
              <Link to="/app/resources" aria-label="Open the resource library" className={`text-slate-500 hover:text-[#F63C49] transition-colors ${EASE}`}>
                <ArrowUpRight size={12} />
              </Link>
            </h3>
            {s.subjectResources.length > 0 ? (
              <div className="space-y-2">
                {s.subjectResources.map(r => {
                  const isVideo = !!getYouTubeID(r.url) || r.type === 'video';
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => s.setViewResource(r)}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-[background-color] ${EASE} hover:bg-white/[0.05] group`}
                    >
                      <span className="w-9 h-11 rounded-t-md bg-white/[0.06] border border-white/10 border-b-2 border-b-[#D61A40]/50 flex items-center justify-center shrink-0">
                        {isVideo ? <PlayCircle size={15} className="text-[#F63C49]" /> : <FileText size={15} className="text-slate-500" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-white truncate">{r.title}</span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">{r.category} - {r.author}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-600">Nothing on this shelf yet. <Link to="/app/resources" className="text-[#F63C49] hover:underline">Add a resource.</Link></p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ConceptB;

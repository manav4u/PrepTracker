import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronDown, FileText, PlayCircle, Check } from 'lucide-react';
import { getYouTubeID } from '../../constants';
import { UnitStatus } from '../../types';
import ResourceViewerModal from '../ResourceViewerModal';
import { SubjectDetailState } from './useSubjectDetail';
import { EASE, PyqRow, StatusSteps, TopicList } from './shared';

const YEARS = ['2022', '2023', '2024'];

/** Concept C - Up next. Action first: the current unit is a big work panel,
 *  the rest wait in a queue, cleared units shrink to a strip. */
const ConceptC: React.FC<{ s: SubjectDetailState }> = ({ s }) => {
  const { subject } = s;
  if (!subject) return null;

  const nextUnit = subject.units.find(u => s.getProg(u.id).status !== UnitStatus.MASTERED);
  const queue = subject.units.filter(u => u.id !== nextUnit?.id && s.getProg(u.id).status !== UnitStatus.MASTERED);
  const cleared = subject.units.filter(u => s.getProg(u.id).status === UnitStatus.MASTERED);
  const allDone = !nextUnit;

  const pyqLabel = (unitTitle: string, solved: string[]) => (y: string) =>
    `${y} question paper, ${unitTitle}: ${solved.includes(y) ? 'solved' : 'not solved'}`;

  return (
    <div className="animate-in fade-in duration-500 pb-24 max-w-4xl mx-auto">
      <ResourceViewerModal isOpen={!!s.viewResource} onClose={() => s.setViewResource(null)} resource={s.viewResource} />

      <Link to="/app" className={`inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors ${EASE} mb-8`}>
        <ArrowLeft size={12} /> Dashboard
      </Link>

      <header className="mb-10">
        <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>
          Course - {subject.code} - {subject.credits} credits
        </span>
        <h1 className="font-display font-bold text-4xl lg:text-6xl tracking-tight text-white leading-[0.95] text-balance">
          {subject.name}<span className="text-[#F63C49]">.</span>
        </h1>
        <div className="mt-7 flex items-center gap-4" data-testid="subject-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.coveredPct} aria-label="Syllabus covered">
          <div className="flex gap-1 h-1.5 flex-1 max-w-xs">
            {subject.units.map(u => (
              <span key={u.id} className={`flex-1 rounded-sm transition-colors ${EASE} ${s.getProg(u.id).status === UnitStatus.MASTERED ? 'bg-[#D61A40]' : 'bg-white/10'}`} />
            ))}
          </div>
          <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
            {s.masteredUnits}/{subject.units.length} units - {s.coveredTopics}/{s.totalTopics} topics
          </span>
        </div>
      </header>

      {/* Up next hero */}
      {nextUnit ? (
        <section className="surface-1 rounded-3xl p-6 lg:p-10 mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F63C49]">
            Up next - Unit {String(nextUnit.unit_number).padStart(2, '0')}
          </span>
          <h2 className="font-display font-bold text-2xl lg:text-4xl tracking-tight text-white mt-2 mb-6">{nextUnit.title}</h2>

          <div className="max-w-md mb-8">
            <StatusSteps value={s.getProg(nextUnit.id).status} onChange={st => s.updateStatus(nextUnit.id, st)} look="segments" />
          </div>

          {nextUnit.topics && nextUnit.topics.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">
                Topics <span className="font-mono text-slate-600">{(s.getProg(nextUnit.id).topicsDone || []).filter(t => nextUnit.topics.includes(t)).length}/{nextUnit.topics.length}</span>
              </h3>
              <TopicList
                topics={nextUnit.topics}
                done={s.getProg(nextUnit.id).topicsDone || []}
                onToggle={t => s.toggleTopic(nextUnit.id, t, nextUnit.topics)}
                look="grid"
              />
            </div>
          )}

          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Question papers</h3>
            <PyqRow
              years={YEARS}
              solved={s.getProg(nextUnit.id).pyqsCompleted || []}
              onToggle={y => s.togglePyq(nextUnit.id, y)}
              labelFor={pyqLabel(nextUnit.title, s.getProg(nextUnit.id).pyqsCompleted || [])}
              look="chips"
            />
          </div>
        </section>
      ) : (
        /* Easter egg: the cleared state */
        <section className="surface-1 rounded-3xl p-10 lg:p-14 mb-10 text-center relative overflow-hidden">
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

      {/* The queue */}
      {queue.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-3">In queue - {queue.length}</h2>
          <div className="surface-1 rounded-2xl divide-y divide-white/[0.06]">
            {queue.map(unit => {
              const p = s.getProg(unit.id);
              const open = !s.isCollapsed(unit.id, true);
              const topicsDone = (p.topicsDone || []).filter(t => (unit.topics || []).includes(t)).length;
              return (
                <div key={unit.id} className="px-5 lg:px-7">
                  <div className="py-4">
                    <div className="flex items-center gap-4">
                      <span className="font-display font-bold text-white/25 text-lg w-8 shrink-0">{String(unit.unit_number).padStart(2, '0')}</span>
                      <button type="button" onClick={() => s.toggleCollapsed(unit.id, true)} aria-expanded={open} className="flex-1 min-w-0 text-left group flex items-center gap-3">
                        <span className={`font-display font-bold tracking-tight truncate transition-colors ${EASE} text-white group-hover:text-[#F63C49]`}>{unit.title}</span>
                        <ChevronDown size={14} className={`shrink-0 text-slate-600 transition-transform ${EASE} ${open ? '' : '-rotate-90'}`} />
                      </button>
                      <span className="font-mono text-[11px] text-slate-600 shrink-0">{topicsDone}/{(unit.topics || []).length}</span>
                    </div>
                    <div className="pl-12 mt-2">
                      <StatusSteps value={p.status} onChange={st => s.updateStatus(unit.id, st)} look="text" />
                    </div>
                  </div>
                  {open && (
                    <div className="pb-6 pl-12">
                      {unit.topics && unit.topics.length > 0 && (
                        <TopicList topics={unit.topics} done={p.topicsDone || []} onToggle={t => s.toggleTopic(unit.id, t, unit.topics)} look="grid" />
                      )}
                      <div className="mt-4">
                        <PyqRow
                          years={YEARS}
                          solved={p.pyqsCompleted || []}
                          onToggle={y => s.togglePyq(unit.id, y)}
                          labelFor={pyqLabel(unit.title, p.pyqsCompleted || [])}
                          look="chips"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Cleared strip */}
      {cleared.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-3">Cleared - {cleared.length}</h2>
          <div className="surface-1 rounded-2xl divide-y divide-white/[0.06]">
            {cleared.map(unit => (
              <div key={unit.id} className="flex items-center gap-4 px-5 lg:px-7 py-3.5">
                <span className="w-4 h-4 rounded bg-[#D61A40] flex items-center justify-center shrink-0">
                  <Check size={10} strokeWidth={3.5} className="text-white" />
                </span>
                <span className="font-display font-bold tracking-tight text-slate-500 truncate">Unit {String(unit.unit_number).padStart(2, '0')} - {unit.title}</span>
                <button
                  type="button"
                  onClick={() => s.updateStatus(unit.id, UnitStatus.IN_PROGRESS)}
                  className={`ml-auto text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-colors ${EASE} shrink-0`}
                  aria-label={`Reopen unit ${unit.unit_number}, ${unit.title}`}
                >
                  Reopen
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resources strip */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">Resources</h2>
          <Link to="/app/resources" className={`text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-[#F63C49] transition-colors ${EASE} flex items-center gap-1`}>
            Library <ArrowUpRight size={10} />
          </Link>
        </div>
        {s.subjectResources.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
            {s.subjectResources.map(r => {
              const isVideo = !!getYouTubeID(r.url) || r.type === 'video';
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => s.setViewResource(r)}
                  className={`surface-1 rounded-2xl p-4 w-56 shrink-0 text-left transition-[border-color] ${EASE} hover:border-white/20`}
                >
                  {isVideo ? <PlayCircle size={16} className="text-[#F63C49] mb-2" /> : <FileText size={16} className="text-slate-500 mb-2" />}
                  <span className="block text-sm font-bold text-white truncate">{r.title}</span>
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">{r.category}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-600">Nothing linked yet. <Link to="/app/resources" className="text-[#F63C49] hover:underline">Add one in the Library.</Link></p>
        )}
      </section>
    </div>
  );
};

export default ConceptC;

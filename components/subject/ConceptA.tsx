import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronDown, FileText, PlayCircle } from 'lucide-react';
import { getYouTubeID } from '../../constants';
import { UnitStatus } from '../../types';
import ResourceViewerModal from '../ResourceViewerModal';
import { SubjectDetailState } from './useSubjectDetail';
import { EASE, PyqRow, StatusSteps, TopicList } from './shared';

const YEARS = ['2022', '2023', '2024'];

/** Concept A - Contents page. The subject as one printed syllabus sheet:
 *  numbered sections, dotted leaders, margin status, a stamp when it is finished. */
const ConceptA: React.FC<{ s: SubjectDetailState }> = ({ s }) => {
  const { subject } = s;
  if (!subject) return null;
  const done = s.coveredPct === 100;

  return (
    <div className="animate-in fade-in duration-500 pb-24 max-w-3xl mx-auto">
      <ResourceViewerModal isOpen={!!s.viewResource} onClose={() => s.setViewResource(null)} resource={s.viewResource} />

      <Link to="/app" className={`inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors ${EASE} mb-8`}>
        <ArrowLeft size={12} /> Dashboard
      </Link>

      {/* Document header */}
      <header className="relative mb-10">
        <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>
          Syllabus - {subject.code} - {subject.credits} credits
        </span>
        <h1 className="font-display font-bold text-4xl lg:text-6xl tracking-tight text-white leading-[0.95] text-balance">
          {subject.name}<span className="text-[#F63C49]">.</span>
        </h1>
        <div className="mt-8" data-testid="subject-progress">
          <div className="flex justify-between items-baseline text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
            <span>Syllabus covered</span>
            <span className="font-mono text-slate-300">{s.coveredTopics}/{s.totalTopics} topics - {s.coveredPct}%</span>
          </div>
          <div className="h-px bg-white/10 relative" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.coveredPct} aria-label="Syllabus covered">
            <div className={`absolute inset-y-0 left-0 bg-[#F63C49] transition-[width] ${EASE}`} style={{ width: `${s.coveredPct}%`, height: '2px', top: '-0.5px' }} />
          </div>
        </div>
      </header>
      {done && (
        <div className="flex justify-end -mt-4 mb-6">
          <div className="pt-drop rotate-[-8deg] border-2 border-[#F63C49] text-[#F63C49] px-3 py-1.5 font-display font-bold text-sm uppercase tracking-[0.2em]">
            Exam ready.
          </div>
        </div>
      )}

      {/* The sheet */}
      <div className="surface-1 rounded-3xl px-6 lg:px-10 py-2">
        {subject.units.map((unit, i) => {
          const p = s.getProg(unit.id);
          const isMastered = p.status === UnitStatus.MASTERED;
          const collapsed = s.isCollapsed(unit.id);
          const topicsDone = (p.topicsDone || []).filter(t => (unit.topics || []).includes(t)).length;
          return (
            <section key={unit.id} className={i > 0 ? 'border-t border-white/[0.07]' : ''}>
              <div className="py-6">
                <div className="flex items-start gap-4 lg:gap-6">
                  <span className={`font-display font-bold text-2xl lg:text-3xl leading-none mt-1 w-10 shrink-0 transition-colors ${EASE} ${isMastered ? 'text-[#F63C49]' : 'text-white/20'}`}>
                    {String(unit.unit_number).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => s.toggleCollapsed(unit.id)}
                    aria-expanded={!collapsed}
                    className="flex-1 min-w-0 text-left group"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className={`font-display font-bold text-lg lg:text-xl tracking-tight transition-colors ${EASE} ${isMastered ? 'text-slate-400' : 'text-white group-hover:text-[#F63C49]'}`}>
                        {unit.title}
                      </span>
                      <span className="flex-1 border-b border-dotted border-white/15 -translate-y-1 hidden sm:block" />
                      <span className="font-mono text-[11px] text-slate-500 shrink-0">{topicsDone}/{(unit.topics || []).length}</span>
                      <ChevronDown size={14} className={`shrink-0 text-slate-600 transition-transform ${EASE} ${collapsed ? '-rotate-90' : ''}`} />
                    </span>
                  </button>
                </div>
                <div className="pl-14 lg:pl-16 mt-3">
                  <StatusSteps value={p.status} onChange={st => s.updateStatus(unit.id, st)} look="text" />
                </div>
              </div>

              {!collapsed && (
                <div className="pl-14 lg:pl-16 pb-8 -mt-2">
                  {unit.topics && unit.topics.length > 0 && (
                    <>
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Key topics</h3>
                      <TopicList topics={unit.topics} done={p.topicsDone || []} onToggle={t => s.toggleTopic(unit.id, t, unit.topics)} look="lines" />
                    </>
                  )}
                  <div className="mt-5">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Question papers</h3>
                    <PyqRow
                      years={YEARS}
                      solved={p.pyqsCompleted || []}
                      onToggle={y => s.togglePyq(unit.id, y)}
                      labelFor={y => `${y} question paper, ${unit.title}: ${(p.pyqsCompleted || []).includes(y) ? 'solved' : 'not solved'}`}
                      look="tags"
                    />
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Further reading, as the document's last section */}
      <section className="mt-12">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="font-display font-bold text-xl text-white tracking-tight">Further reading</h2>
          <span className="flex-1 border-b border-dotted border-white/15 -translate-y-1" />
          <Link to="/app/resources" className={`text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-[#F63C49] transition-colors ${EASE} flex items-center gap-1`}>
            Library <ArrowUpRight size={10} />
          </Link>
        </div>
        {s.subjectResources.length > 0 ? (
          <ul>
            {s.subjectResources.map(r => {
              const isVideo = !!getYouTubeID(r.url) || r.type === 'video';
              return (
                <li key={r.id} className="border-b border-white/[0.06] last:border-0">
                  <button type="button" onClick={() => s.setViewResource(r)} className={`w-full text-left flex items-center gap-3 py-3 group transition-colors ${EASE}`}>
                    {isVideo ? <PlayCircle size={15} className="text-[#F63C49] shrink-0" /> : <FileText size={15} className="text-slate-500 shrink-0" />}
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white truncate transition-colors">{r.title}</span>
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-slate-600 shrink-0">{r.category}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">Nothing linked yet. <Link to="/app/resources" className="text-[#F63C49] hover:underline">Add one in the Library.</Link></p>
        )}
      </section>
    </div>
  );
};

export default ConceptA;

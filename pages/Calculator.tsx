import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { SUBJECTS } from '../constants';
import { RotateCcw, Activity, Cpu, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  CourseMarks,
  GRADE_BANDS,
  MAX_CCE,
  MAX_END_SEM,
  MAX_TERM_WORK,
  estimate,
  failingHeads,
  roundToHalf,
  termWorkGrade,
  theoryGrade,
  Grade,
} from '../lib/grading';

const RULES_URL = 'https://navsahyadri.edu.in/uploads/4.SPPU-Engineering-Rules-and-Regulations.pdf';

type Field = keyof CourseMarks;
const FIELD_MAX: Record<Field, number> = { inSem: MAX_CCE, endSem: MAX_END_SEM, termWork: MAX_TERM_WORK };

const GradeChip = ({ grade }: { grade: Grade | null }) => (
  <span
    className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-widest border ${
      !grade
        ? 'border-white/10 text-slate-600'
        : grade.letter === 'F'
        ? 'border-red-500/40 bg-red-500/10 text-red-400'
        : 'border-white/10 bg-white/5 text-white'
    }`}
    aria-label={grade ? `Grade ${grade.letter}, ${grade.point} points` : 'No grade yet'}
  >
    {grade ? grade.letter : '--'}
  </span>
);

const MarkInput = ({
  label,
  max,
  value,
  onChange,
  id,
  hideLabel,
}: {
  label: string;
  max: number;
  value: number | undefined;
  onChange: (v: string) => void;
  id: string;
  hideLabel?: boolean;
}) => (
  <div className="flex flex-col items-center gap-2">
    <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-[9px] font-mono text-slate-500 uppercase tracking-widest'}>
      {label} / {max}
    </label>
    <div className="relative group/input">
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        step={0.5}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-[4.5rem] bg-white/[0.04] text-lg font-mono text-white text-center border border-white/10 rounded-lg focus:border-[#F63C49] focus:bg-white/[0.07] outline-none py-2 transition-colors placeholder:text-white/20 tabular-nums"
        placeholder="--"
      />
    </div>
  </div>
);

const CalculatorPage: React.FC = () => {
  const { profile, marks, setMarks } = useData();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!profile) return null;
  const selectedIds = profile.selectedSubjects || [];
  const courses = SUBJECTS.filter((s) => selectedIds.includes(s.id));

  const updateMark = (courseId: string, field: Field, raw: string) => {
    setMarks((prev) => {
      const current = { ...(prev[courseId] || {}) };
      const trimmed = raw.trim();
      if (trimmed === '') {
        delete current[field];
      } else {
        const n = parseFloat(trimmed);
        if (!Number.isFinite(n)) return prev;
        current[field] = Math.min(FIELD_MAX[field], Math.max(0, roundToHalf(n)));
      }
      const next = { ...prev };
      if (Object.keys(current).length) next[courseId] = current;
      else delete next[courseId];
      return next;
    });
  };

  const graded = courses.map((c) => ({ id: c.id, theoryCredits: c.theoryCredits, termWorkCredits: c.termWorkCredits }));
  const est = estimate(graded, marks);
  const failing = failingHeads(graded, marks);
  const sgpaText = est.sgpa === null ? '--' : est.sgpa.toFixed(2);

  return (
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#F63C49] mb-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D61A40]"></span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em]">Estimate only</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tighter text-white leading-none">SGPA</h1>
          <p className="mt-2 text-xs text-slate-500 max-w-md leading-relaxed">
            Graded the way the SPPU 2024 pattern does, weighted by credits. Not an official result.
          </p>
        </div>
        {confirmClear ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setMarks({}); setConfirmClear(false); }}
              className="px-3 py-1.5 rounded-lg bg-[#D61A40] text-white text-[9px] font-bold uppercase tracking-widest"
            >
              Yes, clear
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 uppercase tracking-widest"
            >
              Keep
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            disabled={Object.keys(marks).length === 0}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:bg-[#D61A40] hover:text-white hover:border-[#F63C49] transition-all disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 shrink-0"
          >
            <RotateCcw size={10} /> Clear marks
          </button>
        )}
      </header>

      {/* Mobile: keep the running number in view while typing */}
      {createPortal(
      <div
        className="lg:hidden fixed top-[65px] left-0 right-0 z-30 px-6 py-2 bg-[#030303]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between"
        aria-hidden="true"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          {est.complete ? 'SGPA' : 'Partial SGPA'} / {est.completeHeads} of {est.totalHeads} heads
        </span>
        <span className="text-xl font-display font-bold text-white tabular-nums">{sgpaText}</span>
      </div>,
        document.body
      )}

      <div className="lg:hidden h-2" aria-hidden="true" />

      {/* Summary strip: the number, its context, its status. No monument card. */}
      <section className="surface-1 rounded-3xl px-6 py-5 lg:px-8 lg:py-6 flex flex-wrap items-center gap-x-10 gap-y-4" aria-live="polite">
        <div className="flex items-end gap-3">
          <span className="text-6xl lg:text-7xl leading-[0.85] font-display font-bold text-white tracking-tighter tabular-nums">{sgpaText}</span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-1">SGPA / 10</span>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Heads</p>
            <p className="text-sm font-mono font-bold text-white tabular-nums">{est.completeHeads} / {est.totalHeads}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Credits</p>
            <p className="text-sm font-mono font-bold text-white tabular-nums">{est.gradedCredits} / {est.totalCredits}</p>
          </div>
        </div>
        <div className="lg:ml-auto flex flex-col items-start lg:items-end gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
            <Activity size={11} className="text-[#F63C49]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
              {est.sgpa === null ? 'Waiting for marks' : est.complete ? 'Estimated SGPA' : 'Partial estimate'}
            </span>
          </div>
          {failing > 0 && (
            <p className="text-[10px] text-red-400 leading-snug max-w-[16rem] lg:text-right">
              {failing} {failing === 1 ? 'head' : 'heads'} under 40%. That is an F: zero points, course has to be cleared again.
            </p>
          )}
          {est.sgpa !== null && !est.complete && failing === 0 && (
            <p className="text-[10px] text-slate-500 leading-snug max-w-[16rem] lg:text-right">
              Only entered heads count. Fill the rest for the full-semester number.
            </p>
          )}
        </div>
      </section>

      {/* The Ledger */}
      <section className="bg-[#030303] border border-white/10 rounded-3xl overflow-hidden">
        {courses.length === 0 && (
          <p className="p-8 text-sm text-slate-400">
            No courses selected yet. Pick your courses in Settings and they will show up here.
          </p>
        )}

        {/* Desktop ledger header */}
        {courses.length > 0 && (
          <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_92px_92px_92px_72px_72px] gap-4 items-center px-6 py-3 border-b border-white/10 bg-white/[0.02]">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Course</span>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">CCE / 30</span>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">End / 70</span>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">TW / 25</span>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">Theory</span>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">TW</span>
          </div>
        )}

        <div className="divide-y divide-white/5">
          {courses.map((s) => {
            const m = marks[s.id];
            const tg = theoryGrade(m);
            const wg = termWorkGrade(m);
            const rowFailing = (tg?.letter === 'F') || (wg?.letter === 'F');
            return (
              <div key={s.id} className={`relative px-5 py-4 lg:px-6 transition-colors hover:bg-white/[0.02] ${rowFailing ? 'bg-red-500/[0.03]' : ''}`}>
                {rowFailing && <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[#F63C49]"></span>}

                {/* Desktop row */}
                <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_92px_92px_92px_72px_72px] gap-4 items-center">
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{s.code} / {s.credits} cr</span>
                    <h3 className="text-sm font-bold text-white leading-tight mt-0.5 truncate">{s.name}</h3>
                  </div>
                  <div className="flex justify-center"><MarkInput id={`${s.id}-cce`} label="CCE" max={MAX_CCE} value={m?.inSem} onChange={(v) => updateMark(s.id, 'inSem', v)} hideLabel /></div>
                  <div className="flex justify-center"><MarkInput id={`${s.id}-end`} label="End-sem" max={MAX_END_SEM} value={m?.endSem} onChange={(v) => updateMark(s.id, 'endSem', v)} hideLabel /></div>
                  <div className="flex justify-center">{s.termWorkCredits > 0 ? <MarkInput id={`${s.id}-tw`} label="Term work" max={MAX_TERM_WORK} value={m?.termWork} onChange={(v) => updateMark(s.id, 'termWork', v)} hideLabel /> : <span className="text-slate-700 font-mono">--</span>}</div>
                  <div className="flex justify-center"><GradeChip grade={tg} /></div>
                  <div className="flex justify-center">{s.termWorkCredits > 0 ? <GradeChip grade={wg} /> : <span className="text-slate-700 font-mono">--</span>}</div>
                </div>

                {/* Phone block */}
                <div className="lg:hidden">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{s.code} / {s.credits} cr</span>
                      <h3 className="text-sm font-bold text-white leading-tight mt-0.5">{s.name}</h3>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <GradeChip grade={tg} />
                      {s.termWorkCredits > 0 && <GradeChip grade={wg} />}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <MarkInput id={`${s.id}-cce`} label="CCE" max={MAX_CCE} value={m?.inSem} onChange={(v) => updateMark(s.id, 'inSem', v)} />
                    <MarkInput id={`${s.id}-end`} label="End-sem" max={MAX_END_SEM} value={m?.endSem} onChange={(v) => updateMark(s.id, 'endSem', v)} />
                    {s.termWorkCredits > 0 ? (
                      <MarkInput id={`${s.id}-tw`} label="TW" max={MAX_TERM_WORK} value={m?.termWork} onChange={(v) => updateMark(s.id, 'termWork', v)} />
                    ) : <span />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <details className="bg-[#030303] border border-white/10 rounded-2xl p-5 text-sm text-slate-400">
        <summary className="cursor-pointer text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
          <Info size={12} /> How this is graded
        </summary>
        <div className="mt-4 space-y-3 leading-relaxed">
          <p>
            Theory is CCE (30) plus end-semester (70), graded out of 100. Term work (25) is graded on its own as a
            percentage. SGPA is the credit-weighted average of grade points across all heads.
          </p>
          <table className="w-full text-xs font-mono max-w-md">
            <thead>
              <tr className="text-slate-500 text-left">
                <th className="py-1 font-normal">Marks %</th>
                <th className="py-1 font-normal">Grade</th>
                <th className="py-1 font-normal">Points</th>
              </tr>
            </thead>
            <tbody>
              {GRADE_BANDS.map((b) => (
                <tr key={b.letter} className="border-t border-white/5 text-slate-300">
                  <td className="py-1">{b.label}</td>
                  <td className="py-1">{b.letter}</td>
                  <td className="py-1">{b.point}</td>
                </tr>
              ))}
              <tr className="border-t border-white/5 text-slate-300">
                <td className="py-1">Below 40</td>
                <td className="py-1">F</td>
                <td className="py-1">0</td>
              </tr>
            </tbody>
          </table>
          <p>
            Source: SPPU Credit Framework, Guidelines, Rules and Regulations for the 4-year UG Engineering
            programme (2024-25), Table 2.{' '}
            <a href={RULES_URL} target="_blank" rel="noopener noreferrer" className="text-[#F63C49] underline">
              Read the PDF
            </a>
            . Your college's result is the only official one.
          </p>
        </div>
      </details>
    </div>
  );
};

export default CalculatorPage;

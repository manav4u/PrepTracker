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
}: {
  label: string;
  max: number;
  value: number | undefined;
  onChange: (v: string) => void;
  id: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <label htmlFor={id} className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
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
        className="w-20 bg-transparent text-2xl font-mono text-white text-center border-b border-white/10 focus:border-[#F63C49] outline-none py-1 transition-colors placeholder:text-white/10 tabular-nums"
        placeholder="--"
      />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D61A40] scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300"></div>
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
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D61A40]"></span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#F63C49]">
              Estimate only
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tighter text-white leading-none">
            Forecaster
          </h1>
          <p className="mt-4 text-sm text-slate-400 max-w-xl leading-relaxed">
            Enter the marks you have. We grade each head the way SPPU grades it and weight it by credits.
            This is not an official result.
          </p>
        </div>
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

      <div className="lg:hidden h-8" aria-hidden="true" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7">
          <div className="bg-[#030303] border border-white/10 rounded-3xl overflow-hidden relative">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2 text-white">
                <Cpu size={16} />
                <h2 className="font-bold text-xs font-mono uppercase tracking-[0.2em]">Enter Marks</h2>
              </div>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMarks({});
                      setConfirmClear(false);
                    }}
                    className="px-3 py-1.5 rounded bg-[#D61A40] text-white text-[9px] font-bold uppercase tracking-widest"
                  >
                    Yes, clear
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 uppercase tracking-widest"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  disabled={Object.keys(marks).length === 0}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:bg-[#D61A40] hover:text-white hover:border-[#F63C49] transition-all disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400"
                >
                  <RotateCcw size={10} /> Clear marks
                </button>
              )}
            </div>

            {courses.length === 0 && (
              <p className="p-8 text-sm text-slate-400">
                No courses selected yet. Pick your courses in Settings and they will show up here.
              </p>
            )}

            <div className="divide-y divide-white/5">
              {courses.map((s) => {
                const m = marks[s.id];
                const tg = theoryGrade(m);
                const wg = termWorkGrade(m);
                return (
                  <div key={s.id} className="p-5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          {s.code} / {s.credits} credits
                        </span>
                        <h3 className="text-sm font-bold text-white leading-tight mt-1">{s.name}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                            Theory / {s.theoryCredits} cr
                          </span>
                          <GradeChip grade={tg} />
                        </div>
                        <div className="flex items-center justify-around gap-4">
                          <MarkInput
                            id={`${s.id}-cce`}
                            label="CCE"
                            max={MAX_CCE}
                            value={m?.inSem}
                            onChange={(v) => updateMark(s.id, 'inSem', v)}
                          />
                          <MarkInput
                            id={`${s.id}-end`}
                            label="End-sem"
                            max={MAX_END_SEM}
                            value={m?.endSem}
                            onChange={(v) => updateMark(s.id, 'endSem', v)}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                            Term work / {s.termWorkCredits} cr
                          </span>
                          <GradeChip grade={wg} />
                        </div>
                        <div className="flex items-center justify-around">
                          <MarkInput
                            id={`${s.id}-tw`}
                            label="Term work"
                            max={MAX_TERM_WORK}
                            value={m?.termWork}
                            onChange={(v) => updateMark(s.id, 'termWork', v)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <div className="rounded-[2.5rem] surface-1 p-8 lg:p-12 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <div className="relative z-10 w-full" aria-live="polite">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-8">
                <Activity size={12} className="text-[#F63C49]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
                  {est.sgpa === null ? 'Waiting for marks' : est.complete ? 'Estimated SGPA' : 'Partial estimate'}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-[7rem] lg:text-[9rem] leading-[0.8] font-display font-bold text-white tracking-tighter tabular-nums">
                  {sgpaText}
                </h2>
                <p className="text-sm font-mono text-slate-500 uppercase tracking-[0.4em] mt-3">SGPA / 10</p>
              </div>

              <div className="w-full max-w-xs mx-auto space-y-3 text-left">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Heads entered</span>
                  <span className="text-sm font-mono font-bold text-white tabular-nums">
                    {est.completeHeads} / {est.totalHeads}
                  </span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Credits graded</span>
                  <span className="text-sm font-mono font-bold text-white tabular-nums">
                    {est.gradedCredits} / {est.totalCredits}
                  </span>
                </div>
              </div>

              {est.sgpa !== null && !est.complete && (
                <p className="mt-6 text-xs text-slate-400 leading-relaxed">
                  Only the heads you entered are counted. Fill the rest for the full-semester number.
                </p>
              )}
              {failing > 0 && (
                <p className="mt-6 text-xs text-red-400 leading-relaxed">
                  {failing} {failing === 1 ? 'head is' : 'heads are'} under 40 percent. That is an F: zero points, and
                  the course has to be cleared again.
                </p>
              )}
            </div>
          </div>

          <details className="bg-[#030303] border border-white/10 rounded-2xl p-5 text-sm text-slate-400">
            <summary className="cursor-pointer text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
              <Info size={12} /> How this is graded
            </summary>
            <div className="mt-4 space-y-3 leading-relaxed">
              <p>
                Theory is CCE (30) plus end-semester (70), graded out of 100. Term work (25) is graded on its own as a
                percentage. SGPA is the credit-weighted average of grade points across all heads.
              </p>
              <table className="w-full text-xs font-mono">
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
      </div>
    </div>
  );
};

export default CalculatorPage;

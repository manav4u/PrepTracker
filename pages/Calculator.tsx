
import React from 'react';
import {semesterCourses,extraHeads} from '../lib/feMarks.mjs';
import { SUBJECTS } from '../constants';
import { CATALOG } from '../lib/catalog';
import { RotateCcw, Activity, Cpu, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { summarizeMarks, gradeFor } from '../lib/marks.mjs';

const MARKS_KEY = 'sppu_calculator_marks';

type MarkRow = { inSem?: number; endSem?: number; termWork?: number };

// Grade table from the SPPU UG Credit Framework handbook (2024 pattern), Table of grade letters and grade points.
// CGPA class bands from the same handbook (shown here for the SGPA as a guide).
const bandFor = (v: number): string => {
  if (v >= 9.5) return 'Outstanding (O)';
  if (v >= 8.5) return 'Excellent (A+)';
  if (v >= 7.5) return 'Very Good (A)';
  if (v >= 6.25) return 'Good (B+)';
  if (v >= 5.25) return 'Above Average (B)';
  if (v >= 4.75) return 'Average (C)';
  if (v >= 4) return 'Pass (D)';
  return 'Fail (F)';
};

const CalculatorPage: React.FC = () => {
  const { profile,study,setStudy } = useData();
  const config=study.marksConfig;
  const semester=config?.semester||1;const workshop=config?.workshop||'workshop';
  const [marks, setMarksState] = React.useState<Record<string, MarkRow>>(() => {
    try { return JSON.parse(localStorage.getItem(MARKS_KEY) || '{}'); } catch { return {}; }
  });
  const setMarks = (next: Record<string, MarkRow>) => {
    setMarksState(next);
    try { localStorage.setItem(MARKS_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  };

  if (!profile) return null;
  const selectedIds = profile.selectedSubjects || [];

  const unsupported = CATALOG.filter(s => selectedIds.includes(s.id) && s.year !== 'FE');
  const baseSubjects=SUBJECTS.filter(s=>selectedIds.includes(s.id));
  const basket=semesterCourses(CATALOG,selectedIds,semester);
  const fullMode=!!config&&basket.valid;
  const filteredSubjects=fullMode?[...baseSubjects,...extraHeads(semester,workshop)]:baseSubjects;

  const updateMarks = (sId: string, field: 'inSem' | 'endSem' | 'termWork', val: string) => {
    const max = field === 'inSem' ? 30 : field === 'endSem' ? 70 : 25;
    const n = val === '' ? undefined : Math.min(max, Math.max(0, parseInt(val) || 0));
    setMarks({ ...marks, [sId]: { ...(marks[sId] || {}), [field]: n } });
  };

  const summary = summarizeMarks(filteredSubjects, marks);
  const sgpa = Number(summary.value || 0);
  const totalCredits = filteredSubjects.reduce((acc, s) => acc + s.credits, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      
<p className="text-sm text-slate-300">FE marks planner only. {unsupported.length > 0 && `${unsupported.length} SE/TE courses are excluded: complete assessment schemes are not yet mapped.`}</p>
      <section className="p-5 rounded-2xl border border-white/10 space-y-4"><h2 className="text-xl font-bold">FE semester coverage</h2><p className="text-sm text-slate-400">Choose your semester and vocational basket. Full 22-credit coverage requires exactly five theory courses: the right Maths and Programming course plus one Physics/Chemistry, one BEE/BXE and one Graphics/Mechanics. Other heads are added only when that selection matches. Verify your college combination.</p><div className="grid sm:grid-cols-2 gap-4"><label className="text-sm">Semester<select aria-label="Semester" value={config?.semester||''} onChange={e=>setStudy(old=>({...old,marksConfig:e.target.value?{semester:Number(e.target.value) as 1|2,workshop}:undefined}))} className="block mt-2 p-3 w-full bg-zinc-900 rounded-xl"><option value="">Selected courses only</option><option value="1">Semester I</option><option value="2">Semester II</option></select></label><label className="text-sm">Vocational basket<select aria-label="Vocational basket" value={workshop} onChange={e=>setStudy(old=>({...old,marksConfig:{semester,workshop:e.target.value as any}}))} className="block mt-2 p-3 w-full bg-zinc-900 rounded-xl"><option value="workshop">Manufacturing Practice Workshop</option><option value="design">Design Thinking and Idea Lab</option></select></label></div>{config&&!basket.valid&&<p role="alert" className="text-sm text-amber-300">Course selection does not match this semester. Showing selected-course estimate only. Update your plan in Settings.</p>}<p className="text-xs text-slate-400">{fullMode?'All 22 listed credits represented.':'Not full-semester coverage.'} This estimates grade points, not pass eligibility. The handbook overlaps at exactly 40: D 40-44 and F≤40; this planner uses D at 40. Confirm boundary and separate-head pass requirements with your college.</p><div className="flex flex-wrap gap-4 text-sm"><a href="http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/FE%202024%20Pattern%20Syllabus%20-%2016%20July%202024%20(1).pdf" target="_blank" rel="noopener noreferrer" className="text-rose-300">Official FE scheme, pp2-3</a><a href="http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/Rev.HANDBOOK-revised%20Rules%20and%20Regulations_27052025.pdf" target="_blank" rel="noopener noreferrer" className="text-rose-300">Grade rules handbook</a></div></section>
      {/* Header */}
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#E11D48]">Marks planning</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tighter text-white leading-none">
            Marks planner
            </h1>
        </div>
        <div className="hidden lg:block text-right opacity-50">
            <p className="text-[9px] font-mono text-white uppercase tracking-widest">Rules: SPPU 2024 pattern (NEP-2020)</p>
            <p className="text-[9px] font-mono text-white uppercase tracking-widest">Grades: O to F, 10-point</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* INPUT MATRIX (Controls) */}
        <div className="lg:col-span-7">
          <div className="bg-[#030303] border border-white/10 rounded-3xl overflow-hidden relative">
            
            {/* Matrix Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2 text-white">
                 <Cpu size={16} />
                 <h3 className="font-bold text-xs font-mono uppercase tracking-[0.2em]">Enter Marks</h3>
              </div>
              <button 
                onClick={() => setMarks({})} 
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:bg-[#E11D48] hover:text-white hover:border-[#E11D48] transition-all"
              >
                <RotateCcw size={10} /> Clear_All
              </button>
            </div>

            {/* Subject Rows */}
            <div className="divide-y divide-white/5">
              {filteredSubjects.map(s => {
                const currentIn = marks[s.id]?.inSem || 0;
                const currentEnd = marks[s.id]?.endSem || 0;
                const total = currentIn + currentEnd;
                const hasTheory = s.theoryCredits===0 || (marks[s.id]?.inSem !== undefined && marks[s.id]?.endSem !== undefined);
                const isPassing = hasTheory;

                return (
                    <div key={s.id} className="group p-4 sm:p-5 m-3 rounded-2xl border border-white/10 hover:bg-white/[0.02] transition-colors relative">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            
                            {/* Subject Info */}
                            <div className="w-full sm:w-1/3">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${!hasTheory ? 'bg-slate-500' : isPassing ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{s.code}</span>
                                </div>
                                <h4 className="text-sm font-bold text-white leading-tight">{s.name}</h4>
                            </div>

                            {/* Digital Inputs */}
                            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
                                {s.theoryCredits!==0&&<>{/* In Sem Input */}
                                <div className="flex flex-col items-center gap-2">
                                    <label className="text-xs font-mono text-slate-300 uppercase tracking-widest">CCE / 30</label>
                                    <div className="relative group/input">
                                        <input 
                                            type="number" aria-label={`CCE marks: ${s.name}`} min="0" max="30"
                                            value={marks[s.id]?.inSem ?? ''}
                                            onChange={(e) => updateMarks(s.id, 'inSem', e.target.value)}
                                            className="w-full max-w-20 bg-transparent text-2xl font-mono text-white text-center border-b border-white/10 focus:border-[#E11D48] outline-none py-1 transition-colors placeholder:text-white/10 tabular-nums"
                                            placeholder="00"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E11D48] scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300"></div>
                                    </div>
                                </div>

                                {/* Divider */}
                                

                                {/* End Sem Input */}
                                <div className="flex flex-col items-center gap-2">
                                    <label className="text-xs font-mono text-slate-300 uppercase tracking-widest">END-SEM / 70</label>
                                    <div className="relative group/input">
                                        <input 
                                            type="number" aria-label={`End-Sem marks: ${s.name}`} min="0" max="70"
                                            value={marks[s.id]?.endSem ?? ''}
                                            onChange={(e) => updateMarks(s.id, 'endSem', e.target.value)}
                                            className="w-full max-w-20 bg-transparent text-2xl font-mono text-white text-center border-b border-white/10 focus:border-[#E11D48] outline-none py-1 transition-colors placeholder:text-white/10 tabular-nums"
                                            placeholder="00"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E11D48] scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300"></div>
                                    </div>
                                </div>

                                {/* Divider */}
                                

                                </>}{/* Term Work Input */}
                                <div className="flex flex-col items-center gap-2">
                                    <label className="text-xs font-mono text-slate-300 uppercase tracking-widest">TERM WORK / 25</label>
                                    <div className="relative group/input">
                                        <input
                                            type="number" aria-label={`Term work marks: ${s.name}`} min="0" max="25"
                                            value={marks[s.id]?.termWork ?? ''}
                                            onChange={(e) => updateMarks(s.id, 'termWork', e.target.value)}
                                            className="w-full max-w-20 bg-transparent text-2xl font-mono text-white text-center border-b border-white/10 focus:border-[#E11D48] outline-none py-1 transition-colors"
                                            placeholder="00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* OUTPUT CORE (Result) */}
        <div className="lg:col-span-5 sticky top-8">
          <div className="rounded-[2.5rem] bg-[#050505] border border-white/10 p-8 lg:p-12 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            
            <div className="relative z-10 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-8">
                    <Activity size={12} className="text-[#E11D48]" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">{summary.isComplete ? (fullMode?'Full FE coverage estimate':'Selected-course estimate') : 'Partial estimate'}</span>
                </div>

                <div className="mb-10 relative">
                    {/* The Big Number */}
                    <h2 className="text-7xl sm:text-[9rem] leading-[0.8] font-display font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        {summary.value ?? "--"}
                    </h2>
                    <p className="text-sm font-mono text-slate-500 uppercase tracking-[0.4em] mt-2">{summary.isComplete ? (fullMode?'FE semester estimate':'Selected-course SGPA estimate') : 'Entered-head average'}</p>
                </div>

                <p className="text-sm text-slate-300 mb-6" aria-live="polite">{summary.completedSubjects} of {filteredSubjects.length} selected subjects complete. {summary.completeHeads}/{summary.totalHeads} graded heads; {summary.gradedCredits}/{summary.possibleCredits} credits entered. Incomplete theory needs both CCE and End-Sem.</p>
                {/* Status Bars */}
                <div className="space-y-6 w-full max-w-xs mx-auto">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Band</span>
                        <span className={`text-sm font-bold uppercase tracking-wider ${sgpa >= 7.5 ? 'text-[#E11D48]' : 'text-white'}`}>
                            {summary.value ? bandFor(sgpa) : "No complete heads"}
                        </span>
                    </div>

                    <div className="relative pt-2">
                        <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-2 uppercase tracking-widest">
                            <span>Grade-point scale</span>
                            <span>{Math.min(100, Math.round(sgpa * 10))}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[#E11D48] to-purple-600 transition-all duration-700 ease-out"
                                style={{ width: `${Math.min(100, sgpa * 10)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-[10px] leading-relaxed text-slate-500 max-w-xs mx-auto">
                    Grades follow the SPPU UG credit framework handbook: theory (CCE 30 + End-Sem 70) and term work are graded separately and weighted by credits. Full-semester mode includes the three additional vocational/general heads only when the selected theory basket matches. Otherwise only selected courses are counted. Only complete assessment heads are counted. Blank marks are not treated as zero. This is a selected-course estimate, not an official semester result.
                </p>

                {summary.isComplete && sgpa < 5 && (
                    <div className="mt-8 flex items-center justify-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Review your entered marks</span>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;

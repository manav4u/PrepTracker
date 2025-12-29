
import React, { useState, useEffect } from 'react';
import { SUBJECTS } from '../constants';
import { RotateCcw, Activity, TrendingUp, Cpu, AlertCircle } from 'lucide-react';

const CalculatorPage: React.FC<{ selectedIds: string[] }> = ({ selectedIds }) => {
  const [marks, setMarks] = useState<Record<string, { inSem: number, endSem: number }>>(() => {
    const saved = localStorage.getItem('sppu_calculator_marks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('sppu_calculator_marks', JSON.stringify(marks));
  }, [marks]);
  
  const filteredSubjects = SUBJECTS.filter(s => selectedIds.includes(s.id));

  const updateMarks = (sId: string, field: 'inSem' | 'endSem', val: string) => {
    const n = Math.min(field === 'inSem' ? 30 : 70, Math.max(0, parseInt(val) || 0));
    setMarks(prev => ({
      ...prev,
      [sId]: { ...(prev[sId] || { inSem: 0, endSem: 0 }), [field]: n }
    }));
  };

  const getSGPA = () => {
    let pts = 0; let creds = 0;
    filteredSubjects.forEach(s => {
      const m = marks[s.id] || { inSem: 0, endSem: 0 };
      const total = m.inSem + m.endSem;
      let gp = 0;
      if (total >= 90) gp = 10; else if (total >= 80) gp = 9; else if (total >= 70) gp = 8;
      else if (total >= 60) gp = 7; else if (total >= 50) gp = 6; else if (total >= 40) gp = 5;
      pts += gp * s.credits; creds += s.credits;
    });
    return (pts / (creds || 1)).toFixed(2);
  };

  const sgpa = parseFloat(getSGPA());
  const totalCredits = filteredSubjects.reduce((acc, s) => acc + s.credits, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#E11D48]">Simulation Active</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tighter text-white leading-none">
            Forecaster
            </h1>
        </div>
        <div className="hidden lg:block text-right opacity-50">
            <p className="text-[9px] font-mono text-white uppercase tracking-widest">Algorithm: SPPU_2019_REV</p>
            <p className="text-[9px] font-mono text-white uppercase tracking-widest">Version: 1.4.2</p>
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
                 <h3 className="font-bold text-xs font-mono uppercase tracking-[0.2em]">Input Parameters</h3>
              </div>
              <button 
                onClick={() => setMarks({})} 
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:bg-[#E11D48] hover:text-white hover:border-[#E11D48] transition-all"
              >
                <RotateCcw size={10} /> Reset_Values
              </button>
            </div>

            {/* Subject Rows */}
            <div className="divide-y divide-white/5">
              {filteredSubjects.map(s => {
                const currentIn = marks[s.id]?.inSem || 0;
                const currentEnd = marks[s.id]?.endSem || 0;
                const total = currentIn + currentEnd;
                const isPassing = total >= 40;

                return (
                    <div key={s.id} className="group p-5 hover:bg-white/[0.02] transition-colors relative">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            
                            {/* Subject Info */}
                            <div className="w-full sm:w-1/3">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isPassing ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{s.code}</span>
                                </div>
                                <h4 className="text-sm font-bold text-white leading-tight">{s.name}</h4>
                            </div>

                            {/* Digital Inputs */}
                            <div className="flex items-center gap-8 w-full sm:w-auto">
                                {/* In Sem Input */}
                                <div className="flex flex-col items-center gap-2">
                                    <label className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">IN-SEM / 30</label>
                                    <div className="relative group/input">
                                        <input 
                                            type="number" 
                                            value={marks[s.id]?.inSem || ''}
                                            onChange={(e) => updateMarks(s.id, 'inSem', e.target.value)}
                                            className="w-20 bg-transparent text-2xl font-mono text-white text-center border-b border-white/10 focus:border-[#E11D48] outline-none py-1 transition-colors placeholder:text-white/10 tabular-nums"
                                            placeholder="00"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E11D48] scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300"></div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-8 w-px bg-white/10 rotate-12"></div>

                                {/* End Sem Input */}
                                <div className="flex flex-col items-center gap-2">
                                    <label className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">END-SEM / 70</label>
                                    <div className="relative group/input">
                                        <input 
                                            type="number" 
                                            value={marks[s.id]?.endSem || ''}
                                            onChange={(e) => updateMarks(s.id, 'endSem', e.target.value)}
                                            className="w-20 bg-transparent text-2xl font-mono text-white text-center border-b border-white/10 focus:border-[#E11D48] outline-none py-1 transition-colors placeholder:text-white/10 tabular-nums"
                                            placeholder="00"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E11D48] scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300"></div>
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
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">Live Prediction</span>
                </div>

                <div className="mb-10 relative">
                    {/* The Big Number */}
                    <h2 className="text-[9rem] leading-[0.8] font-display font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        {getSGPA()}
                    </h2>
                    <p className="text-sm font-mono text-slate-500 uppercase tracking-[0.4em] mt-2">Projected SGPA</p>
                </div>

                {/* Status Bars */}
                <div className="space-y-6 w-full max-w-xs mx-auto">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Class</span>
                        <span className={`text-sm font-bold uppercase tracking-wider ${sgpa >= 7.75 ? 'text-[#E11D48]' : 'text-white'}`}>
                            {sgpa >= 7.75 ? 'Distinction' : sgpa >= 6.75 ? 'First Class' : 'Second Class'}
                        </span>
                    </div>

                    <div className="relative pt-2">
                        <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-2 uppercase tracking-widest">
                            <span>Performance Metric</span>
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

                {sgpa < 5 && (
                    <div className="mt-8 flex items-center justify-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Critical Performance Detected</span>
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

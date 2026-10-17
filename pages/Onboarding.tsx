
import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Cpu } from 'lucide-react';
import LogoMark from '../components/LogoMark';
import { Profile } from '../types';
import { SE_COMPUTER_SUBJECTS, SE_IT_SUBJECTS, SE_ENTC_SUBJECTS, SE_MECH_SUBJECTS, SE_CIVIL_SUBJECTS } from '../data/curriculum';
import { useData } from '../context/DataContext';

interface OnboardingProps {}

// --- MICRO COMPONENTS ---

const ChoiceRow = ({ index, label, titleA, codeA, titleB, codeB, selected, onSelect }: any) => (
  <div className="py-6 border-b border-white/5">
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-xs font-mono font-bold text-[#F63C49]">{index}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">{label}</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {([['A', codeA, titleA], ['B', codeB, titleB]] as const).map(([v, code, title]) => (
        <button
          key={v}
          onClick={() => onSelect(v)}
          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
            selected === v
              ? 'border-[#F63C49] bg-[#F63C49]/10 shadow-[0_0_24px_-8px_rgba(246,60,73,0.5)]'
              : 'border-white/10 hover:border-white/25 bg-white/[0.02]'
          }`}
        >
          <span className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${selected === v ? 'border-[#F63C49] bg-[#F63C49]' : 'border-white/25'}`}></span>
          <span className="min-w-0">
            <span className="block text-[9px] font-mono text-slate-500 mb-0.5">{code}</span>
            <span className={`block text-sm font-bold truncate ${selected === v ? 'text-white' : 'text-slate-300'}`}>{title}</span>
          </span>
        </button>
      ))}
    </div>
  </div>
);

const Onboarding: React.FC<OnboardingProps> = () => {
  const { setProfile } = useData();
  // Stages: 'boot' -> 'identity' -> 'matrix' -> 'processing'
  const [stage, setStage] = useState<'boot' | 'identity' | 'scope' | 'matrix' | 'processing'>('boot');
  const [year, setYear] = useState<'FE' | 'SE' | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [bootProgress, setBootProgress] = useState(0);
  const [name, setName] = useState('');
  
  // Processing Stage State
  const [processPercent, setProcessPercent] = useState(0);
  const [processLog, setProcessLog] = useState("INITIALIZING...");

  const [choices, setChoices] = useState({
    maths: 'm1',
    programming: 'fpl',
    science: 'phy', // 'phy' or 'chem'
    circuit: 'elect', // 'elect' or 'elec'
    core: 'mech' // 'mech' or 'graph'
  });

  // --- BOOT SEQUENCE LOGIC ---
  useEffect(() => {
    if (stage === 'boot') {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('identity'), 800);
            return 100;
          }
          return Math.min(100, prev + Math.floor(Math.random() * 15) + 5);
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleFinish = async () => {
    setStage('processing');
    
    // Simulate complex processing steps
    const steps = [
        { pct: 10, log: "Saving your profile..." },
        { pct: 30, log: "Setting up your subjects..." },
        { pct: 60, log: "Saving preferences..." },
        { pct: 85, log: "Building your dashboard..." },
        { pct: 100, log: "Ready." }
    ];

    let currentStep = 0;

    const interval = setInterval(async () => {
        if (currentStep >= steps.length) {
            clearInterval(interval);

            const selectedIds = year === 'SE'
                ? (branch === 'it' ? SE_IT_SUBJECTS : branch === 'entc' ? SE_ENTC_SUBJECTS : branch === 'mech' ? SE_MECH_SUBJECTS : branch === 'civil' ? SE_CIVIL_SUBJECTS : SE_COMPUTER_SUBJECTS).map(sub => sub.id)
                : [choices.maths, choices.programming, choices.science, choices.circuit, choices.core];
            const newProfile: Profile = {
                name: name || 'Student',
                theme: 'dark',
                selectedSubjects: selectedIds,
                setupComplete: true,
                streak: 0,
                lastStudyDate: new Date().toISOString(),
                ...(year ? { year } : {}),
                ...(year === 'SE' && branch ? { branch: branch as Profile['branch'] } : {})
            };

            setTimeout(() => {
                setProfile(newProfile);
            }, 800);
            return;
        }

        const step = steps[currentStep];
        setProcessPercent(step.pct);
        setProcessLog(step.log);
        currentStep++;

    }, 600);
  };

  // --- RENDERERS ---

  if (stage === 'boot') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
         <div className="w-64 space-y-4">
            <div className="flex justify-between items-end text-xs font-mono text-[#F63C49] mb-1">
                <span>Setup</span>
                <span>{bootProgress}%</span>
            </div>
            <div className="h-0.5 bg-white/10 w-full overflow-hidden">
                <div 
                    className="h-full bg-[#D61A40] shadow-[0_0_20px_#F63C49] transition-all duration-100 ease-out"
                    style={{ width: `${bootProgress}%` }}
                ></div>
            </div>
            <div className="h-8 overflow-hidden">
                <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
                    {bootProgress < 30 && "Saving your profile..."}
                    {bootProgress >= 30 && bootProgress < 60 && "Setting up your subjects..."}
                    {bootProgress >= 60 && bootProgress < 90 && "Building your dashboard..."}
                    {bootProgress >= 90 && "Ready."}
                </p>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-white selection:text-black">
      
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="p-8 flex justify-between items-center opacity-50">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 bg-white rounded-full ${stage === 'processing' ? 'animate-ping' : 'animate-pulse'}`}></div>
                <span className="font-mono text-[10px] uppercase tracking-widest">Setup</span>
            </div>
            <LogoMark size={20} />
        </header>

        {/* Content Container */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
            
            {stage === 'identity' && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <div className="mb-10">
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-xs font-mono font-bold text-[#F63C49]">01</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Registration</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tighter mb-3">What should we<br/>call you?</h1>
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Saved only on this device</p>
                    </div>

                    <div className="mb-8">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="YOUR NAME"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-xl lg:text-2xl font-display font-bold text-white focus:border-[#F63C49] focus:outline-none focus:bg-white/[0.05] transition-all placeholder:text-white/20 uppercase tracking-wide"
                            autoFocus
                        />
                        <p className="mt-3 text-[10px] text-slate-600 font-mono uppercase tracking-widest">Name or nickname - it personalizes your dashboard</p>
                    </div>

                    <button
                        onClick={() => name.length > 0 && setStage('scope')}
                        disabled={name.length === 0}
                        className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        Continue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {stage === 'scope' && (
                <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
                    <div className="mb-8">
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-xs font-mono font-bold text-[#F63C49]">02</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Your year</span>
                        </div>
                        <h2 className="text-4xl font-display font-bold mb-2 tracking-tighter">Which year are you in?</h2>
                        <p className="text-slate-500 text-sm">PrepTracker loads the official syllabus for your year and branch.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                        {([['FE', 'First Year', 'Common for all branches'], ['SE', 'Second Year', 'Branch-specific syllabus']] as const).map(([v, title, sub]) => (
                            <button
                                key={v}
                                onClick={() => { setYear(v); if (v === 'FE') setBranch(null); }}
                                className={`p-5 rounded-xl border text-left transition-all duration-300 ${
                                    year === v ? 'border-[#F63C49] bg-[#F63C49]/10 shadow-[0_0_24px_-8px_rgba(246,60,73,0.5)]' : 'border-white/10 hover:border-white/25 bg-white/[0.02]'
                                }`}
                            >
                                <span className={`block text-base font-bold mb-1 ${year === v ? 'text-white' : 'text-slate-300'}`}>{title}</span>
                                <span className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">{sub}</span>
                            </button>
                        ))}
                    </div>

                    {year === 'SE' && (
                        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-xs font-mono font-bold text-[#F63C49]">03</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Your branch</span>
                            </div>
                            <div className="border-t border-white/10">
                                {([
                                    ['computer', 'Computer Engineering', true],
                                    ['it', 'Information Technology', true],
                                    ['entc', 'Electronics and Telecom', true],
                                    ['mech', 'Mechanical Engineering', true],
                                    ['civil', 'Civil Engineering', true],
                                ] as const).map(([v, title, ready], i) => (
                                    <button
                                        key={v}
                                        disabled={!ready}
                                        onClick={() => setBranch(v)}
                                        className={`w-full flex items-center gap-4 py-4 border-b border-white/5 text-left transition-colors ${
                                            ready ? 'hover:bg-white/[0.02] cursor-pointer' : 'opacity-40 cursor-not-allowed'
                                        }`}
                                    >
                                        <span className="text-xs font-mono font-bold text-slate-600 w-7 shrink-0">B{i + 1}</span>
                                        <span className={`flex-1 text-sm font-bold ${branch === v ? 'text-[#F63C49]' : 'text-white'}`}>{title}</span>
                                        {ready
                                            ? <span className={`w-4 h-4 rounded-full border-2 shrink-0 ${branch === v ? 'border-[#F63C49] bg-[#F63C49]' : 'border-white/25'}`}></span>
                                            : <span className="text-[9px] font-mono uppercase tracking-widest text-slate-600 shrink-0">Syllabus being added</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {year === 'FE' && (
                        <button
                            onClick={() => setStage('matrix')}
                            className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-slate-200"
                        >
                            Choose subjects <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                    {year === 'SE' && (
                        <button
                            onClick={handleFinish}
                            disabled={!['computer','it','entc','mech','civil'].includes(branch || '')}
                            className="w-full py-5 bg-[#D61A40] text-white font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#B3123B] transition-all shadow-[0_0_40px_-10px_#F63C49] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            <Zap size={18} className="fill-white" />
                            Start PrepTracker
                        </button>
                    )}
                </div>
            )}

            {stage === 'matrix' && (
                <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
                     <div className="mb-8">
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-xs font-mono font-bold text-[#F63C49]">03</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Semester setup</span>
                        </div>
                        <h2 className="text-4xl font-display font-bold mb-2 tracking-tighter">Pick your five subjects</h2>
                        <p className="text-slate-500 text-sm">One from each row. You can change them later in Settings.</p>
                     </div>

                     <div className="border-t border-white/10 mb-10">
                        <ChoiceRow
                            index="A1" label="Mathematics"
                            titleA="Engineering Maths-I" codeA="BSC-101"
                            titleB="Engineering Maths-II" codeB="BSC-151"
                            selected={choices.maths === 'm1' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, maths: v === 'A' ? 'm1' : 'm2'})}
                        />
                        <ChoiceRow
                            index="A2" label="Programming"
                            titleA="FPL (C Programming)" codeA="ESC-105"
                            titleB="PPS (Python)" codeB="PCC-151"
                            selected={choices.programming === 'fpl' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, programming: v === 'A' ? 'fpl' : 'pps'})}
                        />
                        <ChoiceRow
                            index="A3" label="Applied Science"
                            titleA="Engineering Physics" codeA="BSC-102"
                            titleB="Engineering Chemistry" codeB="BSC-103"
                            selected={choices.science === 'phy' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, science: v === 'A' ? 'phy' : 'chem'})}
                        />
                        <ChoiceRow
                            index="A4" label="Circuit Theory"
                            titleA="Basic Electronics" codeA="ESC-101"
                            titleB="Basic Electrical" codeB="ESC-102"
                            selected={choices.circuit === 'elect' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, circuit: v === 'A' ? 'elect' : 'elec'})}
                        />
                        <ChoiceRow
                            index="A5" label="Core Engineering"
                            titleA="Engg. Graphics" codeA="ESC-103"
                            titleB="Engg. Mechanics" codeB="ESC-104"
                            selected={choices.core === 'graph' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, core: v === 'A' ? 'graph' : 'mech'})}
                        />
                     </div>

                     <button
                        onClick={handleFinish}
                        className="w-full py-5 bg-[#D61A40] text-white font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#B3123B] transition-all shadow-[0_0_40px_-10px_#F63C49] hover:shadow-[0_0_60px_-10px_#F63C49] flex items-center justify-center gap-3 group"
                     >
                        <Zap size={18} className="fill-white" />
                        Start PrepTracker
                     </button>
                </div>
            )}

            {stage === 'processing' && (
                <div className="w-full max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-700">
                    <div className="relative mb-12">
                         {/* Core Animation */}
                         <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
                             <div className="absolute inset-0 bg-[#F63C49]/20 rounded-full animate-ping"></div>
                             <div className="absolute inset-0 border border-[#F63C49] rounded-full animate-[spin_10s_linear_infinite]"></div>
                             <div className="absolute inset-4 border border-white/20 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
                             <div className="relative z-10 w-20 h-20 bg-[#0a0a0a] rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_30px_#F63C49]">
                                <Cpu size={32} className="text-white animate-pulse" />
                             </div>
                         </div>
                    </div>

                    <div className="text-center space-y-6">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-widest animate-pulse">
                                Saving your setup
                            </h2>
                            <p className="text-[10px] font-mono text-[#F63C49] uppercase tracking-[0.2em]">
                                {processLog}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-[#0a0a0a] rounded-full h-1.5 border border-white/10 overflow-hidden relative">
                             <div 
                                className="h-full bg-gradient-to-r from-[#F63C49] to-purple-600 transition-all duration-300 ease-out relative"
                                style={{ width: `${processPercent}%` }}
                             >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] animate-[shimmer_1s_infinite]"></div>
                             </div>
                        </div>


                    </div>
                </div>
            )}

        </main>
      </div>
    </div>
  );
};

export default Onboarding;


import React, { useState, useEffect } from 'react';
import { ArrowRight, Hexagon, Zap, Cpu, CircleDashed, CheckCircle2, ChevronRight, Terminal, ScanFace, ShieldCheck, Loader2, Lock, Database, HardDrive } from 'lucide-react';
import { Profile } from '../types';

interface OnboardingProps {
  onComplete: (profile: Profile) => void;
}

// --- MICRO COMPONENTS ---

const BinaryChoice = ({ titleA, codeA, titleB, codeB, selected, onSelect, label }: any) => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
        <div className="h-px bg-white/10 flex-1"></div>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="h-px bg-white/10 flex-1"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onSelect('A')}
        className={`group relative p-6 border rounded-2xl text-left transition-all duration-500 overflow-hidden ${
            selected === 'A' 
            ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
            : 'bg-black border-white/10 text-slate-500 hover:border-white/30 hover:text-white'
        }`}
      >
        <div className="relative z-10">
            <span className={`text-[9px] font-bold uppercase tracking-widest block mb-2 ${selected === 'A' ? 'text-black/50' : 'text-slate-600'}`}>{codeA}</span>
            <span className="text-lg font-bold font-display leading-none">{titleA}</span>
        </div>
        {selected === 'A' && <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-200 to-slate-400 opacity-100 z-0"></div>}
      </button>

      <button
        onClick={() => onSelect('B')}
        className={`group relative p-6 border rounded-2xl text-left transition-all duration-500 overflow-hidden ${
            selected === 'B' 
            ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
            : 'bg-black border-white/10 text-slate-500 hover:border-white/30 hover:text-white'
        }`}
      >
         <div className="relative z-10">
            <span className={`text-[9px] font-bold uppercase tracking-widest block mb-2 ${selected === 'B' ? 'text-black/50' : 'text-slate-600'}`}>{codeB}</span>
            <span className="text-lg font-bold font-display leading-none">{titleB}</span>
         </div>
         {selected === 'B' && <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-200 to-slate-400 opacity-100 z-0"></div>}
      </button>
    </div>
  </div>
);

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  // Stages: 'boot' -> 'identity' -> 'matrix' -> 'processing'
  const [stage, setStage] = useState<'boot' | 'identity' | 'matrix' | 'processing'>('boot');
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
    core: 'mech', // 'mech' or 'graph'
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
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleFinish = () => {
    setStage('processing');
    
    // Simulate complex processing steps
    const steps = [
        { pct: 10, log: "ENCRYPTING LOCAL IDENTITY..." },
        { pct: 30, log: "ALLOCATING SUBJECT VECTORS..." },
        { pct: 60, log: "SYNCING RESOURCE DATABASE..." },
        { pct: 85, log: "OPTIMIZING UI THREADS..." },
        { pct: 100, log: "SYSTEM READY." }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(interval);
            setTimeout(() => {
                const selectedIds = [choices.maths, choices.programming, choices.science, choices.circuit, choices.core];
                const newProfile: Profile = {
                    name: name || 'Operator',
                    theme: 'dark',
                    selectedSubjects: selectedIds,
                    setupComplete: true,
                    streak: 0,
                    lastStudyDate: new Date().toISOString()
                };
                localStorage.setItem('sppu_profile', JSON.stringify(newProfile));
                onComplete(newProfile);
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
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-none z-50">
         <div className="w-64 space-y-4">
            <div className="flex justify-between items-end text-xs font-mono text-[#E11D48] mb-1">
                <span>SYSTEM_INIT</span>
                <span>{bootProgress}%</span>
            </div>
            <div className="h-0.5 bg-white/10 w-full overflow-hidden">
                <div 
                    className="h-full bg-[#E11D48] shadow-[0_0_20px_#E11D48] transition-all duration-100 ease-out"
                    style={{ width: `${bootProgress}%` }}
                ></div>
            </div>
            <div className="h-8 overflow-hidden">
                <p className="font-mono text-[10px] text-slate-500 leading-relaxed opacity-70">
                    {bootProgress < 30 && "> MOUNTING VOLUMES..."}
                    {bootProgress >= 30 && bootProgress < 60 && "> ESTABLISHING NEURAL LINK..."}
                    {bootProgress >= 60 && bootProgress < 90 && "> LOADING PREPTRACKER CORE..."}
                    {bootProgress >= 90 && "> READY."}
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
                <span className="font-mono text-[10px] uppercase tracking-widest">Setup Wizard v3.0</span>
            </div>
            <Hexagon size={20} />
        </header>

        {/* Content Container */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
            
            {stage === 'identity' && (
                <div className="w-full animate-in fade-in zoom-in-95 duration-700 slide-in-from-bottom-8">
                    
                    {/* Visual Icon */}
                    <div className="text-center mb-10">
                        <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10 relative mb-8">
                           <ScanFace size={40} className="text-[#E11D48] relative z-10" strokeWidth={1.5} />
                           {/* Decorative Spinners */}
                           <div className="absolute inset-0 border-t border-[#E11D48] rounded-full animate-spin"></div>
                           <div className="absolute inset-2 border-b border-white/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Identity Verification</h1>
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Secure Access Protocol v9.0</p>
                    </div>

                    {/* Input Container */}
                    <div className="bg-[#050505] border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl">
                        {/* Top Accent */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-[#E11D48] blur-[8px]"></div>

                        <label className="flex items-center gap-2 text-[9px] font-mono text-[#E11D48] mb-6 uppercase tracking-[0.2em] font-bold">
                           <ShieldCheck size={12} /> Establish Operator Alias
                        </label>

                        <div className="relative mb-8">
                           <input
                               type="text"
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                               placeholder="ENTER DESIGNATION"
                               className="w-full bg-transparent border-b border-white/10 py-3 text-2xl lg:text-3xl font-display font-bold text-center text-white focus:border-[#E11D48] focus:outline-none transition-all placeholder:text-white/5 uppercase tracking-wide"
                               autoFocus
                           />
                           <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E11D48] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                        </div>

                        <div className="text-center space-y-2">
                             <p className="text-xs text-white font-medium">What should we call you?</p>
                             <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                                Enter your Real Name, Username, Gamertag, or Codename.<br/>
                                <span className="opacity-50">This designation is local to your device.</span>
                             </p>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="mt-8 flex justify-center">
                        <button 
                            onClick={() => name.length > 0 && setStage('matrix')}
                            disabled={name.length === 0}
                            className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-slate-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Confirm Identity <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {stage === 'matrix' && (
                <div className="w-full animate-in fade-in zoom-in-95 duration-500 slide-in-from-right-8">
                     <div className="mb-10 text-center lg:text-left">
                        <span className="inline-block px-3 py-1 rounded-full border border-[#E11D48]/30 bg-[#E11D48]/10 text-[#E11D48] text-[10px] font-bold uppercase tracking-widest mb-4">
                            System Configuration
                        </span>
                        <h2 className="text-4xl font-display font-bold mb-2">Select Your Loadout</h2>
                        <p className="text-slate-500 text-sm">Configure your semester subject matrix.</p>
                     </div>

                     <div className="space-y-8 mb-12">
                        {/* Mathematics Choice */}
                        <BinaryChoice
                            label="Mathematics Module"
                            titleA="Engineering Maths-I" codeA="BSC-101"
                            titleB="Engineering Maths-II" codeB="BSC-151"
                            selected={choices.maths === 'm1' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, maths: v === 'A' ? 'm1' : 'm2'})}
                        />

                        {/* Programming Choice */}
                        <BinaryChoice
                            label="Programming Module"
                            titleA="FPL (C Programming)" codeA="ESC-105"
                            titleB="PPS (Python)" codeB="PCC-151"
                            selected={choices.programming === 'fpl' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, programming: v === 'A' ? 'fpl' : 'pps'})}
                        />

                        {/* Science Choice */}
                        <BinaryChoice 
                            label="Applied Science Module"
                            titleA="Engineering Physics" codeA="BSC-102"
                            titleB="Engineering Chemistry" codeB="BSC-103"
                            selected={choices.science === 'phy' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, science: v === 'A' ? 'phy' : 'chem'})}
                        />

                        {/* Circuit Choice */}
                        <BinaryChoice 
                            label="Circuit Theory Module"
                            titleA="Basic Electronics" codeA="ESC-101"
                            titleB="Basic Electrical" codeB="ESE-102"
                            selected={choices.circuit === 'elect' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, circuit: v === 'A' ? 'elect' : 'elec'})}
                        />

                        {/* Core Choice */}
                        <BinaryChoice 
                            label="Core Engineering Module"
                            titleA="Engg. Graphics" codeA="ESC-103"
                            titleB="Engg. Mechanics" codeB="ESC-104"
                            selected={choices.core === 'graph' ? 'A' : 'B'}
                            onSelect={(v: string) => setChoices({...choices, core: v === 'A' ? 'graph' : 'mech'})}
                        />
                     </div>

                     <button
                        onClick={handleFinish}
                        className="w-full py-6 bg-[#E11D48] text-white font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#be123c] transition-all shadow-[0_0_40px_-10px_#E11D48] hover:shadow-[0_0_60px_-10px_#E11D48] flex items-center justify-center gap-3 group"
                     >
                        <Zap size={18} className="fill-white" />
                        Launch System
                     </button>
                </div>
            )}

            {stage === 'processing' && (
                <div className="w-full max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-700">
                    <div className="relative mb-12">
                         {/* Core Animation */}
                         <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
                             <div className="absolute inset-0 bg-[#E11D48]/20 rounded-full animate-ping"></div>
                             <div className="absolute inset-0 border border-[#E11D48] rounded-full animate-[spin_10s_linear_infinite]"></div>
                             <div className="absolute inset-4 border border-white/20 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
                             <div className="relative z-10 w-20 h-20 bg-[#0a0a0a] rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_30px_#E11D48]">
                                <Cpu size={32} className="text-white animate-pulse" />
                             </div>
                         </div>
                    </div>

                    <div className="text-center space-y-6">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-widest animate-pulse">
                                System Initialization
                            </h2>
                            <p className="text-[10px] font-mono text-[#E11D48] uppercase tracking-[0.2em]">
                                {processLog}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-[#0a0a0a] rounded-full h-1.5 border border-white/10 overflow-hidden relative">
                             <div 
                                className="h-full bg-gradient-to-r from-[#E11D48] to-purple-600 transition-all duration-300 ease-out relative"
                                style={{ width: `${processPercent}%` }}
                             >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] animate-[shimmer_1s_infinite]"></div>
                             </div>
                        </div>

                        {/* Terminal Log Output Simulation */}
                        <div className="bg-[#050505] border border-white/5 rounded-xl p-4 text-left h-24 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none"></div>
                            <div className="space-y-1.5 font-mono text-[9px] text-slate-500 opacity-70">
                                <p>&gt; MOUNT_VOLUMES: OK</p>
                                <p>&gt; CORE_SERVICES: STARTED</p>
                                <p>&gt; VERIFYING_INTEGRITY: PASSED</p>
                                {processPercent > 20 && <p>&gt; ENCRYPTION_KEYS: GENERATED</p>}
                                {processPercent > 50 && <p className="text-[#E11D48]"> &gt; SYNCING_MATRIX: {Math.round(processPercent)}%</p>}
                                {processPercent > 80 && <p>&gt; PRE_CACHING: DONE</p>}
                                <p className="animate-pulse">_</p>
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

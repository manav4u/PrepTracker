
import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Cpu, CheckCircle2, ScanFace, ShieldCheck, HardDrive } from 'lucide-react';
import LogoMark from '../components/LogoMark';
import { Profile } from '../types';
import { useData } from '../context/DataContext';
import PickerFlow from '../components/PickerFlow';

interface OnboardingProps {}

// --- MICRO COMPONENTS ---

const choiceCls = (on: boolean) =>
  `relative p-5 rounded-2xl border text-left transition-colors duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
    on ? 'border-[#F63C49] bg-[#F63C49]/10 text-white' : 'surface-2 border-white/10 text-slate-300 hover:border-white/25'
  }`;

const BinaryChoice = ({ titleA, codeA, titleB, codeB, selected, onSelect, label }: any) => (
  <div>
    <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">{label}</h3>
    <div className="grid grid-cols-2 gap-3">
      {[['A', titleA, codeA], ['B', titleB, codeB]].map(([k, t, c]) => (
        <button key={k} onClick={() => onSelect(k)} aria-pressed={selected === k} className={choiceCls(selected === k)}>
          <span className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-2">{c}</span>
          <span className="text-base font-medium leading-snug">{t}</span>
        </button>
      ))}
    </div>
  </div>
);

const Onboarding: React.FC<OnboardingProps> = () => {
  const { setProfile } = useData();
  // Stages: 'boot' -> 'identity' -> 'matrix' -> 'processing'
  const [stage, setStage] = useState<'boot' | 'identity' | 'matrix' | 'processing'>('boot');
  const [bootProgress, setBootProgress] = useState(0);
  const [name, setName] = useState('');
  const [year, setYear] = useState<'FE' | 'SE' | 'TE'>('FE');
  
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

  const handleFinish = async (ids?: string[]) => {
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

            const selectedIds = ids || [choices.maths, choices.programming, choices.science, choices.circuit, choices.core];
            const newProfile: Profile = {
                name: name || 'Student',
                theme: 'dark',
                selectedSubjects: selectedIds,
                setupComplete: true,
                streak: 0,
                lastStudyDate: new Date().toISOString()
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
        <main className={`flex-1 flex flex-col items-center p-6 mx-auto w-full ${stage === 'matrix' ? 'max-w-5xl' : 'max-w-lg justify-center'}`}>
            
            {stage === 'identity' && (
                <div className="w-full animate-in fade-in zoom-in-95 duration-700 slide-in-from-bottom-8">
                    
                    {/* Visual Icon */}
                    <div className="text-center mb-10">
                        <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10 relative mb-8">
                           <ScanFace size={40} className="text-[#F63C49] relative z-10" strokeWidth={1.5} />
                           {/* Decorative Spinners */}
                           <div className="absolute inset-0 border-t border-[#F63C49] rounded-full animate-spin"></div>
                           <div className="absolute inset-2 border-b border-white/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Your profile</h1>
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Saved only on this device</p>
                    </div>

                    {/* Input Container */}
                    <div className="surface-1 p-8 rounded-[2rem] relative overflow-hidden group">
                        {/* Top Accent */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-[#D61A40] blur-[8px]"></div>

                        <label className="flex items-center gap-2 text-[9px] font-mono text-[#F63C49] mb-6 uppercase tracking-[0.2em] font-bold">
                           <ShieldCheck size={12} /> Your name
                        </label>

                        <div className="relative mb-8">
                           <input
                               type="text"
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                               placeholder="YOUR NAME"
                               className="w-full bg-transparent border-b border-white/10 py-3 text-2xl lg:text-3xl font-display font-bold text-center text-white focus:border-[#F63C49] focus:outline-none transition-all placeholder:text-white/30 uppercase tracking-wide"
                               autoFocus
                           />
                           <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D61A40] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                        </div>

                        <div className="text-center space-y-2">
                             <p className="text-xs text-white font-medium">What should we call you?</p>
                             <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                                Enter your Name or Username to personalize your dashboard.<br/>
                                <span className="opacity-50">Data is stored securely on your local device.</span>
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
                            Continue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {stage === 'matrix' && (
                <PickerFlow name={name} onDone={(ids) => handleFinish(ids)} />
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

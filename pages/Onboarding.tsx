import type { AvatarShape } from '../lib/avatars';

import React, { useState, useEffect } from 'react';
import LogoMark from '../components/LogoMark';
import { Profile } from '../types';
import { useData } from '../context/DataContext';
import PickerFlow from '../components/PickerFlow';
import SetupScreen from '../components/SetupScreen';
import { buildSummary } from '../components/SetupScenes';

interface OnboardingProps {}

// --- MICRO COMPONENTS ---

const Onboarding: React.FC<OnboardingProps> = () => {
  const { profile, setProfile } = useData();
  // Stages: 'boot' -> 'identity' -> 'matrix' -> 'processing'
  const [stage, setStage] = useState<'boot' | 'matrix' | 'processing'>('boot');
  const [bootProgress, setBootProgress] = useState(0);
  // Re-pick (Settings > Change subjects) keeps the profile, so greet them by name again.
  const [name, setName] = useState(profile?.name ?? '');
  const [avatarId, setAvatarId] = useState(profile?.avatarId);
  const [avatarShape, setAvatarShape] = useState<AvatarShape>(profile?.avatarShape || 'circle');
  
  // Processing Stage State
  const [processPercent, setProcessPercent] = useState(0);
  const [processLog, setProcessLog] = useState("INITIALIZING...");
  const [summary, setSummary] = useState<ReturnType<typeof buildSummary> | undefined>();


  // --- BOOT SEQUENCE LOGIC ---
  useEffect(() => {
    if (stage === 'boot') {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('matrix'), 600);
            return 100;
          }
          return Math.min(100, prev + Math.floor(Math.random() * 15) + 5);
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleFinish = async (ids: string[]) => {
    setSummary(buildSummary(name, ids));
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

            const selectedIds = ids;
            const newProfile: Profile = {
                name: name || profile?.name || 'Student',
                avatarId,
                avatarShape,
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
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-6">
        <SetupScreen title="Getting ready" percent={bootProgress} log={bootProgress < 50 ? 'Loading your catalog' : 'Almost there'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-white selection:text-black">
      

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="p-8 flex justify-between items-center opacity-50">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span className="font-mono text-[10px] uppercase tracking-widest">Setup</span>
            </div>
            <LogoMark size={20} />
        </header>

        {/* Content Container */}
        <main className={`flex-1 flex flex-col items-center p-6 mx-auto w-full ${stage === 'matrix' ? 'max-w-5xl' : 'max-w-lg justify-center'}`}>
            
            {stage === 'matrix' && (
                <PickerFlow avatarShape={avatarShape} setAvatarShape={setAvatarShape} avatarId={avatarId} setAvatarId={setAvatarId} name={name} setName={setName} onDone={(ids) => handleFinish(ids)} />
            )}

            {stage === 'processing' && (
                <SetupScreen title="Setting up" percent={processPercent} log={processLog} checklist summary={summary} />
            )}

        </main>
      </div>
    </div>
  );
};

export default Onboarding;

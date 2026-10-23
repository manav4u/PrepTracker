import type { AvatarShape } from '../lib/avatars';

import React, { useState } from 'react';
import LogoMark from '../components/LogoMark';
import { Profile } from '../types';
import { useData } from '../context/DataContext';
import PickerFlow from '../components/PickerFlow';

/**
 * Setup is a single honest flow: the picker, then the profile is written and
 * the app opens. There is no simulated boot or processing progress - real
 * failures surface through the global storage-full alert and Settings.
 */
const Onboarding: React.FC = () => {
  const { profile, setProfile } = useData();
  // Re-pick (Settings > Change subjects) keeps the profile, so greet them by name again.
  const [name, setName] = useState(profile?.name ?? '');
  const [avatarId, setAvatarId] = useState(profile?.avatarId);
  const [avatarShape, setAvatarShape] = useState<AvatarShape>(profile?.avatarShape || 'circle');

  const handleFinish = (ids: string[]) => {
    const newProfile: Profile = {
      name: name || profile?.name || 'Student',
      avatarId,
      avatarShape,
      theme: 'dark',
      selectedSubjects: ids,
      setupComplete: true,
      streak: 0,
      lastStudyDate: new Date().toISOString()
    };
    setProfile(newProfile);
    // Best-effort: ask the browser not to evict this site's data under
    // storage pressure. Not a guarantee and never promised as one.
    try { navigator.storage?.persist?.(); } catch { /* unsupported or refused */ }
  };

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
        <main className="flex-1 flex flex-col items-center p-6 mx-auto w-full max-w-5xl">
            <PickerFlow avatarShape={avatarShape} setAvatarShape={setAvatarShape} avatarId={avatarId} setAvatarId={setAvatarId} name={name} setName={setName} onDone={(ids) => handleFinish(ids)} />
        </main>
      </div>
    </div>
  );
};

export default Onboarding;

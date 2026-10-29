import type { AvatarShape } from '../lib/avatars';

import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoMark from '../components/LogoMark';
import { finishSetup } from '../lib/onboarding';
import { useData } from '../context/DataContext';
import PickerFlow from '../components/PickerFlow';
import { SUBJECTS } from '../constants';
import { CATALOG_INDEX } from '../lib/catalogLoader';

type AddSeed = { year: 'FE' | 'SE' | 'TE'; branch: string | null; sem: number | null; picked: string[]; fe?: Record<string, string> };

// FE subjects finish through five fixed category picks, not the picked list:
// seed the category the clicked subject belongs to.
const FE_CATEGORY: Record<string, string> = { m1: 'maths', m2: 'maths', fpl: 'programming', pps: 'programming', phy: 'science', chem: 'science', elect: 'circuit', elec: 'circuit', mech: 'core', graph: 'core' };

// Library pages deep-link here with ?add=<course id>. Seed the picker so the
// clicked course lands preselected; an existing student's current subjects stay
// in the set, because finishing REPLACES selectedSubjects with the final pick.
const resolveAddSeed = (addId: string | null, existing: string[]): AddSeed | null => {
  if (!addId) return null;
  const dedup = (ids: string[]) => [...new Set(ids)];
  if (SUBJECTS.some(s => s.id === addId) && FE_CATEGORY[addId]) {
    // Rebuild the five category picks from the student's current selection so a
    // re-pick keeps their other choices, then override with the clicked subject.
    const fe: Record<string, string> = {};
    for (const [id, cat] of Object.entries(FE_CATEGORY)) if (existing.includes(id)) fe[cat] = id;
    fe[FE_CATEGORY[addId]] = addId;
    return { year: 'FE', branch: null, sem: null, picked: [], fe };
  }
  const c = CATALOG_INDEX.courses.find(c => c.id === addId && c.trackerReady);
  if (c) return { year: c.year, branch: c.branchSlug ?? null, sem: c.semester ?? null, picked: dedup([...existing, c.id]) };
  return null;
};

/**
 * Setup is a single honest flow: the picker, then the profile is written and
 * the app opens. There is no simulated boot or processing progress - real
 * failures surface through the global storage-full alert and Settings.
 */
const Onboarding: React.FC = () => {
  const { profile, setProfile } = useData();
  const addId = new URLSearchParams(useLocation().search).get('add');
  const addSeed = useMemo(() => resolveAddSeed(addId, profile?.selectedSubjects || []), [addId]);
  // Re-pick (Settings > Change subjects) keeps the profile, so greet them by name again.
  const [name, setName] = useState(profile?.name ?? '');
  const [avatarId, setAvatarId] = useState(profile?.avatarId);
  const [avatarShape, setAvatarShape] = useState<AvatarShape>(profile?.avatarShape || 'circle');

  const navigate = useNavigate();
  const handleFinish = (ids: string[]) => {
    const newProfile = finishSetup(profile, {
      name: name || profile?.name || 'Student',
      avatarId,
      avatarShape,
      selectedSubjects: ids,
    });
    setProfile(newProfile);
    // Best-effort: ask the browser not to evict this site's data under
    // storage pressure. Not a guarantee and never promised as one.
    try { navigator.storage?.persist?.(); } catch { /* unsupported or refused */ }
    // Explicit exit: with ?add= in the URL the route gate keeps /onboarding
    // reachable, so the post-setup redirect cannot rely on the guard alone.
    navigate('/app', { replace: true });
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
            <PickerFlow avatarShape={avatarShape} setAvatarShape={setAvatarShape} avatarId={avatarId} setAvatarId={setAvatarId} name={name} setName={setName} onDone={(ids) => handleFinish(ids)} initialYear={addSeed?.year ?? null} initialBranch={addSeed?.branch ?? null} initialSem={addSeed?.sem ?? null} initialPicked={addSeed?.picked ?? []} initialFe={addSeed?.fe} />
        </main>
      </div>
    </div>
  );
};

export default Onboarding;

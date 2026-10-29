import type { AvatarShape } from '../lib/avatars';

import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoMark from '../components/LogoMark';
import { finishSetup } from '../lib/onboarding';
import { useData } from '../context/DataContext';
import PickerFlow from '../components/PickerFlow';
import StepArt from '../components/StepArt';
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
type AddTarget = { id: string; name: string; code?: string };

const Onboarding: React.FC = () => {
  const { profile, setProfile } = useData();
  const addId = new URLSearchParams(useLocation().search).get('add');
  const existing = profile?.selectedSubjects || [];
  const addSeed = useMemo(() => resolveAddSeed(addId, existing), [addId]);
  // The course a library "Add to my plan" link points at, if it is real.
  const addTarget = useMemo<AddTarget | null | undefined>(() => {
    if (!addId) return null;
    const feSub = SUBJECTS.find(s => s.id === addId);
    if (feSub) return { id: feSub.id, name: feSub.name, code: feSub.code };
    const c = CATALOG_INDEX.courses.find(c => c.id === addId && c.trackerReady);
    if (c) return { id: c.id, name: c.name, code: c.code };
    return undefined; // unknown course id
  }, [addId]);
  // Re-pick (Settings > Change subjects) keeps the profile, so greet them by name again.
  const [name, setName] = useState(profile?.name ?? '');
  const [avatarId, setAvatarId] = useState(profile?.avatarId);
  const [avatarShape, setAvatarShape] = useState<AvatarShape>(profile?.avatarShape || 'circle');

  const navigate = useNavigate();
  const handleFinish = (ids: string[]) => {
    // Library deep links (?add=) are additive: an existing student keeps the
    // subjects they already track and the new course joins them. Plain setup
    // and Settings > Change subjects (no ?add=) keep replace semantics.
    const finalIds = addId ? [...new Set([...(profile?.selectedSubjects || []), ...ids])] : ids;
    const newProfile = finishSetup(profile, {
      name: name || profile?.name || 'Student',
      avatarId,
      avatarShape,
      selectedSubjects: finalIds,
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
            {addId && addTarget === undefined ? (
              /* The link named a course we do not have - say so plainly. */
              <div className="flex-1 flex items-center justify-center w-full">
                <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0b0b0d] p-8 lg:p-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_40px_-24px_rgba(0,0,0,0.9)]">
                  <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Add to your plan</p>
                    <h1 className="text-2xl font-semibold">We could not find that course</h1>
                    <p className="text-slate-400 text-sm">The link may be old. The library always has the current list.</p>
                    <div className="flex gap-3">
                      <button onClick={() => navigate('/syllabus/')} className="h-12 px-6 rounded-full bg-white text-black font-medium hover:bg-slate-200 transition-colors">Open the library</button>
                      <button onClick={() => navigate('/app', { replace: true })} className="h-12 px-6 rounded-full border border-white/15 text-slate-300 hover:border-white/40 hover:text-white transition-colors">Back to app</button>
                    </div>
                  </div>
                  <StepArt kind="courses" className="w-28 h-28 lg:w-44 lg:h-44 justify-self-center" />
                </div>
              </div>
            ) : addId && addTarget && existing.length > 0 ? (
              /* Existing student + library add: add exactly the course they
                 clicked, keep everything they track, and say so before it
                 happens. No picker detour, no extra auto-enrolments. */
              <div className="flex-1 flex items-center justify-center w-full">
                <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0b0b0d] p-8 lg:p-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_40px_-24px_rgba(0,0,0,0.9)]">
                  <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Add to your plan</p>
                    <div>
                      <h1 className="text-3xl font-semibold">{addTarget.name}</h1>
                      {addTarget.code && <p className="font-mono text-xs text-slate-500 mt-2">{addTarget.code}</p>}
                    </div>
                    {existing.includes(addTarget.id) ? (
                      <>
                        <p className="text-slate-400 text-sm">Already in your plan{existing.length > 1 ? `, along with your ${existing.length - 1} other tracked ${existing.length - 1 === 1 ? 'subject' : 'subjects'}` : ''}.</p>
                        <button onClick={() => navigate('/app', { replace: true })} className="h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-slate-200 transition-colors">Back to app</button>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-400 text-sm">You keep your {existing.length} tracked {existing.length === 1 ? 'subject' : 'subjects'}. Only this course is added.</p>
                        <div className="flex gap-3">
                          <button onClick={() => handleFinish([addTarget.id])} className="h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-slate-200 transition-colors">Add to my plan</button>
                          <button onClick={() => navigate('/app', { replace: true })} className="h-12 px-6 rounded-full border border-white/15 text-slate-300 hover:border-white/40 hover:text-white transition-colors">Not now</button>
                        </div>
                      </>
                    )}
                  </div>
                  <StepArt kind="courses" className="w-28 h-28 lg:w-44 lg:h-44 justify-self-center" />
                </div>
              </div>
            ) : (
            <PickerFlow avatarShape={avatarShape} setAvatarShape={setAvatarShape} avatarId={avatarId} setAvatarId={setAvatarId} name={name} setName={setName} onDone={(ids) => handleFinish(ids)} initialYear={addSeed?.year ?? null} initialBranch={addSeed?.branch ?? null} initialSem={addSeed?.sem ?? null} initialPicked={addSeed?.picked ?? []} initialFe={addSeed?.fe} />
            )}
        </main>
      </div>
    </div>
  );
};

export default Onboarding;

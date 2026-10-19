import { lazy, Suspense } from 'react';
import ProfileAvatar from './ProfileAvatar';
const AvatarPicker = lazy(() => import('./AvatarPicker'));
import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CATALOG_INDEX } from '../lib/catalogLoader';
import type { CatalogEntry } from '../lib/catalog';
import NameTiles from './NameTiles';
import StepArt, { ArtKind } from './StepArt';
import Ring from './CheckRing';
import RestoreBackup from './RestoreBackup';

type Year = 'FE' | 'SE' | 'TE';
type Step = 'name' | 'year' | 'branch' | 'semester' | 'courses';
const SEMESTERS: Record<'SE' | 'TE', number[]> = { SE: [3, 4], TE: [5, 6] };
const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

const FE_CHOICES = [
  { key: 'maths', label: 'Maths', a: ['m1', 'BSC-101', 'Engineering Maths-I'], b: ['m2', 'BSC-151', 'Engineering Maths-II'] },
  { key: 'programming', label: 'Programming', a: ['fpl', 'ESC-105', 'FPL (C Programming)'], b: ['pps', 'PCC-151', 'PPS (Python)'] },
  { key: 'science', label: 'Applied science', a: ['phy', 'BSC-102', 'Engineering Physics'], b: ['chem', 'BSC-103', 'Engineering Chemistry'] },
  { key: 'circuit', label: 'Circuit theory', a: ['elect', 'ESC-101', 'Basic Electronics'], b: ['elec', 'ESC-102', 'Basic Electrical'] },
  { key: 'core', label: 'Core engineering', a: ['mech', 'ESC-104', 'Engg. Mechanics'], b: ['graph', 'ESC-103', 'Engg. Graphics'] },
] as const;

const stat = (f: (c: CatalogEntry) => boolean) => {
  const l = CATALOG_INDEX.courses.filter(c => c.trackerReady && f(c));
  return `${l.length} courses - ${l.reduce((n, c) => n + c.units, 0)} units`;
};

const card = (on: boolean, off = false) =>
  `group/card relative w-full h-full min-h-[64px] text-left rounded-3xl border p-5 transition-[background-color,border-color,color,transform,box-shadow] ${EASE} ${
    off
      ? 'surface-2 border-white/5 text-slate-600 cursor-default'
      : on
        ? 'bg-white text-black border-white -translate-y-px shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.5),0_14px_28px_-12px_rgba(0,0,0,0.9)] active:translate-y-0 active:scale-[0.99] active:shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
        : 'bg-[#18181d] border-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_1px_2px_rgba(0,0,0,0.8),0_4px_8px_-2px_rgba(0,0,0,0.7),0_16px_28px_-12px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:border-white/30 hover:bg-[#1d1d23] active:translate-y-0 active:scale-[0.99] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]'
  }`;

const Heading = ({ children, art, kicker }: { children: React.ReactNode; art: ArtKind; kicker: string }) => (
  <div className="flex items-end justify-between gap-4 mb-6 lg:mb-8">
    <div className="min-w-0">
      <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>{kicker}
      </span>
      <h2 className="text-white leading-[0.95]">
        <span className="block font-display font-bold text-4xl lg:text-5xl tracking-tight">{children}<span className="text-[#F63C49]">.</span></span>
      </h2>
    </div>
    <StepArt kind={art} className="w-28 h-28 lg:w-36 lg:h-36 shrink-0 -mb-2" />
  </div>
);

/** One decision per screen: year, branch, semester, courses. Calls onDone with the chosen course ids. */
const PickerFlow: React.FC<{ onDone: (ids: string[]) => void; name: string; setName: (v: string) => void; avatarId?: string; setAvatarId: (v: string) => void }> = ({ onDone, name, setName, avatarId, setAvatarId }) => {
  const [step, setStep] = useState<Step>('name');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [year, setYear] = useState<Year | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [sem, setSem] = useState<number | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [fe, setFe] = useState<Record<string, string>>({ maths: 'm1', programming: 'fpl', science: 'phy', circuit: 'elect', core: 'mech' });

  const branches = useMemo(() => {
    const m = new Map<string, { slug: string; name: string; ready: boolean }>();
    for (const c of CATALOG_INDEX.courses) {
      if (c.year !== year) continue;
      const cur = m.get(c.branchSlug) || { slug: c.branchSlug, name: c.branch, ready: false };
      if (c.trackerReady) cur.ready = true;
      m.set(c.branchSlug, cur);
    }
    return [...m.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [year]);

  const courses = useMemo(
    () => CATALOG_INDEX.courses.filter(c => c.branchSlug === branch && c.semester === sem && c.trackerReady),
    [branch, sem]
  );
  const groups = useMemo(() => {
    const g = new Map<string, CatalogEntry[]>();
    for (const c of courses) if (c.electiveGroup) g.set(c.electiveGroup, [...(g.get(c.electiveGroup) || []), c]);
    return g;
  }, [courses]);
  const fixed = courses.filter(c => !c.electiveGroup);

  const flow: Step[] = year === 'FE' ? ['name', 'year', 'courses'] : ['name', 'year', 'branch', 'semester', 'courses'];
  const idx = flow.indexOf(step);
  const last = idx === flow.length - 1;
  const canGo =
    step === 'name' ? name.trim().length > 0 : step === 'year' ? !!year : step === 'branch' ? !!branch : step === 'semester' ? !!sem : year === 'FE' ? true : picked.length > 0;

  const toggle = (c: CatalogEntry) => setPicked(p => {
    if (p.includes(c.id)) return p.filter(x => x !== c.id);
    const rest = c.electiveGroup ? p.filter(id => CATALOG_INDEX.courses.find(x => x.id === id)?.electiveGroup !== c.electiveGroup) : p;
    return [...rest, c.id];
  });

  const next = () => {
    if (!canGo) return;
    if (last) return onDone(year === 'FE' ? FE_CHOICES.map(f => fe[f.key]) : picked);
    if (step === 'semester') {
      // core courses start selected; minors and electives are the student's choice
      setPicked(CATALOG_INDEX.courses.filter(c => c.branchSlug === branch && c.semester === sem && c.trackerReady && !c.electiveGroup && c.type !== 'Minor').map(c => c.id));
    }
    setDir('fwd');
    setStep(flow[idx + 1]);
  };
  const back = () => { if (idx > 0) { setDir('back'); setStep(flow[idx - 1]); } };

  const title = { name: 'What is your name', year: 'Which year', branch: 'Which branch', semester: 'Which semester', courses: year === 'FE' ? 'Your subjects' : 'Pick your courses' }[step];

  const chosen = year === 'FE' ? [] : CATALOG_INDEX.courses.filter(c => picked.includes(c.id));
  const branchName = branches.find(b => b.slug === branch)?.name;

  return (
    <div className="w-full lg:grid lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-16">
    {avatarOpen && <Suspense fallback={<p role="status">Loading avatar picker...</p>}><AvatarPicker current={avatarId} name={name} onClose={() => setAvatarOpen(false)} onSave={id => { setAvatarId(id); setAvatarOpen(false); }} /></Suspense>}
    <div className={`flex flex-col w-full min-h-[calc(100dvh-6rem)] pb-6 ${step === 'name' ? 'lg:justify-center' : ''}`}>
      <div className="flex gap-1.5 mb-8" role="progressbar" aria-valuemin={1} aria-valuemax={flow.length} aria-valuenow={idx + 1} aria-label="Setup step">
        {flow.map((s, i) => <span key={s} className={`h-1 flex-1 rounded-full transition-colors ${EASE} ${i <= idx ? 'bg-[#F63C49]' : 'bg-white/10'}`} />)}
      </div>

      <div key={step} className={`${step === 'name' ? 'flex-1 lg:flex-none' : 'flex-1'} flex flex-col ${dir === 'fwd' ? 'pt-step-fwd' : 'pt-step-back'}`}>
      {step === 'name' ? (
        <div className="mb-6 lg:mb-8">
          <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>{`Step ${idx + 1} of ${flow.length}`}
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-tight leading-[0.95] text-white">What is your name<span className="text-[#F63C49]">.</span></h2>
        </div>
      ) : (
        <Heading art={step as ArtKind} kicker={`Step ${idx + 1} of ${flow.length}`}>{title}</Heading>
      )}

      <div className={`${step === 'name' ? 'flex-1 lg:flex-none lg:mt-6' : 'flex-1'} flex flex-col`}>
        {step === 'name' && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="lg:hidden flex-1 flex items-center justify-center mt-3"><NameTiles name={name} className="w-full max-w-sm" /></div>
            <div className="mt-auto">
              <label htmlFor="setup-name" className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2.5 block px-1">What should we call you</label>
              <div className="rounded-3xl border border-white/[0.14] bg-[#0d0d10] px-5 py-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.06)] transition-colors duration-[250ms] focus-within:border-[#F63C49]">
                <input
                  id="setup-name"
                  type="text"
                  value={name}
                  maxLength={40}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
                  placeholder="Type your name"
                  autoComplete="given-name"
                  className="w-full bg-transparent outline-none font-display font-bold text-3xl tracking-tight text-white placeholder:text-slate-700"
                />
              </div>
              <p className="mt-3 px-1 text-sm text-slate-500">Used for your greeting. Stays on this device.</p>
              <button type="button" onClick={() => setAvatarOpen(true)} className="flex items-center gap-3 mt-4 text-sm text-slate-300 min-h-[44px]"><ProfileAvatar id={avatarId} size={40} /><span className="underline underline-offset-4">Choose avatar</span><span className="text-xs text-slate-500">Optional</span></button>
            </div>
          </div>
        )}

        {step === 'year' && (
          <div className="flex-1 grid grid-rows-3 auto-rows-fr gap-3">
            {([['FE', 'First year', 'Common first year - 5 subjects'], ['SE', 'Second year', `Semester 3 and 4`], ['TE', 'Third year', `Semester 5 and 6`]] as const).map(([y, l, sub], i) => (
              <button key={y} aria-pressed={year === y} onClick={() => { setYear(y); setBranch(null); setSem(null); }} className={`${card(year === y)} flex flex-col justify-end overflow-hidden`}>
                <Ring on={year === y} className="absolute left-5 top-5" />
                <StepArt kind="year" level={(i + 1) as 1 | 2 | 3} className="absolute right-5 top-4 w-24 h-24 lg:w-28 lg:h-28" />
                <span className="font-display font-bold text-3xl lg:text-4xl leading-none tracking-tight">{l}</span>
                <span className={`mt-2 text-[10px] font-bold uppercase tracking-[0.18em] ${year === y ? 'text-black/50' : 'text-slate-500'}`}>{sub}</span>
              </button>
            ))}
          </div>
        )}

        {step === 'branch' && (
          <>
            <div className="flex-1 grid auto-rows-fr gap-2.5">
              {branches.map(b => (
                <button key={b.slug} disabled={!b.ready} aria-pressed={branch === b.slug} onClick={() => setBranch(b.slug)} className={`${card(branch === b.slug, !b.ready)} flex items-center justify-between gap-3 !p-4`}>
                  <span className="text-base font-medium leading-snug">{b.name}</span>
                  {b.ready
                    ? <span className="text-[10px] font-bold uppercase tracking-[0.14em] shrink-0 opacity-50">{stat(c => c.branchSlug === b.slug)}</span>
                    : <span className="text-[9px] font-bold uppercase tracking-[0.18em] shrink-0">Reference only</span>}
                  {b.ready && <Ring on={branch === b.slug} />}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">More branches are coming.</p>
          </>
        )}

        {step === 'semester' && year !== 'FE' && year && (
          <div className="flex-1 grid grid-rows-2 gap-3">
            {SEMESTERS[year].map(s => (
              <button key={s} aria-pressed={sem === s} onClick={() => setSem(s)} className={`${card(sem === s)} flex flex-col justify-end`}>
                <Ring on={sem === s} className="absolute left-5 top-5" />
                <span className="font-display font-bold text-3xl lg:text-4xl leading-none tracking-tight">Semester {s}</span>
                <span className={`mt-2 text-[10px] font-bold uppercase tracking-[0.18em] ${sem === s ? 'text-black/50' : 'text-slate-500'}`}>{stat(c => c.branchSlug === branch && c.semester === s)}</span>
              </button>
            ))}
          </div>
        )}

        {step === 'courses' && year === 'FE' && (
          <div className="space-y-6">
            {FE_CHOICES.map(f => (
              <div key={f.key}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">{f.label}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[f.a, f.b].map(([id, code, name]) => (
                    <button key={id} aria-pressed={fe[f.key] === id} onClick={() => setFe({ ...fe, [f.key]: id })} className={card(fe[f.key] === id)}>
                      <Ring on={fe[f.key] === id} className="absolute right-3 top-3" />
                      <span className={`block text-[9px] font-mono uppercase tracking-widest mb-2 ${fe[f.key] === id ? 'text-black/50' : 'text-slate-500'}`}>{code}</span>
                      <span className="text-base font-medium leading-snug">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 'courses' && year !== 'FE' && (
          <div className="space-y-6">
            <div className="space-y-2.5">
              {fixed.map(c => (
                <button key={c.id} aria-pressed={picked.includes(c.id)} onClick={() => toggle(c)} className={card(picked.includes(c.id))}>
                  <Ring on={picked.includes(c.id)} className="absolute right-4 top-1/2 -translate-y-1/2" />
                  <span className={`block text-[9px] font-mono uppercase tracking-widest mb-1.5 ${picked.includes(c.id) ? 'text-black/50' : 'text-slate-500'}`}>{c.code}{c.type === 'Minor' ? ' - optional' : ''}</span>
                  <span className="text-base font-medium leading-snug">{c.name}</span>
                </button>
              ))}
            </div>
            {[...groups.entries()].map(([g, list]) => (
              <div key={g}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">{g} - pick one</h3>
                <div className="space-y-2.5">
                  {list.map(c => (
                    <button key={c.id} aria-pressed={picked.includes(c.id)} onClick={() => toggle(c)} className={card(picked.includes(c.id))}>
                  <Ring on={picked.includes(c.id)} className="absolute right-4 top-1/2 -translate-y-1/2" />
                      <span className={`block text-[9px] font-mono uppercase tracking-widest mb-1.5 ${picked.includes(c.id) ? 'text-black/50' : 'text-slate-500'}`}>{c.code}</span>
                      <span className="text-base font-medium leading-snug">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      </div>

      <div className="mt-8 flex items-center gap-3">
        {idx > 0 && (
          <button onClick={back} aria-label="Back" className={`group h-16 w-16 shrink-0 rounded-full border border-white/15 bg-[#0d0d10] text-slate-300 flex items-center justify-center transition-[border-color,color,transform,box-shadow] ${EASE} shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_1px_2px_rgba(0,0,0,0.6),0_8px_18px_-8px_rgba(0,0,0,0.9)] hover:border-white/40 hover:text-white hover:-translate-y-px active:translate-y-px active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)]`}>
            <ArrowLeft size={18} aria-hidden="true" className={`transition-transform ${EASE} group-hover:-translate-x-0.5`} />
          </button>
        )}
        <button
          onClick={next}
          disabled={!canGo}
          className={`group flex-1 h-16 rounded-full pl-7 pr-2 flex items-center justify-between text-sm font-bold uppercase tracking-[0.14em] transition-[background-color,color,transform,box-shadow] ${EASE} ${canGo
            ? 'bg-[#F63C49] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_0_#a8212d,0_14px_24px_-10px_rgba(0,0,0,0.9)] hover:bg-[#ff4d59] hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_0_#a8212d,0_18px_28px_-10px_rgba(0,0,0,0.9)] active:translate-y-[3px] active:bg-[#e8343f] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_0_#a8212d,0_4px_8px_-4px_rgba(0,0,0,0.9)]'
            : 'bg-white/[0.06] text-slate-600 cursor-default shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'}`}
        >
          <span>{last ? 'Start' : 'Continue'}</span>
          <span aria-hidden="true" className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${EASE} ${canGo ? 'bg-white text-black shadow-[0_2px_4px_rgba(0,0,0,0.35)]' : 'bg-white/[0.06] text-slate-600'}`}>
            <ArrowRight size={18} strokeWidth={2.5} className={`transition-transform ${EASE} ${canGo ? 'group-hover:translate-x-[3px]' : ''}`} />
          </span>
        </button>
      </div>

      {step === 'name' && <RestoreBackup />}
    </div>

    <aside aria-hidden="true" className="hidden lg:block">
      <div className="h-full min-h-[34rem] rounded-3xl border border-white/10 bg-[#0b0b0d] p-8 flex flex-col">
        <span className="inline-flex self-start items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>Welcome
        </span>
        {step !== 'name' && (<>
        <p className="mt-6 font-display font-bold text-4xl tracking-tight text-white leading-none">Hi, {name || 'there'}<span className="text-[#F63C49]">.</span></p>
        <p className="mt-3 text-sm text-slate-500 max-w-xs">A few taps and your syllabus is ready to track.</p>
        </>)}
        <div className="flex-1 flex items-center justify-center py-8">
          {step === 'name' ? <NameTiles name={name} className="w-full max-w-md" /> : <StepArt kind={step as ArtKind} className="w-64 h-64" />}
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6">
          {[
            ['Year', year ? (year === 'FE' ? 'First year' : year === 'SE' ? 'Second year' : 'Third year') : null],
            ['Branch', year === 'FE' ? 'Common' : branchName],
            ['Semester', year === 'FE' ? null : sem ? `Semester ${sem}` : null],
            ['Courses', year === 'FE' ? '5 subjects' : chosen.length ? `${chosen.length} picked` : null],
          ].map(([k, v]) => (
            <div key={k as string}>
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{k}</dt>
              <dd className={`mt-1 text-sm font-medium ${v ? 'text-white' : 'text-slate-700'}`}>{v || '-'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
    </div>
  );
};

export default PickerFlow;

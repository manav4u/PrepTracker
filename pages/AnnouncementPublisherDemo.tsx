import React from 'react';
import { ArrowLeft, ArrowRight, Check, Bell, RotateCcw, AlertTriangle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnnouncementCard } from '../components/AnnouncementsBell';
import { ANNOUNCEMENT_TAGS, validateAnnouncementFeed, type Announcement } from '../lib/announcementValidation.ts';

const SAMPLE: Announcement = { id: 'sample-publisher', date: '2026-10-24', tag: 'Update', title: 'Sample: a note from Manav', body: 'This is a design placeholder. Write a sample message here to try the publishing flow. Nothing in this demo reaches students.' };
type Phase = 'write' | 'preview' | 'checked' | 'done' | 'failed';
const stepNames = ['Write', 'Preview', 'Checks', 'Demo result'];
export default function AnnouncementPublisherDemo() {
 const [entered, setEntered] = React.useState(false);
 const [draft, setDraft] = React.useState<Announcement>({...SAMPLE});
 const [phase, setPhase] = React.useState<Phase>('write');
 const [errors, setErrors] = React.useState<string[]>([]);
 const [failChecks, setFailChecks] = React.useState(false);
 const [failDeploy, setFailDeploy] = React.useState(false);
 const feed = {version:1, items:[draft]};
 const update = (key: keyof Announcement, value: string) => {setDraft(d=>({...d,[key]:value}));setErrors([]);};
 const review = () => { const e=validateAnnouncementFeed(feed);setErrors(e);if(!e.length)setPhase('preview'); };
 const reset = () => { setPhase('write');setDraft({...SAMPLE});setErrors([]);setFailChecks(false);setFailDeploy(false); };
 const headingRef = React.useRef<HTMLHeadingElement>(null);
 React.useEffect(()=>{if(phase!=='write')headingRef.current?.focus();},[phase]);
 const step = phase==='write'?0:phase==='preview'?1:phase==='checked'||phase==='failed'?2:3;
 const primary='min-h-12 px-6 rounded-full bg-[#D61A40] hover:bg-[#F63C49] text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
 const secondary='min-h-12 px-5 rounded-full border border-white/15 hover:bg-white/5 text-sm text-slate-200 transition-colors';
 const input='w-full mt-2 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F63C49]';
 return <div className="min-h-screen bg-[#030303] text-white px-5 py-7 lg:px-10 lg:py-10">
  <div className="max-w-6xl mx-auto">
   <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-white/10">
    <Link to="/app" className="text-xs text-slate-400 inline-flex items-center gap-2 min-h-11"><ArrowLeft size={14}/> PrepTracker</Link>
    <span className="text-[10px] uppercase tracking-[0.2em] text-[#F63C49] border border-[#F63C49]/30 px-3 py-2 rounded-full">Interactive demo only</span>
   </div>
   <header className="py-8 lg:py-10 max-w-2xl">
    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">Owner publishing / Sample preview</p>
    <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mt-3">A note, from you.</h1>
    <p className="text-sm text-slate-400 leading-relaxed mt-4">Write it. See it as students would. Keep the checks before anything goes out.</p>
   </header>
   <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-relaxed text-slate-400 mb-7 flex gap-3"><AlertTriangle size={17} className="shrink-0 text-[#F63C49] mt-0.5"/><p>No real sign-in, repository changes or publishing. Anyone with this preview link can try the demo. The real publisher requires server-side owner authentication and a separately approved GitHub App setup.</p></div>
   {!entered ? <section className="surface-1 rounded-3xl p-7 lg:p-10 max-w-xl">
    <FileText size={27} className="text-[#F63C49]"/><h2 className="text-xl font-bold mt-5">Try the owner workflow</h2>
    <p className="text-sm leading-relaxed text-slate-400 mt-3">In the real version, GitHub sign-in comes first. For this sample, skip authentication and explore with placeholder content.</p>
    <button className={primary+' mt-7 inline-flex gap-3 items-center'} onClick={()=>setEntered(true)}>Enter sample editor <ArrowRight size={16}/></button>
    <p className="text-xs text-slate-500 mt-4">Text stays in this tab and is lost on reload.</p>
   </section> : <>
    <ol aria-label="Publishing progress" className="grid grid-cols-4 gap-2 mb-7">{stepNames.map((s,i)=><li key={s} aria-current={step===i?'step':undefined} className={'border-t-2 pt-3 text-[10px] lg:text-xs '+(step===i?'border-[#F63C49] text-white':'border-white/10 text-slate-500')}><span className="font-mono mr-1">0{i+1}</span> {s}</li>)}</ol>
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
     <section className="surface-1 rounded-3xl p-6 lg:p-8">
      {phase==='write' ? <form onSubmit={e=>{e.preventDefault();review();}} noValidate>
       <h2 className="text-xl font-bold">Write a sample notice</h2><p className="text-xs text-slate-500 mt-2 mb-6">No JSON. No GitHub editing.</p>
       <fieldset><legend className="text-xs text-slate-400 mb-2">Category</legend><div className="flex gap-2 flex-wrap">{ANNOUNCEMENT_TAGS.map(t=><button type="button" aria-pressed={draft.tag===t} key={t} onClick={()=>update('tag',t)} className={'min-h-11 px-4 rounded-full border text-xs '+(draft.tag===t?'border-[#F63C49] text-[#F63C49] bg-[#F63C49]/10':'border-white/15 text-slate-400')}>{t}</button>)}</div></fieldset>
       <label className="block text-xs text-slate-400 mt-5">Title<input className={input} value={draft.title} maxLength={120} onChange={e=>update('title',e.target.value)} /></label>
       <label className="block text-xs text-slate-400 mt-5">Message<textarea className={input+' min-h-36 resize-y'} value={draft.body} maxLength={2000} onChange={e=>update('body',e.target.value)}/></label>
       <div className="flex justify-end text-[10px] text-slate-500 mt-1">{draft.body.length}/2000</div>
       <label className="block text-xs text-slate-400 mt-4">Date<input type="date" style={{colorScheme:'dark'}} className={input} value={draft.date} onChange={e=>update('date',e.target.value)}/></label>
       <label className="block text-xs text-slate-400 mt-5">HTTPS link <span className="text-slate-600">(optional)</span><input type="url" className={input} placeholder="https://" value={draft.link||''} onChange={e=>{const v=e.target.value;setDraft(d=>{const n={...d};if(v)n.link=v;else delete n.link;return n;});setErrors([]);}}/></label>
       {errors.length>0&&<div role="alert" className="text-xs text-red-300 leading-relaxed mt-5">{errors.map(e=><p key={e}>{e}</p>)}</div>}
       <button type="submit" className={primary+' mt-7 w-full'}>Preview sample</button>
      </form> : <div key={phase} className="animate-in fade-in duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
       <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none">{phase==='preview'?'Ready for a closer look?':phase==='failed'?'Sample check failed':phase==='checked'?'Sample checks passed':failDeploy?'Simulated deployment failed':'Demo complete. Nothing is live.'}</h2>
       <p role="status" className="text-sm text-slate-400 leading-relaxed mt-4">{phase==='preview'?'The original announcement card is shown beside this form (above on phone). Review the words and link before sending for checks.':phase==='failed'?'This is a deliberately simulated failure. Publish stays blocked. Edit the draft or turn the test failure off and retry.':phase==='checked'?'The demo feed passes local validation. CI and repository access are simulated, not actually connected.':failDeploy?'In the real publisher, a failed deployment must show Not live. A merge alone is not a successful publication.':'This sample completed the flow in memory only. No PR was created, no notices were published, and no students were contacted.'}</p>
       {phase==='preview'&&<div className="mt-6 rounded-2xl bg-black/30 border border-white/10 p-4 text-xs leading-relaxed text-slate-400"><strong className="text-slate-200">Real-workflow privacy note:</strong> PrepTracker’s repository is public. Sending for checks would make the text public in a PR before final publication.</div>}
       {(phase==='preview'||phase==='failed')&&<label className="flex items-center gap-3 text-xs text-slate-400 mt-6 min-h-11"><input type="checkbox" checked={failChecks} onChange={e=>setFailChecks(e.target.checked)}/> Test a failed check</label>}
       {phase==='checked'&&<><ul className="space-y-3 mt-6 text-sm text-slate-300">{['Feed validation passed locally','CI checks: simulated','Commit review: simulated'].map(t=><li key={t} className="flex gap-2 items-center"><Check size={15} className="text-[#F63C49]"/>{t}</li>)}</ul><label className="flex items-center gap-3 text-xs text-slate-400 mt-6 min-h-11"><input type="checkbox" checked={failDeploy} onChange={e=>setFailDeploy(e.target.checked)}/> Test a deployment failure</label></>}
       <div className="flex flex-col gap-3 mt-6">
        {(phase==='preview'||phase==='failed')&&<button className={primary} onClick={()=>setPhase(failChecks?'failed':'checked')}>Run sample checks</button>}
        {phase==='checked'&&<button className={primary} onClick={()=>setPhase('done')}>Simulate publish (not live)</button>}
        {phase!=='done'&&<button className={secondary} onClick={()=>setPhase('write')}>Back to edit</button>}
        {phase==='done'&&<button className={primary} onClick={reset}>Start another sample</button>}
       </div>
      </div>}
     </section>
     <aside className={'lg:sticky lg:top-8 space-y-4 '+(phase!=='write'?'order-first lg:order-last':'')}>
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 lg:p-8">
       <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-[0.18em] mb-5"><Bell size={15}/> Student card preview</div>
       <AnnouncementCard item={draft} fresh={true}/>
       <p className="text-[10px] leading-relaxed text-slate-500 mt-4">Same card as the chosen panel. Sample only; your text is never fetched by the student app.</p>
      </div>
      <p className="text-xs leading-relaxed text-slate-500 px-2">Future live flow: owner sign-in → announcement PR → real checks → your confirmation → deployment verified.</p>
      <button className={secondary+' w-full inline-flex justify-center gap-2 items-center'} onClick={reset}><RotateCcw size={13}/> Reset demo</button>
     </aside>
    </div>
   </>}
   <footer className="mt-10 pt-5 border-t border-white/10 text-[10px] text-slate-600 uppercase tracking-[0.15em]">Preview only / No publishing connection</footer>
  </div>
 </div>;
}

import React from 'react';
import {Link} from 'react-router-dom';
import {CATALOG} from '../lib/catalog';
import {UnitStatus} from '../types';
import {useData} from '../context/DataContext';

export default function Dashboard(){
 const {profile,userProgress,tasks}=useData();
 if(!profile)return null;
 const courses=CATALOG.filter(c=>profile.selectedSubjects?.includes(c.id));
 const status=(id:string)=>userProgress.find(p=>p.unitId===id)?.status||UnitStatus.NOT_STARTED;
 const all=courses.flatMap(c=>c.units.map(u=>({course:c,unit:u,status:status(u.id)})));
 const done=all.filter(u=>u.status===UnitStatus.MASTERED).length;
 const next=all.find(u=>u.status===UnitStatus.IN_PROGRESS||u.status===UnitStatus.REVISION)||all.find(u=>u.status!==UnitStatus.MASTERED);
 const pending=tasks.filter(t=>!t.completed).sort((a,b)=>(a.dueDate||'9999').localeCompare(b.dueDate||'9999')).slice(0,3);
 const link=(course:string,unit?:string)=>`/subject/${encodeURIComponent(course)}${unit?`?unit=${encodeURIComponent(unit)}`:''}`;
 return <div className="space-y-8 max-w-6xl mx-auto">
 <header className="flex flex-wrap gap-4 items-end justify-between"><div><p className="text-sm text-rose-400">Your study plan · saved in this browser</p><h1 className="text-3xl sm:text-4xl font-bold mt-2">What will you study next?</h1></div><Link to="/directory" className="px-4 py-3 rounded-xl border border-white/20 text-sm">Add a course</Link></header>
 <section className="grid lg:grid-cols-3 gap-4">
 <div className="lg:col-span-2 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 to-zinc-950 p-5 sm:p-6">{next?<><p className="text-sm text-rose-300">{next.status===UnitStatus.NOT_STARTED?'Start a unit':'Continue studying'}</p><h2 className="text-2xl font-bold mt-2">{next.unit.title}</h2><p className="text-sm text-slate-300 mt-2">{next.course.name} · Unit {next.unit.unit_number}</p><Link to={link(next.course.id,next.unit.id)} className="inline-flex mt-5 px-5 py-3 rounded-xl bg-rose-600 text-white font-semibold">Open this unit</Link></>:<><h2 className="text-xl font-bold">{courses.length?'All planned units are marked Done':'Build your first study plan'}</h2><p className="text-sm text-slate-300 mt-3">{courses.length?'Revisit a course below for revision. Done is your own completion mark, not a test score.':'Find your year and branch, then add the courses you take.'}</p><Link to="/directory" className="inline-flex mt-5 px-5 py-3 bg-rose-600 rounded-xl">Browse courses</Link></>}</div>
 <div className="rounded-2xl border border-white/10 p-5 bg-zinc-950"><h2 className="text-sm text-slate-300">Plan completion</h2><p className="text-4xl font-bold mt-3">{done}<span className="text-lg text-slate-400"> / {all.length} units</span></p><p className="text-sm text-slate-400 mt-2">Marked Done by you</p><div className="h-2 bg-white/10 rounded-full mt-4 overflow-hidden"><div className="h-full bg-rose-500" style={{width:`${all.length?done/all.length*100:0}%`}}/></div><p className="text-xs text-slate-400 mt-3">Study and revision marks do not count as Done.</p></div>
 </section>
 <section><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">Your courses</h2><span className="text-sm text-slate-400">{courses.length} in plan</span></div><div className="grid md:grid-cols-2 gap-3">{courses.map(c=>{const complete=c.units.filter(u=>status(u.id)===UnitStatus.MASTERED).length;const focus=c.units.find(u=>[UnitStatus.IN_PROGRESS,UnitStatus.REVISION].includes(status(u.id)))||c.units.find(u=>status(u.id)!==UnitStatus.MASTERED);return <article key={c.id} className="p-5 rounded-2xl border border-white/10 bg-zinc-950"><p className="text-xs text-slate-400 break-words">{c.year} · {c.code}{c.semester?` · Semester ${c.semester}`:''}</p><h3 className="text-lg font-bold mt-2">{c.name}</h3><p className="text-sm text-slate-300 mt-2">{complete}/{c.units.length} Done{focus?` · Next: Unit ${focus.unit_number}`:' · Ready to revise'}</p><Link to={link(c.id,focus?.id)} className="inline-flex py-3 mt-2 text-rose-300 font-semibold">{focus?'Study course':'Revise course'} →</Link></article>})}</div></section>
 <section className="grid md:grid-cols-2 gap-4"><div className="p-5 border border-white/10 rounded-2xl"><div className="flex justify-between gap-4"><h2 className="text-lg font-bold">Pending tasks</h2><Link to="/tasks" className="text-rose-300">All tasks</Link></div>{pending.length?<ul className="mt-3 space-y-3">{pending.map(t=><li key={t.id} className="text-sm"><p>{t.text}</p>{t.dueDate&&<p className="text-slate-400 mt-1">Due: {t.dueDate}</p>}</li>)}</ul>:<p className="mt-3 text-sm text-slate-400">No pending tasks. Add your own study deadlines.</p>}</div><div className="p-5 border border-white/10 rounded-2xl"><h2 className="text-lg font-bold">Keep your work safe</h2><p className="text-sm text-slate-400 mt-3">This plan stays in this browser. Export a backup before switching devices or clearing browser data.</p><Link to="/settings" className="inline-flex mt-3 py-2 text-rose-300">Export / restore backup →</Link></div></section>
 </div>;
}

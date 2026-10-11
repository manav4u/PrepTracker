import React,{useState}from'react';
const topics=['Arrays','Stacks','Queues','Linked lists','Trees','Graphs','Hashing','Sorting'];
const sheets=['Plan','Papers'];
export default function PaperStackHero(){
 const [done,setDone]=useState<number[]>([0,1]);
 const toggle=(i:number)=>setDone(d=>d.includes(i)?d.filter(x=>x!==i):[...d,i]);
 return <div className="hero-stack" role="group" aria-label="Example desk. Sample data only, nothing here is saved.">
  <div className="hero-glow" aria-hidden="true"/>
  <div className="hero-sheet hero-sheet-back" aria-hidden="true"><span>{sheets[1]}</span></div>
  <div className="hero-sheet hero-sheet-mid" aria-hidden="true"><span>{sheets[0]}</span></div>
  <div className="hero-sheet hero-sheet-top">
   <header><p>EXAMPLE DESK</p><small>SAMPLE STUDENT, NOT REAL DATA</small></header>
   <h2>Data Structures</h2>
   <p className="hero-count"><b>{done.length}</b> of {topics.length} topics covered <i>by your own word</i></p>
   <ul className="hero-tiles">{topics.map((t,i)=><li key={t}><button type="button" aria-pressed={done.includes(i)} onClick={()=>toggle(i)}><span className="hero-tile-name">{t}</span><span className="hero-stamp" aria-hidden="true">{done.includes(i)?'covered':''}</span></button></li>)}</ul>
   <p className="hero-note">Tap a tile. This is a demo and does not save anything.</p>
  </div>
 </div>;
}

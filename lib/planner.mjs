import{validDay,localDay}from'./dates.mjs';import{nextRevision}from'./study.mjs';
export function generatePlan(topics,study,tasks,{minutes=60,sessionMinutes=20,days=7,start=localDay()}={}){
 if(!validDay(start))throw Error('Valid start date required.');
 const daily=Math.floor(Math.max(0,Math.min(240,minutes))/Math.max(10,Math.min(120,sessionMinutes)));const slots=Math.min(35,daily*Math.max(1,Math.min(7,days)));
 const attempted=new Set((study.attempts||[]).map(a=>a.topicId));const practiceDue=t=>attempted.has(t.id)&&study.topics[t.id]?.nextReview&&study.topics[t.id].nextReview<=start;
 const legacyDue=s=>s.lastRevised&&!Object.hasOwn(s,'nextReview')&&nextRevision(s.lastRevised,s.confidence||'low')<=start;
 const ranked=topics.filter(t=>{const s=study.topics[t.id]||{};return s.status!=='done'||practiceDue(t)||legacyDue(s);}).map(t=>{const s=study.topics[t.id]||{};const due=practiceDue(t)||legacyDue(s);const deadline=tasks.filter(x=>!x.completed&&validDay(x.dueDate)&&x.courseId===t.course.id).sort((a,b)=>a.dueDate.localeCompare(b.dueDate))[0];const weak=s.confidence==='low';return {...t,deadlineDay:deadline?.dueDate,rank:(deadline?0:10)+(due?0:5)+(weak?0:2),reason:deadline?`Paper ${deadline.dueDate} - before it`:due?(practiceDue(t)?'Practice return due':'Revision due'):weak?'Low self-reported confidence':'Next unfinished topic'};}).sort((a,b)=>a.rank-b.rank||a.id.localeCompare(b.id));
 const dayN=Math.max(1,Math.min(7,days));const free=Array.from({length:dayN},()=>daily);const dayOf=n=>{const d=new Date(start+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
 const placed=[];const notes={noFit:[],closed:[]};const noFitCount={};
 for(const t of ranked){if(placed.length>=slots)break;const dl=t.deadlineDay;let n=-1;
  for(let k=0;k<dayN;k++){if(free[k]<=0)continue;if(dl&&dayOf(k)>=dl)break;n=k;break;}
  if(n<0){if(dl){if(dl<=start){if(!notes.closed.find(c=>c.course===t.course.name))notes.closed.push({course:t.course.name,date:dl});}else noFitCount[t.course.name]=(noFitCount[t.course.name]||0)+1;}continue;}
  free[n]--;placed.push({n,t});}
 for(const[course,count]of Object.entries(noFitCount))notes.noFit.push({course,count});
 placed.sort((a,b)=>a.n-b.n);
 const out=placed.map(({n,t})=>({id:crypto.randomUUID(),topicId:t.id,courseId:t.course.id,label:`${t.course.name} · Unit ${t.unit.unit_number}`,date:dayOf(n),minutes:sessionMinutes,reason:t.reason,status:'planned'}));
 Object.defineProperty(out,'notes',{value:notes,enumerable:false});return out;
}

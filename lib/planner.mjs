import{validDay,localDay}from'./dates.mjs';import{nextRevision}from'./study.mjs';
export function generatePlan(topics,study,tasks,{minutes=60,sessionMinutes=20,days=7,start=localDay()}={}){
 if(!validDay(start))throw Error('Valid start date required.');
 const daily=Math.floor(Math.max(0,Math.min(240,minutes))/Math.max(10,Math.min(120,sessionMinutes)));const slots=Math.min(35,daily*Math.max(1,Math.min(7,days)));
 const attempted=new Set((study.attempts||[]).map(a=>a.topicId));const practiceDue=t=>attempted.has(t.id)&&study.topics[t.id]?.nextReview&&study.topics[t.id].nextReview<=start;
 const legacyDue=s=>s.lastRevised&&!Object.hasOwn(s,'nextReview')&&nextRevision(s.lastRevised,s.confidence||'low')<=start;
 const ranked=topics.filter(t=>{const s=study.topics[t.id]||{};return s.status!=='done'||practiceDue(t)||legacyDue(s);}).map(t=>{const s=study.topics[t.id]||{};const due=practiceDue(t)||legacyDue(s);const deadline=tasks.filter(x=>!x.completed&&validDay(x.dueDate)&&x.courseId===t.course.id).sort((a,b)=>a.dueDate.localeCompare(b.dueDate))[0];const weak=s.confidence==='low';return {...t,rank:(deadline?0:10)+(due?0:5)+(weak?0:2),reason:deadline?`Course deadline: ${deadline.dueDate}`:due?(practiceDue(t)?'Practice return due':'Revision due'):weak?'Low self-reported confidence':'Next unfinished topic'};}).sort((a,b)=>a.rank-b.rank||a.id.localeCompare(b.id));
 return ranked.slice(0,slots).map((t,i)=>{const d=new Date(start+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+Math.floor(i/daily));return {id:crypto.randomUUID(),topicId:t.id,courseId:t.course.id,label:`${t.course.name} · Unit ${t.unit.unit_number}`,date:d.toISOString().slice(0,10),minutes:sessionMinutes,reason:t.reason,status:'planned'};});
}

import {learningNodes} from './learning.mjs';
import {nextRevision} from './study.mjs';
import {validDay} from './dates.mjs';
// Calendar-day arithmetic is deliberate: a date-only deadline has no paper time.
export function dayDistance(from,to){if(!validDay(from)||!validDay(to))return null;return Math.round((Date.parse(to+'T12:00:00Z')-Date.parse(from+'T12:00:00Z'))/86400000);}
export function deskModel(courses,study,tasks,today){
 const shelves=courses.map(course=>{const nodes=learningNodes(course).map(n=>({...n,course}));const units=course.units.map(unit=>{const list=nodes.filter(n=>n.unitId===unit.id);return{...unit,nodes:list,covered:list.filter(n=>study.topics[n.id]?.status==='done').length,total:list.length};});return{course,nodes,units,covered:nodes.filter(n=>study.topics[n.id]?.status==='done').length,total:nodes.length};});
 const nodes=shelves.flatMap(s=>s.nodes),known=new Set(nodes.map(n=>n.id)),selected=new Set(courses.map(c=>c.id));
 const returns=nodes.map(node=>{const s=study.topics[node.id]||{};const date=s.nextReview||(s.lastRevised?nextRevision(s.lastRevised,s.confidence||'low'):null);return{...node,date};}).filter(n=>validDay(n.date)&&n.date<=today).sort((a,b)=>a.date.localeCompare(b.date));
 const papers=tasks.filter(t=>!t.completed&&t.category==='EXAM'&&selected.has(t.courseId)&&validDay(t.dueDate)&&t.dueDate>=today).map(t=>({...t,course:courses.find(c=>c.id===t.courseId),days:dayDistance(today,t.dueDate)})).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||a.text.localeCompare(b.text));
 const planned=(study.plan||[]).filter(p=>p.date===today&&p.status==='planned'&&known.has(p.topicId)).map(p=>({...p,node:nodes.find(n=>n.id===p.topicId)}));
 const next=returns[0]||planned[0]?.node||nodes.find(n=>study.topics[n.id]?.status==='studying')||nodes.find(n=>study.topics[n.id]?.status!=='done')||null;
 const covered=nodes.filter(n=>study.topics[n.id]?.status==='done').length;
 return{shelves,nodes,returns,papers,planned,next,covered,total:nodes.length,left:nodes.length-covered,percent:nodes.length?Math.round(covered/nodes.length*100):0};
}
export function visitDelta(previous,nodes,study){if(!previous||!Array.isArray(previous.covered)||!Array.isArray(previous.courses))return null;const ids=[...new Set(nodes.map(n=>n.courseId))].sort();if(ids.join('|')!==previous.courses.slice().sort().join('|'))return null;const old=new Set(previous.covered);return nodes.filter(n=>study.topics[n.id]?.status==='done'&&!old.has(n.id)).length;}

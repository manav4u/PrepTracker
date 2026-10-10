import {deriveOutline} from './outline.mjs';
import {topicId} from './study.mjs';
import {validDay,localDay} from './dates.mjs';
// Stable source-boundary handles. Original IDs and source strings are never rewritten.
export function sourceKey(text){let n=2166136261;for(const c of text.normalize('NFC')){n^=c.codePointAt(0);n=Math.imul(n,16777619);}return (n>>>0).toString(36);}
export function learningNodes(course){return course.units.flatMap(unit=>{
 const raw=unit.sourceText;
 if(!raw)return unit.topics.map((text,index)=>({id:topicId(unit.id,index),courseId:course.id,unitId:unit.id,text,unit,index,kind:'source-topic',source:course.source}));
 const seen=new Map();return deriveOutline(raw).map((text,index)=>{const key=sourceKey(text),count=(seen.get(key)||0)+1;seen.set(key,count);return {id:`${unit.id}:source:${key}:${count}`,aggregateId:topicId(unit.id,0),courseId:course.id,unitId:unit.id,text,unit,index,kind:'derived-source',source:course.source};});
 });}
export function migrateLearning(state){if(state.schemaVersion===2)return state;return {...state,schemaVersion:2,attempts:state.attempts||[]};}
export const reviewDay=(day,outcome)=>{if(!validDay(day)||!['again','hint','solo'].includes(outcome))throw Error('Valid review date and outcome required.');const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+({again:1,hint:3,solo:7}[outcome]));return d.toISOString().slice(0,10);};
export function recordAttempt(state,{topicId:id,courseId,unitId,goal,answer='',paper=false,outcome,reference,day=localDay(),at=new Date().toISOString(),review=reviewDay(day,outcome),attemptId=crypto.randomUUID()}){
 if(![id,courseId,unitId,goal].every(x=>typeof x==='string'&&x.trim()&&x.length<=10000)||typeof answer!=='string'||answer.length>10000||!validDay(day)||!['again','hint','solo'].includes(outcome))throw Error('Choose a topic, goal and outcome.');
 if(!answer.trim()&&!paper)throw Error('Record an attempt before checking.');
 if(!reference||!['user','reviewed'].includes(reference.kind)||!reference.label?.trim()||!reference.text?.trim()||reference.label.length>10000||reference.text.length>10000)throw Error('A comparison reference is required; a syllabus heading is not an answer.');
 if(reference.url&&!/^https?:\/\//i.test(reference.url))throw Error('Reference URL must be HTTP(S).');
 if(review!==null&&!validDay(review))throw Error('Valid next review required.');
 const next=migrateLearning(state),before=Object.hasOwn(next.topics,id)?{...next.topics[id]}:null;
 const attempt={id:attemptId,topicId:id,courseId,unitId,goal,answer,paper,outcome,reference,day,at,review,before};
 return {...next,topics:{...next.topics,[id]:{...next.topics[id],lastAttempt:day,outcome,nextReview:review}},attempts:[...next.attempts,attempt].slice(-5000)};
}
export function editReview(state,id,date){if(date!==null&&!validDay(date))throw Error('Valid review date required.');return {...state,topics:{...state.topics,[id]:{...state.topics[id],nextReview:date}}};}
export function undoAttempt(state,id){const attempt=state.attempts?.find(a=>a.id===id);if(!attempt)return state;const later=state.attempts.filter(a=>a.topicId===attempt.topicId).at(-1);if(later.id!==id)throw Error('Undo the most recent attempt on this topic first.');const topics={...state.topics};const current=topics[attempt.topicId]||{}; // keep coverage edits made after the attempt
 const restored={...attempt.before};for(const k of ['status','confidence','lastRevised']){if(Object.hasOwn(current,k))restored[k]=current[k];else delete restored[k];}
 if(attempt.before===null&&!Object.keys(restored).length)delete topics[attempt.topicId];else topics[attempt.topicId]=restored;
 return {...state,topics,attempts:state.attempts.filter(a=>a.id!==id)};}
export function learningSummary(nodes,state,today=localDay()){const known=new Set(nodes.map(n=>n.id));const attempts=(state.attempts||[]).filter(a=>known.has(a.topicId));return {total:nodes.length,covered:nodes.filter(n=>state.topics[n.id]?.status==='done').length,attempted:new Set(attempts.map(a=>a.topicId)).size,due:nodes.filter(n=>{const s=state.topics[n.id];return s?.lastAttempt&&s.nextReview&&s.nextReview<=today;}).length,attempts:attempts.length};}

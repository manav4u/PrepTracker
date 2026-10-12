import {validDay,localDay} from './dates.mjs';
export const topicId=(unit,index)=>`${unit}:topic:${index+1}`;
export const nextRevision=(day,confidence)=>{if(!validDay(day))return null;const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+(confidence==='high'?7:confidence==='medium'?3:1));return d.toISOString().slice(0,10);};
export function revisionQueue(topics,state,today=localDay()){return topics.filter(t=>{const s=state.topics[t.id];return s?.lastRevised&&nextRevision(s.lastRevised,s.confidence)<=today;}).sort((a,b)=>nextRevision(state.topics[a.id].lastRevised,state.topics[a.id].confidence).localeCompare(nextRevision(state.topics[b.id].lastRevised,state.topics[b.id].confidence))).slice(0,5);}
export function recordRevision(state,id,confidence,day=localDay(),at=new Date().toISOString()){return {...state,topics:{...state.topics,[id]:{...state.topics[id],confidence,lastRevised:day}},events:[...state.events,{id:crypto.randomUUID(),topicId:id,day,at,kind:'revision',confidence}].slice(-5000)};}
// Quick log: a dated "I looked at this" note. It is not compared against any reference, so it only appends an event.
// It must not write topic state (no confidence, no lastRevised), so it can never create a due date, a confidence claim or progress.
export function recordQuickLog(state,id,day=localDay(),at=new Date().toISOString()){return {...state,events:[...state.events,{id:crypto.randomUUID(),topicId:id,day,at,kind:'quick-log',compared:false}].slice(-5000)};}

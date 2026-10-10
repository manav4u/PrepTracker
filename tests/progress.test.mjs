import test from'node:test';import assert from'node:assert/strict';import{evidenceState}from'../lib/progress.mjs';
const n={id:'t'},base={topics:{},attempts:[]};
test('coverage and old confidence cannot manufacture attempted state',()=>{assert.equal(evidenceState(n,{...base,topics:{t:{status:'done',confidence:'high'}}}).key,'new');});
test('due date outranks latest successful attempt; no permanent solid/mastery state',()=>{const s={topics:{t:{nextReview:'2026-10-10'}},attempts:[{topicId:'t',outcome:'solo'}]};assert.equal(evidenceState(n,s,'2026-10-10').key,'returning');assert.equal(evidenceState(n,s,'2026-10-09').key,'unaided');assert.ok(evidenceState(n,s,'2026-10-09').reason.includes('Not proof'));});
test('later assistance moves evidence back to needs pass; undo absence returns to new',()=>{const s={topics:{},attempts:[{topicId:'t',outcome:'solo'},{topicId:'t',outcome:'hint'}]};assert.equal(evidenceState(n,s).key,'attempted');assert.equal(evidenceState(n,base).key,'new');});
import {recordAttempt,undoAttempt,editReview,learningNodes} from '../lib/learning.mjs';
import {progressCourses} from '../lib/progress.mjs';
const course={id:'c',units:[{id:'u',unit_number:1,topics:['One','Two']}]};
const node=learningNodes(course)[0];
const entry=(outcome,id)=>({topicId:node.id,courseId:'c',unitId:'u',goal:'Solve and justify',answer:'Recorded reasoning',paper:false,outcome,reference:{kind:'user',label:'My notes',text:'Worked method'},day:'2026-10-10',at:'2026-10-10T00:00:00Z',attemptId:id});
test('recording, editing return, later outcome and undo keep map tied to evidence',()=>{
 let s={schemaVersion:2,topics:{[node.id]:{status:'done'}},events:[],attempts:[]};
 s=recordAttempt(s,entry('hint','a'));let m=progressCourses([course],s,'2026-10-10')[0];
 assert.equal(m.nodes[0].evidence.key,'attempted');assert.equal(m.summary.covered,1);assert.equal(m.summary.attempted,1);assert.equal(m.summary.due,0);
 s=editReview(s,node.id,'2026-10-10');m=progressCourses([course],s,'2026-10-10')[0];assert.equal(m.nodes[0].evidence.key,'returning');assert.equal(m.summary.due,1);
 s=recordAttempt(s,entry('solo','b'));m=progressCourses([course],s,'2026-10-10')[0];assert.equal(m.nodes[0].evidence.key,'unaided');assert.equal(m.summary.attempted,1);assert.equal(m.nodes[0].evidence.attempts.length,2);
 s=undoAttempt(s,'b');assert.equal(progressCourses([course],s,'2026-10-10')[0].nodes[0].evidence.key,'returning');
 s=undoAttempt(s,'a');m=progressCourses([course],s,'2026-10-10')[0];assert.equal(m.nodes[0].evidence.key,'new');assert.equal(m.summary.covered,1);assert.equal(m.summary.attempted,0);assert.equal(m.summary.due,0);
});
test('empty courses and unknown historical topic handles do not invent map evidence',()=>{
 assert.deepEqual(progressCourses([],base),[]);
 const m=progressCourses([course],{topics:{old:{status:'done'}},attempts:[{topicId:'old',outcome:'solo'}]},'2026-10-10')[0];assert.equal(m.summary.covered,0);assert.equal(m.summary.attempted,0);assert.ok(m.nodes.every(n=>n.evidence.key==='new'));
 assert.equal(progressCourses([{id:'empty',units:[]}],base)[0].nodes.length,0);
});

test('map and due total use actual attempts even with incomplete redundant topic cache',()=>{
 const s={topics:{[node.id]:{status:'done',nextReview:'2026-10-10'}},attempts:[{topicId:node.id,outcome:'hint'}]};
 const m=progressCourses([course],s,'2026-10-10')[0];assert.equal(m.nodes[0].evidence.key,'returning');assert.equal(m.summary.due,1);
 const orphan=progressCourses([course],{topics:{[node.id]:{lastAttempt:'2026-10-01',nextReview:'2026-10-10'}},attempts:[]},'2026-10-10')[0];assert.equal(orphan.nodes[0].evidence.key,'new');assert.equal(orphan.summary.due,0);
});

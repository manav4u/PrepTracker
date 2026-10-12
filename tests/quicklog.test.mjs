import{test}from'node:test';import assert from'node:assert/strict';
import{recordQuickLog,revisionQueue}from'../lib/study.mjs';import{learningSummary}from'../lib/learning.mjs';import{deskModel}from'../lib/desk.mjs';
const course={id:'c',name:'C',units:[{id:'u1',unit_number:1,title:'U',topics:['One']}]};const node={id:'u1:topic:1'};
test('quick log appends only a not-compared event and never touches topic state',()=>{
 const s0={topics:{},events:[]};const s=recordQuickLog(s0,node.id,'2026-10-12');
 assert.deepEqual(s.topics,{});assert.equal(s.events.length,1);assert.equal(s.events[0].kind,'quick-log');assert.equal(s.events[0].compared,false);
 assert.equal(s.events[0].confidence,undefined);
 assert.deepEqual(revisionQueue([node],s,'2027-01-01'),[]);
 const d=deskModel([course],s,[],'2027-01-01');assert.equal(JSON.stringify(d).includes('quick-log'),false);assert.equal(d.shelves[0].covered,0);
 const sum=learningSummary([node],s,'2027-01-01');assert.equal(sum.covered,0);assert.equal(sum.attempted,0);assert.equal(sum.due,0);assert.equal(sum.attempts,0);
});
test('quick log keeps existing confidence and coverage exactly as they were',()=>{
 const s0={topics:{[node.id]:{status:'done',confidence:'high',lastRevised:'2026-10-01'}},events:[]};
 const s=recordQuickLog(s0,node.id,'2026-10-12');assert.deepEqual(s.topics,s0.topics);
});
import{createBackup,parseBackup}from'../lib/backup.mjs';
test('a backup containing quick-log events round-trips, and a forged compared:true quick-log is rejected',()=>{
 const study={schemaVersion:2,topics:{},events:[...recordQuickLog({topics:{},events:[]},'u1:topic:1','2026-10-12').events]};
 const data={profile:null,progress:[],marks:{},resources:[],tasks:[],hiddenResourceIds:[],study,theory:{}};
 const text=JSON.stringify({metadata:{version:'6.0.0',type:'SPPU_PREPTRACKER_LOCAL_BACKUP',timestamp:'2026-10-12T00:00:00.000Z'},data});
 assert.doesNotThrow(()=>parseBackup(text));
 const forged=JSON.parse(text);forged.data.study.events[0].compared=true;
 assert.throws(()=>parseBackup(JSON.stringify(forged)));
});

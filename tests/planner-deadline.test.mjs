import{test}from'node:test';import assert from'node:assert/strict';import{generatePlan}from'../lib/planner.mjs';
const mk=(n,c)=>Array.from({length:n},(_,i)=>({id:`${c}-${i}`,text:'t',unit:{unit_number:1},course:{id:c,name:c}}));
const topics=[...mk(12,'m'),...mk(6,'p')];
test('nothing for a course is scheduled on or after its paper date, and the overflow is reported',()=>{
 const tasks=[{id:1,completed:false,dueDate:'2026-10-13',courseId:'m'}];
 const plan=generatePlan(topics,{topics:{},attempts:[]},tasks,{minutes:60,sessionMinutes:30,days:7,start:'2026-10-11'});
 const m=plan.filter(p=>p.courseId==='m');
 assert.ok(m.every(p=>p.date<'2026-10-13'));assert.equal(m.length,4);
 assert.equal(plan.notes.noFit[0].count,8);
 assert.ok(plan.some(p=>p.courseId==='p'));
});
test('paper today means no new sessions for that course',()=>{
 const tasks=[{id:1,completed:false,dueDate:'2026-10-11',courseId:'m'}];
 const plan=generatePlan(topics,{topics:{},attempts:[]},tasks,{minutes:60,sessionMinutes:30,days:7,start:'2026-10-11'});
 assert.equal(plan.filter(p=>p.courseId==='m').length,0);assert.equal(plan.notes.closed[0].course,'m');
});

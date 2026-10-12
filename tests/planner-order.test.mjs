import{test}from'node:test';import assert from'node:assert/strict';import{generatePlan}from'../lib/planner.mjs';
const mk=(n,c)=>Array.from({length:n},(_,i)=>({id:`${c}-t${i+1}`,text:'t',unit:{unit_number:1},course:{id:c,name:c}}));
test('the paper that is closer gets its topics first, whatever the course names',()=>{
 const topics=[...mk(3,'a'),...mk(3,'z')];
 const tasks=[{id:1,completed:false,dueDate:'2026-10-20',courseId:'a'},{id:2,completed:false,dueDate:'2026-10-14',courseId:'z'}];
 const plan=generatePlan(topics,{topics:{},attempts:[]},tasks,{minutes:30,sessionMinutes:30,days:3,start:'2026-10-11'});
 assert.deepEqual(plan.map(p=>p.courseId),['z','z','z']);
});
test('topic 2 comes before topic 10',()=>{
 const topics=mk(11,'m');
 const plan=generatePlan(topics,{topics:{},attempts:[]},[],{minutes:30,sessionMinutes:30,days:3,start:'2026-10-11'});
 assert.deepEqual(plan.map(p=>p.topicId),['m-t1','m-t2','m-t3']);
});

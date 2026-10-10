import{test}from'node:test';import assert from'node:assert/strict';import{generatePlan}from'../lib/planner.mjs';
const topics=['a','b','c'].map(id=>({id,course:{id,name:id},unit:{unit_number:1}}));
test('budget, linked deadlines, weak topics and completed exclusion',()=>{const state={topics:{a:{confidence:'low'},c:{status:'done'}},events:[]};let p=generatePlan(topics,state,[{courseId:'b',dueDate:'2026-10-11',completed:false}],{minutes:20,sessionMinutes:20,start:'2026-10-10'});assert.equal(p[0].topicId,'b');assert.equal(p[1].topicId,'a');assert.equal(p[1].date,'2026-10-11');assert.equal(p.length,2);assert.deepEqual(generatePlan(topics,state,[],{minutes:0,start:'2026-10-10'}),[]);});

test('Done does not exclude genuinely due revision; fresh Done stays out',()=>{const s={topics:{a:{status:'done',lastRevised:'2026-10-01',confidence:'low'},b:{status:'done',lastRevised:'2026-10-10',confidence:'high'},c:{status:'done'}},events:[]};const p=generatePlan(topics,s,[],{start:'2026-10-10'});assert.deepEqual(p.map(x=>x.topicId),['a']);assert.equal(p[0].reason,'Revision due');});

test('covered source topics return for actual practice, not invented cache-only attempts',()=>{const state={topics:{a:{status:'done',nextReview:'2026-10-10'},b:{status:'done',lastAttempt:'2026-01-01',nextReview:'2026-10-10'}},attempts:[{topicId:'a',outcome:'solo'}]};const p=generatePlan(topics,state,[],{start:'2026-10-10'});assert.ok(p.some(x=>x.topicId==='a'&&x.reason==='Practice return due'));assert.ok(!p.some(x=>x.topicId==='b'));});

test('an explicitly cleared return does not revive an old revision date',()=>{const state={topics:{a:{status:'done',lastRevised:'2026-01-01',nextReview:null}},attempts:[]};assert.deepEqual(generatePlan(topics.slice(0,1),state,[],{start:'2026-10-10'}),[])});

import{test}from'node:test';import assert from'node:assert/strict';import{summarizeMarks}from'../lib/marks.mjs';
const subj=[{id:'a',credits:4,theoryCredits:3,termWorkCredits:1,name:'A'}];
test('out-of-range or non-integer marks are never counted',()=>{
 const s=summarizeMarks(subj,{a:{inSem:45,endSem:90,termWork:-3}});
 assert.equal(s.completeHeads,0);
 const t=summarizeMarks(subj,{a:{inSem:20.5,endSem:50,termWork:20}});
 assert.equal(t.completeHeads,1);
});
test('valid marks still count',()=>{const s=summarizeMarks(subj,{a:{inSem:25,endSem:60,termWork:22}});assert.equal(s.completeHeads,2);});

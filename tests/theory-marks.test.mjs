import{test}from'node:test';import assert from'node:assert/strict';import{theoryTotal,theoryCourses}from'../lib/theoryMarks.mjs';
const c40={id:'a',year:'SE',cce:40,ese:60},c30={id:'b',year:'TE',cce:30,ese:70};
test('uses each course\'s own official maxima',()=>{
 assert.equal(theoryTotal(c40,{cce:35,ese:50}).total,85);
 assert.equal(theoryTotal(c40,{cce:35,ese:50}).percent,85);
 assert.equal(theoryTotal(c30,{cce:35,ese:50}).done,false);
 assert.equal(theoryTotal(c30,{cce:30,ese:70}).percent,100);
});
test('no total until both parts are valid whole numbers',()=>{
 assert.equal(theoryTotal(c40,{cce:20}).total,null);
 assert.equal(theoryTotal(c40,{cce:20,ese:61}).done,false);
 assert.equal(theoryTotal(c40,{cce:20.5,ese:10}).done,false);
});
test('only SE/TE courses with official maxima are listed',()=>{
 const cat=[c40,c30,{id:'fe',year:'FE',cce:30,ese:70},{id:'x',year:'SE'}];
 assert.deepEqual(theoryCourses(cat,['a','b','fe','x']).map(c=>c.id),['a','b']);
});
import{parseBackup,createBackup,restoreBackup}from'../lib/backup.mjs';
const store=(o={})=>({d:{...o},getItem(k){return k in this.d?this.d[k]:null},setItem(k,v){this.d[k]=String(v)},removeItem(k){delete this.d[k]}});
test('theory marks travel in a backup and an older 6.0.0 backup without them still restores',()=>{
 const s=store({sppu_theory_marks:JSON.stringify({a:{cce:30,ese:50}})});
 const b=createBackup(s);assert.deepEqual(b.data.theory,{a:{cce:30,ese:50}});
 const old=JSON.parse(JSON.stringify(b));delete old.data.theory;
 const r=parseBackup(JSON.stringify(old),{theory:{z:{cce:1}}});assert.deepEqual(r.data.theory,{z:{cce:1}});
 const r2=parseBackup(JSON.stringify(b),{});assert.deepEqual(r2.data.theory,{a:{cce:30,ese:50}});
});

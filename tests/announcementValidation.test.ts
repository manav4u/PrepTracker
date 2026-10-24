import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAnnouncementFeed } from '../lib/announcementValidation.ts';
const item = {id:'sample',date:'2026-10-24',tag:'Update',title:'Sample notice',body:'Sample text'};
const validate=(items: unknown[])=>validateAnnouncementFeed({version:1,items});
test('strict feed supports valid notices and deliberate empty feeds',()=>{
 assert.deepEqual(validate([item]),[]);assert.deepEqual(validate([]),[]);
 assert.deepEqual(validate([{...item,link:'https://example.com/resource'}]),[]);
});
test('strict feed rejects invalid dates, duplicate IDs, bad links, fields and limits',()=>{
 for(const patch of [{date:'2026-02-30'},{date:''},{tag:'Anything'},{id:'bad id'},{title:'x'.repeat(121)},{body:' '},{body:'x'.repeat(2001)},{link:'javascript:alert(1)'},{link:'https://user:pass@example.com'},{link:'https://bad host'},{link:'http://example.com'},{unplanned:true}]) assert.ok(validate([{...item,...patch}]).length,JSON.stringify(patch));
 assert.ok(validate([item,item]).length);
 assert.ok(validate(Array.from({length:21},(_,i)=>({...item,id:`s${i}`}))).length);
 assert.ok(validateAnnouncementFeed({version:2,items:[]}).length);
 assert.ok(validateAnnouncementFeed({version:1,items:[],extra:true}).length);
});

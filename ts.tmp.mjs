import p from 'puppeteer-core';
const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const d=new Date();const iso=n=>new Date(d.getTime()+n*864e5).toISOString().slice(0,10);
const cats=['EXAM','LAB','SUBMISSION','GENERAL'];
const tasks=[['Revise integration by parts','m1-u3',2,0,0,'EXAM'],['Chem lab write-up','chem',1,0,-1,'LAB'],['Submit FPL assignment','',1,0,1,'SUBMISSION'],['Read unit 1 summary','m1-u1',0,0,6,'GENERAL'],['Physics numericals set','',0,1,2,'LAB']].map((t,i)=>({id:'t'+i,text:t[0],unitId:t[1].startsWith('m1-')?t[1]:undefined,priority:['LOW','NORMAL','CRITICAL'][t[2]],completed:!!t[3],dueDate:iso(t[4]),category:t[5],createdAt:new Date().toISOString()}));
const prof={name:'Aarav',theme:'dark',selectedSubjects:['m1','fpl','phy','chem'],setupComplete:true,streak:6,lastStudyDate:iso(0)};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
for(const [w,h,f,n] of [[390,844,2,'390'],[1440,900,1,'1440']]){
const pg=await b.newPage();await pg.setViewport({width:w,height:h,deviceScaleFactor:f});
await pg.evaluateOnNewDocument((t,pr)=>{localStorage.setItem('sppu_profile',JSON.stringify(pr));localStorage.setItem('sppu_tasks',JSON.stringify(t));},tasks,prof);
await pg.goto('http://localhost:4173/app/tasks',{waitUntil:'networkidle0'});await wait(800);
const scr=(l,blk)=>pg.evaluate((l,blk)=>[...document.querySelectorAll('label')].find(e=>e.textContent.trim().toLowerCase().startsWith(l)).scrollIntoView({block:blk}),l,blk);
const openSel=async l=>{await pg.evaluate(l=>{[...document.querySelectorAll('label')].find(e=>e.textContent.trim().toLowerCase().startsWith(l)).parentElement.querySelector('button').click()},l);await wait(400)};
await scr('priority','center');if(n==='390')await pg.evaluate(()=>window.scrollBy(0,120));await openSel('priority');await pg.screenshot({path:`/downloads/tasksico-${n}-priority.png`});
await pg.mouse.click(5,5);await wait(200);
await openSel('category');await pg.screenshot({path:`/downloads/tasksico-${n}-category.png`});
await pg.mouse.click(5,5);await wait(200);
await pg.evaluate(()=>{[...document.querySelectorAll('button')].find(e=>/^all$/i.test(e.textContent.trim())).scrollIntoView({block:'start'});window.scrollBy(0,-90)});await wait(300);
await pg.screenshot({path:`/downloads/tasksico-${n}-rows.png`});}
await b.close();

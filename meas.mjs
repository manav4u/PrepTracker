import puppeteer from 'puppeteer-core';
const url=process.argv[2];
const profile={name:'Aarav',theme:'dark',setupComplete:true,selectedSubjects:['m1'],streak:0,lastStudyDate:''};
const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--hide-scrollbars']});
const p=await b.newPage();await p.setViewport({width:390,height:844,deviceScaleFactor:2});
await p.evaluateOnNewDocument(a=>{localStorage.setItem('sppu_profile',JSON.stringify(a));},profile);
await p.goto(url,{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,1000));
for(const [from,to] of [['/app','/app/settings'],['/app/settings','/app/tasks']]){
await p.click(`aside a[href="${from}"]`).catch(()=>{});await new Promise(r=>setTimeout(r,800));
const out=await p.evaluate(async(to)=>{
  const pill=()=>document.querySelector('aside a[aria-current="page"] span.absolute');
  const samples=[];const t0=performance.now();let done=false;
  const tick=()=>{const e=document.querySelector('aside a[aria-current="page"] span[class*="from-"]');const r=e&&e.getBoundingClientRect();samples.push([Math.round(performance.now()-t0),r?+(r.left+r.width/2).toFixed(1):null,r?+r.width.toFixed(1):null]);if(performance.now()-t0<900)requestAnimationFrame(tick);else done=true;};
  document.querySelector(`aside a[href="${to}"]`).click();requestAnimationFrame(tick);
  await new Promise(r=>setTimeout(r,1000));return samples;},to);
const xs=out.filter(s=>s[1]!==null);const end=xs.at(-1)[1],start=xs[0][1];
const dir=Math.sign(end-start);let over=0;xs.forEach(s=>{over=Math.max(over,(s[1]-end)*dir)});
const moving=xs.filter(s=>Math.abs(s[1]-end)>0.5);
console.log(`${from}->${to}: start ${start} end ${end} max overshoot past end ${over.toFixed(2)}px; first sample moving t=${moving[0]?.[0]} last moving t=${moving.at(-1)?.[0]}`);
console.log(xs.slice(0,30).map(s=>s[0]+':'+s[1]).join(' '));
}
await b.close();

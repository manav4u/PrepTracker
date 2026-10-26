import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { GUIDE_CHAPTERS } from '../lib/guide';

test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('pt_ga_consent','denied'));});
test('guide works before setup, searches, and keeps reader state out of study data',async({page})=>{
 await page.goto('/guide');
 await expect(page.getByRole('heading',{level:1})).toContainText('Less figuring');
 await expect(page.locator('.guide-card')).toHaveCount(11);
 const before=await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('sppu_')))));
 await page.getByRole('textbox',{name:'Search the guide'}).fill('backup');
 await expect(page.getByRole('status')).not.toHaveText('0 chapters found');
 await page.getByRole('textbox',{name:'Search the guide'}).fill('zzzz-no-match');
 await expect(page.getByRole('heading',{name:'No chapter by that name.'})).toBeVisible();
 await page.getByRole('button',{name:'Show all chapters'}).click();
 await page.locator('.guide-card').filter({hasText:'Know what to study today.'}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Know what to study today.');
 await page.getByRole('button',{name:'Next step',exact:true}).click();
 await expect(page.getByRole('heading',{level:2})).toHaveText('Open Revise, then Plan.');
 await page.getByRole('button',{name:'Enlarge example screenshot'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Enlarge example screenshot'})).toBeFocused();
 expect(await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('sppu_')))))).toEqual(before);
 await page.reload();
 await expect(page.getByRole('heading',{level:2,name:'Give each subject its own date.',exact:true})).toBeVisible();
});
test('every chapter and step has a working visual and no overflow',async({page},info)=>{test.setTimeout(90000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const chapter of GUIDE_CHAPTERS){
   await page.goto('/guide/'+chapter.id);
   await expect(page.getByRole('heading',{level:1})).toHaveText(chapter.title);
   for(let i=0;i<chapter.steps.length;i++){
     await page.locator('.guide-step-nav button').nth(i).click();
     await expect(page.getByRole('heading',{level:2})).toHaveText(chapter.steps[i].title);
     if(chapter.steps[i].image) await expect.poll(()=>page.locator('.guide-image-button img').evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBeTruthy();
     else await expect(page.locator('.guide-diagram')).toBeVisible();
     expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
   }
   if(process.env.GUIDE_SHOTS){fs.mkdirSync('/tmp/guide-proof',{recursive:true});await page.locator('.guide-step-nav button').first().click();await page.screenshot({path:`/tmp/guide-proof/${chapter.id}-${info.project.name}.png`,fullPage:true});}
 }
 expect(errors).toEqual([]);
});
test('guide passes axe and reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const axe=fs.readFileSync(path.resolve('node_modules/axe-core/axe.min.js'),'utf8');
 for(const route of ['/guide','/guide/daily-plan','/guide/backup-restore']){
  await page.goto(route);await page.locator('h1').waitFor();await page.addScriptTag({content:axe});
  const violations=await page.evaluate(async()=> (await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map((v:any)=>({id:v.id,nodes:v.nodes.map((n:any)=>n.target)})));
  expect(violations).toEqual([]);
 }
});

import {chromium} from '@playwright/test';
import fs from 'node:fs';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const context=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
const p=await context.newPage();p.setDefaultTimeout(7000);await p.clock.install({time:new Date('2026-10-27T10:00:00')});
await p.addInitScript(()=>{if(sessionStorage.getItem('guide-seed'))return;localStorage.setItem('pt_ga_consent','denied');localStorage.setItem('sppu_revise_prompt','2026-10-27');const maths=['Rolle’s Theorem','Mean Value Theorems',"Taylor's and Maclaurin's Series",'Indeterminate Forms',"L' Hospital's Rule",'Fourier series (Full range & Half range)','Harmonic analysis'];localStorage.setItem('sppu_profile',JSON.stringify({name:'Aarya',theme:'dark',selectedSubjects:['m1','phy'],setupComplete:true,streak:4,lastStudyDate:'2026-10-27T09:00:00',prn:'DEMO 2026',examStartDate:'2026-11-05',examDates:{m1:'2026-11-05',phy:'2026-11-07'},activity:{'2026-10-24':2,'2026-10-25':4,'2026-10-26':3,'2026-10-27':7},events:maths.map(topic=>({day:'2026-10-27',subjectId:'m1',unitId:'m1-u1',topic,kind:'topic'}))}));localStorage.setItem('sppu_progress',JSON.stringify([{unitId:'m1-u1',status:'Mastered',topicsDone:maths,pyqsCompleted:['2023']}]));localStorage.setItem('sppu_reviews',JSON.stringify(Object.fromEntries(maths.map(topic=>['m1-u1::'+topic,{stage:0,due:'2026-10-27',last:'2026-10-24'}]))));localStorage.setItem('sppu_tasks',JSON.stringify([{id:'demo-task',text:'Solve Physics Unit 1 PYQs',completed:false,priority:'CRITICAL',category:'EXAM',subjectId:'phy',unitId:'phy-u1',dueDate:'2026-10-26',createdAt:'2026-10-24T09:00:00'},{id:'demo-task-2',text:'Revise Rolle’s theorem',completed:true,priority:'NORMAL',category:'GENERAL',subjectId:'m1',createdAt:'2026-10-25T09:00:00'}]));sessionStorage.setItem('guide-seed','yes');});
async function go(route){await p.goto('http://127.0.0.1:5173'+route);await p.locator('h1').waitFor();await p.clock.runFor(1300);await p.addStyleTag({content:'aside.fixed{visibility:hidden!important}'});}
async function shot(name,locator){await locator.screenshot({animations:'disabled',style:'aside.fixed,header.fixed{visibility:hidden!important}',path:'public/guide/'+name+'.png'});console.log(name);}
await go('/app/settings');await p.getByRole('button',{name:/Exam date per subject/}).click();
await shot('plan-dates',p.getByRole('button',{name:/Exam date per subject/}).locator('..'));
await shot('profile',p.locator('#profile-name').locator('../..'));
await shot('subjects-change',p.locator('section').filter({has:p.getByRole('heading',{name:'Your subjects',exact:true})}));
await shot('danger',p.locator('section').filter({has:p.getByRole('heading',{name:'Danger Zone'})}));
await shot('backup',p.locator('section').filter({has:p.getByRole('heading',{name:'Data Portability'})}));
const download= p.waitForEvent('download');await p.getByRole('button',{name:'Save Backup',exact:true}).click();const d=await download;await d.saveAs('/tmp/guide-demo-backup.json');
await p.locator('input[type=file]').setInputFiles('/tmp/guide-demo-backup.json');
await shot('restore',p.getByRole('dialog'));await p.getByRole('button',{name:'Cancel',exact:true}).click();
await go('/app');await shot('home-progress',p.locator('main>div').last().locator('section').first());await shot('home-stats',p.locator('main section').first().locator('div.lg\\:col-span-2').last());
await shot('activity',p.locator('main section').nth(1));
await shot('courses',p.locator('section').filter({has:p.getByRole('heading',{name:'Active Courses'})}));
await shot('timeline',p.locator('section').filter({has:p.getByRole('heading',{name:'Exam Timeline'})}));
await go('/app/subject/m1');const unit=p.locator('article').first();await unit.getByRole('button',{expanded:false}).click();await shot('unit',unit);await shot('topics',unit.getByRole('heading',{name:'Pages to cover'}).locator('..'));await shot('unit-status',unit.getByRole('group',{name:'Unit status'}));await shot('pyq',unit.getByRole('heading',{name:'Paper ribbons'}).locator('..'));
await go('/app/revise');await shot('review',p.getByRole('button',{name:'Got it',exact:true}).locator('..').locator('..'));await p.getByRole('button',{name:'Got it',exact:true}).click();await shot('review-undo',p.getByRole('button',{name:'Undo',exact:true}).locator('..'));
await go('/app/tasks');await shot('task-form',p.getByRole('heading',{name:'Add New Task'}).locator('..').locator('..'));await shot('task-carry',p.getByRole('heading',{name:'Carried over'}).locator('..').locator('..'));await shot('task-row',p.getByRole('button',{name:'Mark done: Solve Physics Unit 1 PYQs',exact:true}).locator('..').locator('..'));
await go('/app/resources');await shot('library',p.locator('main').locator('div.sticky').first());await p.getByRole('button',{name:'Add Resource',exact:true}).click();await shot('resource-add',p.getByRole('dialog'));
await p.keyboard.press('Escape');await p.getByRole('button',{name:'Search',exact:true}).click();await p.getByRole('textbox',{name:/Search subjects, units/}).fill('Rolle');await shot('search',p.getByRole('dialog',{name:'Search'}));
await p.keyboard.press('Escape');await p.getByRole('button',{name:/Announcements/}).click();await shot('announcements',p.getByRole('dialog'));await b.close();

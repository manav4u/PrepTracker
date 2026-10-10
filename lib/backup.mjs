import {validDay} from './dates.mjs';
// Shared storage contract. Backup/restore must use the same keys as the tracker.
export const KEYS = Object.freeze({profile:'sppu_profile',progress:'sppu_progress',marks:'sppu_calculator_marks',resources:'sppu_custom_resources',tasks:'sppu_tasks',hiddenResourceIds:'sppu_deleted_system_ids',study:'sppu_study'});
export const ROLLBACK_KEY='sppu_backup_rollback';
export const MAX_BYTES=5*1024*1024;
const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const str=x=>typeof x==='string'&&x.length<=10000;
const strs=x=>Array.isArray(x)&&x.length<=10000&&x.every(str);
const rows=(x,check)=>Array.isArray(x)&&x.length<=10000&&x.every(v=>plain(v)&&check(v));
const checks={
 profile:x=>x===null||(plain(x)&&str(x.name)&&strs(x.selectedSubjects)&&typeof x.setupComplete==='boolean'&&['light','dark'].includes(x.theme)&&Number.isFinite(x.streak)&&str(x.lastStudyDate)),
 progress:x=>rows(x,v=>str(v.unitId)&&['Not Started','In Progress','Revision','Mastered'].includes(v.status)&&strs(v.pyqsCompleted)),
 tasks:x=>rows(x,v=>str(v.id)&&str(v.text)&&typeof v.completed==='boolean'&&['CRITICAL','NORMAL','LOW'].includes(v.priority)&&['EXAM','LAB','SUBMISSION','GENERAL'].includes(v.category)&&str(v.createdAt)&&(v.courseId===undefined||str(v.courseId))&&(v.dueDate===undefined||str(v.dueDate))),
 resources:x=>rows(x,v=>['video','pdf','book','link'].includes(v.type)&&['id','title','author','downloads','subject','category','url'].every(k=>str(v[k]))&&/^https?:\/\//i.test(v.url)),
 marks:x=>plain(x)&&Object.values(x).every(v=>plain(v)&&Object.entries(v).every(([k,n])=>['inSem','endSem','termWork'].includes(k)&&Number.isFinite(n)&&n>=0&&n<=(k==='inSem'?30:k==='endSem'?70:25))),
 study:x=>plain(x)&&(x.marksConfig===undefined||(plain(x.marksConfig)&&[1,2].includes(x.marksConfig.semester)&&['workshop','design'].includes(x.marksConfig.workshop)))&&plain(x.topics)&&Object.keys(x.topics).length<=10000&&Object.entries(x.topics).every(([id,v])=>str(id)&&plain(v)&&[undefined,'low','medium','high'].includes(v.confidence)&&[undefined,'not-started','studying','done'].includes(v.status)&&(v.lastRevised===undefined||validDay(v.lastRevised)))&&(x.plan===undefined||rows(x.plan,v=>['id','topicId','courseId','label','reason'].every(k=>str(v[k]))&&validDay(v.date)&&Number.isFinite(v.minutes)&&v.minutes>=10&&v.minutes<=120&&['planned','done','skipped'].includes(v.status)))&&(x.budget===undefined||(plain(x.budget)&&Number.isFinite(x.budget.minutes)&&x.budget.minutes>=0&&x.budget.minutes<=240&&Number.isFinite(x.budget.sessionMinutes)&&x.budget.sessionMinutes>=10&&x.budget.sessionMinutes<=120))&&rows(x.events,v=>str(v.id)&&str(v.topicId)&&validDay(v.day)&&str(v.at)&&v.kind==='revision'&&['low','medium','high'].includes(v.confidence)),
 hiddenResourceIds:strs
};
const defaults={profile:null,progress:[],marks:{},resources:[],tasks:[],hiddenResourceIds:[],study:{topics:{},events:[]}};
export function readState(storage){
 const state={};for(const [field,key] of Object.entries(KEYS)){const raw=storage.getItem(key);state[field]=raw===null?defaults[field]:JSON.parse(raw);if(!checks[field](state[field]))throw Error(`Invalid saved ${field}. Nothing was changed.`);}return state;
}
export function createBackup(storage){return {metadata:{version:'5.0.0',type:'SPPU_PREPTRACKER_LOCAL_BACKUP',timestamp:new Date().toISOString()},data:readState(storage)};}
export function parseBackup(content,current){
 if(new TextEncoder().encode(content).length>MAX_BYTES)throw Error('Backup exceeds the 5 MB limit.');
 const parsed=JSON.parse(content);if(!plain(parsed))throw Error('Invalid backup.');
 let source,warnings=[];
 if(parsed.metadata){
  if(!plain(parsed.metadata)||parsed.metadata.type!=='SPPU_PREPTRACKER_LOCAL_BACKUP'||!['3.1.0','4.0.0','5.0.0'].includes(parsed.metadata.version)||!plain(parsed.data))throw Error('Unsupported backup type or version.');source=parsed.data;
 }else{if(!Object.hasOwn(parsed,'profile'))throw Error('Invalid legacy backup.');source=parsed;warnings.push('Legacy format. Missing fields retain current data.');}
 const data={};
 for(const field of Object.keys(KEYS)){
  if(!Object.hasOwn(source,field)){if(parsed.metadata?.version==='5.0.0'||(parsed.metadata?.version==='4.0.0'&&field!=='study'))throw Error(`Missing ${field}.`);data[field]=current[field]??defaults[field];warnings.push(`${field} absent: current data retained.`);continue;}
  let value=source[field];if(!parsed.metadata&&typeof value==='string')value=JSON.parse(value);
  if(!checks[field](value))throw Error(`Invalid ${field}. Nothing was changed.`);data[field]=value;
 }
 if(parsed.metadata?.version==='3.1.0')warnings.push('Older backups may have omitted real progress. An empty progress list cannot recover records never exported.');
 return {data,warnings};
}
function snapshot(storage){return Object.fromEntries(Object.values(KEYS).map(k=>[k,storage.getItem(k)]));}
function apply(storage,raw){for(const [k,v] of Object.entries(raw)){if(v===null)storage.removeItem(k);else storage.setItem(k,v);}}
export function restoreBackup(storage,data){
 for(const field of Object.keys(KEYS))if(!checks[field](data[field]))throw Error(`Invalid ${field}.`);
 const before=snapshot(storage);const oldRollback=storage.getItem(ROLLBACK_KEY);
 try{storage.setItem(ROLLBACK_KEY,JSON.stringify(before));apply(storage,Object.fromEntries(Object.entries(KEYS).map(([f,k])=>[k,JSON.stringify(data[f])])));}
 catch(e){try{apply(storage,before);if(oldRollback===null)storage.removeItem(ROLLBACK_KEY);else storage.setItem(ROLLBACK_KEY,oldRollback);}catch{throw Error('Restore failed and automatic rollback failed. Keep this tab open and download your existing backup if possible.');}throw Error('Restore failed. Existing data was restored.');}
}
export function rollbackRestore(storage){
 const raw=JSON.parse(storage.getItem(ROLLBACK_KEY)||'null');if(!plain(raw)||Object.keys(raw).length!==Object.keys(KEYS).length||!Object.values(KEYS).every(k=>Object.hasOwn(raw,k)&&(raw[k]===null||typeof raw[k]==='string')))throw Error('No valid rollback snapshot.');
 const before=snapshot(storage);try{apply(storage,raw);storage.setItem(ROLLBACK_KEY,JSON.stringify(before));}catch{apply(storage,before);throw Error('Rollback failed. Current data retained.');}
}

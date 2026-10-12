// SE/TE theory marks: official CCE and End-Sem maxima come from each course's catalog record.
// No grade points, no SGPA: term work and practical credits for SE/TE are not mapped yet.
export function theoryTotal(course,raw={}){
 const cm=Number(course.cce),em=Number(course.ese);
 const ok=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max?v:undefined;
 const cce=ok(raw.cce,cm),ese=ok(raw.ese,em);
 const max=cm+em;const done=cce!==undefined&&ese!==undefined;
 return {cce,ese,cceMax:cm,eseMax:em,max,done,total:done?cce+ese:null,percent:done?Math.round((cce+ese)/max*1000)/10:null};
}
export function theoryCourses(catalog,ids){return catalog.filter(c=>ids.includes(c.id)&&c.year!=='FE'&&Number.isFinite(Number(c.cce))&&Number.isFinite(Number(c.ese)));}

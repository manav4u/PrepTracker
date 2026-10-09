import rollout from './trackerMetadata.json';
import {SUBJECTS} from '../constants';
import {SUBJECT_PAGES} from './pages';
import {SE_BRANCHES} from './seBranches';
import {coursePath} from './sePage';
import {SYLLABUS_PDF} from './syllabusPage';
const pilot: Record<string,{semester:number;type:string;group?:string}> = {
 'PCC-201-COM':{semester:3,type:'Core'},'PCC-202-COM':{semester:3,type:'Core'},'PCC-203-COM':{semester:3,type:'Core'},'MDM-221-COM':{semester:3,type:'Minor'},'PCC-251-COM':{semester:4,type:'Core'},'PCC-252-COM':{semester:4,type:'Core'},'PCC-253-COM':{semester:4,type:'Core'},'MDM-271-COM':{semester:4,type:'Minor'},
 'PCC-301-IT':{semester:5,type:'Core'},'PCC-302-IT':{semester:5,type:'Core'},'PCC-303-IT':{semester:5,type:'Core'},'PEC-321A-IT':{semester:5,type:'Elective',group:'PEC I'},'PEC-321B-IT':{semester:5,type:'Elective',group:'PEC I'},'PEC-321C-IT':{semester:5,type:'Elective',group:'PEC I'},'PEC-321D-IT':{semester:5,type:'Elective',group:'PEC I'},
 'PCC-351-IT':{semester:6,type:'Core'},'PCC352-ITT':{semester:6,type:'Core'},'PEC-361A-IT':{semester:6,type:'Elective',group:'PEC II'},'PEC-361B-IT':{semester:6,type:'Elective',group:'PEC II'},'PEC-361C-IT':{semester:6,type:'Elective',group:'PEC II'},'PEC-361D-IT':{semester:6,type:'Elective',group:'PEC II'},'PEC-362A-IT':{semester:6,type:'Elective',group:'PEC III'},'PEC-362B-IT':{semester:6,type:'Elective',group:'PEC III'},'PEC-362C-IT':{semester:6,type:'Elective',group:'PEC III'},'PEC-362D-IT':{semester:6,type:'Elective',group:'PEC III'},
};
export function catalog(){
 const fe=SUBJECTS.map(s=>({...s,year:'FE',branch:'Common First Year',branchSlug:'fe',pattern:'2024',source:SYLLABUS_PDF,sourceLabel:'Official FE 2024 syllabus',draft:false,trackerReady:true,type:'FE course',path:'/syllabus/'+SUBJECT_PAGES.find(p=>p.id===s.id)!.slug+'/',cce:30,ese:70}));
 const later=SE_BRANCHES.flatMap(b=>b.courses.map(c=>{const id=`${b.slug}:2024:${c.code}`;const metadata=(b.slug==='se-computer-engineering'||b.slug==='te-information-technology')?pilot[c.code]:(rollout as Record<string,{semester:number;type:string;group?:string}>)[`${b.slug}:${c.code}`];return {id,name:c.name,code:c.code,credits:c.credits,units:c.units.map((u,i)=>({id:`${id}:unit:${i+1}`,unit_number:i+1,title:u.title,hours:u.hours,topics:[u.text],sourceText:u.text})),year:b.year||'SE',branch:b.branch,branchSlug:b.slug,pattern:b.pattern||'2024',source:b.pdf,sourceLabel:b.pdfLabel,draft:!!b.draft,trackerReady:!!metadata,type:metadata?.type||'Theory course',semester:metadata?.semester,electiveGroup:metadata?.group,path:coursePath(b,c),cce:c.cce,ese:c.ese};}));
 return {version:1,coverageNote:'Theory catalog only. FE subject combinations depend on your college. Tracking metadata covers verified published courses. SE Cyber Security remains reference-only because existing course content conflicts with its current official PDF; SE Automobile is a draft. This catalog is not a complete university curriculum: labs, open electives and some theory courses are not yet represented.',courses:[...fe,...later]};
}

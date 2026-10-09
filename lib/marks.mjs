export const gradeFor = pct => pct>=90?{letter:'O',gp:10}:pct>=75?{letter:'A+',gp:9}:pct>=60?{letter:'A',gp:8}:pct>=55?{letter:'B+',gp:7}:pct>=50?{letter:'B',gp:6}:pct>=45?{letter:'C',gp:5}:pct>=40?{letter:'D',gp:4}:{letter:'F',gp:0};
export function summarizeMarks(subjects,marks){
 let points=0,gradedCredits=0,possibleCredits=0,completedSubjects=0,startedSubjects=0,completeHeads=0,totalHeads=0;
 for(const s of subjects){const m=marks[s.id]||{};const tc=s.theoryCredits??s.credits,tw=s.termWorkCredits??0;possibleCredits+=tc+tw;totalHeads+=1+(tw>0?1:0);
 const theory=m.inSem!==undefined&&m.endSem!==undefined;const work=tw===0||m.termWork!==undefined;
 if(Object.values(m).some(v=>v!==undefined))startedSubjects++;
 if(theory){points+=gradeFor(m.inSem+m.endSem).gp*tc;gradedCredits+=tc;completeHeads++;}
 if(tw>0&&m.termWork!==undefined){points+=gradeFor(m.termWork/25*100).gp*tw;gradedCredits+=tw;completeHeads++;}
 if(theory&&work)completedSubjects++;
 }
 return {value:gradedCredits?(points/gradedCredits).toFixed(2):null,gradedCredits,possibleCredits,completedSubjects,startedSubjects,completeHeads,totalHeads,isComplete:subjects.length>0&&completedSubjects===subjects.length};
}

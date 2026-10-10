import {learningNodes,learningSummary}from'./learning.mjs';import {localDay}from'./dates.mjs';
export function evidenceState(node,study,today=localDay()){
 const s=study.topics[node.id]||{},attempts=(study.attempts||[]).filter(a=>a.topicId===node.id);
 if(!attempts.length)return{key:'new',label:'No attempt',reason:s.status==='done'?'Covered by you, but no practice attempt recorded.':'No practice attempt recorded.',next:'Choose a concrete task and make an attempt.',attempts};
 if(s.nextReview&&s.nextReview<=today)return{key:'returning',label:'Return due',reason:`Your chosen return date is ${s.nextReview}.`,next:'Try a fresh task before looking at the reference.',attempts};
 const last=attempts.at(-1);
 if(last.outcome==='solo')return{key:'unaided',label:'Without help',reason:'Latest outcome: without help, judged by you. Not proof of mastery.',next:s.nextReview?`Return on ${s.nextReview} to test it again.`:'Choose a later return if you want to test retention.',attempts};
 return{key:'attempted',label:last.outcome==='hint'?'Needed a hint':'Try again',reason:'Latest attempt exposed a gap, judged by you.',next:'Use a worked example to find the missing step, then try another task.',attempts};
}
export function progressCourses(courses,study,today=localDay()){return courses.map(course=>{const nodes=learningNodes(course).map(n=>({...n,evidence:evidenceState(n,study,today)}));return{course,nodes,summary:{...learningSummary(nodes,study,today),due:nodes.filter(n=>n.evidence.key==='returning').length}};});}

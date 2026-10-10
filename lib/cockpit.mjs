import {learningNodes,learningSummary} from './learning.mjs';
import {localDay} from './dates.mjs';
export function cockpit(courses,study,today=localDay()){
 const nodes=courses.flatMap(c=>learningNodes(c).map(n=>({...n,course:c})));
 const known=new Set(nodes.map(n=>n.id));
 const due=nodes.filter(n=>study.topics[n.id]?.lastAttempt&&study.topics[n.id]?.nextReview&&study.topics[n.id].nextReview<=today).sort((a,b)=>study.topics[a.id].nextReview.localeCompare(study.topics[b.id].nextReview));
 const planned=(study.plan||[]).filter(x=>x.status==='planned'&&x.date<=today&&known.has(x.topicId));
 const plannedNode=planned.length?nodes.find(n=>n.id===planned[0].topicId):null;
 const started=nodes.find(n=>study.topics[n.id]?.status==='studying');
 const uncovered=nodes.find(n=>study.topics[n.id]?.status!=='done');
 const untried=nodes.find(n=>!study.topics[n.id]?.lastAttempt);
 const next=due[0]||plannedNode||started||uncovered||untried||null;
 const reason=due.length?'A recorded attempt is due again.':plannedNode?'You put this on your plan.':started?'You marked this topic Studying.':uncovered?'First uncovered topic in your course order.':untried?'Covered by you, but no attempt recorded.':'No outstanding topic in this queue.';
 const history=(study.attempts||[]).filter(a=>known.has(a.topicId)).slice().reverse().slice(0,4).map(a=>({...a,node:nodes.find(n=>n.id===a.topicId)}));
 return {nodes,due,next,reason,history,summary:learningSummary(nodes,study,today),shelves:courses.map(course=>({course,summary:learningSummary(learningNodes(course),study,today)}))};
}

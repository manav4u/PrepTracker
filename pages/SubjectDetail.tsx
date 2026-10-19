import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSubjectDetail } from '../components/subject/useSubjectDetail';
import ConceptA from '../components/subject/ConceptA';
import ConceptB from '../components/subject/ConceptB';
import ConceptC from '../components/subject/ConceptC';

export type SubjectConcept = 'a' | 'b' | 'c';

export const conceptFromSearch = (search: string): SubjectConcept => {
  const c = new URLSearchParams(search).get('c');
  return c === 'b' || c === 'c' ? c : 'a';
};

const SubjectDetail: React.FC = () => {
  const state = useSubjectDetail();
  const [params] = useSearchParams();
  const concept = conceptFromSearch(params.toString() ? `?${params.toString()}` : '');

  if (!state.subject) {
    return state.subjectsReady
      ? <div className="p-20 text-center text-white font-display">Subject not found</div>
      : null;
  }

  if (concept === 'b') return <ConceptB s={state} />;
  if (concept === 'c') return <ConceptC s={state} />;
  return <ConceptA s={state} />;
};

export default SubjectDetail;

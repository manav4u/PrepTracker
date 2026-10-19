import React from 'react';
import { useSubjectDetail } from '../components/subject/useSubjectDetail';
import ConceptB from '../components/subject/ConceptB';

const SubjectDetail: React.FC = () => {
  const state = useSubjectDetail();
  if (!state.subject) {
    return state.subjectsReady
      ? <div className="p-20 text-center text-white font-display">Subject not found</div>
      : null;
  }
  return <ConceptB s={state} />;
};

export default SubjectDetail;

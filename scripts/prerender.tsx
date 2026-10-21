// Static library pages prerendered at build time so crawlers get real content
// and the old /syllabus/* URLs keep working. The revamp landing is intentionally
// not prerendered here (client-rendered SPA shell, unchanged).
export { renderSubjectPage } from './syllabusPage';
export { SUBJECT_PAGES } from './pages';
export { INFO_PAGES, renderInfoPage } from './infoPages';
export { renderSeCourse, renderSeBranch, coursePath } from './sePage';
export { SE_BRANCHES } from './seBranches';

export { readingCss, readingChrome, readingScript, consentCss, consentScript } from './readingEdition';
export { renderPrivacyPage } from './privacyPage';
export { renderSyllabusHub } from './hubPage';

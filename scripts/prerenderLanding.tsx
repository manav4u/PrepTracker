// SSR entry for the build-time landing prerender. Renders LandingPage inside
// the same providers the client uses. App's lazy() boundaries can't resolve
// inside renderToString, so the route element is rendered directly; the
// wrapper components (ErrorBoundary, Suspense, Routes) emit no DOM, so the
// markup matches what the client hydrates.
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import ErrorBoundary from '../components/ErrorBoundary';
import { DataProvider } from '../context/DataContext';
import { SubjectsProvider } from '../context/SubjectsContext';

export function renderLanding(): string {
  return renderToString(
    <StaticRouter location="/">
      <DataProvider>
        <SubjectsProvider>
          <ErrorBoundary scope="app">
            {/* Matches the client's Suspense boundary in App so the SSR
                markup carries the same boundary markers for hydration. */}
            <React.Suspense fallback={<div className="min-h-screen bg-[#030303]" />}>
              <LandingPage />
            </React.Suspense>
          </ErrorBoundary>
        </SubjectsProvider>
      </DataProvider>
    </StaticRouter>,
  );
}
export { landingToMarkdown } from './htmlToMarkdown';

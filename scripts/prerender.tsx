import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

// Renders the public landing page to static HTML at build time so crawlers
// get real content instead of an empty #root. The client bundle replaces it on load.
export function renderLanding(): string {
  return renderToString(
    <MemoryRouter initialEntries={['/']}>
      <LandingPage />
    </MemoryRouter>
  );
}

export { renderM1Page, M1_PATH } from './syllabusPage';

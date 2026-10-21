
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initAnalytics } from './lib/analytics';
import { DataProvider } from './context/DataContext';
import { SubjectsProvider } from './context/SubjectsContext';

initAnalytics();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const appTree = (
  <React.StrictMode>
    <BrowserRouter basename={(import.meta as any).env?.BASE_URL || '/'}>
      <DataProvider>
      <SubjectsProvider>
        <App />
      </SubjectsProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  // The landing was prerendered at build time: hydrate it. Pre-import the
  // lazily loaded LandingPage so it resolves synchronously during hydration.
  import('./pages/LandingPage').then(() => {
    ReactDOM.hydrateRoot(rootElement, appTree);
  });
} else {
  ReactDOM.createRoot(rootElement).render(appTree);
}

if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${(import.meta as any).env?.BASE_URL || '/'}sw.js`).catch(() => {});
  });
}

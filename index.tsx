
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { DataProvider } from './context/DataContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <DataProvider>
        <App />
      </DataProvider>
    </HashRouter>
  </React.StrictMode>
);

import './atlas.css';
import './edition-care.css';
import './edition-motion.css';
import './edition-nav.css';
import './front-cover.css';
import './library.css';
import './link-cabinet.css';
import './map.css';
import './marks-ledger.css';
import './materials.css';
import './notebook.css';
import './paper-desk.css';
import './progress-map.css';
import './quiet-progress.css';
import './quiet-study.css';
import './recall-box.css';
import './studio.css';
import './task-pins.css';
import './week-folio.css';
import './site-palette.css';

import "./cycle-three.css";

import "./edition-type.css";
import './desk-sketch.css';

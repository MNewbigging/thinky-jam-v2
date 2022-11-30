import './index.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { AppState } from './AppState';

const appState = new AppState();

let container: HTMLElement = null;

document.addEventListener('DOMContentLoaded', (event) => {
  if (!container) {
    container = document.getElementById('app-root') as HTMLElement;
    const root = createRoot(container);
    root.render(<App appState={appState} />);
  }
});

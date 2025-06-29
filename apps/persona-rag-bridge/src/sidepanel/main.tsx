import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import { SidepanelView } from './SidepanelView';
import '../styles/global.css';

// Render sidepanel app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider>
        <SidepanelView />
      </Provider>
    </React.StrictMode>
  );
}

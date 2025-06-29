import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import SidepanelView from './components/SidepanelView';
import './styles/global.css';

// Initialize extension when sidepanel opens
const initializeSidepanel = async () => {
  try {
    console.log('Initializing OWU+ Sidepanel...');
    // TODO: Initialize services
    console.log('OWU+ Sidepanel initialized successfully');
  } catch (error) {
    console.error('Failed to initialize sidepanel:', error);
  }
};

// Initialize when sidepanel loads
initializeSidepanel();

// Render sidepanel
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
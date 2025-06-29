import React from "react";import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import { PopupDashboard } from './components/PopupDashboard';
import './styles/global.css';

// Initialize extension when popup opens
const initializeExtension = async () => {
  try {
    console.log('Initializing OWU+ Extension...');
    // TODO: Initialize services
    console.log('OWU+ Extension initialized successfully');
  } catch (error) {
    console.error('Failed to initialize extension:', error);
  }
};

// Initialize when popup loads
initializeExtension();

// Render popup
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider>
        <PopupDashboard />
      </Provider>
    </React.StrictMode>
  );
}

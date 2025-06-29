import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import { ExtensionPopup } from './components/ExtensionPopup';
import './styles/globals.css';

// Initialize extension when popup opens
const initializeExtension = async () => {
  try {
    // Initialize services
    console.log('Initializing OWU+ Extension...');
    
    // TODO: Initialize Reticulum client
    // TODO: Initialize KLF client
    // TODO: Initialize service connectors
    
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
        <ExtensionPopup />
      </Provider>
    </React.StrictMode>
  );
} 
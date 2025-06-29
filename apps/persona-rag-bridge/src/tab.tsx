import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import { TabView } from './tab/TabView';
import './styles/global.css';

// Initialize extension when tab opens
const initializeTab = async () => {
  try {
    console.log('Initializing OWU+ Tab...');
    // TODO: Initialize services
    console.log('OWU+ Tab initialized successfully');
  } catch (error) {
    console.error('Failed to initialize tab:', error);
  }
};

// Initialize when tab loads
initializeTab();

// Render tab
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider>
        <TabView initialView="chat" />
      </Provider>
    </React.StrictMode>
  );
} 
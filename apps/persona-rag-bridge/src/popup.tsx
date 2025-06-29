import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSetAtom } from 'jotai';
import { ExtensionPopup } from './components/ExtensionPopup';
import { initializeThemeAtom, systemThemeListenerAtom } from './modules/state/themeAtoms';
import './styles/globals.css';

// Theme initializer component
const ThemeInitializer: React.FC = () => {
  const initializeTheme = useSetAtom(initializeThemeAtom);
  const setupSystemThemeListener = useSetAtom(systemThemeListenerAtom);

  useEffect(() => {
    // Initialize theme
    initializeTheme();
    
    // Setup system theme listener
    const cleanup = setupSystemThemeListener();
    
    return cleanup;
  }, [initializeTheme, setupSystemThemeListener]);

  return null;
};

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
        <ThemeInitializer />
        <ExtensionPopup />
      </Provider>
    </React.StrictMode>
  );
} 
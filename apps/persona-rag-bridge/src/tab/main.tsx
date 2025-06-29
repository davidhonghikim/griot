import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import { TabView } from './TabView';
import '../styles/global.css';

const TabApp: React.FC = () => {
  const [initialView, setInitialView] = useState<string>('chat');

  useEffect(() => {
    // Get the initial view from storage
    chrome.storage.local.get(['initialView'], (result) => {
      if (result.initialView) {
        setInitialView(result.initialView);
      }
    });
  }, []);

  return <TabView initialView={initialView} />;
};

// Render tab app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider>
        <TabApp />
      </Provider>
    </React.StrictMode>
  );
}

/// <reference path="./types/chrome.d.ts" />
/**
 * Background Service Worker
 * 
 * Handles extension lifecycle, message routing, and background tasks.
 */

console.log('OWU+ Extension background service starting...');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension starting up...');
});

// Handle messages from popup, content scripts, etc.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message, 'from:', sender);
  
  switch (message.action) {
    case 'getStatus':
      sendResponse({ status: 'ok', timestamp: Date.now() });
      return true;
      
    case 'openTab':
      const { serviceId, view } = message.payload;
      const tabUrl = chrome.runtime.getURL('tab.html');
      
      // Check if a tab is already open
      chrome.tabs.query({ url: tabUrl }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          // Tab exists, focus it and send it the new state
          const tabId = tabs[0].id;
          chrome.tabs.update(tabId, { active: true });
          if (tabs[0].windowId) {
            chrome.windows.update(tabs[0].windowId, { focused: true });
          }
          // Send a message to the existing tab to update its state
          chrome.tabs.sendMessage(tabId, {
            action: 'setState',
            payload: { serviceId, view },
          });
        } else {
          // No tab exists, create a new one with query params
          const params = new URLSearchParams();
          if (serviceId) {
            params.set('serviceId', serviceId);
          }
          if (view) {
            params.set('view', view);
          }
          const finalUrl = `${tabUrl}?${params.toString()}`;
          chrome.tabs.create({ url: finalUrl });
        }
      });
      return true;
      
    case 'openPanel':
      const { serviceId: panelServiceId, view: panelView } = message.payload;
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const currentTab = tabs[0];
        if (currentTab?.id) {
          try {
            await chrome.sidePanel.setOptions({
              tabId: currentTab.id,
              path: 'sidepanel.html',
              enabled: true
            });
            await chrome.sidePanel.open({ tabId: currentTab.id });
            
            // Send state to panel
            chrome.tabs.sendMessage(currentTab.id, {
              action: 'setPanelState',
              payload: { serviceId: panelServiceId, view: panelView },
            });
          } catch (error) {
            console.error('Failed to open panel:', error);
          }
        }
      });
      return true;
      
    case 'openVault':
      const vaultUrl = chrome.runtime.getURL('tab.html?view=vault');
      chrome.tabs.create({ url: vaultUrl });
      return true;
      
    default:
      console.warn('Unknown message action:', message.action);
  }
});

console.log('OWU+ Extension background service initialized'); 
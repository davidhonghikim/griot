/**
 * Background Service Worker
 * 
 * Handles extension lifecycle, message routing, and background tasks.
 */

import { getSection } from '../config/environment';

// Extension state
let isInitialized = false;

// Initialize extension
const initializeExtension = async () => {
  if (isInitialized) return;

  try {
    console.log('Initializing OWU+ Extension background service...');
    
    const config = getSection('extension');
    
    // Set up extension icon
    chrome.action.setIcon({
      path: {
        16: 'icons/icon-16.png',
        32: 'icons/icon-32.png',
        48: 'icons/icon-48.png',
        128: 'icons/icon-128.png',
      },
    });

    // Set up extension badge
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' });

    // Initialize services
    await initializeServices();
    
    isInitialized = true;
    console.log('OWU+ Extension background service initialized');
  } catch (error) {
    console.error('Failed to initialize background service:', error);
  }
};

// Initialize services
const initializeServices = async () => {
  // TODO: Initialize Reticulum client
  // TODO: Initialize KLF client
  // TODO: Initialize service connectors
  // TODO: Set up periodic health checks
  // TODO: Set up notification handlers
};

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // First time installation
    chrome.tabs.create({
      url: 'https://github.com/your-repo/owu-plus#readme',
    });
  }
  
  initializeExtension();
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension starting up...');
  initializeExtension();
});

// Handle messages from popup, content scripts, etc.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message, 'from:', sender);
  
  switch (message.action) {
    case 'openPanel':
      openPanel();
      break;
      
    case 'openVault':
      openVault();
      break;
      
    case 'getStatus':
      getStatus().then(sendResponse);
      return true; // Keep message channel open for async response
      
    case 'sendMessage':
      sendReticulumMessage(message.data).then(sendResponse);
      return true;
      
    case 'executeWorkflow':
      executeWorkflow(message.data).then(sendResponse);
      return true;
      
    default:
      console.warn('Unknown message action:', message.action);
  }
});

// Open side panel
const openPanel = () => {
  chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
};

// Open vault
const openVault = () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('vault.html'),
  });
};

// Get extension status
const getStatus = async () => {
  // TODO: Return actual status from services
  return {
    reticulum: { connected: false, nodes: 0 },
    klf: { connected: false, services: 0 },
    services: { active: 0, total: 0 },
    timestamp: Date.now(),
  };
};

// Send message through Reticulum
const sendReticulumMessage = async (data: any) => {
  // TODO: Implement Reticulum message sending
  console.log('Sending Reticulum message:', data);
  return { success: true, messageId: crypto.randomUUID() };
};

// Execute KLF workflow
const executeWorkflow = async (data: any) => {
  // TODO: Implement KLF workflow execution
  console.log('Executing workflow:', data);
  return { success: true, executionId: crypto.randomUUID() };
};

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // TODO: Inject content scripts if needed
    // TODO: Update extension state based on page
  }
});

// Handle tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  // TODO: Update extension state based on active tab
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('Storage changed:', namespace, changes);
  
  // TODO: Handle configuration changes
  // TODO: Update service connections
  // TODO: Refresh extension state
});

// Periodic health checks
setInterval(async () => {
  try {
    // TODO: Check service health
    // TODO: Update extension badge
    // TODO: Send notifications if needed
  } catch (error) {
    console.error('Health check failed:', error);
  }
}, 30000); // Every 30 seconds

// Handle extension shutdown
chrome.runtime.onSuspend.addListener(() => {
  console.log('Extension suspending...');
  // TODO: Cleanup resources
  // TODO: Save state
});

// Initialize on load
initializeExtension(); 
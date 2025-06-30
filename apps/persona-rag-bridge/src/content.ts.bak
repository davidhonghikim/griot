/// <reference path="./types/chrome.d.ts" />
/**
 * Content Script
 * 
 * Injected into web pages to provide OWU+ functionality.
 */

console.log('OWU+ Extension content script loaded');

// Initialize content script
const initializeContentScript = () => {
  // TODO: Set up page-specific functionality
  // TODO: Inject UI elements if needed
  // TODO: Listen for page events
};

// Handle messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  switch (message.action) {
    case 'getPageInfo':
      sendResponse({
        url: window.location.href,
        title: document.title,
        domain: window.location.hostname,
      });
      break;
      
    case 'injectUI':
      // TODO: Inject UI elements
      sendResponse({ success: true });
      break;
      
    default:
      console.warn('Unknown message action in content script:', message.action);
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
  initializeContentScript();
} 
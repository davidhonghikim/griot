/**
 * Application Configuration
 * 
 * This file contains the configuration for the PersonaRAG Bridge extension.
 * Network settings are configured for development with 192.168.1.180 as the default.
 */

export const config = {
  // --- Networking ---
  networking: {
    localIp: 'localhost',
    remoteIp: '192.168.1.180', // Default dev IP
    defaultTimeoutMs: 15000
  },

  // --- Service Defaults ---
  services: {
    defaultOllamaModel: 'llama3.2:3b',
    defaultOpenAiModel: 'gpt-4o',
    defaultOpenWebUIModel: 'llama3.2:3b',
    defaultPersonaRAGModel: 'llama3.2:3b',
    defaultVectorStoreModel: 'sentence-transformers/all-MiniLM-L6-v2'
  },

  // --- UI/UX Settings ---
  ui: {
    defaultTheme: 'dark',
    showCategoryHeaders: true,
    popupWidth: 640,
    popupHeight: 600
  },

  // --- Developer & Debugging ---
  developer: {
    logLevel: 'info',
    loadDefaultServices: true,
    featureFlags: {
      enableServiceDiscovery: true,
      enableHealthChecks: true
    }
  },

  // --- Logging ---
  logging: {
    enabled: true,
    level: 'info' // 'debug', 'info', 'warn', 'error', 'silent'
  }
};

export type Config = typeof config; 
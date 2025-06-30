/**
 * Application Configuration
 * 
 * This file contains the configuration for the PersonaRAG Bridge extension.
 * Flexible configuration that allows any service connections while maintaining local RAG/vector/db storage.
 */

export const config = {
  // --- Networking ---
  networking: {
    // Allow any IP/hostname for service connections
    allowedHosts: ['localhost', '127.0.0.1', '192.168.1.180', '0.0.0.0'],
    defaultTimeoutMs: 15000,
    // Allow dynamic service discovery
    enableServiceDiscovery: true
  },

  // --- Service Configuration ---
  services: {
    // Default models but allow any model to be used
    defaultModels: {
      ollama: 'llama3.2:3b',
      openai: 'gpt-4o',
      openwebui: 'llama3.2:3b',
      anthropic: 'claude-3-sonnet',
      local: 'llama3.2:3b'
    },
    // Allow any service type
    supportedTypes: ['ollama', 'openai', 'openwebui', 'anthropic', 'local', 'custom'],
    // Local storage always used for RAG/vector/db
    localStorage: {
      vectorStore: 'local',
      database: 'local',
      embeddings: 'local'
    }
  },

  // --- RAG & Vector Configuration ---
  rag: {
    // Always use local vector store and database
    vectorStore: {
      type: 'local',
      path: './data/vectors',
      model: 'sentence-transformers/all-MiniLM-L6-v2'
    },
    database: {
      type: 'local',
      path: './data/database'
    },
    embeddings: {
      type: 'local',
      model: 'sentence-transformers/all-MiniLM-L6-v2'
    }
  },

  // --- UI/UX Settings ---
  ui: {
    defaultTheme: 'dark',
    showCategoryHeaders: true,
    popupWidth: 640,
    popupHeight: 600,
    // Allow dynamic service configuration
    enableServiceConfig: true
  },

  // --- Developer & Debugging ---
  developer: {
    logLevel: 'info',
    loadDefaultServices: true,
    featureFlags: {
      enableServiceDiscovery: true,
      enableHealthChecks: true,
      allowAnyServiceConnection: true,
      flexibleModelSelection: true
    }
  },

  // --- Logging ---
  logging: {
    enabled: true,
    level: 'info' // 'debug', 'info', 'warn', 'error', 'silent'
  }
};

export type Config = typeof config; 
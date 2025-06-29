import { config } from "dotenv"; config();

// Environment configuration types
export interface KLFConfig {
  nodeId: string;
  discoveryUrl: string;
  orchestrationUrl: string;
  timeout: number;
  capabilities: string[];
}

export interface ReticulumConfig {
  nodeId: string;
  host: string;
  port: number;
  encryptionKey: string;
}

export interface AIServiceConfig {
  openaiApiKey: string;
  openwebuiUrl: string;
  openwebuiApiKey: string;
}

export interface ExtensionConfig {
  name: string;
  version: string;
  description: string;
}

// Configuration sections
const klfConfig: KLFConfig = {
  nodeId: process.env.KLF_NODE_ID || 'griot-node',
  discoveryUrl: process.env.KLF_DISCOVERY_URL || 'http://localhost:3001',
  orchestrationUrl: process.env.KLF_ORCHESTRATION_URL || 'http://localhost:3002',
  timeout: parseInt(process.env.KLF_TIMEOUT || '5000'),
  capabilities: ['persona-rag', 'vectorization', 'orchestration']
};

const reticulumConfig: ReticulumConfig = {
  nodeId: process.env.RETICULUM_NODE_ID || 'griot-node',
  host: process.env.RETICULUM_HOST || 'localhost',
  port: parseInt(process.env.RETICULUM_PORT || '3003'),
  encryptionKey: process.env.RETICULUM_ENCRYPTION_KEY || 'default-key'
};

const aiServiceConfig: AIServiceConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openwebuiUrl: process.env.OPENWEBUI_URL || 'http://192.168.1.180:3000',
  openwebuiApiKey: process.env.OPENWEBUI_API_KEY || ''
};

const extensionConfig: ExtensionConfig = {
  name: 'OWU Plus Extension',
  version: '1.0.0',
  description: 'Enhanced OpenWebUI integration with PersonaRAG capabilities'
};

// Configuration getter function
export function getSection<T>(section: string): T {
  switch (section) {
    case 'klf':
      return klfConfig as T;
    case 'reticulum':
      return reticulumConfig as T;
    case 'ai':
      return aiServiceConfig as T;
    case 'extension':
      return extensionConfig as T;
    default:
      throw new Error(`Unknown configuration section: ${section}`);
  }
}

// Export individual configs for direct access
export { klfConfig, reticulumConfig, aiServiceConfig, extensionConfig };

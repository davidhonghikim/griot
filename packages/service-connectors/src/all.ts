import type { ServiceDefinition } from './types';

// AI Models
import { openaiDefinition } from './ai-models/openai';
import { anthropicDefinition } from './ai-models/anthropic';
import { ollamaDefinition } from './ai-models/ollama';
import { openaiCompatibleDefinition } from './ai-models/openai-compatible';
import { llamaCppDefinition } from './ai-models/llama-cpp';
import { llmStudioDefinition } from './ai-models/llm-studio';
import { vllmDefinition } from './ai-models/vllm';
import { huggingfaceDefinition } from './ai-models/huggingface';
import { openWebUIDefinition } from './ai-models/open-webui';
import { civitaiDefinition } from './ai-models/civitai';

// Image Generation
import { comfyuiDefinition } from './image-generation/comfyui';
import { a1111Definition } from './image-generation/a1111';

// Storage
import { mongodbDefinition } from './storage/mongodb';
import { chromaDefinition } from './storage/chromadb';
import { qdrantDefinition } from './storage/qdrant';
import { milvusDefinition } from './storage/milvus';
import { dropboxDefinition } from './storage/dropbox';

// Automation
import { n8nDefinition } from './automation/n8n';

// Networking
import { reticulumDefinition } from './networking/reticulum';

// Organized by category
export const AI_MODELS: ServiceDefinition[] = [
  openaiDefinition,
  anthropicDefinition,
  ollamaDefinition,
  openaiCompatibleDefinition,
  llamaCppDefinition,
  llmStudioDefinition,
  vllmDefinition,
  huggingfaceDefinition,
  openWebUIDefinition,
  civitaiDefinition
];

export const IMAGE_GENERATION: ServiceDefinition[] = [
  comfyuiDefinition,
  a1111Definition
];

export const STORAGE: ServiceDefinition[] = [
  mongodbDefinition,
  chromaDefinition,
  qdrantDefinition,
  milvusDefinition,
  dropboxDefinition
];

export const AUTOMATION: ServiceDefinition[] = [
  n8nDefinition
];

export const NETWORKING: ServiceDefinition[] = [
  reticulumDefinition
];

// All connectors in a single array
export const ALL_CONNECTORS: ServiceDefinition[] = [
  ...AI_MODELS,
  ...IMAGE_GENERATION,
  ...STORAGE,
  ...AUTOMATION,
  ...NETWORKING
];

// Connector lookup by type
export const CONNECTOR_MAP = new Map<string, ServiceDefinition>(
  ALL_CONNECTORS.map(connector => [connector.type, connector])
);

// Category lookup
export const CONNECTORS_BY_CATEGORY = {
  'ai-models': AI_MODELS,
  'image-generation': IMAGE_GENERATION,
  'storage': STORAGE,
  'automation': AUTOMATION,
  'networking': NETWORKING
} as const;

// Helper functions
export function getConnectorByType(type: string): ServiceDefinition | undefined {
  return CONNECTOR_MAP.get(type);
}

export function getConnectorsByCategory(category: keyof typeof CONNECTORS_BY_CATEGORY): ServiceDefinition[] {
  return CONNECTORS_BY_CATEGORY[category] || [];
}

export function getAllCategories(): string[] {
  return Object.keys(CONNECTORS_BY_CATEGORY);
}

export function getConnectorCount(): number {
  return ALL_CONNECTORS.length;
}

export function getConnectorCountByCategory(): Record<string, number> {
  return Object.fromEntries(
    Object.entries(CONNECTORS_BY_CATEGORY).map(([category, connectors]) => [
      category,
      connectors.length
    ])
  );
} 
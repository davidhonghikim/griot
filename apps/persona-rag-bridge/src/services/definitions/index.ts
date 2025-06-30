import { personaRAGDefinition } from './persona-rag';
import { openWebUIDefinition } from './openwebui';
import { vectorStoreDefinition } from './vector-store';

export const allServiceDefinitions = [
  personaRAGDefinition,
  openWebUIDefinition,
  vectorStoreDefinition,
];

export { personaRAGDefinition, openWebUIDefinition, vectorStoreDefinition }; 
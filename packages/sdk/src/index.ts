/**
 * Starseed Node SDK
 * 
 * Type-safe client for interacting with the Starseed Node API.
 */

export { default as StarseedClient } from './StarseedClient.js';
export type {
  ApiError,
  ServiceInstance,
  ServiceStats,
  DatabaseStatus,
  Skill,
  Persona,
  Recipe,
  RecipeExecution,
  NodeInfo,
  HealthStatus,
  StarseedClientOptions
} from './StarseedClient.js';

// Re-export the client as default
export { default } from './StarseedClient.js'; 
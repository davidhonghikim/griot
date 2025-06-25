/**
 * Griot Framework - Main Entry Point
 * Complete AI agent framework for building sophisticated agent systems
 */

// Core protocol exports
export * from './core/protocol/types.js';

// Transport layer exports
export * from './core/transport/transport.js';
export * from './core/transport/websocket.js';

// Node system exports
export * from './core/node/base-node.js';
export * from './core/manager/node-manager.js';

// Built-in node types
export * from './nodes/http-api/http-api-node.js';

// Utilities
export * from './core/utils/logger.js';

// Examples
export * from './examples/basic-system.js';

// Version info
export const VERSION = '1.0.0';
export const PROTOCOL_VERSION = '1.0.0';

// Framework metadata
export const FRAMEWORK_INFO = {
  name: '@griot/framework',
  version: VERSION,
  protocolVersion: PROTOCOL_VERSION,
  description: 'Complete AI agent framework for building sophisticated agent systems',
  repository: 'https://github.com/griot-framework/griot-node',
  documentation: 'https://griot.dev/docs'
};

// Quick start functions
export { createBasicSystem } from './examples/basic-system.js';
export { createNodeManager } from './core/manager/node-manager.js';
export { createTransportManager } from './core/transport/transport.js';
export { createHttpApiNode } from './nodes/http-api/http-api-node.js'; 
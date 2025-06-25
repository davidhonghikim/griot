/**
 * Basic System Example
 * Demonstrates a complete working Griot system with HTTP API and echo nodes
 */

import { createNodeManager } from '../core/manager/node-manager.js';
import { createTransportManager } from '../core/transport/transport.js';
import { createHttpApiNode } from '../nodes/http-api/http-api-node.js';
import { createSimpleNode } from '../core/node/base-node.js';
import { MessageType, createTaskResponse } from '../core/protocol/types.js';
import { createLogger } from '../core/utils/logger.js';

const logger = createLogger('basic-system');

async function createBasicSystem() {
  logger.info('Creating basic Griot system...');

  // 1. Create transport manager (for future external connections)
  const transportManager = createTransportManager();

  // 2. Create node manager
  const nodeManager = createNodeManager(transportManager);

  // 3. Create an echo node that responds to task requests
  const echoNode = createSimpleNode('echo', {
    [MessageType.TASK_REQUEST]: async (message) => {
      logger.info(`Echo node received: ${JSON.stringify(message.payload)}`);
      
      const result = {
        echo: message.payload,
        processedAt: new Date().toISOString(),
        processingTime: Math.random() * 100
      };

      return createTaskResponse(
        'echo-node', 
        message.from, 
        result, 
        message
      );
    }
  });

  // Override the ID to be predictable
  (echoNode as any).id = 'echo-node';

  // 4. Create HTTP API node
  const httpNode = createHttpApiNode({
    type: 'http-api',
    port: 3000,
    cors: true,
    routes: [
      {
        method: 'POST',
        path: '/api/echo',
        targetNode: 'echo-node',
        messageType: MessageType.TASK_REQUEST,
        transformRequest: (body: any) => ({
          taskType: 'echo',
          parameters: body
        }),
        transformResponse: (response: any) => ({
          success: true,
          data: response.result,
          timestamp: new Date().toISOString()
        })
      },
      {
        method: 'GET',
        path: '/api/ping',
        targetNode: 'echo-node',
        messageType: MessageType.PING,
        transformResponse: (response: any) => ({
          status: 'pong',
          latency: Date.now() - response.originalTimestamp
        })
      }
    ]
  });

  // 5. Register nodes
  await nodeManager.registerNode(echoNode);
  await nodeManager.registerNode(httpNode);

  // 6. Start the system
  await nodeManager.startAll();

  logger.info('Basic system started successfully!');
  logger.info('Try these endpoints:');
  logger.info('  POST http://localhost:3000/api/echo');
  logger.info('  GET  http://localhost:3000/api/ping');
  logger.info('  GET  http://localhost:3000/health');
  logger.info('  GET  http://localhost:3000/api/nodes');

  // 7. Set up graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down system...');
    await nodeManager.shutdown();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return nodeManager;
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createBasicSystem().catch((error) => {
    logger.error('Failed to start basic system:', error);
    process.exit(1);
  });
}

export { createBasicSystem }; 
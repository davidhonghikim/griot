/**
 * Griot Node Server
 * Main entry point for running the Griot Node application
 */

import { createNodeManager } from '@griot/core';
import { createTransportManager } from '@griot/core';
import { createHttpApiNode } from '@griot/core';
import { createLogger } from '@griot/core';
// TODO: Import database connection functions

const logger = createLogger('server');

async function startServer() {
  logger.info('Starting Griot Node server...');

  // TODO: Initialize Database Connections
  // await connectToMongo();
  // etc.

  // 1. Create transport manager
  const transportManager = createTransportManager();

  // 2. Create node manager
  const nodeManager = createNodeManager(transportManager);

  // 3. Create HTTP API node
  const httpNode = createHttpApiNode({
    type: 'http-api',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 30437,
    cors: true,
    // No custom routes needed for now, the default /health is sufficient
  });

  // 4. Register nodes
  await nodeManager.registerNode(httpNode);

  // 5. Start the system
  await nodeManager.startAll();

  logger.info(`Griot Node server started successfully on port ${httpNode.getPort()}`);
  logger.info('Available endpoints:');
  logger.info(`  GET http://localhost:${httpNode.getPort()}/health`);
  logger.info(`  GET http://localhost:${httpNode.getPort()}/api/nodes`);

  // 6. Set up graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down server...');
    await nodeManager.shutdown();
    // TODO: Disconnect databases
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return nodeManager;
}

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
}); 
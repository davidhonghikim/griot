/**
 * HTTP API Node
 * Bridges HTTP requests to KLF message protocol
 */

import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BaseNode, NodeConfig } from '../../core/node/base-node.js';
import { 
  KLFMessage, 
  MessageType, 
  createMessage,
  createTaskRequest,
  Priority 
} from '../../core/protocol/types.js';
import { createLogger } from '../../core/utils/logger.js';

const logger = createLogger('http-api-node');

export interface HttpApiNodeConfig extends NodeConfig {
  type: 'http-api';
  port?: number;
  host?: string;
  cors?: boolean;
  authentication?: {
    enabled: boolean;
    apiKeys?: string[];
    jwt?: {
      secret: string;
      algorithm?: string;
    };
  };
  routes?: HttpRoute[];
}

export interface HttpRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  targetNode: string;
  messageType: MessageType;
  transformRequest?: (body: any, params: any, query: any) => any;
  transformResponse?: (response: any) => any;
}

export class HttpApiNode extends BaseNode {
  private server?: FastifyInstance;
  private readonly port: number;
  private readonly host: string;
  private readonly corsEnabled: boolean;
  private readonly routes: HttpRoute[];
  private messageRouter?: (message: KLFMessage) => Promise<KLFMessage | void>;

  constructor(config: HttpApiNodeConfig) {
    super({
      ...config,
      capabilities: [
        {
          name: 'http-api',
          version: '1.0.0',
          description: 'HTTP API to KLF message bridge',
          messageTypes: [MessageType.TASK_REQUEST, MessageType.TASK_RESPONSE],
          parameters: {
            port: config.port,
            host: config.host,
            routes: config.routes?.length || 0
          }
        },
        ...(config.capabilities || [])
      ]
    });

    this.port = config.port || 3000;
    this.host = config.host || '0.0.0.0';
    this.corsEnabled = config.cors || false;
    this.routes = config.routes || [];
  }

  async initialize(): Promise<void> {
    this.server = Fastify({
      logger: false // We use our own logger
    });

    // Enable CORS if requested
    if (this.corsEnabled) {
      await this.server.register(import('@fastify/cors'), {
        origin: true
      });
    }

    // Register routes
    this.registerRoutes();

    // Add health check endpoint
    this.server.get('/health', async (request, reply) => {
      return {
        status: 'healthy',
        node: this.getNodeInfo(),
        timestamp: new Date().toISOString()
      };
    });

    // Start the server
    await this.server.listen({ 
      port: this.port, 
      host: this.host 
    });

    logger.info(`HTTP API server listening on ${this.host}:${this.port}`);
  }

  async cleanup(): Promise<void> {
    if (this.server) {
      await this.server.close();
      logger.info('HTTP API server stopped');
    }
  }

  // Set the message router function
  setMessageRouter(router: (message: KLFMessage) => Promise<KLFMessage | void>): void {
    this.messageRouter = router;
  }

  private registerRoutes(): void {
    if (!this.server) return;

    // Register configured routes
    this.routes.forEach(route => {
      this.registerRoute(route);
    });

    // Register a generic endpoint for sending arbitrary messages
    this.server.post('/api/messages', async (request, reply) => {
      return this.handleGenericMessage(request, reply);
    });

    // Register endpoint for querying node information
    this.server.get('/api/nodes', async (request, reply) => {
      return this.handleNodeQuery(request, reply);
    });

    // Register endpoint for sending task requests
    this.server.post('/api/tasks', async (request, reply) => {
      return this.handleTaskRequest(request, reply);
    });
  }

  private registerRoute(route: HttpRoute): void {
    if (!this.server) return;

    const handler = async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { body, params, query } = request;
        
        // Transform request if transformer provided
        const payload = route.transformRequest 
          ? route.transformRequest(body, params, query)
          : { body, params, query };

        // Create KLF message
        const message = createMessage()
          .from(this.id)
          .to(route.targetNode)
          .type(route.messageType)
          .payload(payload)
          .build();

        // Route the message
        if (!this.messageRouter) {
          throw new Error('Message router not configured');
        }

        const response = await this.messageRouter(message);
        
        if (!response) {
          reply.code(202).send({ status: 'accepted', messageId: message.id });
          return;
        }

        // Transform response if transformer provided
        const responseData = route.transformResponse
          ? route.transformResponse(response.payload)
          : response.payload;

        reply.send(responseData);

      } catch (error) {
        logger.error(`Error handling ${route.method} ${route.path}:`, error);
        reply.code(500).send({ 
          error: 'Internal server error',
          message: (error as Error).message 
        });
      }
    };

    // Register the route with Fastify
    switch (route.method) {
      case 'GET':
        this.server.get(route.path, handler);
        break;
      case 'POST':
        this.server.post(route.path, handler);
        break;
      case 'PUT':
        this.server.put(route.path, handler);
        break;
      case 'DELETE':
        this.server.delete(route.path, handler);
        break;
      case 'PATCH':
        this.server.patch(route.path, handler);
        break;
    }

    logger.info(`Registered route: ${route.method} ${route.path} -> ${route.targetNode}`);
  }

  private async handleGenericMessage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { to, type, payload, priority = 'normal' } = request.body as any;

      if (!to || !type || !payload) {
        reply.code(400).send({ 
          error: 'Missing required fields: to, type, payload' 
        });
        return;
      }

      const message = createMessage()
        .from(this.id)
        .to(to)
        .type(type)
        .payload(payload)
        .priority(Priority[priority.toUpperCase() as keyof typeof Priority] || Priority.NORMAL)
        .build();

      if (!this.messageRouter) {
        throw new Error('Message router not configured');
      }

      const response = await this.messageRouter(message);

      if (response) {
        reply.send({
          messageId: message.id,
          response: response.payload
        });
      } else {
        reply.code(202).send({
          messageId: message.id,
          status: 'sent'
        });
      }

    } catch (error) {
      logger.error('Error handling generic message:', error);
      reply.code(500).send({ 
        error: 'Internal server error',
        message: (error as Error).message 
      });
    }
  }

  private async handleNodeQuery(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const targetNode = query.node || 'discovery';

      const message = createMessage()
        .from(this.id)
        .to(targetNode)
        .type(MessageType.NODE_DISCOVERY)
        .payload({ query })
        .build();

      if (!this.messageRouter) {
        throw new Error('Message router not configured');
      }

      const response = await this.messageRouter(message);

      if (response) {
        reply.send(response.payload);
      } else {
        reply.code(202).send({ status: 'query sent' });
      }

    } catch (error) {
      logger.error('Error handling node query:', error);
      reply.code(500).send({ 
        error: 'Internal server error',
        message: (error as Error).message 
      });
    }
  }

  private async handleTaskRequest(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { targetNode, taskType, parameters, priority = 'normal' } = request.body as any;

      if (!targetNode || !taskType) {
        reply.code(400).send({ 
          error: 'Missing required fields: targetNode, taskType' 
        });
        return;
      }

      const message = createTaskRequest(this.id, targetNode, taskType, parameters || {});
      message.metadata.priority = Priority[priority.toUpperCase() as keyof typeof Priority] || Priority.NORMAL;

      if (!this.messageRouter) {
        throw new Error('Message router not configured');
      }

      const response = await this.messageRouter(message);

      if (response) {
        reply.send({
          taskId: message.id,
          result: response.payload
        });
      } else {
        reply.code(202).send({
          taskId: message.id,
          status: 'submitted'
        });
      }

    } catch (error) {
      logger.error('Error handling task request:', error);
      reply.code(500).send({ 
        error: 'Internal server error',
        message: (error as Error).message 
      });
    }
  }

  getNodeInfo() {
    const info = super.getNodeInfo();
    return {
      ...info,
      endpoints: [`http://${this.host}:${this.port}`],
      metadata: {
        ...info.metadata,
        routes: this.routes.length,
        cors: this.corsEnabled
      }
    };
  }
}

// Factory function
export function createHttpApiNode(config: HttpApiNodeConfig): HttpApiNode {
  return new HttpApiNode(config);
}

// Example configurations
export const exampleConfigs = {
  basic: {
    type: 'http-api' as const,
    port: 3000,
    cors: true
  },

  withRoutes: {
    type: 'http-api' as const,
    port: 3000,
    cors: true,
    routes: [
      {
        method: 'POST' as const,
        path: '/api/chat',
        targetNode: 'llm-node',
        messageType: MessageType.TASK_REQUEST,
        transformRequest: (body: any) => ({
          taskType: 'chat',
          parameters: { message: body.message, model: body.model }
        }),
        transformResponse: (response: any) => ({
          reply: response.result,
          usage: response.usage
        })
      },
      {
        method: 'GET' as const,
        path: '/api/status/:nodeId',
        targetNode: 'status-manager',
        messageType: MessageType.NODE_STATUS,
        transformRequest: (body: any, params: any) => ({
          nodeId: params.nodeId
        })
      }
    ]
  }
}; 
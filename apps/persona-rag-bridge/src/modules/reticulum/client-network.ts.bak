#!/usr/bin/env tsx

/**
 * Reticulum Client Network Module
 * 
 * Handles network communication and packet routing functionality.
 */

import type {
  ReticulumMessage,
  ReticulumPacket,
  ReticulumConnection,
  ReticulumAddress,
  ReticulumEvent,
  ReticulumEventType
} from './types';
import type { ReticulumConfig } from '../../../config/environment';

export class ReticulumNetworkManager {
  private config: ReticulumConfig;
  private connections: Map<string, ReticulumConnection> = new Map();
  private eventListeners: Map<string, ((event: ReticulumEvent) => void)[]> = new Map();

  constructor(config: ReticulumConfig) {
    this.config = config;
  }

  /**
   * Send a message to a specific node
   */
  async sendMessage(nodeId: string, message: Omit<ReticulumMessage, 'id' | 'timestamp'>): Promise<string> {
    const connection = this.connections.get(nodeId);
    if (!connection) {
      throw new Error(`No connection to node ${nodeId}`);
    }

    const reticulumMessage: ReticulumMessage = {
      id: crypto.randomUUID(),
      ...message,
      timestamp: new Date(),
    };

    try {
      const packet: ReticulumPacket = {
        header: {
          version: 1,
          type: 0x01, // DATA
          source: this.config.nodeId,
          destination: nodeId,
          timestamp: Date.now(),
          ttl: 10,
          hops: 0,
          flags: {
            encrypted: false,
            compressed: false,
            fragmented: false,
            acknowledged: false,
            priority: 0
          },
          payloadLength: Buffer.from(JSON.stringify(reticulumMessage)).length
        },
        payload: Buffer.from(JSON.stringify(reticulumMessage)),
        signature: undefined
      };

      await this.sendPacket(packet);
      
      this.emit('message:sent', { 
        type: 'message:sent' as ReticulumEventType, 
        data: { message: reticulumMessage, nodeId },
        timestamp: new Date()
      });

      return reticulumMessage.id;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Broadcast message to all connected nodes
   */
  async broadcastMessage(message: Omit<ReticulumMessage, 'id' | 'timestamp'>): Promise<string[]> {
    const messageIds: string[] = [];

    for (const nodeId of this.connections.keys()) {
      try {
        const messageId = await this.sendMessage(nodeId, message);
        messageIds.push(messageId);
      } catch (error) {
        console.error(`Failed to send message to node ${nodeId}:`, error);
      }
    }

    return messageIds;
  }

  /**
   * Connect to a specific node
   */
  async connectToNode(nodeId: string, address: string): Promise<void> {
    const remoteAddress: ReticulumAddress = {
      host: address.split(':')[0],
      port: parseInt(address.split(':')[1]) || 8080,
      protocol: 'tcp',
      encrypted: false
    };

    const localAddress: ReticulumAddress = {
      host: 'localhost',
      port: 8080,
      protocol: 'tcp',
      encrypted: false
    };

    const connection: ReticulumConnection = {
      id: crypto.randomUUID(),
      remoteNode: nodeId,
      localAddress,
      remoteAddress,
      status: 'connecting',
      encrypted: false,
      establishedAt: new Date(),
      lastActivity: new Date(),
      statistics: {
        bytesSent: 0,
        bytesReceived: 0,
        packetsSent: 0,
        packetsReceived: 0,
        errors: 0,
        latency: 0
      }
    };

    try {
      await this.establishConnection(connection);
      this.connections.set(nodeId, connection);
      
      this.emit('node:connected', {
        type: 'node:connected' as ReticulumEventType,
        data: { nodeId, address },
        timestamp: new Date()
      });
    } catch (error) {
      console.error(`Failed to connect to node ${nodeId}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from a specific node
   */
  async disconnectFromNode(nodeId: string): Promise<void> {
    const connection = this.connections.get(nodeId);
    if (!connection) return;

    try {
      await this.closeConnection(connection);
      connection.status = 'disconnected';
      this.connections.delete(nodeId);
      
      this.emit('node:disconnected', {
        type: 'node:disconnected' as ReticulumEventType,
        data: { nodeId },
        timestamp: new Date()
      });
    } catch (error) {
      console.error(`Failed to disconnect from node ${nodeId}:`, error);
      throw error;
    }
  }

  /**
   * Get all connections
   */
  getConnections(): ReticulumConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Get connection by node ID
   */
  getConnection(nodeId: string): ReticulumConnection | undefined {
    return this.connections.get(nodeId);
  }

  /**
   * Check if connected to network
   */
  isConnected(): boolean {
    return this.connections.size > 0;
  }

  /**
   * Send packet to network
   */
  private async sendPacket(packet: ReticulumPacket): Promise<void> {
    // TODO: Implement actual packet sending
    console.log('Sending packet to:', packet.header.destination);
  }

  /**
   * Establish connection to node
   */
  private async establishConnection(connection: ReticulumConnection): Promise<void> {
    // TODO: Implement actual connection establishment
    connection.status = 'connected';
  }

  /**
   * Close connection to node
   */
  private async closeConnection(connection: ReticulumConnection): Promise<void> {
    // TODO: Implement actual connection closing
    connection.status = 'disconnected';
  }

  /**
   * Event handling
   */
  on(event: string, listener: (event: ReticulumEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  private emit(event: string, data: ReticulumEvent): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.connections.clear();
    this.eventListeners.clear();
  }
} 
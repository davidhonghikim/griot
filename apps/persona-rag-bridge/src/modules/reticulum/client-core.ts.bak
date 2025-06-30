#!/usr/bin/env tsx

/**
 * Reticulum Client - Main Entry Point
 * 
 * Orchestrates all Reticulum functionality using modular components.
 */

import type {
  ReticulumMessage,
  ReticulumNode,
  ReticulumEvent,
  ReticulumEventType
} from './types';
import { getSection } from '../../../config/environment';
import type { ReticulumConfig } from '../../../config/environment';
import { ReticulumNetworkManager } from './client-network';
import { ReticulumDiscoveryManager } from './client-discovery';

export class ReticulumClient {
  private config: ReticulumConfig;
  private networkManager: ReticulumNetworkManager;
  private discoveryManager: ReticulumDiscoveryManager;
  private eventListeners: Map<string, ((event: ReticulumEvent) => void)[]> = new Map();

  constructor() {
    this.config = getSection('reticulum');
    this.networkManager = new ReticulumNetworkManager(this.config);
    this.discoveryManager = new ReticulumDiscoveryManager(this.config);
    this.initialize();
  }

  private initialize(): void {
    // Initialize network connection
    this.connect();
    
    // Start node discovery
    this.discoveryManager.startDiscovery();
  }

  /**
   * Connect to Reticulum network
   */
  private async connect(): Promise<void> {
    try {
      // TODO: Implement connection to Reticulum network
      // - WebSocket connection
      // - Authentication
      // - Node registration
      
      this.emit('connected', { 
        type: 'connected' as ReticulumEventType, 
        data: { nodeId: this.config.nodeId }, 
        timestamp: new Date() 
      });
    } catch (error) {
      console.error('Failed to connect to Reticulum:', error);
      this.emit('error', { 
        type: 'error' as ReticulumEventType, 
        data: { error }, 
        timestamp: new Date() 
      });
    }
  }

  /**
   * Send a message to a specific node
   */
  async sendMessage(nodeId: string, message: Omit<ReticulumMessage, 'id' | 'timestamp'>): Promise<string> {
    return this.networkManager.sendMessage(nodeId, message);
  }

  /**
   * Broadcast message to all connected nodes
   */
  async broadcastMessage(message: Omit<ReticulumMessage, 'id' | 'timestamp'>): Promise<string[]> {
    return this.networkManager.broadcastMessage(message);
  }

  /**
   * Connect to a specific node
   */
  async connectToNode(nodeId: string, address: string): Promise<void> {
    return this.networkManager.connectToNode(nodeId, address);
  }

  /**
   * Disconnect from a specific node
   */
  async disconnectFromNode(nodeId: string): Promise<void> {
    return this.networkManager.disconnectFromNode(nodeId);
  }

  /**
   * Get all connections
   */
  getConnections() {
    return this.networkManager.getConnections();
  }

  /**
   * Get connection by node ID
   */
  getConnection(nodeId: string) {
    return this.networkManager.getConnection(nodeId);
  }

  /**
   * Get all nodes
   */
  getNodes(): ReticulumNode[] {
    return this.discoveryManager.getNodes();
  }

  /**
   * Get node by ID
   */
  getNode(nodeId: string): ReticulumNode | undefined {
    return this.discoveryManager.getNode(nodeId);
  }

  /**
   * Check if connected to network
   */
  isConnected(): boolean {
    return this.networkManager.isConnected();
  }

  /**
   * Event handling - forwards events from all managers
   */
  on(event: string, listener: (event: ReticulumEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);

    // Forward events from managers
    this.networkManager.on(event, listener);
    this.discoveryManager.on(event, listener);
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
    this.networkManager.destroy();
    this.discoveryManager.destroy();
    this.eventListeners.clear();
  }
}

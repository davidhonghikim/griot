#!/usr/bin/env tsx

/**
 * KLF (Kind Link Framework) Client - Main Entry Point
 * 
 * Orchestrates all KLF functionality using modular components.
 */

import type { 
  KLFService, 
  KLFOrchestrationRequest,
  KLFOrchestrationResponse
} from './types';
import { getSection } from '../../../config/environment';
import type { KLFConfig } from '../../../config/environment';
import { KLFConnectionManager } from './client-connection';
import { KLFDiscoveryManager } from './client-discovery';
import { KLFOrchestrationManager } from './client-orchestration';

export class KLFClient {
  private config: KLFConfig;
  private connectionManager: KLFConnectionManager;
  private discoveryManager: KLFDiscoveryManager;
  private orchestrationManager: KLFOrchestrationManager;
  private eventListeners: Map<string, ((event: any) => void)[]> = new Map();

  constructor() {
    this.config = getSection('klf');
    this.connectionManager = new KLFConnectionManager(this.config);
    this.discoveryManager = new KLFDiscoveryManager(this.config);
    this.orchestrationManager = new KLFOrchestrationManager();
    this.initialize();
  }

  private initialize(): void {
    // Initialize connection to KLF orchestrator
    this.connectionManager.connect();
    
    // Start service discovery
    this.discoveryManager.startDiscovery();
  }

  /**
   * Register a service with KLF
   */
  async registerService(service: Omit<KLFService, 'id' | 'registeredAt'>): Promise<string> {
    return this.discoveryManager.registerService(service);
  }

  /**
   * Send orchestration request
   */
  async orchestrate(request: KLFOrchestrationRequest): Promise<KLFOrchestrationResponse> {
    return this.orchestrationManager.orchestrate(request);
  }

  /**
   * Get all discovered services
   */
  getServices(): KLFService[] {
    return this.discoveryManager.getServices();
  }

  /**
   * Get service by ID
   */
  getService(serviceId: string): KLFService | undefined {
    return this.discoveryManager.getService(serviceId);
  }

  /**
   * Check if connected to orchestrator
   */
  isConnected(): boolean {
    return this.connectionManager.isConnectedToOrchestrator();
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; timestamp: Date } {
    return this.connectionManager.getConnectionStatus();
  }

  /**
   * Event handling - forwards events from all managers
   */
  on(event: string, listener: (event: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);

    // Forward events from managers
    this.connectionManager.on(event, listener);
    this.discoveryManager.on(event, listener);
    this.orchestrationManager.on(event, listener);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.connectionManager.destroy();
    this.discoveryManager.destroy();
    this.orchestrationManager.destroy();
    this.eventListeners.clear();
  }
}


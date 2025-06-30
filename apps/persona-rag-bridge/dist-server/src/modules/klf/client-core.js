#!/usr/bin/env tsx
"use strict";
/**
 * KLF (Kind Link Framework) Client - Main Entry Point
 *
 * Orchestrates all KLF functionality using modular components.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KLFClient = void 0;
const environment_1 = require("../../../config/environment");
const client_connection_1 = require("./client-connection");
const client_discovery_1 = require("./client-discovery");
const client_orchestration_1 = require("./client-orchestration");
class KLFClient {
    constructor() {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "connectionManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "discoveryManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "orchestrationManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eventListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.config = (0, environment_1.getSection)('klf');
        this.connectionManager = new client_connection_1.KLFConnectionManager(this.config);
        this.discoveryManager = new client_discovery_1.KLFDiscoveryManager(this.config);
        this.orchestrationManager = new client_orchestration_1.KLFOrchestrationManager();
        this.initialize();
    }
    initialize() {
        // Initialize connection to KLF orchestrator
        this.connectionManager.connect();
        // Start service discovery
        this.discoveryManager.startDiscovery();
    }
    /**
     * Register a service with KLF
     */
    async registerService(service) {
        return this.discoveryManager.registerService(service);
    }
    /**
     * Send orchestration request
     */
    async orchestrate(request) {
        return this.orchestrationManager.orchestrate(request);
    }
    /**
     * Get all discovered services
     */
    getServices() {
        return this.discoveryManager.getServices();
    }
    /**
     * Get service by ID
     */
    getService(serviceId) {
        return this.discoveryManager.getService(serviceId);
    }
    /**
     * Check if connected to orchestrator
     */
    isConnected() {
        return this.connectionManager.isConnectedToOrchestrator();
    }
    /**
     * Get connection status
     */
    getConnectionStatus() {
        return this.connectionManager.getConnectionStatus();
    }
    /**
     * Event handling - forwards events from all managers
     */
    on(event, listener) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(listener);
        // Forward events from managers
        this.connectionManager.on(event, listener);
        this.discoveryManager.on(event, listener);
        this.orchestrationManager.on(event, listener);
    }
    /**
     * Cleanup
     */
    destroy() {
        this.connectionManager.destroy();
        this.discoveryManager.destroy();
        this.orchestrationManager.destroy();
        this.eventListeners.clear();
    }
}
exports.KLFClient = KLFClient;

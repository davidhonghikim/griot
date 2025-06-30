#!/usr/bin/env tsx
"use strict";
/**
 * Reticulum Client - Main Entry Point
 *
 * Orchestrates all Reticulum functionality using modular components.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReticulumClient = void 0;
const environment_1 = require("../../../config/environment");
const client_network_1 = require("./client-network");
const client_discovery_1 = require("./client-discovery");
class ReticulumClient {
    constructor() {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "networkManager", {
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
        Object.defineProperty(this, "eventListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.config = (0, environment_1.getSection)('reticulum');
        this.networkManager = new client_network_1.ReticulumNetworkManager(this.config);
        this.discoveryManager = new client_discovery_1.ReticulumDiscoveryManager(this.config);
        this.initialize();
    }
    initialize() {
        // Initialize network connection
        this.connect();
        // Start node discovery
        this.discoveryManager.startDiscovery();
    }
    /**
     * Connect to Reticulum network
     */
    async connect() {
        try {
            // TODO: Implement connection to Reticulum network
            // - WebSocket connection
            // - Authentication
            // - Node registration
            this.emit('connected', {
                type: 'connected',
                data: { nodeId: this.config.nodeId },
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('Failed to connect to Reticulum:', error);
            this.emit('error', {
                type: 'error',
                data: { error },
                timestamp: new Date()
            });
        }
    }
    /**
     * Send a message to a specific node
     */
    async sendMessage(nodeId, message) {
        return this.networkManager.sendMessage(nodeId, message);
    }
    /**
     * Broadcast message to all connected nodes
     */
    async broadcastMessage(message) {
        return this.networkManager.broadcastMessage(message);
    }
    /**
     * Connect to a specific node
     */
    async connectToNode(nodeId, address) {
        return this.networkManager.connectToNode(nodeId, address);
    }
    /**
     * Disconnect from a specific node
     */
    async disconnectFromNode(nodeId) {
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
    getConnection(nodeId) {
        return this.networkManager.getConnection(nodeId);
    }
    /**
     * Get all nodes
     */
    getNodes() {
        return this.discoveryManager.getNodes();
    }
    /**
     * Get node by ID
     */
    getNode(nodeId) {
        return this.discoveryManager.getNode(nodeId);
    }
    /**
     * Check if connected to network
     */
    isConnected() {
        return this.networkManager.isConnected();
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
        this.networkManager.on(event, listener);
        this.discoveryManager.on(event, listener);
    }
    emit(event, data) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(listener => listener(data));
        }
    }
    /**
     * Cleanup
     */
    destroy() {
        this.networkManager.destroy();
        this.discoveryManager.destroy();
        this.eventListeners.clear();
    }
}
exports.ReticulumClient = ReticulumClient;

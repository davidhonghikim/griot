"use strict";
/**
 * Base Service Connector
 *
 * Provides a unified interface for connecting to various AI services
 * with health monitoring, configuration management, and error handling.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceConnector = void 0;
const environment_1 = require("../../config/environment");
class ServiceConnector {
    constructor(serviceId, serviceType, baseUrl) {
        Object.defineProperty(this, "serviceId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: serviceId
        });
        Object.defineProperty(this, "serviceType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: serviceType
        });
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: baseUrl
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "health", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "connection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "reconnectAttempts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "maxReconnectAttempts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(this, "reconnectDelay", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5000
        });
        this.config = (0, environment_1.getSection)('aiServices');
        this.health = this.initializeHealth();
        this.connection = this.initializeConnection();
    }
    initializeHealth() {
        return {
            status: 'unhealthy',
            responseTime: 0,
            lastCheck: new Date(),
            metrics: {
                uptime: 0,
                requests: 0,
                errors: 0,
                latency: 0,
                throughput: 0,
            },
        };
    }
    initializeConnection() {
        return {
            id: crypto.randomUUID(),
            serviceId: this.serviceId,
            status: 'disconnected',
            establishedAt: new Date(),
            lastActivity: new Date(),
            config: {},
        };
    }
    /**
     * Connect to the service
     */
    async connect() {
        try {
            this.connection.status = 'connected';
            this.connection.establishedAt = new Date();
            this.connection.lastActivity = new Date();
            // Perform health check
            await this.performHealthCheck();
            this.reconnectAttempts = 0;
            return true;
        }
        catch (error) {
            this.connection.status = 'error';
            this.health.status = 'unhealthy';
            this.health.errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.health.metrics.errors++;
            console.error(`Failed to connect to ${this.serviceType}:`, error);
            return false;
        }
    }
    /**
     * Disconnect from the service
     */
    async disconnect() {
        this.connection.status = 'disconnected';
        this.health.status = 'unhealthy';
        // Cleanup any resources
        await this.cleanup();
    }
    /**
     * Perform health check
     */
    async performHealthCheck() {
        const startTime = Date.now();
        try {
            await this.checkHealth();
            const responseTime = Date.now() - startTime;
            this.health.responseTime = responseTime;
            this.health.lastCheck = new Date();
            this.health.status = 'healthy';
            this.health.metrics.requests++;
            this.health.metrics.latency = responseTime;
            this.connection.lastActivity = new Date();
        }
        catch (error) {
            this.health.status = 'unhealthy';
            this.health.errorMessage = error instanceof Error ? error.message : 'Health check failed';
            this.health.metrics.errors++;
            // Attempt reconnection if disconnected
            if (this.connection.status === 'disconnected' && this.reconnectAttempts < this.maxReconnectAttempts) {
                await this.attemptReconnect();
            }
        }
        return this.health;
    }
    /**
     * Attempt to reconnect
     */
    async attemptReconnect() {
        this.reconnectAttempts++;
        setTimeout(async () => {
            console.log(`Attempting to reconnect to ${this.serviceType} (attempt ${this.reconnectAttempts})`);
            const success = await this.connect();
            if (!success && this.reconnectAttempts < this.maxReconnectAttempts) {
                await this.attemptReconnect();
            }
        }, this.reconnectDelay * this.reconnectAttempts);
    }
    /**
     * Get service health
     */
    getHealth() {
        return { ...this.health };
    }
    /**
     * Get connection status
     */
    getConnection() {
        return { ...this.connection };
    }
    /**
     * Check if service is healthy
     */
    isHealthy() {
        return this.health.status === 'healthy' && this.connection.status === 'connected';
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    /**
     * Make a request to the service
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const startTime = Date.now();
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            const responseTime = Date.now() - startTime;
            // Update metrics
            this.health.metrics.requests++;
            this.health.metrics.latency = responseTime;
            this.connection.lastActivity = new Date();
            return data;
        }
        catch (error) {
            this.health.metrics.errors++;
            this.health.status = 'unhealthy';
            this.health.errorMessage = error instanceof Error ? error.message : 'Request failed';
            throw error;
        }
    }
    /**
     * Get service information
     */
    getServiceInfo() {
        return {
            id: this.serviceId,
            type: this.serviceType,
            baseUrl: this.baseUrl,
            health: this.getHealth(),
            connection: this.getConnection(),
            config: this.config,
        };
    }
}
exports.ServiceConnector = ServiceConnector;

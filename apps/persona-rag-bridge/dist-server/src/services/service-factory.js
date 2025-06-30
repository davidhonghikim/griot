#!/usr/bin/env tsx
"use strict";
/**
 * Service Factory - Creates and manages service instances
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceFactory = void 0;
const persona_rag_service_1 = require("./persona-rag.service");
const openwebui_bridge_service_1 = require("./openwebui-bridge.service");
const vector_store_service_1 = require("./vector-store.service");
class ServiceFactory {
    constructor(_config) {
        Object.defineProperty(this, "services", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // Config will be used in future implementation
    }
    /**
     * Create PersonaRAG service
     */
    createPersonaRAGService() {
        if (this.services.has('personaRAG')) {
            return this.services.get('personaRAG');
        }
        const config = {
            enableVectorization: true,
            enableCaching: true,
            maxResults: 10,
            similarityThreshold: 0.7,
            cacheTTL: 300000 // 5 minutes
        };
        const service = new persona_rag_service_1.PersonaRAGService(config);
        this.services.set('personaRAG', service);
        return service;
    }
    /**
     * Create OpenWebUI bridge service
     */
    createOpenWebUIBridgeService(personaRAGService) {
        if (this.services.has('openWebUI')) {
            return this.services.get('openWebUI');
        }
        const config = {
            url: 'http://192.168.1.180:3000',
            apiKey: 'sk-dae28e6035904cecb2737fbc54768d16'
        };
        const service = new openwebui_bridge_service_1.OpenWebUIBridge(config, personaRAGService);
        this.services.set('openWebUI', service);
        return service;
    }
    /**
     * Create vector store service
     */
    createVectorStoreService() {
        if (this.services.has('vectorStore')) {
            return this.services.get('vectorStore');
        }
        const config = {
            type: 'weaviate',
            host: 'localhost',
            port: 8080,
            apiKey: 'test-key'
        };
        const mockVault = {
            getSecret: async (_key) => 'mock-secret',
            setSecret: async (_key, _value) => { },
            listSecrets: async () => [],
            deleteSecret: async (_key) => { },
            healthCheck: async () => ({ status: 'healthy' })
        };
        const service = new vector_store_service_1.VectorStoreService(mockVault, config);
        this.services.set('vectorStore', service);
        return service;
    }
    /**
     * Get all created services
     */
    getServices() {
        return new Map(this.services);
    }
    /**
     * Get service by name
     */
    getService(name) {
        return this.services.get(name);
    }
    /**
     * Cleanup all services
     */
    async cleanup() {
        for (const service of this.services.values()) {
            if (service.destroy) {
                await service.destroy();
            }
        }
        this.services.clear();
    }
}
exports.ServiceFactory = ServiceFactory;

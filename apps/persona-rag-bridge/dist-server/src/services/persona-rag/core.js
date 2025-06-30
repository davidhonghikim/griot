#!/usr/bin/env tsx
"use strict";
/**
 * PersonaRAG Service - Main Entry Point
 *
 * Orchestrates all PersonaRAG functionality using modular components.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaRAGService = void 0;
const persona_rag_service_1 = require("@griot/data/rag/persona_rag_service");
const persona_vectorization_service_1 = require("@griot/data/rag/persona_vectorization_service");
const query_manager_1 = require("./query-manager");
const cache_manager_1 = require("./cache-manager");
const crud_manager_1 = require("./crud-manager");
class PersonaRAGService {
    constructor(config) {
        Object.defineProperty(this, "coreService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "queryManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cacheManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "crudManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = config;
        this.queryManager = new query_manager_1.PersonaRAGQueryManager();
        this.cacheManager = new cache_manager_1.PersonaRAGCacheManager({
            enableCaching: config.enableCaching,
            cacheTTL: config.cacheTTL
        });
        this.crudManager = new crud_manager_1.PersonaRAGCRUDManager();
    }
    async initialize() {
        try {
            // Create mock services for now
            const mockVectorStore = {
                initialize: async () => { },
                addDocuments: async () => { },
                search: async () => ({ results: [], total: 0 }),
                deleteDocuments: async () => { },
                updateDocuments: async () => { },
                getDocument: async () => null,
                healthCheck: async () => ({ status: 'healthy' }),
                cleanup: async () => { }
            };
            const mockEmbeddingService = {
                embed: async () => new Float32Array(1536),
                embedBatch: async () => [],
                getDimensions: () => 1536,
                healthCheck: async () => ({ status: 'healthy' })
            };
            const vectorizationConfig = {
                vectorStore: mockVectorStore,
                embeddingService: mockEmbeddingService,
                personaLoader: async () => []
            };
            this.coreService = new persona_rag_service_1.PersonaRAGService(mockVectorStore, mockEmbeddingService, new persona_vectorization_service_1.PersonaVectorizationService(vectorizationConfig));
            console.log("PersonaRAGService initialized successfully");
        }
        catch (error) {
            console.error("Failed to initialize PersonaRAGService:", error);
            throw error;
        }
    }
    /**
     * Query personas based on request
     */
    async query(request) {
        try {
            if (!this.coreService) {
                throw new Error('PersonaRAGService not initialized');
            }
            // Check cache first
            const cached = this.cacheManager.getCachedResult(request);
            if (cached) {
                return cached;
            }
            // Process query
            const response = await this.queryManager.processQuery(request);
            // Cache the result
            this.cacheManager.cacheResult(request, response);
            return response;
        }
        catch (error) {
            console.error('PersonaRAG query failed:', error);
            return {
                success: false,
                query: request.query,
                processingTime: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Add a new persona
     */
    async addPersona(persona) {
        return this.crudManager.addPersona(persona);
    }
    /**
     * Update an existing persona
     */
    async updatePersona(personaId, updates) {
        return this.crudManager.updatePersona(personaId, updates);
    }
    /**
     * Delete a persona
     */
    async deletePersona(personaId) {
        return this.crudManager.deletePersona(personaId);
    }
    /**
     * Get all personas
     */
    async getAllPersonas() {
        return this.crudManager.getAllPersonas();
    }
    /**
     * Get service statistics
     */
    async getStats() {
        try {
            if (!this.coreService) {
                throw new Error('PersonaRAGService not initialized');
            }
            const cacheStats = this.cacheManager.getCacheStats();
            return {
                totalPersonas: 0,
                vectorizedPersonas: 0,
                cacheSize: cacheStats.size,
                vectorStoreStatus: 'unknown',
                lastUpdated: new Date()
            };
        }
        catch (error) {
            console.error('Failed to get stats:', error);
            throw error;
        }
    }
    /**
     * Health check
     */
    async healthCheck() {
        try {
            if (!this.coreService) {
                return false;
            }
            // TODO: Implement actual health check
            return true;
        }
        catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cacheManager.clearCache();
    }
    /**
     * Get configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        // Update cache manager config
        this.cacheManager.updateConfig({
            enableCaching: this.config.enableCaching,
            cacheTTL: this.config.cacheTTL
        });
    }
}
exports.PersonaRAGService = PersonaRAGService;

#!/usr/bin/env tsx
"use strict";
/**
 * PersonaRAG Cache Manager
 *
 * Handles caching functionality for query results and persona data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaRAGCacheManager = void 0;
class PersonaRAGCacheManager {
    constructor(config) {
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = config;
    }
    /**
     * Get cached result for request
     */
    getCachedResult(request) {
        if (!this.config.enableCaching) {
            return null;
        }
        const cacheKey = this.generateCacheKey(request);
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.config.cacheTTL) {
            return cached.data;
        }
        return null;
    }
    /**
     * Cache result for request
     */
    cacheResult(request, response) {
        if (!this.config.enableCaching) {
            return;
        }
        const cacheKey = this.generateCacheKey(request);
        this.cache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
        });
    }
    /**
     * Generate cache key for request
     */
    generateCacheKey(request) {
        return JSON.stringify({
            query: request.query,
            personaId: request.personaId,
            limit: request.limit,
            similarityThreshold: request.similarityThreshold,
            filters: request.filters
        });
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache size
     */
    getCacheSize() {
        return this.cache.size;
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            enabled: this.config.enableCaching,
            ttl: this.config.cacheTTL
        };
    }
    /**
     * Update cache configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
exports.PersonaRAGCacheManager = PersonaRAGCacheManager;

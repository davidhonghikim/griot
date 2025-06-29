#!/usr/bin/env tsx

/**
 * PersonaRAG Cache Manager
 * 
 * Handles caching functionality for query results and persona data.
 */

import type { PersonaRAGRequest, PersonaRAGResponse } from './core';

export class PersonaRAGCacheManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private config: { enableCaching: boolean; cacheTTL: number };

  constructor(config: { enableCaching: boolean; cacheTTL: number }) {
    this.config = config;
  }

  /**
   * Get cached result for request
   */
  getCachedResult(request: PersonaRAGRequest): PersonaRAGResponse | null {
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
  cacheResult(request: PersonaRAGRequest, response: PersonaRAGResponse): void {
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
  private generateCacheKey(request: PersonaRAGRequest): string {
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
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    enabled: boolean;
    ttl: number;
  } {
    return {
      size: this.cache.size,
      enabled: this.config.enableCaching,
      ttl: this.config.cacheTTL
    };
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<{ enableCaching: boolean; cacheTTL: number }>): void {
    this.config = { ...this.config, ...newConfig };
  }
} 
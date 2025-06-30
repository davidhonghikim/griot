#!/usr/bin/env tsx

/**
 * PersonaRAG Service - Main Entry Point
 * 
 * Orchestrates all PersonaRAG functionality using modular components.
 */

import { PersonaRAGService as CorePersonaRAGService } from '@griot/data/rag/persona_rag_service';
import { PersonaVectorizationService } from '@griot/data/rag/persona_vectorization_service';
import { PersonaRAGQueryManager } from './query-manager';
import { PersonaRAGCacheManager } from './cache-manager';
import { PersonaRAGCRUDManager } from './crud-manager';

export interface PersonaRAGConfig {
  enableVectorization: boolean;
  enableCaching: boolean;
  maxResults: number;
  similarityThreshold: number;
  cacheTTL: number;
}

export interface PersonaRAGRequest {
  query: string;
  personaId?: string;
  limit?: number;
  similarityThreshold?: number;
  includeContent?: boolean;
  includeMetadata?: boolean;
  filters?: Record<string, any>;
}

export interface PersonaRAGResponse {
  success: boolean;
  query: string;
  selectedPersona?: {
    personaId: string;
    name: string;
    description: string;
    contextSnippet: string;
    relevanceScore: number;
    metadata: Record<string, any>;
  };
  relatedPersonas?: Array<{
    personaId: string;
    name: string;
    description: string;
    relevanceScore: number;
    metadata: Record<string, any>;
  }>;
  processingTime: number;
  error?: string;
}

export interface PersonaDocument {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class PersonaRAGService {
  private coreService: CorePersonaRAGService | null = null;
  private config: PersonaRAGConfig;
  private queryManager: PersonaRAGQueryManager;
  private cacheManager: PersonaRAGCacheManager;
  private crudManager: PersonaRAGCRUDManager;

  constructor(config: PersonaRAGConfig) {
    this.config = config;
    this.queryManager = new PersonaRAGQueryManager();
    this.cacheManager = new PersonaRAGCacheManager({
      enableCaching: config.enableCaching,
      cacheTTL: config.cacheTTL
    });
    this.crudManager = new PersonaRAGCRUDManager();
  }

  async initialize(): Promise<void> {
    try {
      // Create mock services for now
      const mockVectorStore = {
        initialize: async () => {},
        addDocuments: async () => {},
        search: async () => ({ results: [], total: 0 }),
        deleteDocuments: async () => {},
        updateDocuments: async () => {},
        getDocument: async () => null,
        healthCheck: async () => ({ status: 'healthy' }),
        cleanup: async () => {}
      };

      const mockEmbeddingService = {
        embed: async () => new Float32Array(1536),
        embedBatch: async () => [],
        getDimensions: () => 1536,
        healthCheck: async () => ({ status: 'healthy' })
      };

      const vectorizationConfig = {
        vectorStore: mockVectorStore as any,
        embeddingService: mockEmbeddingService as any,
        personaLoader: async () => []
      };

      this.coreService = new CorePersonaRAGService(
        mockVectorStore as any,
        mockEmbeddingService as any,
        new PersonaVectorizationService(vectorizationConfig as any)
      );

      console.log("PersonaRAGService initialized successfully");
    } catch (error) {
      console.error("Failed to initialize PersonaRAGService:", error);
      throw error;
    }
  }

  /**
   * Query personas based on request
   */
  async query(request: PersonaRAGRequest): Promise<PersonaRAGResponse> {
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
    } catch (error) {
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
  async addPersona(persona: PersonaDocument): Promise<string> {
    return this.crudManager.addPersona(persona);
  }

  /**
   * Update an existing persona
   */
  async updatePersona(personaId: string, updates: Partial<PersonaDocument>): Promise<void> {
    return this.crudManager.updatePersona(personaId, updates);
  }

  /**
   * Delete a persona
   */
  async deletePersona(personaId: string): Promise<void> {
    return this.crudManager.deletePersona(personaId);
  }

  /**
   * Get all personas
   */
  async getAllPersonas(): Promise<PersonaDocument[]> {
    return this.crudManager.getAllPersonas();
  }

  /**
   * Get service statistics
   */
  async getStats(): Promise<{
    totalPersonas: number;
    vectorizedPersonas: number;
    cacheSize: number;
    vectorStoreStatus: string;
    lastUpdated: Date;
  }> {
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
    } catch (error) {
      console.error('Failed to get stats:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.coreService) {
        return false;
      }

      // TODO: Implement actual health check
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cacheManager.clearCache();
  }

  /**
   * Get configuration
   */
  getConfig(): PersonaRAGConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PersonaRAGConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update cache manager config
    this.cacheManager.updateConfig({
      enableCaching: this.config.enableCaching,
      cacheTTL: this.config.cacheTTL
    });
  }
}


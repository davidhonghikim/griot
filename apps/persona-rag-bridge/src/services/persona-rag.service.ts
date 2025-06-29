#!/usr/bin/env tsx

import { PersonaRAGService as CorePersonaRAGService } from '@griot/data/rag/persona_rag_service';
import { PersonaVectorizationService } from '@griot/data/rag/persona_vectorization_service';
import { VectorStoreService, VectorDocument, VectorSearchResult } from './vector-store.service';
import { SecureVault } from '../vault/secure-vault';

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
  private coreService: CorePersonaRAGService;
  private vectorizationService: PersonaVectorizationService;
  private vectorStore: VectorStoreService;
  private vault: SecureVault;
  private config: PersonaRAGConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  constructor(
    config: PersonaRAGConfig,
    vectorStore: VectorStoreService,
    vault: SecureVault
  ) {
    this.config = config;
    this.vectorStore = vectorStore;
    this.vault = vault;
    this.coreService = new CorePersonaRAGService();
    this.vectorizationService = new PersonaVectorizationService();
  }

  async initialize(): Promise<void> {
    try {
      // Initialize core services
      await this.coreService.initialize();
      await this.vectorizationService.initialize();
      
      // Initialize vector store if enabled
      if (this.config.enableVectorization) {
        await this.vectorStore.initialize();
      }

      console.log('✅ PersonaRAG service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize PersonaRAG service:', error);
      throw error;
    }
  }

  async query(request: PersonaRAGRequest): Promise<PersonaRAGResponse> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      if (this.config.enableCaching) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.config.cacheTTL) {
          return {
            ...cached.data,
            processingTime: Date.now() - startTime
          };
        }
      }

      let response: PersonaRAGResponse;

      if (request.personaId) {
        // Direct persona lookup
        response = await this.getPersonaById(request);
      } else {
        // Search for relevant personas
        response = await this.searchPersonas(request);
      }

      // Cache the result
      if (this.config.enableCaching) {
        this.cache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      }

      return {
        ...response,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        query: request.query,
        processingTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async getPersonaById(request: PersonaRAGRequest): Promise<PersonaRAGResponse> {
    try {
      const persona = await this.coreService.getPersonaById(request.personaId!);
      if (!persona) {
        return {
          success: false,
          query: request.query,
          error: `Persona with ID ${request.personaId} not found`
        };
      }

      return {
        success: true,
        query: request.query,
        selectedPersona: {
          personaId: persona.id,
          name: persona.name,
          description: persona.description,
          contextSnippet: request.includeContent ? persona.content : '',
          relevanceScore: 1.0,
          metadata: persona.metadata || {}
        }
      };
    } catch (error) {
      throw error;
    }
  }

  private async searchPersonas(request: PersonaRAGRequest): Promise<PersonaRAGResponse> {
    try {
      let searchResults: VectorSearchResult[] = [];

      if (this.config.enableVectorization) {
        // Use vector store for semantic search
        searchResults = await this.vectorStore.search(request.query, {
          limit: request.limit || this.config.maxResults,
          similarityThreshold: request.similarityThreshold || this.config.similarityThreshold,
          filters: request.filters,
          includeMetadata: request.includeMetadata !== false
        });
      } else {
        // Use core service for traditional search
        const coreResults = await this.coreService.searchPersonas({
          query: request.query,
          limit: request.limit || this.config.maxResults,
          filters: request.filters
        });

        searchResults = coreResults.map(result => ({
          id: result.id,
          content: result.content,
          score: result.relevanceScore,
          metadata: result.metadata
        }));
      }

      if (searchResults.length === 0) {
        return {
          success: false,
          query: request.query,
          error: 'No relevant personas found'
        };
      }

      const selectedPersona = searchResults[0];
      const relatedPersonas = searchResults.slice(1).map(result => ({
        personaId: result.id,
        name: result.metadata?.name || 'Unknown',
        description: result.metadata?.description || '',
        relevanceScore: result.score,
        metadata: result.metadata || {}
      }));

      return {
        success: true,
        query: request.query,
        selectedPersona: {
          personaId: selectedPersona.id,
          name: selectedPersona.metadata?.name || 'Unknown',
          description: selectedPersona.metadata?.description || '',
          contextSnippet: request.includeContent ? selectedPersona.content : '',
          relevanceScore: selectedPersona.score,
          metadata: selectedPersona.metadata || {}
        },
        relatedPersonas
      };
    } catch (error) {
      throw error;
    }
  }

  async addPersona(persona: PersonaDocument): Promise<string> {
    try {
      // Add to core service
      const personaId = await this.coreService.addPersona({
        id: persona.id,
        name: persona.name,
        description: persona.description,
        content: persona.content,
        tags: persona.tags,
        metadata: persona.metadata,
        createdAt: persona.createdAt,
        updatedAt: persona.updatedAt
      });

      // Add to vector store if enabled
      if (this.config.enableVectorization) {
        const vectorDoc: VectorDocument = {
          id: personaId,
          content: persona.content,
          metadata: {
            name: persona.name,
            description: persona.description,
            tags: persona.tags,
            ...persona.metadata
          }
        };

        await this.vectorStore.addDocument(vectorDoc);
      }

      return personaId;
    } catch (error) {
      console.error('❌ Failed to add persona:', error);
      throw error;
    }
  }

  async updatePersona(personaId: string, updates: Partial<PersonaDocument>): Promise<void> {
    try {
      // Update in core service
      await this.coreService.updatePersona(personaId, updates);

      // Update in vector store if enabled
      if (this.config.enableVectorization && (updates.content || updates.name || updates.description)) {
        const vectorDoc: Partial<VectorDocument> = {
          content: updates.content,
          metadata: {
            name: updates.name,
            description: updates.description,
            tags: updates.tags,
            ...updates.metadata
          }
        };

        await this.vectorStore.updateDocument(personaId, vectorDoc);
      }
    } catch (error) {
      console.error('❌ Failed to update persona:', error);
      throw error;
    }
  }

  async deletePersona(personaId: string): Promise<void> {
    try {
      // Delete from core service
      await this.coreService.deletePersona(personaId);

      // Delete from vector store if enabled
      if (this.config.enableVectorization) {
        await this.vectorStore.deleteDocument(personaId);
      }

      // Clear cache entries for this persona
      if (this.config.enableCaching) {
        for (const [key] of this.cache) {
          if (key.includes(personaId)) {
            this.cache.delete(key);
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to delete persona:', error);
      throw error;
    }
  }

  async vectorizePersonas(): Promise<void> {
    if (!this.config.enableVectorization) {
      throw new Error('Vectorization is not enabled');
    }

    try {
      const personas = await this.coreService.getAllPersonas();
      
      for (const persona of personas) {
        const vectorDoc: VectorDocument = {
          id: persona.id,
          content: persona.content,
          metadata: {
            name: persona.name,
            description: persona.description,
            tags: persona.tags,
            ...persona.metadata
          }
        };

        await this.vectorStore.addDocument(vectorDoc);
      }

      console.log(`✅ Vectorized ${personas.length} personas`);
    } catch (error) {
      console.error('❌ Failed to vectorize personas:', error);
      throw error;
    }
  }

  async getStats(): Promise<{
    totalPersonas: number;
    vectorizedPersonas: number;
    cacheSize: number;
    vectorStoreStatus: string;
    lastUpdated: Date;
  }> {
    try {
      const coreStats = await this.coreService.getStats();
      const vectorStats = this.config.enableVectorization ? await this.vectorStore.getStats() : null;

      return {
        totalPersonas: coreStats.totalPersonas,
        vectorizedPersonas: vectorStats?.totalDocuments || 0,
        cacheSize: this.cache.size,
        vectorStoreStatus: this.config.enableVectorization ? 'enabled' : 'disabled',
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('❌ Failed to get stats:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const coreHealth = await this.coreService.healthCheck();
      const vectorHealth = this.config.enableVectorization ? await this.vectorStore.healthCheck() : true;
      
      return coreHealth && vectorHealth;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }

  private generateCacheKey(request: PersonaRAGRequest): string {
    return `${request.query}:${request.personaId}:${request.limit}:${request.similarityThreshold}:${JSON.stringify(request.filters)}`;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getConfig(): PersonaRAGConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<PersonaRAGConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
} 
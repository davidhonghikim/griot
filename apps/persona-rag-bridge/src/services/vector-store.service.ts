#!/usr/bin/env tsx

import { VectorStore, VectorDocument as CoreVectorDocument, SearchOptions, SearchResult } from '@griot/data/rag/vector_store';
import { EmbeddingService } from '@griot/data/rag/embedding_service';
import { SecureVault } from '../vault/secure-vault';

// Generic interfaces for modular design
export interface VectorStoreConfig {
  type: 'weaviate' | 'postgresql';
  host: string;
  port: number;
  database?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  schema?: string;
  enableSSL?: boolean;
}

export interface VectorDocument {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  embedding?: number[];
  score?: number;
}

export interface VectorSearchOptions {
  limit?: number;
  similarityThreshold?: number;
  filters?: Record<string, any>;
  includeMetadata?: boolean;
}

export interface VectorSearchResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface VectorStoreStats {
  totalDocuments: number;
  backendType: string;
  status: string;
  lastUpdated: Date;
}

// Abstract base class for schema management
export abstract class SchemaManager {
  abstract createSchema(): Promise<void>;
  abstract validateSchema(): Promise<boolean>;
}

// Weaviate schema manager
export class WeaviateSchemaManager extends SchemaManager {
  private vectorStore: VectorStore;

  constructor(vectorStore: VectorStore) {
    super();
    this.vectorStore = vectorStore;
  }

  async createSchema(): Promise<void> {
    // Weaviate schema is handled by the core VectorStore class
    // This is a placeholder for future schema customization
    console.log('📋 Weaviate schema creation handled by core VectorStore');
  }

  async validateSchema(): Promise<boolean> {
    try {
      // Implementation for schema validation
      return true;
    } catch (error) {
      return false;
    }
  }
}

// PostgreSQL schema manager
export class PostgreSQLSchemaManager extends SchemaManager {
  private vectorStore: VectorStore;

  constructor(vectorStore: VectorStore) {
    super();
    this.vectorStore = vectorStore;
  }

  async createSchema(): Promise<void> {
    // PostgreSQL schema creation would be implemented here
    // For now, we'll use the core VectorStore which handles Weaviate
    console.log('📋 PostgreSQL schema creation not yet implemented');
  }

  async validateSchema(): Promise<boolean> {
    try {
      // Implementation for schema validation
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Document processor for batch operations
export class DocumentProcessor {
  private embeddingService: EmbeddingService;

  constructor(embeddingService: EmbeddingService) {
    this.embeddingService = embeddingService;
  }

  async processDocument(document: VectorDocument): Promise<VectorDocument> {
    if (!document.embedding) {
      document.embedding = await this.embeddingService.embedText(document.content);
    }
    return document;
  }

  async processBatch(documents: VectorDocument[], batchSize: number = 10): Promise<VectorDocument[]> {
    const processed: VectorDocument[] = [];
    
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const batchPromises = batch.map(doc => this.processDocument(doc));
      const processedBatch = await Promise.all(batchPromises);
      processed.push(...processedBatch);
    }
    
    return processed;
  }
}

// Main vector store service - modular and generic
export class VectorStoreService {
  private config: VectorStoreConfig;
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;
  private vault: SecureVault;
  private schemaManager: SchemaManager;
  private documentProcessor: DocumentProcessor;
  private isInitialized: boolean = false;

  constructor(config: VectorStoreConfig, vault: SecureVault) {
    this.config = config;
    this.vault = vault;
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new VectorStore();
    this.documentProcessor = new DocumentProcessor(this.embeddingService);
    
    // Initialize appropriate schema manager
    this.schemaManager = this.createSchemaManager();
  }

  private createSchemaManager(): SchemaManager {
    switch (this.config.type) {
      case 'weaviate':
        return new WeaviateSchemaManager(this.vectorStore);
      case 'postgresql':
        return new PostgreSQLSchemaManager(this.vectorStore);
      default:
        throw new Error(`Unsupported vector store type: ${this.config.type}`);
    }
  }

  async initialize(): Promise<void> {
    try {
      // Initialize the core vector store
      await this.vectorStore.initialize();
      
      // Create schema if needed
      await this.schemaManager.createSchema();
      
      this.isInitialized = true;
      console.log(`✅ Vector store service initialized with ${this.config.type} backend`);
    } catch (error) {
      console.error('❌ Failed to initialize vector store service:', error);
      throw error;
    }
  }

  async addDocument(document: VectorDocument): Promise<string> {
    this.ensureInitialized();
    
    try {
      const processedDoc = await this.documentProcessor.processDocument(document);
      
      const coreDocument: CoreVectorDocument = {
        id: processedDoc.id,
        content: processedDoc.content,
        metadata: processedDoc.metadata || {},
        embedding: processedDoc.embedding || []
      };
      
      return await this.vectorStore.storeDocument(coreDocument);
    } catch (error) {
      console.error('❌ Failed to add document:', error);
      throw error;
    }
  }

  async addDocuments(documents: VectorDocument[]): Promise<string[]> {
    this.ensureInitialized();
    
    try {
      const processedDocs = await this.documentProcessor.processBatch(documents);
      
      const results: string[] = [];
      for (const doc of processedDocs) {
        const coreDocument: CoreVectorDocument = {
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata || {},
          embedding: doc.embedding || []
        };
        
        const id = await this.vectorStore.storeDocument(coreDocument);
        results.push(id);
      }
      
      return results;
    } catch (error) {
      console.error('❌ Failed to add documents:', error);
      throw error;
    }
  }

  async search(
    query: string, 
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    this.ensureInitialized();
    
    try {
      const queryEmbedding = await this.embeddingService.embedText(query);
      
      const searchOptions: SearchOptions = {
        limit: options.limit || 10,
        filter: options.filters || {}
      };

      const results = await this.vectorStore.search(queryEmbedding, searchOptions);
      
      return results.map(result => ({
        id: result.id,
        content: result.content,
        score: result.score,
        metadata: result.metadata
      }));
    } catch (error) {
      console.error('❌ Failed to search documents:', error);
      throw error;
    }
  }

  async getDocument(id: string): Promise<VectorDocument | null> {
    this.ensureInitialized();
    
    try {
      const document = await this.vectorStore.getDocument(id);
      if (!document) return null;

      return {
        id: document.id,
        content: document.content,
        metadata: document.metadata,
        embedding: document.embedding
      };
    } catch (error) {
      console.error('❌ Failed to get document:', error);
      throw error;
    }
  }

  async updateDocument(id: string, updates: Partial<VectorDocument>): Promise<void> {
    this.ensureInitialized();
    
    try {
      // For now, we'll delete and recreate since the core VectorStore doesn't have update
      const existingDoc = await this.getDocument(id);
      if (!existingDoc) {
        throw new Error(`Document ${id} not found`);
      }

      const updatedDoc = { ...existingDoc, ...updates };
      
      if (updates.content && !updates.embedding) {
        updatedDoc.embedding = await this.embeddingService.embedText(updates.content);
      }

      await this.vectorStore.deleteDocument(id);
      
      const coreDocument: CoreVectorDocument = {
        id: updatedDoc.id,
        content: updatedDoc.content,
        metadata: updatedDoc.metadata || {},
        embedding: updatedDoc.embedding || []
      };
      
      await this.vectorStore.storeDocument(coreDocument);
    } catch (error) {
      console.error('❌ Failed to update document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    this.ensureInitialized();
    
    try {
      await this.vectorStore.deleteDocument(id);
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      throw error;
    }
  }

  async getStats(): Promise<VectorStoreStats> {
    this.ensureInitialized();
    
    try {
      const totalDocuments = await this.vectorStore.getDocumentCount();
      return {
        totalDocuments,
        backendType: this.config.type,
        status: 'operational',
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('❌ Failed to get stats:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.vectorStore.healthCheck();
      return true;
    } catch (error) {
      console.error('❌ Vector store health check failed:', error);
      return false;
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Vector store service not initialized');
    }
  }

  getConfig(): VectorStoreConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<VectorStoreConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
} 
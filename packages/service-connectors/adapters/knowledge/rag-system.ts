/**
 * Modular RAG (Retrieval-Augmented Generation) System
 * 
 * A focused RAG system that uses modular components for embedding,
 * search, and retrieval operations.
 */

import {
  SearchQuery,
  SearchResponse,
  SearchResult,
  IndexingResult,
  SystemMetrics,
  Vector,
  Embedding
} from './core/interfaces';
import { VectorUtils } from './core/vector-utils';
import { EmbeddingService, EmbeddingProvider } from './services/embedding-service';

export interface RAGSystemConfig {
  readonly vectorDimensions: number;
  readonly chunkSize: number;
  readonly overlapSize: number;
  readonly preserveSentences: boolean;
  readonly maxResults: number;
  readonly defaultThreshold: number;
  readonly nodeClass: string;
  readonly culturalContext: string;
  readonly enableCaching: boolean;
  readonly cacheTTL: number; // in milliseconds
}

export class RAGSystem {
  private config: RAGSystemConfig;
  private embeddingService: EmbeddingService;
  private cache: Map<string, { results: SearchResult[]; timestamp: number }> = new Map();
  private metrics: {
    totalQueries: number;
    totalIndexed: number;
    averageQueryTime: number;
    cacheHitRate: number;
  } = {
    totalQueries: 0,
    totalIndexed: 0,
    averageQueryTime: 0,
    cacheHitRate: 0
  };

  constructor(config: RAGSystemConfig, provider?: EmbeddingProvider) {
    this.config = config;
    this.embeddingService = new EmbeddingService({
      vectorDimensions: config.vectorDimensions,
      chunkSize: config.chunkSize,
      overlapSize: config.overlapSize,
      preserveSentences: config.preserveSentences,
      nodeClass: config.nodeClass,
      culturalContext: config.culturalContext
    }, provider);
  }

  /**
   * Set the embedding provider
   */
  setEmbeddingProvider(provider: EmbeddingProvider): void {
    this.embeddingService.setProvider(provider);
  }

  /**
   * Index a document for retrieval
   */
  async indexDocument(
    documentId: string,
    content: string,
    metadata: any
  ): Promise<IndexingResult> {
    try {
      const startTime = Date.now();
      
      const embeddings = await this.embeddingService.createEmbeddings(
        documentId,
        content,
        metadata
      );
      
      this.metrics.totalIndexed += embeddings.length;
      
      return {
        success: true,
        documentId,
        indexedChunks: embeddings.length,
        error: undefined
      };
      
    } catch (error) {
      return {
        success: false,
        documentId,
        indexedChunks: 0,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Search for relevant documents
   */
  async search(query: SearchQuery): Promise<SearchResponse> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      if (this.config.enableCaching) {
        const cacheKey = this.generateCacheKey(query);
        const cached = this.cache.get(cacheKey);
        
        if (cached && this.isCacheValid(cached.timestamp)) {
          this.updateCacheHitRate();
          return {
            results: cached.results,
            totalCount: cached.results.length,
            query: query.query,
            searchTime: Date.now() - startTime
          };
        }
      }
      
      // Generate query embedding
      const queryVector = await this.generateQueryVector(query.query);
      
      // Find similar embeddings
      const similarEmbeddings = this.embeddingService.findSimilarEmbeddings(
        queryVector,
        query.threshold || this.config.defaultThreshold,
        query.limit || this.config.maxResults
      );
      
      // Apply filters
      const filteredEmbeddings = this.applyFilters(similarEmbeddings, query.filters);
      
      // Convert to search results
      const results: SearchResult[] = filteredEmbeddings.map(embedding => ({
        id: embedding.id,
        content: embedding.metadata.content,
        similarity: embedding.metadata.confidence,
        metadata: embedding.metadata,
        source: embedding.metadata.source,
        context: this.generateContext(embedding)
      }));
      
      // Cache results
      if (this.config.enableCaching) {
        const cacheKey = this.generateCacheKey(query);
        this.cache.set(cacheKey, {
          results,
          timestamp: Date.now()
        });
      }
      
      // Update metrics
      this.updateMetrics(Date.now() - startTime);
      
      return {
        results,
        totalCount: results.length,
        query: query.query,
        searchTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('Search failed:', error);
      return {
        results: [],
        totalCount: 0,
        query: query.query,
        searchTime: Date.now() - startTime
      };
    }
  }

  /**
   * Delete a document and its embeddings
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      this.embeddingService.deleteDocumentEmbeddings(documentId);
      this.clearCache(); // Clear cache since embeddings changed
      return true;
    } catch (error) {
      console.error('Failed to delete document:', error);
      return false;
    }
  }

  /**
   * Get system metrics
   */
  getMetrics(): SystemMetrics {
    return {
      ...this.metrics,
      totalEmbeddings: this.embeddingService.getEmbeddingCount(),
      cacheSize: this.cache.size,
      nodeClass: this.config.nodeClass
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get all embeddings for a document
   */
  async getDocumentEmbeddings(documentId: string): Promise<Embedding[]> {
    return this.embeddingService.getDocumentEmbeddings(documentId);
  }

  // Private helper methods

  private async generateQueryVector(query: string): Promise<Vector> {
    // Create a temporary embedding for the query
    const tempEmbedding = await this.embeddingService.createEmbedding(
      { content: query, index: 0, startOffset: 0, endOffset: query.length, metadata: {} as any },
      {
        documentId: 'query',
        chunkIndex: 0,
        content: query,
        contentType: 'text',
        source: 'query',
        nodeClass: this.config.nodeClass,
        culturalContext: this.config.culturalContext,
        tags: [],
        priority: 'medium',
        confidence: 1.0
      }
    );
    
    return tempEmbedding.vector;
  }

  private applyFilters(
    embeddings: Embedding[],
    filters?: any
  ): Embedding[] {
    if (!filters) return embeddings;
    
    return embeddings.filter(embedding => {
      if (filters.contentType && !filters.contentType.includes(embedding.metadata.contentType)) {
        return false;
      }
      if (filters.source && !filters.source.includes(embedding.metadata.source)) {
        return false;
      }
      if (filters.nodeClass && !filters.nodeClass.includes(embedding.metadata.nodeClass)) {
        return false;
      }
      if (filters.tags && !filters.tags.some((tag: string) => embedding.metadata.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  }

  private generateContext(embedding: Embedding): string {
    return `Document: ${embedding.metadata.documentId}, Chunk: ${embedding.metadata.chunkIndex}, Source: ${embedding.metadata.source}`;
  }

  private generateCacheKey(query: SearchQuery): string {
    return `${query.query}_${JSON.stringify(query.filters)}_${query.limit}_${query.threshold}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.config.cacheTTL;
  }

  private updateCacheHitRate(): void {
    this.metrics.cacheHitRate = (this.metrics.cacheHitRate + 1) / 2;
  }

  private updateMetrics(queryTime: number): void {
    this.metrics.totalQueries++;
    this.metrics.averageQueryTime = 
      (this.metrics.averageQueryTime + queryTime) / 2;
  }
} 
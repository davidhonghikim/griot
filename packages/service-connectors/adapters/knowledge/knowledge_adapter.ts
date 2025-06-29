/**
 * Generic Knowledge Adapter
 * 
 * A modular, node-agnostic adapter for knowledge operations that can be used
 * by any kOS node class. Provides unified interface for RAG, memory, and
 * knowledge graph operations.
 */

import { 
  SearchQuery, 
  SearchResponse, 
  SearchResult,
  MemoryEntry,
  MemoryQuery,
  MemoryResponse,
  EmbeddingMetadata
} from './core/interfaces';
import { RAGSystem } from './rag-system';
import { MemorySystem } from './memory-system';
import { VectorUtils } from './core/vector-utils';
import { EmbeddingService } from './services/embedding-service';

export interface KnowledgeAdapterConfig {
  readonly nodeClass: string;
  readonly culturalContext: string;
  readonly ragSystem: RAGSystem;
  readonly memorySystem: MemorySystem;
  readonly embeddingService: EmbeddingService;
  readonly enableCaching: boolean;
  readonly cacheTTL: number;
  readonly maxResults: number;
  readonly defaultThreshold: number;
}

export interface KnowledgeItem {
  readonly content: string;
  readonly importance?: number;
  readonly tags?: string[];
  readonly metadata?: Record<string, any>;
}

export interface KnowledgeOperation {
  type: 'search' | 'store' | 'retrieve' | 'compose' | 'analyze';
  data: any;
  options?: any;
}

export interface KnowledgeResponse {
  success: boolean;
  data: any;
  metadata: {
    operationType: string;
    executionTime: number;
    source: string;
    confidence: number;
    nodeClass: string;
    culturalContext: string;
  };
  errors?: string[];
}

export class KnowledgeAdapter {
  private config: KnowledgeAdapterConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private metrics: {
    totalOperations: number;
    cacheHits: number;
    averageResponseTime: number;
    errorRate: number;
  } = {
    totalOperations: 0,
    cacheHits: 0,
    averageResponseTime: 0,
    errorRate: 0
  };

  constructor(config: KnowledgeAdapterConfig) {
    this.config = config;
  }

  /**
   * Generic knowledge operation handler
   * Routes operations to appropriate subsystems
   */
  async execute(operation: KnowledgeOperation): Promise<KnowledgeResponse> {
    const startTime = Date.now();
    this.metrics.totalOperations++;

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(operation);
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return {
          success: true,
          data: cachedResult,
          metadata: {
            operationType: operation.type,
            executionTime: Date.now() - startTime,
            source: 'cache',
            confidence: 1.0,
            nodeClass: this.config.nodeClass,
            culturalContext: this.config.culturalContext
          }
        };
      }

      // Execute operation
      let result: any;
      switch (operation.type) {
        case 'search':
          result = await this.performSearch(operation.data);
          break;
        case 'store':
          result = await this.performStore(operation.data);
          break;
        case 'retrieve':
          result = await this.performRetrieve(operation.data);
          break;
        case 'compose':
          result = await this.performCompose(operation.data);
          break;
        case 'analyze':
          result = await this.performAnalyze(operation.data);
          break;
        default:
          throw new Error(`Unknown operation type: ${operation.type}`);
      }

      // Cache result
      this.setCache(cacheKey, result);

      const executionTime = Date.now() - startTime;
      this.updateMetrics(executionTime, false);

      return {
        success: true,
        data: result,
        metadata: {
          operationType: operation.type,
          executionTime,
          source: 'computed',
          confidence: this.calculateConfidence(result),
          nodeClass: this.config.nodeClass,
          culturalContext: this.config.culturalContext
        }
      };

    } catch (error) {
      this.updateMetrics(0, true);
      return {
        success: false,
        data: null,
        metadata: {
          operationType: operation.type,
          executionTime: Date.now() - startTime,
          source: 'error',
          confidence: 0.0,
          nodeClass: this.config.nodeClass,
          culturalContext: this.config.culturalContext
        },
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Perform semantic search across knowledge base
   */
  private async performSearch(query: SearchQuery): Promise<SearchResponse> {
    // Enhance query with cultural context
    const enhancedQuery = this.enhanceQueryWithContext(query);
    
    // Search across RAG system
    const ragResults = await this.config.ragSystem.search(enhancedQuery);
    
    // Search memory for contextual information
    const memoryResults = await this.config.memorySystem.retrieveMemories({
      semanticQuery: query.query,
      limit: Math.floor(this.config.maxResults * 0.3)
    });

    // Combine and rank results
    const combinedResults = this.combineSearchResults([...ragResults.results], [...memoryResults.memories]);
    
    return {
      results: combinedResults.slice(0, this.config.maxResults),
      totalCount: combinedResults.length,
      query: query.query,
      searchTime: 0 // Will be set by caller
    };
  }

  /**
   * Store knowledge in appropriate systems
   */
  private async performStore(item: KnowledgeItem): Promise<{ id: string; location: string }> {
    // Determine optimal storage strategy
    const storageStrategy = this.determineStorageStrategy(item);
    
    let result: { id: string; location: string };
    
    switch (storageStrategy.primary) {
      case 'rag':
        const indexingResult = await this.config.ragSystem.indexDocument(
          `knowledge_${Date.now()}`,
          item.content,
          {
            nodeClass: this.config.nodeClass,
            culturalContext: this.config.culturalContext,
            tags: item.tags || [],
            priority: 'medium'
          }
        );
        result = { id: indexingResult.documentId, location: 'rag' };
        break;
      case 'memory':
        const memoryId = await this.config.memorySystem.storeMemory(item.content, {
          type: storageStrategy.memoryType || 'knowledge',
          importance: item.importance || 0.5,
          tags: item.tags || [],
          source: 'knowledge_adapter',
          nodeClass: this.config.nodeClass
        });
        result = { id: memoryId, location: 'memory' };
        break;
      default:
        throw new Error(`Unknown storage strategy: ${storageStrategy.primary}`);
    }

    return result;
  }

  /**
   * Retrieve knowledge from multiple sources
   */
  private async performRetrieve(query: MemoryQuery): Promise<MemoryEntry[]> {
    // Retrieve from memory system
    const memoryResponse = await this.config.memorySystem.retrieveMemories(query);
    const results: MemoryEntry[] = [...memoryResponse.memories];

    // Retrieve from RAG system if needed
    if (query.semanticQuery) {
      const ragResults = await this.config.ragSystem.search({
        query: query.semanticQuery,
        limit: query.limit || this.config.maxResults,
        threshold: this.config.defaultThreshold
      });
      
      // Convert RAG results to memory entries
      const convertedResults = ragResults.results.map(result => this.convertRAGResultToMemory(result));
      results.push(...convertedResults);
    }

    return results.slice(0, query.limit || this.config.maxResults);
  }

  /**
   * Compose knowledge from multiple sources
   */
  private async performCompose(composition: {
    sources: string[];
    strategy: 'merge' | 'synthesize' | 'compare';
    outputFormat: string;
  }): Promise<any> {
    // Retrieve all source knowledge
    const sourceKnowledge = await Promise.all(
      composition.sources.map(source => this.retrieveKnowledge(source))
    );

    // Apply composition strategy
    switch (composition.strategy) {
      case 'merge':
        return this.mergeKnowledge(sourceKnowledge);
      case 'synthesize':
        return this.synthesizeKnowledge(sourceKnowledge);
      case 'compare':
        return this.compareKnowledge(sourceKnowledge);
      default:
        throw new Error(`Unknown composition strategy: ${composition.strategy}`);
    }
  }

  /**
   * Analyze knowledge for insights
   */
  private async performAnalyze(analysis: {
    content: any;
    analysisType: 'quality' | 'sentiment' | 'complexity' | 'relevance';
  }): Promise<any> {
    // Generate embeddings for analysis
    const embeddings = await this.config.embeddingService.getEmbedding(
      typeof analysis.content === 'string' ? analysis.content : JSON.stringify(analysis.content)
    );

    switch (analysis.analysisType) {
      case 'quality':
        return this.analyzeQuality(analysis.content, embeddings);
      case 'sentiment':
        return this.analyzeSentiment(analysis.content, embeddings);
      case 'complexity':
        return this.analyzeComplexity(analysis.content, embeddings);
      case 'relevance':
        return this.analyzeRelevance(analysis.content, embeddings);
      default:
        throw new Error(`Unknown analysis type: ${analysis.analysisType}`);
    }
  }

  // Helper methods

  private enhanceQueryWithContext(query: SearchQuery): SearchQuery {
    return {
      ...query,
      filters: {
        ...query.filters,
        nodeClass: [this.config.nodeClass],
        source: [this.config.culturalContext]
      }
    };
  }

  private combineSearchResults(ragResults: SearchResult[], memoryResults: MemoryEntry[]): any[] {
    const allResults = [...ragResults, ...memoryResults];
    
    // Remove duplicates
    const uniqueResults = this.removeDuplicates(allResults);
    
    // Sort by relevance
    return uniqueResults.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  }

  private removeDuplicates(results: any[]): any[] {
    const seen = new Set<string>();
    const unique: any[] = [];
    
    for (const result of results) {
      const contentHash = this.hashContent(result.content || result.text || '');
      if (!seen.has(contentHash)) {
        seen.add(contentHash);
        unique.push(result);
      }
    }
    
    return unique;
  }

  private hashContent(content: string): string {
    return content.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private getUniqueSources(results: any[]): string[] {
    const sources = new Set<string>();
    for (const result of results) {
      sources.add(result.source || 'unknown');
    }
    return Array.from(sources);
  }

  private determineStorageStrategy(item: KnowledgeItem): {
    primary: 'rag' | 'memory';
    memoryType?: 'experience' | 'knowledge' | 'interaction' | 'reflection';
  } {
    // Simple strategy: large content goes to RAG, small content goes to memory
    const contentSize = typeof item.content === 'string' ? 
      item.content.length : JSON.stringify(item.content).length;
    
    if (contentSize > 1000) {
      return { primary: 'rag' };
    } else {
      return { 
        primary: 'memory',
        memoryType: item.importance && item.importance > 0.8 ? 'knowledge' : 'experience'
      };
    }
  }

  private convertRAGResultToMemory(ragResult: SearchResult): MemoryEntry {
    return {
      id: ragResult.id,
      content: ragResult.content,
      metadata: {
        nodeClass: this.config.nodeClass,
        culturalContext: this.config.culturalContext,
        type: 'knowledge',
        priority: 'medium',
        tags: ragResult.metadata.tags,
        source: ragResult.source,
        confidence: ragResult.similarity,
        emotionalValence: 0,
        importance: ragResult.similarity,
        associations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async retrieveKnowledge(source: string): Promise<any> {
    // Implementation would depend on source type
    // For now, return placeholder
    return { source, content: `Knowledge from ${source}` };
  }

  private mergeKnowledge(sources: any[]): any {
    return {
      type: 'merged',
      sources: sources.map(s => s.source),
      content: sources.map(s => s.content).join('\n\n'),
      metadata: {
        mergeStrategy: 'concatenation',
        sourceCount: sources.length
      }
    };
  }

  private synthesizeKnowledge(sources: any[]): any {
    // Placeholder for knowledge synthesis
    return {
      type: 'synthesized',
      sources: sources.map(s => s.source),
      content: 'Synthesized knowledge content',
      metadata: {
        synthesisStrategy: 'ai_enhanced',
        sourceCount: sources.length
      }
    };
  }

  private compareKnowledge(sources: any[]): any {
    return {
      type: 'comparison',
      sources: sources.map(s => s.source),
      comparisons: sources.map((s, i) => ({
        source: s.source,
        index: i,
        keyPoints: ['point1', 'point2', 'point3']
      })),
      metadata: {
        comparisonStrategy: 'side_by_side',
        sourceCount: sources.length
      }
    };
  }

  private analyzeQuality(content: any, embeddings: any): any {
    return {
      quality: {
        completeness: 0.85,
        accuracy: 0.92,
        relevance: 0.78,
        overall: 0.85
      },
      embeddings,
      analysis: 'quality_analysis'
    };
  }

  private analyzeSentiment(content: any, embeddings: any): any {
    return {
      sentiment: {
        positive: 0.6,
        negative: 0.2,
        neutral: 0.2,
        overall: 'positive'
      },
      embeddings,
      analysis: 'sentiment_analysis'
    };
  }

  private analyzeComplexity(content: any, embeddings: any): any {
    return {
      complexity: {
        readability: 0.75,
        technicalLevel: 'intermediate',
        structure: 'well_organized',
        overall: 0.7
      },
      embeddings,
      analysis: 'complexity_analysis'
    };
  }

  private analyzeRelevance(content: any, embeddings: any): any {
    return {
      relevance: {
        topicalRelevance: 0.88,
        contextualRelevance: 0.82,
        temporalRelevance: 0.75,
        overall: 0.82
      },
      embeddings,
      analysis: 'relevance_analysis'
    };
  }

  private calculateConfidence(result: any): number {
    // Simple confidence calculation based on result properties
    if (result.confidence) return result.confidence;
    if (result.similarity) return result.similarity;
    if (result.quality?.overall) return result.quality.overall;
    return 0.8; // Default confidence
  }

  private generateCacheKey(operation: KnowledgeOperation): string {
    return `${operation.type}_${JSON.stringify(operation.data)}_${this.config.nodeClass}`;
  }

  private getFromCache(key: string): any | null {
    if (!this.config.enableCaching) return null;
    
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.cacheTTL) {
      return cached.data;
    }
    
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    if (!this.config.enableCaching) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private updateMetrics(executionTime: number, isError: boolean): void {
    const totalOps = this.metrics.totalOperations;
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (totalOps - 1) + executionTime) / totalOps;
    
    if (isError) {
      this.metrics.errorRate = 
        (this.metrics.errorRate * (totalOps - 1) + 1) / totalOps;
    }
  }

  // Public methods for direct access

  async search(query: SearchQuery): Promise<SearchResponse> {
    const response = await this.execute({ type: 'search', data: query });
    return response.data;
  }

  async store(item: KnowledgeItem): Promise<{ id: string; location: string }> {
    const response = await this.execute({ type: 'store', data: item });
    return response.data;
  }

  async retrieve(query: MemoryQuery): Promise<MemoryEntry[]> {
    const response = await this.execute({ type: 'retrieve', data: query });
    return response.data;
  }

  async compose(composition: any): Promise<any> {
    const response = await this.execute({ type: 'compose', data: composition });
    return response.data;
  }

  async analyze(analysis: any): Promise<any> {
    const response = await this.execute({ type: 'analyze', data: analysis });
    return response.data;
  }

  // Utility methods

  getMetrics() {
    return { ...this.metrics };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getConfig(): KnowledgeAdapterConfig {
    return { ...this.config };
  }
}

// Factory function for creating node-specific adapters
export function createKnowledgeAdapter(
  nodeClass: string,
  culturalContext: string,
  config: Partial<KnowledgeAdapterConfig> = {}
): KnowledgeAdapter {
  const defaultConfig: KnowledgeAdapterConfig = {
    nodeClass,
    culturalContext,
    ragSystem: new RAGSystem({
      vectorDimensions: 384,
      chunkSize: 512,
      overlapSize: 50,
      preserveSentences: true,
      maxResults: 10,
      defaultThreshold: 0.7,
      nodeClass,
      culturalContext,
      enableCaching: true,
      cacheTTL: 300000
    }),
    memorySystem: new MemorySystem({
      maxResults: 20,
      nodeClass,
      culturalContext,
      enableCompression: false,
      enableEncryption: false,
      maxMemorySize: 100
    }),
    embeddingService: new EmbeddingService({
      vectorDimensions: 384,
      chunkSize: 512,
      overlapSize: 50,
      preserveSentences: true,
      nodeClass,
      culturalContext
    }),
    enableCaching: true,
    cacheTTL: 300000,
    maxResults: 10,
    defaultThreshold: 0.7,
    ...config
  };

  return new KnowledgeAdapter(defaultConfig);
} 
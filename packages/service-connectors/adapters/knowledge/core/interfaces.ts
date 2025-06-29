/**
 * Core interfaces for the knowledge system
 * Focused, minimal interfaces that define the contract between modules
 */

export interface Vector {
  readonly values: readonly number[];
  readonly dimension: number;
}

export interface Embedding {
  readonly id: string;
  readonly vector: Vector;
  readonly metadata: EmbeddingMetadata;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface EmbeddingMetadata {
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly content: string;
  readonly contentType: string;
  readonly source: string;
  readonly nodeClass: string;
  readonly culturalContext: string;
  readonly tags: readonly string[];
  readonly priority: 'low' | 'medium' | 'high';
  readonly confidence: number;
}

export interface SearchQuery {
  readonly query: string;
  readonly limit?: number;
  readonly threshold?: number;
  readonly filters?: SearchFilters;
}

export interface SearchFilters {
  readonly contentType?: readonly string[];
  readonly source?: readonly string[];
  readonly nodeClass?: readonly string[];
  readonly tags?: readonly string[];
}

export interface SearchResult {
  readonly id: string;
  readonly content: string;
  readonly similarity: number;
  readonly metadata: EmbeddingMetadata;
  readonly source: string;
  readonly context: string;
}

export interface SearchResponse {
  readonly results: readonly SearchResult[];
  readonly totalCount: number;
  readonly query: string;
  readonly searchTime: number;
}

export interface IndexingResult {
  readonly success: boolean;
  readonly documentId: string;
  readonly indexedChunks: number;
  readonly error?: string;
}

export interface MemoryEntry {
  readonly id: string;
  readonly content: string;
  readonly metadata: MemoryMetadata;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MemoryMetadata {
  readonly nodeClass: string;
  readonly culturalContext: string;
  readonly type: 'experience' | 'knowledge' | 'interaction' | 'reflection';
  readonly priority: 'low' | 'medium' | 'high';
  readonly tags: readonly string[];
  readonly source: string;
  readonly confidence: number;
  readonly emotionalValence: number;
  readonly importance: number;
  readonly associations: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MemoryQuery {
  readonly tags?: readonly string[];
  readonly temporalRange?: { readonly start: string; readonly end: string };
  readonly semanticQuery?: string;
  readonly associations?: readonly string[];
  readonly limit?: number;
  readonly filters?: MemoryFilters;
  readonly sortBy?: 'importance' | 'recent' | 'priority' | 'confidence';
}

export interface MemoryFilters {
  readonly type?: readonly string[];
  readonly priority?: readonly string[];
  readonly source?: readonly string[];
  readonly minImportance?: number;
}

export interface MemoryResponse {
  readonly memories: readonly MemoryEntry[];
  readonly totalCount: number;
  readonly query: MemoryQuery;
  readonly retrievalTime: number;
}

export interface SystemMetrics {
  readonly totalQueries: number;
  readonly totalIndexed: number;
  readonly averageQueryTime: number;
  readonly cacheHitRate: number;
  readonly totalEmbeddings: number;
  readonly cacheSize: number;
  readonly nodeClass: string;
} 
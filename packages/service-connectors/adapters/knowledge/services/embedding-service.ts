/**
 * Embedding service for vector generation and management
 * Handles the creation, storage, and retrieval of text embeddings
 */

import { Vector, Embedding, EmbeddingMetadata } from '../core/interfaces';
import { VectorUtils } from '../core/vector-utils';
import { TextChunker, TextChunk } from '../core/text-chunker';

export interface EmbeddingServiceConfig {
  readonly vectorDimensions: number;
  readonly chunkSize: number;
  readonly overlapSize: number;
  readonly preserveSentences: boolean;
  readonly nodeClass: string;
  readonly culturalContext: string;
}

export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
}

export class EmbeddingService {
  private config: EmbeddingServiceConfig;
  private chunker: TextChunker;
  private embeddings: Map<string, Embedding> = new Map();
  private provider?: EmbeddingProvider;

  constructor(config: EmbeddingServiceConfig, provider?: EmbeddingProvider) {
    this.config = config;
    this.provider = provider;
    this.chunker = new TextChunker({
      maxChunkSize: config.chunkSize,
      overlapSize: config.overlapSize,
      preserveSentences: config.preserveSentences,
      preserveParagraphs: false
    });
  }

  /**
   * Set the embedding provider
   */
  setProvider(provider: EmbeddingProvider): void {
    this.provider = provider;
  }

  /**
   * Create embeddings for a document
   */
  async createEmbeddings(
    documentId: string,
    content: string,
    metadata: Partial<EmbeddingMetadata>
  ): Promise<Embedding[]> {
    if (!this.provider) {
      throw new Error('Embedding provider not set');
    }

    const chunks = this.chunker.chunkText(content);
    const embeddings: Embedding[] = [];

    for (const chunk of chunks) {
      const embedding = await this.createEmbedding(chunk, {
        documentId,
        chunkIndex: chunk.index,
        content: chunk.content,
        contentType: metadata.contentType || 'text',
        source: metadata.source || 'unknown',
        nodeClass: this.config.nodeClass,
        culturalContext: this.config.culturalContext,
        tags: metadata.tags || [],
        priority: metadata.priority || 'medium',
        confidence: 1.0,
        ...metadata
      });

      embeddings.push(embedding);
      this.embeddings.set(embedding.id, embedding);
    }

    return embeddings;
  }

  /**
   * Create a single embedding
   */
  async createEmbedding(
    chunk: TextChunk,
    metadata: EmbeddingMetadata
  ): Promise<Embedding> {
    if (!this.provider) {
      throw new Error('Embedding provider not set');
    }

    const vectorValues = await this.provider.generateEmbedding(chunk.content);
    
    if (vectorValues.length !== this.config.vectorDimensions) {
      throw new Error(
        `Expected ${this.config.vectorDimensions} dimensions, got ${vectorValues.length}`
      );
    }

    const vector: Vector = {
      values: vectorValues,
      dimension: this.config.vectorDimensions
    };

    const normalizedVector = VectorUtils.normalize(vector);

    return {
      id: this.generateEmbeddingId(metadata.documentId, chunk.index),
      vector: normalizedVector,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Find similar embeddings
   */
  findSimilarEmbeddings(
    queryVector: Vector,
    threshold: number,
    limit: number
  ): Embedding[] {
    const similarities: { embedding: Embedding; similarity: number }[] = [];

    for (const embedding of this.embeddings.values()) {
      const similarity = VectorUtils.cosineSimilarity(queryVector, embedding.vector);
      if (similarity >= threshold) {
        similarities.push({ embedding, similarity });
      }
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => ({
        ...item.embedding,
        metadata: { ...item.embedding.metadata, confidence: item.similarity }
      }));
  }

  /**
   * Get embedding by ID
   */
  getEmbedding(id: string): Embedding | undefined {
    return this.embeddings.get(id);
  }

  /**
   * Get all embeddings for a document
   */
  getDocumentEmbeddings(documentId: string): Embedding[] {
    const embeddings: Embedding[] = [];
    
    for (const embedding of this.embeddings.values()) {
      if (embedding.metadata.documentId === documentId) {
        embeddings.push(embedding);
      }
    }
    
    return embeddings.sort((a, b) => a.metadata.chunkIndex - b.metadata.chunkIndex);
  }

  /**
   * Delete embeddings for a document
   */
  deleteDocumentEmbeddings(documentId: string): void {
    const embeddingsToDelete: string[] = [];
    
    for (const [id, embedding] of this.embeddings.entries()) {
      if (embedding.metadata.documentId === documentId) {
        embeddingsToDelete.push(id);
      }
    }
    
    for (const id of embeddingsToDelete) {
      this.embeddings.delete(id);
    }
  }

  /**
   * Get all embeddings
   */
  getAllEmbeddings(): Embedding[] {
    return Array.from(this.embeddings.values());
  }

  /**
   * Get embedding count
   */
  getEmbeddingCount(): number {
    return this.embeddings.size;
  }

  /**
   * Clear all embeddings
   */
  clearEmbeddings(): void {
    this.embeddings.clear();
  }

  /**
   * Generate unique embedding ID
   */
  private generateEmbeddingId(documentId: string, chunkIndex: number): string {
    return `${documentId}_chunk_${chunkIndex}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 
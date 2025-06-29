/**
 * Modular Memory System
 * 
 * A focused memory system for storing and retrieving contextual information
 * with efficient indexing and retrieval capabilities.
 */

import {
  MemoryEntry,
  MemoryQuery,
  MemoryResponse,
  MemoryMetadata
} from './core/interfaces';

export interface MemorySystemConfig {
  readonly maxResults: number;
  readonly nodeClass: string;
  readonly culturalContext: string;
  readonly enableCompression: boolean;
  readonly enableEncryption: boolean;
  readonly maxMemorySize: number; // in MB
}

export class MemorySystem {
  private config: MemorySystemConfig;
  private memories: Map<string, MemoryEntry> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map(); // tag -> memory IDs
  private temporalIndex: Map<string, Set<string>> = new Map(); // date -> memory IDs
  private metrics: {
    totalMemories: number;
    totalRetrievals: number;
    averageRetrievalTime: number;
  } = {
    totalMemories: 0,
    totalRetrievals: 0,
    averageRetrievalTime: 0
  };

  constructor(config: MemorySystemConfig) {
    this.config = config;
  }

  /**
   * Store a new memory
   */
  async storeMemory(
    content: string,
    metadata: Partial<MemoryMetadata>
  ): Promise<string> {
    const memoryId = this.generateMemoryId();
    const timestamp = new Date().toISOString();
    
    const memory: MemoryEntry = {
      id: memoryId,
      content,
      metadata: {
        nodeClass: this.config.nodeClass,
        culturalContext: this.config.culturalContext,
        type: metadata.type || 'experience',
        priority: metadata.priority || 'medium',
        tags: metadata.tags || [],
        source: metadata.source || 'internal',
        confidence: metadata.confidence || 1.0,
        emotionalValence: metadata.emotionalValence || 0,
        importance: metadata.importance || 0.5,
        associations: metadata.associations || [],
        createdAt: timestamp,
        updatedAt: timestamp,
        ...metadata
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.memories.set(memoryId, memory);
    this.updateIndexes(memory);
    this.metrics.totalMemories++;
    
    return memoryId;
  }

  /**
   * Retrieve memories based on query
   */
  async retrieveMemories(query: MemoryQuery): Promise<MemoryResponse> {
    const startTime = Date.now();
    
    let results: MemoryEntry[] = [];
    
    if (query.tags && query.tags.length > 0) {
      results = this.retrieveByTags(query.tags);
    } else if (query.temporalRange) {
      results = this.retrieveByTemporalRange(query.temporalRange);
    } else if (query.associations && query.associations.length > 0) {
      results = this.retrieveByAssociations(query.associations);
    } else {
      results = this.retrieveRecent(query.limit || this.config.maxResults);
    }
    
    results = this.applyFilters(results, query.filters);
    results = this.sortMemories(results, query.sortBy || 'importance');
    results = results.slice(0, query.limit || this.config.maxResults);
    
    this.updateMetrics(Date.now() - startTime);
    
    return {
      memories: results,
      totalCount: results.length,
      query,
      retrievalTime: Date.now() - startTime
    };
  }

  /**
   * Update an existing memory
   */
  async updateMemory(
    memoryId: string,
    updates: Partial<MemoryEntry>
  ): Promise<boolean> {
    const memory = this.memories.get(memoryId);
    if (!memory) return false;
    
    this.removeFromIndexes(memory);
    
    const updatedMemory: MemoryEntry = {
      ...memory,
      ...updates,
      metadata: {
        ...memory.metadata,
        ...updates.metadata,
        updatedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };
    
    this.memories.set(memoryId, updatedMemory);
    this.updateIndexes(updatedMemory);
    
    return true;
  }

  /**
   * Delete a memory
   */
  async deleteMemory(memoryId: string): Promise<boolean> {
    const memory = this.memories.get(memoryId);
    if (!memory) return false;
    
    this.removeFromIndexes(memory);
    this.memories.delete(memoryId);
    this.metrics.totalMemories--;
    
    return true;
  }

  /**
   * Get memory by ID
   */
  async getMemory(memoryId: string): Promise<MemoryEntry | null> {
    return this.memories.get(memoryId) || null;
  }

  /**
   * Get system metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      totalMemories: this.memories.size,
      tagIndexSize: this.tagIndex.size,
      temporalIndexSize: this.temporalIndex.size,
      nodeClass: this.config.nodeClass
    };
  }

  /**
   * Clear all memories
   */
  async clearAllMemories(): Promise<void> {
    this.memories.clear();
    this.tagIndex.clear();
    this.temporalIndex.clear();
    this.metrics.totalMemories = 0;
  }

  // Private helper methods

  private generateMemoryId(): string {
    return `memory_${this.config.nodeClass}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateIndexes(memory: MemoryEntry): void {
    // Update tag index
    for (const tag of memory.metadata.tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(memory.id);
    }
    
    // Update temporal index
    const dateKey = memory.createdAt.split('T')[0] || memory.createdAt;
    if (!this.temporalIndex.has(dateKey)) {
      this.temporalIndex.set(dateKey, new Set());
    }
    this.temporalIndex.get(dateKey)!.add(memory.id);
  }

  private removeFromIndexes(memory: MemoryEntry): void {
    // Remove from tag index
    for (const tag of memory.metadata.tags) {
      const tagMemories = this.tagIndex.get(tag);
      if (tagMemories) {
        tagMemories.delete(memory.id);
        if (tagMemories.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    }
    
    // Remove from temporal index
    const dateKey = memory.createdAt.split('T')[0] || memory.createdAt;
    const temporalMemories = this.temporalIndex.get(dateKey);
    if (temporalMemories) {
      temporalMemories.delete(memory.id);
      if (temporalMemories.size === 0) {
        this.temporalIndex.delete(dateKey);
      }
    }
  }

  private retrieveByTags(tags: readonly string[]): MemoryEntry[] {
    const memoryIds = new Set<string>();
    
    for (const tag of tags) {
      const tagMemories = this.tagIndex.get(tag);
      if (tagMemories) {
        for (const id of tagMemories) {
          memoryIds.add(id);
        }
      }
    }
    
    return Array.from(memoryIds).map(id => this.memories.get(id)!);
  }

  private retrieveByTemporalRange(range: { readonly start: string; readonly end: string }): MemoryEntry[] {
    const memories: MemoryEntry[] = [];
    
    for (const [dateKey, memoryIds] of this.temporalIndex.entries()) {
      if (dateKey >= range.start && dateKey <= range.end) {
        for (const id of memoryIds) {
          const memory = this.memories.get(id);
          if (memory) memories.push(memory);
        }
      }
    }
    
    return memories;
  }

  private retrieveByAssociations(associations: readonly string[]): MemoryEntry[] {
    return Array.from(this.memories.values()).filter(memory =>
      associations.some(association =>
        memory.metadata.associations.includes(association)
      )
    );
  }

  private retrieveRecent(limit: number): MemoryEntry[] {
    return Array.from(this.memories.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  private applyFilters(
    memories: MemoryEntry[],
    filters?: any
  ): MemoryEntry[] {
    if (!filters) return memories;
    
    return memories.filter(memory => {
      if (filters.type && !filters.type.includes(memory.metadata.type)) {
        return false;
      }
      if (filters.priority && !filters.priority.includes(memory.metadata.priority)) {
        return false;
      }
      if (filters.source && !filters.source.includes(memory.metadata.source)) {
        return false;
      }
      if (filters.minImportance && memory.metadata.importance < filters.minImportance) {
        return false;
      }
      return true;
    });
  }

  private sortMemories(
    memories: MemoryEntry[],
    sortBy: 'importance' | 'recent' | 'priority' | 'confidence'
  ): MemoryEntry[] {
    switch (sortBy) {
      case 'importance':
        return memories.sort((a, b) => b.metadata.importance - a.metadata.importance);
      case 'recent':
        return memories.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return memories.sort((a, b) => 
          priorityOrder[b.metadata.priority] - priorityOrder[a.metadata.priority]
        );
      case 'confidence':
        return memories.sort((a, b) => b.metadata.confidence - a.metadata.confidence);
      default:
        return memories;
    }
  }

  private updateMetrics(retrievalTime: number): void {
    this.metrics.totalRetrievals++;
    this.metrics.averageRetrievalTime = 
      (this.metrics.averageRetrievalTime + retrievalTime) / 2;
  }
} 
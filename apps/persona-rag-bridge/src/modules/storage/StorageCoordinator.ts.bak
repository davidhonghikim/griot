/**
 * Storage Coordinator for PersonaRAG Bridge
 * 
 * Orchestrates IndexedDB, MongoDB, and RAG storage systems.
 */

import { IndexedDBManager, IndexedDBConfig } from './IndexedDBManager';
import { MongoDBManager, MongoDBConfig } from './MongoDBManager';
import { RAGManager, RAGConfig } from './RAGManager';

export interface StorageConfig {
  indexedDB: IndexedDBConfig;
  mongodb: MongoDBConfig;
  rag: RAGConfig;
  sync: {
    enabled: boolean;
    interval: number;
    conflictResolution: 'local' | 'remote' | 'merge';
  };
}

export interface StorageState {
  indexedDB: ReturnType<IndexedDBManager['getState']>;
  mongodb: ReturnType<MongoDBManager['getState']>;
  rag: ReturnType<RAGManager['getState']>;
  initialized: boolean;
  error?: string;
}

export class StorageCoordinator {
  private config: StorageConfig;
  private indexedDB: IndexedDBManager;
  private mongodb: MongoDBManager;
  private rag: RAGManager;
  private state: StorageState;

  constructor(config: StorageConfig) {
    this.config = config;
    this.indexedDB = new IndexedDBManager(config.indexedDB);
    this.mongodb = new MongoDBManager(config.mongodb);
    this.rag = new RAGManager(config.rag);
    this.state = {
      indexedDB: this.indexedDB.getState(),
      mongodb: this.mongodb.getState(),
      rag: this.rag.getState(),
      initialized: false,
    };
  }

  /**
   * Initialize all storage systems
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing storage systems...');

    try {
      // Initialize IndexedDB
      await this.indexedDB.initialize();
      console.log('✅ IndexedDB initialized');

      // Initialize MongoDB
      await this.mongodb.initialize();
      console.log('✅ MongoDB initialized');

      // Initialize RAG service
      await this.rag.initialize();
      console.log('✅ RAG service initialized');

      this.state = {
        indexedDB: this.indexedDB.getState(),
        mongodb: this.mongodb.getState(),
        rag: this.rag.getState(),
        initialized: true,
      };

      console.log('✅ Storage systems initialized successfully');
    } catch (error) {
      this.state = {
        ...this.state,
        error: error instanceof Error ? error.message : 'Storage initialization failed',
      };
      console.error('❌ Storage initialization failed:', error);
      throw error;
    }
  }

  /**
   * Store chat message with multi-tier persistence
   */
  async storeChatMessage(message: any): Promise<void> {
    // Store in IndexedDB for offline access
    await this.indexedDB.store('chats', message);

    // Sync to MongoDB if enabled
    if (this.config.mongodb.enabled) {
      await this.mongodb.sync('chats', message);
    }

    // Create embeddings for semantic search
    if (this.config.rag.enabled) {
      // TODO: Create embeddings for message content
      console.log('Creating embeddings for chat message');
    }
  }

  /**
   * Store artefact with metadata indexing
   */
  async storeArtefact(artefact: any): Promise<void> {
    // Store in IndexedDB with metadata indexes
    await this.indexedDB.store('artefacts', artefact);

    // Sync to MongoDB if enabled
    if (this.config.mongodb.enabled) {
      await this.mongodb.sync('artefacts', artefact);
    }

    // Create embeddings for content-based search
    if (this.config.rag.enabled && artefact.type === 'document') {
      // TODO: Extract text and create embeddings
      console.log('Creating embeddings for document artefact');
    }
  }

  /**
   * Store persona with RAG integration
   */
  async storePersona(persona: any): Promise<void> {
    // Store in IndexedDB
    await this.indexedDB.store('personas', persona);

    // Vectorize persona for semantic search
    if (this.config.rag.enabled) {
      // TODO: Use PersonaVectorizationService to create embeddings
      console.log('Vectorizing persona for semantic search');
    }

    // Sync to MongoDB
    if (this.config.mongodb.enabled) {
      await this.mongodb.sync('personas', persona);
    }
  }

  /**
   * Unified search across all storage layers
   */
  async search(query: string, type?: string, limit: number = 20): Promise<any[]> {
    const results: any[] = [];

    // 1. Semantic search using RAG
    if (this.config.rag.enabled) {
      try {
        const ragResults = await this.rag.search(query, type, Math.floor(limit / 2));
        results.push(...ragResults.map((r: any) => ({ ...r, source: 'rag' })));
      } catch (error) {
        console.warn('RAG search failed:', error);
      }
    }

    // 2. IndexedDB search
    try {
      const stores = type ? [type] : ['chats', 'artefacts', 'personas'];
      for (const storeName of stores) {
        const storeResults = await this.indexedDB.query(storeName);
        const filtered = storeResults.filter((item: any) =>
          JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
        );
        results.push(...filtered.map((r: any) => ({ ...r, source: 'indexeddb' })));
      }
    } catch (error) {
      console.warn('IndexedDB search failed:', error);
    }

    // 3. MongoDB search (if enabled)
    if (this.config.mongodb.enabled) {
      try {
        const collections = type ? [type] : ['chats', 'artefacts', 'personas'];
        for (const collection of collections) {
          const mongoResults = await this.mongodb.query(collection, {
            $text: { $search: query }
          });
          results.push(...mongoResults.map((r: any) => ({ ...r, source: 'mongodb' })));
        }
      } catch (error) {
        console.warn('MongoDB search failed:', error);
      }
    }

    // Deduplicate and sort by relevance
    const unique = results.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    );

    return unique.slice(0, limit);
  }

  /**
   * Get current state
   */
  getState(): StorageState {
    return {
      ...this.state,
      indexedDB: this.indexedDB.getState(),
      mongodb: this.mongodb.getState(),
      rag: this.rag.getState(),
    };
  }

  /**
   * Check if all systems are initialized
   */
  isInitialized(): boolean {
    return this.state.initialized;
  }
} 
/**
 * IndexedDB Manager for PersonaRAG Bridge
 * 
 * Handles browser-based storage for offline capabilities and fast local access.
 */

export interface IndexedDBConfig {
  dbName: string;
  version: number;
  stores: string[];
}

export interface IndexedDBState {
  isInitialized: boolean;
  db: IDBDatabase | null;
  version: number;
  stores: string[];
  error?: string;
}

export class IndexedDBManager {
  private config: IndexedDBConfig;
  private state: IndexedDBState;

  constructor(config: IndexedDBConfig) {
    this.config = config;
    this.state = {
      isInitialized: false,
      db: null,
      version: config.version,
      stores: [],
    };
  }

  /**
   * Initialize IndexedDB
   */
  async initialize(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);
      
      request.onerror = () => {
        this.state = {
          ...this.state,
          isInitialized: false,
          db: null,
          error: 'Failed to open IndexedDB'
        };
        reject(new Error('Failed to open IndexedDB'));
      };
      
      request.onsuccess = () => {
        const db = request.result;
        this.state = {
          ...this.state,
          isInitialized: true,
          db,
          stores: this.config.stores,
        };
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });
  }

  /**
   * Create object stores with appropriate indexes
   */
  private createStores(db: IDBDatabase): void {
    this.config.stores.forEach(storeName => {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'id' });
        
        // Add indexes based on store type
        switch (storeName) {
          case 'chats':
            store.createIndex('conversationId', 'conversationId');
            store.createIndex('timestamp', 'timestamp');
            store.createIndex('personaId', 'personaId');
            break;
          case 'artefacts':
            store.createIndex('type', 'type');
            store.createIndex('tags', 'tags', { multiEntry: true });
            store.createIndex('createdAt', 'createdAt');
            break;
          case 'personas':
            store.createIndex('name', 'name');
            store.createIndex('expertise', 'expertise', { multiEntry: true });
            break;
          case 'embeddings':
            store.createIndex('sourceId', 'sourceId');
            store.createIndex('type', 'type');
            break;
        }
      }
    });
  }

  /**
   * Store data in IndexedDB
   */
  async store<T>(storeName: string, data: T): Promise<void> {
    if (!this.state.db) throw new Error('IndexedDB not initialized');
    
    const transaction = this.state.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise<void>((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to store data'));
    });
  }

  /**
   * Retrieve data from IndexedDB
   */
  async get<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.state.db) throw new Error('IndexedDB not initialized');
    
    const transaction = this.state.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise<T | null>((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to get data'));
    });
  }

  /**
   * Query data from IndexedDB
   */
  async query<T>(storeName: string, index?: string, query?: any): Promise<T[]> {
    if (!this.state.db) throw new Error('IndexedDB not initialized');
    
    const transaction = this.state.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const source = index ? store.index(index) : store;
    
    return new Promise<T[]>((resolve, reject) => {
      const request = query ? source.getAll(query) : source.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to query data'));
    });
  }

  /**
   * Get current state
   */
  getState(): IndexedDBState {
    return { ...this.state };
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.state.isInitialized;
  }
} 
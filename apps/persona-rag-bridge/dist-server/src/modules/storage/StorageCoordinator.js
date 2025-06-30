"use strict";
/**
 * Storage Coordinator for PersonaRAG Bridge
 *
 * Orchestrates IndexedDB, MongoDB, and RAG storage systems.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageCoordinator = void 0;
const IndexedDBManager_1 = require("./IndexedDBManager");
const MongoDBManager_1 = require("./MongoDBManager");
const RAGManager_1 = require("./RAGManager");
class StorageCoordinator {
    constructor(config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "indexedDB", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mongodb", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = config;
        this.indexedDB = new IndexedDBManager_1.IndexedDBManager(config.indexedDB);
        this.mongodb = new MongoDBManager_1.MongoDBManager(config.mongodb);
        this.rag = new RAGManager_1.RAGManager(config.rag);
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
    async initialize() {
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
        }
        catch (error) {
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
    async storeChatMessage(message) {
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
    async storeArtefact(artefact) {
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
    async storePersona(persona) {
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
    async search(query, type, limit = 20) {
        const results = [];
        // 1. Semantic search using RAG
        if (this.config.rag.enabled) {
            try {
                const ragResults = await this.rag.search(query, type, Math.floor(limit / 2));
                results.push(...ragResults.map((r) => ({ ...r, source: 'rag' })));
            }
            catch (error) {
                console.warn('RAG search failed:', error);
            }
        }
        // 2. IndexedDB search
        try {
            const stores = type ? [type] : ['chats', 'artefacts', 'personas'];
            for (const storeName of stores) {
                const storeResults = await this.indexedDB.query(storeName);
                const filtered = storeResults.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));
                results.push(...filtered.map((r) => ({ ...r, source: 'indexeddb' })));
            }
        }
        catch (error) {
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
                    results.push(...mongoResults.map((r) => ({ ...r, source: 'mongodb' })));
                }
            }
            catch (error) {
                console.warn('MongoDB search failed:', error);
            }
        }
        // Deduplicate and sort by relevance
        const unique = results.filter((item, index, self) => index === self.findIndex(t => t.id === item.id));
        return unique.slice(0, limit);
    }
    /**
     * Get current state
     */
    getState() {
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
    isInitialized() {
        return this.state.initialized;
    }
}
exports.StorageCoordinator = StorageCoordinator;

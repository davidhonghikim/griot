#!/usr/bin/env tsx
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStoreService = exports.DocumentProcessor = exports.PostgreSQLSchemaManager = exports.WeaviateSchemaManager = exports.SchemaManager = void 0;
const vector_store_1 = require("@griot/data/rag/vector_store");
const embedding_service_1 = require("@griot/data/rag/embedding_service");
// Abstract base class for schema management
class SchemaManager {
}
exports.SchemaManager = SchemaManager;
// Weaviate schema manager
class WeaviateSchemaManager extends SchemaManager {
    constructor(_vectorStore) {
        super();
        // VectorStore will be used in future implementation
    }
    async createSchema() {
        // Weaviate schema is handled by the core VectorStore class
        // This is a placeholder for future schema customization
        console.log('📋 Weaviate schema creation handled by core VectorStore');
    }
    async validateSchema() {
        try {
            // Implementation for schema validation
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.WeaviateSchemaManager = WeaviateSchemaManager;
// PostgreSQL schema manager
class PostgreSQLSchemaManager extends SchemaManager {
    constructor(_vectorStore) {
        super();
        // VectorStore will be used in future implementation
    }
    async createSchema() {
        // PostgreSQL schema creation would be implemented here
        // For now, we'll use the core VectorStore which handles Weaviate
        console.log('📋 PostgreSQL schema creation not yet implemented');
    }
    async validateSchema() {
        try {
            // Implementation for schema validation
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.PostgreSQLSchemaManager = PostgreSQLSchemaManager;
// Document processor for batch operations
class DocumentProcessor {
    constructor(embeddingService) {
        Object.defineProperty(this, "embeddingService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.embeddingService = embeddingService;
    }
    async processDocument(document) {
        if (!document.embedding) {
            document.embedding = await this.embeddingService.embedText(document.content);
        }
        return document;
    }
    async processBatch(documents, batchSize = 10) {
        const processed = [];
        for (let i = 0; i < documents.length; i += batchSize) {
            const batch = documents.slice(i, i + batchSize);
            const batchPromises = batch.map(doc => this.processDocument(doc));
            const processedBatch = await Promise.all(batchPromises);
            processed.push(...processedBatch);
        }
        return processed;
    }
}
exports.DocumentProcessor = DocumentProcessor;
// Main vector store service - modular and generic
class VectorStoreService {
    constructor(_vault, config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "embeddingService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // Vault will be used in future implementation
        this.config = config;
        this.embeddingService = new embedding_service_1.EmbeddingService("mock-key-for-dev");
    }
    createSchemaManager() {
        switch (this.config.type) {
            case 'weaviate':
                return new WeaviateSchemaManager(this.currentService);
            case 'postgresql':
                return new PostgreSQLSchemaManager(this.currentService);
            default:
                throw new Error(`Unsupported vector store type: ${this.config.type}`);
        }
    }
    async initialize() {
        try {
            // Initialize the core vector store
            this.currentService = new vector_store_1.VectorStore();
            // Create schema if needed
            await this.createSchemaManager().createSchema();
            this.isInitialized = true;
            console.log(`✅ Vector store service initialized with ${this.config.type} backend`);
        }
        catch (error) {
            console.error('❌ Failed to initialize vector store service:', error);
            throw error;
        }
    }
    async addDocument(document) {
        this.ensureInitialized();
        try {
            const processedDoc = await this.processDocument(document);
            const coreDocument = {
                id: processedDoc.id,
                content: processedDoc.content,
                metadata: processedDoc.metadata || {},
                embedding: processedDoc.embedding || []
            };
            return await this.currentService.storeDocument(coreDocument);
        }
        catch (error) {
            console.error('❌ Failed to add document:', error);
            throw error;
        }
    }
    async addDocuments(documents) {
        this.ensureInitialized();
        try {
            const processedDocs = await this.processBatch(documents);
            const results = [];
            for (const doc of processedDocs) {
                const coreDocument = {
                    id: doc.id,
                    content: doc.content,
                    metadata: doc.metadata || {},
                    embedding: doc.embedding || []
                };
                const id = await this.currentService.storeDocument(coreDocument);
                results.push(id);
            }
            return results;
        }
        catch (error) {
            console.error('❌ Failed to add documents:', error);
            throw error;
        }
    }
    async search(query, options = {}) {
        this.ensureInitialized();
        try {
            const queryEmbedding = await this.embeddingService.embedText(query);
            const searchOptions = {
                limit: options.limit || 10,
                filter: options.filters || {}
            };
            const results = await this.currentService.search(queryEmbedding, searchOptions);
            return results.map((result) => ({
                id: result.id,
                content: result.content,
                score: result.score,
                metadata: result.metadata
            }));
        }
        catch (error) {
            console.error('❌ Failed to search documents:', error);
            throw error;
        }
    }
    async getDocument(id) {
        this.ensureInitialized();
        try {
            const document = await this.currentService.getDocument(id);
            if (!document)
                return null;
            return {
                id: document.id,
                content: document.content,
                metadata: document.metadata,
                embedding: document.embedding
            };
        }
        catch (error) {
            console.error('❌ Failed to get document:', error);
            throw error;
        }
    }
    async updateDocument(id, updates) {
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
            await this.currentService.deleteDocument(id);
            const coreDocument = {
                id: updatedDoc.id,
                content: updatedDoc.content,
                metadata: updatedDoc.metadata || {},
                embedding: updatedDoc.embedding || []
            };
            await this.currentService.storeDocument(coreDocument);
        }
        catch (error) {
            console.error('❌ Failed to update document:', error);
            throw error;
        }
    }
    async deleteDocument(id) {
        this.ensureInitialized();
        try {
            await this.currentService.deleteDocument(id);
        }
        catch (error) {
            console.error('❌ Failed to delete document:', error);
            throw error;
        }
    }
    async getStats() {
        this.ensureInitialized();
        try {
            const totalDocuments = await this.currentService.getDocumentCount();
            return {
                totalDocuments,
                backendType: this.config.type,
                status: 'operational',
                lastUpdated: new Date()
            };
        }
        catch (error) {
            console.error('❌ Failed to get stats:', error);
            throw error;
        }
    }
    async healthCheck() {
        try {
            await this.currentService.healthCheck();
            return true;
        }
        catch (error) {
            console.error('❌ Vector store health check failed:', error);
            return false;
        }
    }
    ensureInitialized() {
        if (!this.isInitialized) {
            throw new Error('Vector store service not initialized');
        }
    }
    async processDocument(document) {
        if (!document.embedding) {
            document.embedding = await this.embeddingService.embedText(document.content);
        }
        return document;
    }
    async processBatch(documents, batchSize = 10) {
        const processed = [];
        for (let i = 0; i < documents.length; i += batchSize) {
            const batch = documents.slice(i, i + batchSize);
            const processedBatch = await Promise.all(batch.map(doc => this.processDocument(doc)));
            processed.push(...processedBatch);
        }
        return processed;
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
exports.VectorStoreService = VectorStoreService;

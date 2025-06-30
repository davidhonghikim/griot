"use strict";
/**
 * MongoDB Manager for PersonaRAG Bridge
 *
 * Handles server-side persistence using existing MongoDB infrastructure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBManager = void 0;
class MongoDBManager {
    constructor(config) {
        Object.defineProperty(this, "config", {
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
        this.state = {
            connected: false,
            collections: [],
            lastSync: null,
            syncStatus: 'idle',
        };
    }
    /**
     * Initialize MongoDB connection
     */
    async initialize() {
        if (!this.config.enabled) {
            console.log('MongoDB disabled in configuration');
            return;
        }
        try {
            // Test connection using existing service connectors
            const response = await fetch(`${this.config.host}/${this.config.database}/admin/ping`, {
                method: 'GET',
            });
            if (response.ok) {
                this.state = {
                    ...this.state,
                    connected: true,
                };
                console.log('✅ MongoDB connected');
            }
            else {
                throw new Error('MongoDB ping failed');
            }
        }
        catch (error) {
            this.state = {
                ...this.state,
                connected: false,
                error: error instanceof Error ? error.message : 'MongoDB connection failed',
            };
            console.warn('⚠️ MongoDB connection failed:', error);
        }
    }
    /**
     * Sync data to MongoDB
     */
    async sync(collection, data) {
        if (!this.config.enabled || !this.state.connected)
            return;
        this.state = { ...this.state, syncStatus: 'syncing' };
        try {
            const response = await fetch(`${this.config.host}/${this.config.database}/${collection}/insertOne`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document: data }),
            });
            if (!response.ok)
                throw new Error('Failed to sync to MongoDB');
            this.state = {
                ...this.state,
                syncStatus: 'idle',
                lastSync: new Date(),
            };
        }
        catch (error) {
            this.state = {
                ...this.state,
                syncStatus: 'error',
                error: error instanceof Error ? error.message : 'MongoDB sync failed',
            };
            throw error;
        }
    }
    /**
     * Query data from MongoDB
     */
    async query(collection, filter = {}) {
        if (!this.config.enabled || !this.state.connected)
            return [];
        try {
            const response = await fetch(`${this.config.host}/${this.config.database}/${collection}/find`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filter }),
            });
            if (!response.ok)
                throw new Error('Failed to query MongoDB');
            const results = await response.json();
            return results;
        }
        catch (error) {
            this.state = {
                ...this.state,
                error: error instanceof Error ? error.message : 'MongoDB query failed',
            };
            throw error;
        }
    }
    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Check if connected
     */
    isConnected() {
        return this.state.connected;
    }
}
exports.MongoDBManager = MongoDBManager;

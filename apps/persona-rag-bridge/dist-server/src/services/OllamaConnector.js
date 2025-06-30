"use strict";
/**
 * Ollama Service Connector
 *
 * Connects to Ollama API for local model inference.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaConnector = void 0;
const ServiceConnector_1 = require("./ServiceConnector");
class OllamaConnector extends ServiceConnector_1.ServiceConnector {
    constructor(baseUrl = 'http://localhost:11434') {
        super('ollama', 'ollama', baseUrl);
    }
    /**
     * Check Ollama health
     */
    async checkHealth() {
        await this.makeRequest('/api/tags');
    }
    /**
     * Cleanup resources
     */
    async cleanup() {
        // No specific cleanup needed for Ollama
    }
    /**
     * Get available models
     */
    async getModels() {
        const response = await this.makeRequest('/api/tags');
        return response.models;
    }
    /**
     * Generate text using a model
     */
    async generate(request) {
        return this.makeRequest('/api/generate', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }
    /**
     * Stream text generation
     */
    async *generateStream(request) {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...request, stream: true }),
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }
        const decoder = new TextDecoder();
        let buffer = '';
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            yield data;
                        }
                        catch (error) {
                            console.warn('Failed to parse Ollama response:', line);
                        }
                    }
                }
            }
        }
        finally {
            reader.releaseLock();
        }
    }
    /**
     * Pull a model
     */
    async pullModel(modelName) {
        await this.makeRequest('/api/pull', {
            method: 'POST',
            body: JSON.stringify({ name: modelName }),
        });
    }
    /**
     * Delete a model
     */
    async deleteModel(modelName) {
        await this.makeRequest('/api/delete', {
            method: 'DELETE',
            body: JSON.stringify({ name: modelName }),
        });
    }
    /**
     * Get model information
     */
    async getModelInfo(modelName) {
        return this.makeRequest(`/api/show`, {
            method: 'POST',
            body: JSON.stringify({ name: modelName }),
        });
    }
}
exports.OllamaConnector = OllamaConnector;

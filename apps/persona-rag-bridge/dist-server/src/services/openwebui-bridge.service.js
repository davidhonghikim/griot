#!/usr/bin/env tsx
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenWebUIBridge = void 0;
const axios_1 = __importDefault(require("axios"));
class OpenWebUIBridge {
    constructor(config, personaRAG) {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "personaRAG", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = axios_1.default.create({
            baseURL: config.url,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        this.personaRAG = personaRAG;
    }
    async sendChatMessage(message, personaId, model = 'llama3.1') {
        try {
            const messages = [];
            if (personaId) {
                const personaContext = await this.getPersonaContext(personaId, message);
                if (personaContext) {
                    messages.push({
                        role: 'system',
                        content: `You are ${personaContext.name}. ${personaContext.description}\n\nContext: ${personaContext.context}\n\nRespond in character as this persona.`
                    });
                }
            }
            messages.push({ role: 'user', content: message });
            const request = {
                messages,
                model,
                temperature: 0.7,
                max_tokens: 1000
            };
            const response = await this.client.post('/v1/chat/completions', request);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async enhancedChat(message, personaId, conversationHistory = []) {
        const startTime = Date.now();
        try {
            let selectedPersona = null;
            let context = '';
            if (!personaId) {
                const personaRequest = {
                    query: message,
                    limit: 1,
                    similarityThreshold: 0.6
                };
                const personaResponse = await this.personaRAG.query(personaRequest);
                if (personaResponse.success && personaResponse.selectedPersona) {
                    selectedPersona = {
                        id: personaResponse.selectedPersona.personaId,
                        name: personaResponse.selectedPersona.name,
                        description: personaResponse.selectedPersona.metadata.description,
                        relevanceScore: personaResponse.selectedPersona.relevanceScore
                    };
                    context = personaResponse.selectedPersona.contextSnippet;
                    personaId = selectedPersona.id;
                }
            }
            else {
                const personaContext = await this.getPersonaContext(personaId, message);
                if (personaContext) {
                    selectedPersona = {
                        id: personaContext.id,
                        name: personaContext.name,
                        description: personaContext.description,
                        relevanceScore: personaContext.relevanceScore
                    };
                    context = personaContext.context;
                }
            }
            const messages = [];
            if (selectedPersona) {
                messages.push({
                    role: 'system',
                    content: `You are ${selectedPersona.name}. ${selectedPersona.description}\n\nContext: ${context}\n\nRespond in character as this persona, drawing from the provided context.`
                });
            }
            messages.push(...conversationHistory);
            messages.push({ role: 'user', content: message });
            const chatRequest = {
                messages,
                model: 'llama3.1',
                temperature: 0.7,
                max_tokens: 1000
            };
            const response = await this.client.post('/v1/chat/completions', chatRequest);
            const processingTime = Date.now() - startTime;
            return {
                message: response.data.choices[0]?.message?.content || '',
                persona: selectedPersona,
                context,
                processingTime,
                success: true
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            return {
                message: '',
                persona: null,
                context: '',
                processingTime,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async getPersonaContext(personaId, query) {
        try {
            const request = {
                query,
                personaId,
                limit: 1,
                includeContent: true
            };
            const response = await this.personaRAG.query(request);
            if (response.success && response.selectedPersona) {
                return {
                    id: response.selectedPersona.personaId,
                    name: response.selectedPersona.name,
                    description: response.selectedPersona.metadata.description,
                    context: response.selectedPersona.contextSnippet,
                    relevanceScore: response.selectedPersona.relevanceScore
                };
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
}
exports.OpenWebUIBridge = OpenWebUIBridge;

export class HuggingFaceRAGService {
    constructor(config, personaLoader, vectorStore, embeddingService) {
        this.config = {
            ...config,
        };
        this.personaLoader = personaLoader;
        this.vectorStore = vectorStore;
        this.embeddingService = embeddingService;
        this.huggingfaceHost = this.config.huggingfaceHost || "";
        this.apiKey = this.config.apiKey || "";
    }
    async initialize() {
        await this.checkHuggingFaceHealth();
        const models = await this.getAvailableModels();
        if (!models.find((m) => m.id === this.config.defaultModel)) {
            this.config.defaultModel = models[0]?.id || 'microsoft/DialoGPT-medium';
        }
    }
    async query(request) {
        const startTime = Date.now();
        const model = request.model || this.config.defaultModel;
        try {
            const retrievalStart = Date.now();
            const retrievedDocuments = await this.retrieveDocuments(request);
            const retrievalTime = Date.now() - retrievalStart;
            const context = this.buildContext(retrievedDocuments, request.query);
            const generationStart = Date.now();
            const huggingfaceResponse = await this.generateWithHuggingFace({
                model: model || "",
                prompt: this.buildPrompt(context, request.query),
                stream: request.stream || this.config.enableStreaming,
                options: {
                    max_new_tokens: request.maxTokens || this.config.maxTokens,
                    top_p: request.topP || this.config.topP,
                    repetition_penalty: request.repetitionPenalty || this.config.repetitionPenalty,
                    do_sample: request.do_sample !== undefined ? request.do_sample : this.config.do_sample,
                }
            });
            const generationTime = Date.now() - generationStart;
            return {
                query: request.query,
                model: model || "",
                response: huggingfaceResponse.response,
                retrievedDocuments: request.includeMetadata ? retrievedDocuments :
                    retrievedDocuments.map(doc => ({
                        id: doc.id,
                        content: doc.content,
                        score: doc.score
                    })),
                context,
                metadata: {
                    retrievalTime,
                    generationTime,
                    totalTokens: huggingfaceResponse.usage?.total_tokens || 0,
                    documentCount: retrievedDocuments.length,
                    modelUsed: model || "",
                    apiEndpoint: this.huggingfaceHost,
                },
            };
        }
        catch (error) {
            throw new Error(`Hugging Face-RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async retrieveDocuments(request) {
        const queryEmbedding = await this.embeddingService.embedText(request.query);
        const searchResults = await this.vectorStore.search(queryEmbedding, {
            limit: request.maxResults || 10,
        });
        return searchResults.map(result => ({
            id: result.id,
            content: result.content,
            score: result.score,
            metadata: result.metadata,
        }));
    }
    buildContext(documents, query) {
        const contextParts = documents.map(doc => doc.content);
        return `Context: ${contextParts.join('\n\n')}\n\nQuery: ${query}`;
    }
    buildPrompt(context, query) {
        return `Based on the following context, please answer the query:\n\n${context}\n\nAnswer:`;
    }
    async generateWithHuggingFace(request) {
        const response = await fetch(`${this.huggingfaceHost}/models/${request.model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: request.prompt,
                ...request.options,
            }),
        });
        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        let responseText = '';
        if (Array.isArray(data)) {
            responseText = data[0]?.generated_text || '';
        }
        else if (typeof data === 'string') {
            responseText = data;
        }
        else {
            responseText = data.generated_text || data.text || '';
        }
        return {
            response: responseText,
            usage: { total_tokens: responseText.length },
        };
    }
    async checkHuggingFaceHealth() {
        try {
            const response = await fetch(`${this.huggingfaceHost}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }
            return true;
        }
        catch (error) {
            throw new Error(`Hugging Face service not available at ${this.huggingfaceHost}`);
        }
    }
    async getAvailableModels() {
        try {
            const response = await fetch(`${this.huggingfaceHost}/api/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to get models: ${response.status}`);
            }
            const data = await response.json();
            return data || [];
        }
        catch (error) {
            return [];
        }
    }
    async searchModels(query, task) {
        try {
            const params = new URLSearchParams({
                search: query,
                ...(task && { filter: task }),
            });
            const response = await fetch(`${this.huggingfaceHost}/api/models?${params}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to search models: ${response.status}`);
            }
            const data = await response.json();
            return data || [];
        }
        catch (error) {
            return [];
        }
    }
    async getModelInfo(modelId) {
        try {
            const response = await fetch(`${this.huggingfaceHost}/api/models/${modelId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to get model info: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return null;
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.apiKey = this.config.apiKey || "";
    }
    async getStats() {
        const models = await this.getAvailableModels();
        return {
            availableModels: models.length,
            vectorStoreStatus: 'connected',
            embeddingServiceStatus: 'ready',
            apiEndpoint: this.huggingfaceHost,
        };
    }
}
//# sourceMappingURL=huggingface_rag_service.js.map
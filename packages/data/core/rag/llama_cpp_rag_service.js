export class LlamaCppRAGService {
    constructor(config, personaLoader, vectorStore, embeddingService) {
        this.config = {
            llamaCppHost: 'http://localhost:8080',
            defaultModel: 'gemma-2b-it.gguf',
            maxTokens: 2048,
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            similarityThreshold: 0.7,
            maxResults: 5,
            enableStreaming: false,
            contextSize: 4096,
            threads: 8,
            ...config,
        };
        this.personaLoader = personaLoader;
        this.vectorStore = vectorStore;
        this.embeddingService = embeddingService;
        this.llamaCppHost = this.config.llamaCppHost;
    }
    async initialize() {
        console.log('🔄 Initializing Llama.cpp-RAG Service...');
        await this.checkLlamaCppHealth();
        const models = await this.getAvailableModels();
        console.log(`📚 Available Llama.cpp models: ${models.map(m => m.name).join(', ')}`);
        if (!models.find(m => m.name === this.config.defaultModel)) {
            console.warn(`⚠️ Default model ${this.config.defaultModel} not found, using fallback`);
            this.config.defaultModel = models.find(m => m.name === 'qwen2.5-coder.gguf')?.name || models[0]?.name || 'gemma-2b-it.gguf';
        }
        console.log(`✅ Llama.cpp-RAG Service initialized with model: ${this.config.defaultModel}`);
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
            const llamaCppResponse = await this.generateWithLlamaCpp({
                model,
                prompt: this.buildPrompt(context, request.query),
                stream: request.stream || this.config.enableStreaming,
                options: {
                    max_tokens: request.maxTokens || this.config.maxTokens,
                    temperature: request.temperature || this.config.temperature,
                    top_p: request.topP || this.config.topP,
                    top_k: request.topK || this.config.topK,
                    stop: request.stop || [],
                }
            });
            const generationTime = Date.now() - generationStart;
            return {
                query: request.query,
                model,
                response: llamaCppResponse.response,
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
                    totalTokens: llamaCppResponse.usage?.total_tokens || 0,
                    documentCount: retrievedDocuments.length,
                    modelUsed: model,
                    contextSize: this.config.contextSize,
                },
            };
        }
        catch (error) {
            console.error('Llama.cpp-RAG query failed:', error);
            throw new Error(`Llama.cpp-RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        let context = `Query: ${query}\n\nRelevant Information:\n`;
        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            if (!doc)
                continue;
            context += `${i + 1}. [Similarity: ${doc.score.toFixed(3)}] ${doc.content}\n\n`;
        }
        return context;
    }
    buildPrompt(context, query) {
        return `You are a helpful AI assistant with access to relevant information. Use the context below to answer the user's question accurately and comprehensively.

${context}

Based on the information above, please answer the following question:

Question: ${query}

Answer:`;
    }
    async generateWithLlamaCpp(params) {
        const url = `${this.llamaCppHost}/v1/chat/completions`;
        const payload = {
            model: params.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant with access to relevant information.'
                },
                {
                    role: 'user',
                    content: params.prompt
                }
            ],
            stream: params.stream || false,
            max_tokens: params.options?.max_tokens || this.config.maxTokens,
            temperature: params.options?.temperature || this.config.temperature,
            top_p: params.options?.top_p || this.config.topP,
            top_k: params.options?.top_k || this.config.topK,
            stop: params.options?.stop || [],
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Llama.cpp API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return {
            response: data.choices[0]?.message?.content || '',
            usage: data.usage,
        };
    }
    async checkLlamaCppHealth() {
        try {
            const response = await fetch(`${this.llamaCppHost}/health`);
            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }
            return true;
        }
        catch (error) {
            console.error('Llama.cpp health check failed:', error);
            throw new Error(`Llama.cpp service not available at ${this.llamaCppHost}`);
        }
    }
    async getAvailableModels() {
        try {
            const response = await fetch(`${this.llamaCppHost}/v1/models`);
            if (!response.ok) {
                throw new Error(`Failed to get models: ${response.status}`);
            }
            const data = await response.json();
            return data.data || [];
        }
        catch (error) {
            console.error('Failed to get Llama.cpp models:', error);
            return [];
        }
    }
    async loadModel(modelName) {
        try {
            const response = await fetch(`${this.llamaCppHost}/v1/models`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: modelName,
                    path: `/models/${modelName}`
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to load model: ${response.status}`);
            }
            console.log(`✅ Successfully loaded model: ${modelName}`);
        }
        catch (error) {
            console.error(`Failed to load model ${modelName}:`, error);
            throw error;
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    async getStats() {
        const models = await this.getAvailableModels();
        return {
            llamaCppHost: this.llamaCppHost,
            defaultModel: this.config.defaultModel,
            availableModels: models.length,
            vectorStoreStatus: 'connected',
            embeddingServiceStatus: 'ready',
            contextSize: this.config.contextSize,
            threads: this.config.threads,
        };
    }
}
//# sourceMappingURL=llama_cpp_rag_service.js.map
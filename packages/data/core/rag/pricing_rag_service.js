export class PricingRAGService {
    constructor(vectorStore, embeddingService, defaultPricingPath = 'packages/data/config/default_pricing.json') {
        this.vectorStore = vectorStore;
        this.embeddingService = embeddingService;
        this.defaultPricingPath = defaultPricingPath;
    }
    async initialize() {
        console.log('🔄 Initializing Pricing RAG Service...');
        const defaultPricing = await this.loadDefaultPricing();
        const documents = this.convertPricingToDocuments(defaultPricing);
        await this.vectorizeAndStore(documents);
        console.log('✅ Pricing RAG Service initialized');
    }
    async loadDefaultPricing() {
        try {
            const fs = await import('fs/promises');
            const data = await fs.readFile(this.defaultPricingPath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Failed to load default pricing:', error);
            throw new Error('Default pricing data not available');
        }
    }
    convertPricingToDocuments(pricingData) {
        const documents = [];
        for (const [providerKey, provider] of Object.entries(pricingData.providers)) {
            const providerData = provider;
            documents.push({
                id: `provider_${providerKey}`,
                type: 'provider',
                content: `${providerData.display_name} - ${providerData.description}. Website: ${providerData.website || 'N/A'}. Status: ${providerData.status}`,
                metadata: {
                    provider_key: providerKey,
                    display_name: providerData.display_name,
                    website: providerData.website,
                    status: providerData.status,
                    provider_type: 'ai_service'
                }
            });
            if (providerData.models) {
                for (const [modelKey, model] of Object.entries(providerData.models)) {
                    const modelData = model;
                    documents.push({
                        id: `model_${providerKey}_${modelKey}`,
                        type: 'model',
                        content: `${modelData.display_name} by ${providerData.display_name}. ${modelData.description}. Input: $${modelData.input_price_per_1m_tokens}/1M tokens, Output: $${modelData.output_price_per_1m_tokens}/1M tokens. Context window: ${modelData.context_window} tokens.`,
                        metadata: {
                            provider_key: providerKey,
                            model_key: modelKey,
                            display_name: modelData.display_name,
                            input_price_per_1m_tokens: modelData.input_price_per_1m_tokens,
                            output_price_per_1m_tokens: modelData.output_price_per_1m_tokens,
                            context_window: modelData.context_window,
                            max_tokens: modelData.max_tokens,
                            is_active: modelData.is_active,
                            model_type: 'text_generation'
                        }
                    });
                }
            }
            if (providerData.media_pricing) {
                for (const [mediaType, mediaPricing] of Object.entries(providerData.media_pricing)) {
                    const mediaData = mediaPricing;
                    documents.push({
                        id: `media_${providerKey}_${mediaType}`,
                        type: 'media_pricing',
                        content: `${providerData.display_name} ${mediaType} generation. Base cost: $${mediaData.base_cost} per ${mediaData.pricing_model}.`,
                        metadata: {
                            provider_key: providerKey,
                            media_type: mediaType,
                            pricing_model: mediaData.pricing_model,
                            base_cost: mediaData.base_cost,
                            resolution_multipliers: mediaData.resolution_multipliers,
                            quality_multipliers: mediaData.quality_multipliers,
                            media_type_category: mediaType
                        }
                    });
                }
            }
        }
        return documents;
    }
    async vectorizeAndStore(documents) {
        console.log(`📊 Vectorizing ${documents.length} pricing documents...`);
        for (const document of documents) {
            const embedding = await this.embeddingService.embedText(document.content);
            await this.vectorStore.storeDocument({
                id: document.id,
                content: document.content,
                embedding,
                metadata: document.metadata
            });
        }
        console.log('✅ Pricing documents vectorized and stored');
    }
    async searchPricing(query) {
        const semanticQuery = this.buildSemanticQuery(query);
        const queryEmbedding = await this.embeddingService.embedText(semanticQuery);
        const searchResults = await this.vectorStore.search(queryEmbedding, {
            limit: 10,
            filter: this.buildSearchFilter(query)
        });
        return this.convertSearchResultsToPricingResults(searchResults, query);
    }
    buildSemanticQuery(query) {
        const parts = [];
        if (query.provider) {
            parts.push(`provider: ${query.provider}`);
        }
        if (query.model) {
            parts.push(`model: ${query.model}`);
        }
        if (query.mediaType) {
            parts.push(`${query.mediaType} generation pricing`);
        }
        if (query.useCase) {
            parts.push(`good for ${query.useCase}`);
        }
        if (query.performance) {
            switch (query.performance) {
                case 'fast':
                    parts.push('fast and efficient model');
                    break;
                case 'balanced':
                    parts.push('balanced performance and cost');
                    break;
                case 'high_quality':
                    parts.push('highest quality model');
                    break;
            }
        }
        if (query.maxPrice) {
            parts.push(`cost under $${query.maxPrice} per 1M tokens`);
        }
        if (query.contextWindow) {
            parts.push(`context window at least ${query.contextWindow} tokens`);
        }
        return parts.join('. ');
    }
    buildSearchFilter(query) {
        const filter = {};
        if (query.provider) {
            filter.provider_key = query.provider;
        }
        if (query.mediaType) {
            filter.media_type = query.mediaType;
        }
        if (query.maxPrice) {
            filter.input_price_per_1m_tokens = { $lte: query.maxPrice };
        }
        if (query.minPrice) {
            filter.input_price_per_1m_tokens = { $gte: query.minPrice };
        }
        return filter;
    }
    convertSearchResultsToPricingResults(searchResults, query) {
        const results = [];
        for (const result of searchResults) {
            if (result.metadata.type === 'model') {
                results.push({
                    model: result.metadata.model_key,
                    provider: result.metadata.provider_key,
                    inputPrice: result.metadata.input_price_per_1m_tokens,
                    outputPrice: result.metadata.output_price_per_1m_tokens,
                    contextWindow: result.metadata.context_window,
                    maxTokens: result.metadata.max_tokens,
                    description: result.metadata.display_name,
                    confidence: result.score,
                    metadata: result.metadata
                });
            }
        }
        return results.sort((a, b) => {
            if (Math.abs(a.confidence - b.confidence) > 0.1) {
                return b.confidence - a.confidence;
            }
            return a.inputPrice - b.inputPrice;
        });
    }
    async getModelPricing(modelKey, providerKey) {
        const query = {
            model: modelKey,
            provider: providerKey
        };
        const results = await this.searchPricing(query);
        return results.length > 0 && results[0] !== undefined ? results[0] : null;
    }
    async compareModels(modelKeys) {
        const results = [];
        for (const modelKey of modelKeys) {
            const pricing = await this.getModelPricing(modelKey);
            if (pricing) {
                results.push(pricing);
            }
        }
        return results.sort((a, b) => a.inputPrice - b.inputPrice);
    }
    async findBestModel(useCase, maxBudget, performance = 'balanced') {
        const query = {
            useCase,
            maxPrice: maxBudget,
            performance
        };
        const results = await this.searchPricing(query);
        return results.length > 0 && results[0] !== undefined ? results[0] : null;
    }
    async updatePricingData(newPricingData) {
        console.log('🔄 Updating pricing data in RAG system...');
        const documents = this.convertPricingToDocuments(newPricingData);
        await this.vectorizeAndStore(documents);
        console.log('✅ Pricing data updated');
    }
    async getPricingStats() {
        return {
            totalProviders: 0,
            totalModels: 0,
            averageInputPrice: 0,
            averageOutputPrice: 0,
            priceRange: { min: 0, max: 0 }
        };
    }
}
//# sourceMappingURL=pricing_rag_service.js.map
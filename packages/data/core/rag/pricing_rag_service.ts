import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
import { PricingDocument } from '../types/pricing_types';

export interface PricingQuery {
  provider?: string;
  model?: string;
  mediaType?: 'text' | 'image' | 'video' | 'audio';
  maxPrice?: number;
  minPrice?: number;
  contextWindow?: number;
  useCase?: string; // e.g., "summarization", "code generation", "creative writing"
  performance?: 'fast' | 'balanced' | 'high_quality';
}

export interface PricingResult {
  model: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
  maxTokens: number;
  description: string;
  confidence: number;
  metadata: Record<string, any>;
}

export class PricingRAGService {
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;
  private defaultPricingPath: string;

  constructor(
    vectorStore: VectorStore,
    embeddingService: EmbeddingService,
    defaultPricingPath: string = 'packages/data/config/default_pricing.json'
  ) {
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
    this.defaultPricingPath = defaultPricingPath;
  }

  /**
   * Initialize the RAG system with pricing data
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing Pricing RAG Service...');
    
    // Load default pricing data
    const defaultPricing = await this.loadDefaultPricing();
    
    // Convert to documents for vectorization
    const documents = this.convertPricingToDocuments(defaultPricing);
    
    // Generate embeddings and store in vector database
    await this.vectorizeAndStore(documents);
    
    console.log('✅ Pricing RAG Service initialized');
  }

  /**
   * Load default pricing data from JSON file
   */
  private async loadDefaultPricing(): Promise<any> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(this.defaultPricingPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load default pricing:', error);
      throw new Error('Default pricing data not available');
    }
  }

  /**
   * Convert pricing data to documents for vectorization
   */
  private convertPricingToDocuments(pricingData: any): PricingDocument[] {
    const documents: PricingDocument[] = [];

    for (const [providerKey, provider] of Object.entries(pricingData.providers)) {
      const providerData = provider as any;
      
      // Add provider-level document
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

      // Add model-level documents
      if (providerData.models) {
        for (const [modelKey, model] of Object.entries(providerData.models)) {
          const modelData = model as any;
          
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

      // Add media pricing documents
      if (providerData.media_pricing) {
        for (const [mediaType, mediaPricing] of Object.entries(providerData.media_pricing)) {
          const mediaData = mediaPricing as any;
          
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

  /**
   * Vectorize documents and store in vector database
   */
  private async vectorizeAndStore(documents: PricingDocument[]): Promise<void> {
    console.log(`📊 Vectorizing ${documents.length} pricing documents...`);

    for (const document of documents) {
      // Generate embedding for document content
      const embedding = await this.embeddingService.embedText(document.content);
      
      // Store in vector database
      await this.vectorStore.storeDocument({
        id: document.id,
        content: document.content,
        embedding,
        metadata: document.metadata
      });
    }

    console.log('✅ Pricing documents vectorized and stored');
  }

  /**
   * Search for pricing information using semantic queries
   */
  async searchPricing(query: PricingQuery): Promise<PricingResult[]> {
    // Build semantic query
    const semanticQuery = this.buildSemanticQuery(query);
    
    // Generate embedding for query
    const queryEmbedding = await this.embeddingService.embedText(semanticQuery);
    
    // Search vector database
    const searchResults = await this.vectorStore.search(queryEmbedding, {
      limit: 10,
      filter: this.buildSearchFilter(query)
    });

    // Convert to pricing results
    return this.convertSearchResultsToPricingResults(searchResults, query);
  }

  /**
   * Build semantic query from structured query
   */
  private buildSemanticQuery(query: PricingQuery): string {
    const parts: string[] = [];

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

  /**
   * Build search filter for vector database
   */
  private buildSearchFilter(query: PricingQuery): Record<string, any> {
    const filter: Record<string, any> = {};

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

  /**
   * Convert search results to pricing results
   */
  private convertSearchResultsToPricingResults(
    searchResults: any[],
    query: PricingQuery
  ): PricingResult[] {
    const results: PricingResult[] = [];

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

    // Sort by relevance and price
    return results.sort((a, b) => {
      // First by confidence score
      if (Math.abs(a.confidence - b.confidence) > 0.1) {
        return b.confidence - a.confidence;
      }
      
      // Then by input price (cheaper first)
      return a.inputPrice - b.inputPrice;
    });
  }

  /**
   * Get specific model pricing
   */
  async getModelPricing(modelKey: string, providerKey?: string): Promise<PricingResult | null> {
    const query: PricingQuery = {
      model: modelKey,
      provider: providerKey
    };

    const results = await this.searchPricing(query);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get cost comparison for multiple models
   */
  async compareModels(modelKeys: string[]): Promise<PricingResult[]> {
    const results: PricingResult[] = [];

    for (const modelKey of modelKeys) {
      const pricing = await this.getModelPricing(modelKey);
      if (pricing) {
        results.push(pricing);
      }
    }

    return results.sort((a, b) => a.inputPrice - b.inputPrice);
  }

  /**
   * Find best model for specific use case and budget
   */
  async findBestModel(
    useCase: string,
    maxBudget: number,
    performance: 'fast' | 'balanced' | 'high_quality' = 'balanced'
  ): Promise<PricingResult | null> {
    const query: PricingQuery = {
      useCase,
      maxPrice: maxBudget,
      performance
    };

    const results = await this.searchPricing(query);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update pricing data (for when new data is available)
   */
  async updatePricingData(newPricingData: any): Promise<void> {
    console.log('🔄 Updating pricing data in RAG system...');
    
    // Convert new data to documents
    const documents = this.convertPricingToDocuments(newPricingData);
    
    // Update vector database
    await this.vectorizeAndStore(documents);
    
    console.log('✅ Pricing data updated');
  }

  /**
   * Get pricing statistics
   */
  async getPricingStats(): Promise<{
    totalProviders: number;
    totalModels: number;
    averageInputPrice: number;
    averageOutputPrice: number;
    priceRange: { min: number; max: number };
  }> {
    // This would query the vector database for statistics
    // Implementation depends on the specific vector database used
    return {
      totalProviders: 0,
      totalModels: 0,
      averageInputPrice: 0,
      averageOutputPrice: 0,
      priceRange: { min: 0, max: 0 }
    };
  }
} 
import { VectorStore } from './vector_store.js';
import { EmbeddingService } from './embedding_service.js';
export interface PricingQuery {
    provider?: string;
    model?: string;
    mediaType?: 'text' | 'image' | 'video' | 'audio';
    maxPrice?: number;
    minPrice?: number;
    contextWindow?: number;
    useCase?: string;
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
export declare class PricingRAGService {
    private vectorStore;
    private embeddingService;
    private defaultPricingPath;
    constructor(vectorStore: VectorStore, embeddingService: EmbeddingService, defaultPricingPath?: string);
    initialize(): Promise<void>;
    private loadDefaultPricing;
    private convertPricingToDocuments;
    private vectorizeAndStore;
    searchPricing(query: PricingQuery): Promise<PricingResult[]>;
    private buildSemanticQuery;
    private buildSearchFilter;
    private convertSearchResultsToPricingResults;
    getModelPricing(modelKey: string, providerKey?: string): Promise<PricingResult | null>;
    compareModels(modelKeys: string[]): Promise<PricingResult[]>;
    findBestModel(useCase: string, maxBudget: number, performance?: 'fast' | 'balanced' | 'high_quality'): Promise<PricingResult | null>;
    updatePricingData(newPricingData: any): Promise<void>;
    getPricingStats(): Promise<{
        totalProviders: number;
        totalModels: number;
        averageInputPrice: number;
        averageOutputPrice: number;
        priceRange: {
            min: number;
            max: number;
        };
    }>;
}
//# sourceMappingURL=pricing_rag_service.d.ts.map
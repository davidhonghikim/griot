export interface EmbeddingOptions {
    model?: string;
    dimensions?: number;
    truncate?: 'NONE' | 'START' | 'END';
}
export interface BatchEmbeddingOptions extends EmbeddingOptions {
    batchSize?: number;
    delayBetweenBatches?: number;
}
export declare class EmbeddingService {
    private openai;
    private defaultModel;
    private defaultDimensions;
    constructor();
    embedText(text: string, options?: EmbeddingOptions): Promise<number[]>;
    embedBatch(texts: string[], options?: BatchEmbeddingOptions): Promise<number[][]>;
    embedTextsWithMetadata(texts: Array<{
        text: string;
        metadata?: Record<string, any>;
    }>, options?: BatchEmbeddingOptions): Promise<Array<{
        embedding: number[];
        metadata?: Record<string, any>;
    }>>;
    getEmbeddingDimensions(model?: string): Promise<number>;
    validateEmbedding(embedding: number[]): Promise<boolean>;
    healthCheck(): Promise<boolean>;
    getModelInfo(): {
        model: string;
        dimensions: number;
    };
}
//# sourceMappingURL=embedding_service.d.ts.map
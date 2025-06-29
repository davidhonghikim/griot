import { PersonaLoader } from '../persona_loader';
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
export interface OllamaRAGConfig {
    ollamaHost?: string;
    apiKey?: string;
    defaultModel?: string;
    enableStreaming?: boolean;
    maxTokens?: number;
    topP?: number;
    temperature?: number;
    similarityThreshold?: number;
}
export interface OllamaRAGRequest {
    query: string;
    model?: string;
    context?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    similarityThreshold?: number;
    maxResults?: number;
    includeMetadata?: boolean;
    stream?: boolean;
}
export interface OllamaRAGResponse {
    query: string;
    model: string;
    response: string;
    retrievedDocuments: Array<{
        id: string;
        content: string;
        score: number;
        metadata?: Record<string, any>;
    }>;
    context: string;
    metadata: {
        retrievalTime: number;
        generationTime: number;
        totalTokens: number;
        documentCount: number;
        modelUsed: string;
        apiEndpoint: string;
    };
}
export interface OllamaModelInfo {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    details: {
        format: string;
        family: string;
        families: string[];
        parameter_size: string;
        quantization_level: string;
    };
}
export declare class OllamaRAGService {
    private config;
    private ollamaHost;
    private apiKey;
    private personaLoader;
    private vectorStore;
    private embeddingService;
    constructor(config: OllamaRAGConfig, personaLoader: PersonaLoader, vectorStore: VectorStore, embeddingService: EmbeddingService);
    initialize(): Promise<void>;
    query(request: OllamaRAGRequest): Promise<OllamaRAGResponse>;
    private retrieveDocuments;
    private buildContext;
    private buildPrompt;
    private generateWithOllama;
    checkOllamaHealth(): Promise<boolean>;
    getAvailableModels(): Promise<OllamaModelInfo[]>;
    pullModel(modelName: string): Promise<void>;
    deleteModel(modelName: string): Promise<void>;
    getConfig(): OllamaRAGConfig;
    updateConfig(newConfig: Partial<OllamaRAGConfig>): void;
    getStats(): Promise<{
        ollamaHost: string;
        defaultModel: string;
        availableModels: number;
        vectorStoreStatus: string;
        embeddingServiceStatus: string;
    }>;
}
//# sourceMappingURL=ollama_rag_service.d.ts.map
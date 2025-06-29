import { PersonaLoader } from '../persona_loader';
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
export interface LlamaCppRAGConfig {
    llamaCppHost: string;
    defaultModel: string;
    maxTokens: number;
    temperature: number;
    topP: number;
    topK: number;
    similarityThreshold: number;
    maxResults: number;
    enableStreaming: boolean;
    contextSize: number;
    threads: number;
}
export interface LlamaCppRAGRequest {
    query: string;
    model?: string;
    context?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    similarityThreshold?: number;
    maxResults?: number;
    includeMetadata?: boolean;
    stream?: boolean;
    stop?: string[];
}
export interface LlamaCppRAGResponse {
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
        contextSize: number;
    };
}
export interface LlamaCppModelInfo {
    name: string;
    size: number;
    modified_at: string;
    digest: string;
    details: {
        format: string;
        family: string;
        families?: string[];
        parameter_size: string;
        quantization_level: string;
    };
}
export declare class LlamaCppRAGService {
    private config;
    private personaLoader;
    private vectorStore;
    private embeddingService;
    private llamaCppHost;
    constructor(config: Partial<LlamaCppRAGConfig>, personaLoader: PersonaLoader, vectorStore: VectorStore, embeddingService: EmbeddingService);
    initialize(): Promise<void>;
    query(request: LlamaCppRAGRequest): Promise<LlamaCppRAGResponse>;
    private retrieveDocuments;
    private buildContext;
    private buildPrompt;
    private generateWithLlamaCpp;
    checkLlamaCppHealth(): Promise<boolean>;
    getAvailableModels(): Promise<LlamaCppModelInfo[]>;
    loadModel(modelName: string): Promise<void>;
    getConfig(): LlamaCppRAGConfig;
    updateConfig(newConfig: Partial<LlamaCppRAGConfig>): void;
    getStats(): Promise<{
        llamaCppHost: string;
        defaultModel: string;
        availableModels: number;
        vectorStoreStatus: string;
        embeddingServiceStatus: string;
        contextSize: number;
        threads: number;
    }>;
}
//# sourceMappingURL=llama_cpp_rag_service.d.ts.map
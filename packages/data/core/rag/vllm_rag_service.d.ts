import { PersonaLoader } from '../persona_loader';
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
export interface VLLMRAGConfig {
    vllmHost?: string;
    apiKey?: string;
    defaultModel?: string;
    enableStreaming?: boolean;
    maxTokens?: number;
    topP?: number;
    temperature?: number;
    similarityThreshold?: number;
}
export interface VLLMRAGRequest {
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
export interface VLLMRAGResponse {
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
export interface VLLMModelInfo {
    id: string;
    object: string;
    created: number;
    owned_by: string;
    permission: any[];
    root: string;
    parent: string;
}
export declare class VLLMRAGService {
    private config;
    private vllmHost;
    private apiKey;
    private personaLoader;
    private vectorStore;
    private embeddingService;
    constructor(config: VLLMRAGConfig, personaLoader: PersonaLoader, vectorStore: VectorStore, embeddingService: EmbeddingService);
    initialize(): Promise<void>;
    query(request: VLLMRAGRequest): Promise<VLLMRAGResponse>;
    private retrieveDocuments;
    private buildContext;
    private buildPrompt;
    private generateWithVLLM;
    checkVLLMHealth(): Promise<boolean>;
    getAvailableModels(): Promise<VLLMModelInfo[]>;
    getConfig(): VLLMRAGConfig;
    updateConfig(newConfig: Partial<VLLMRAGConfig>): void;
    getStats(): Promise<{
        availableModels: number;
        vectorStoreStatus: string;
        embeddingServiceStatus: string;
        apiEndpoint: string;
    }>;
}
//# sourceMappingURL=vllm_rag_service.d.ts.map
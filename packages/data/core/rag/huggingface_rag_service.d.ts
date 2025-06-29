import { PersonaLoader } from '../persona_loader';
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
export interface HuggingFaceRAGConfig {
    huggingfaceHost?: string;
    apiKey?: string;
    defaultModel?: string;
    enableStreaming?: boolean;
    maxTokens?: number;
    topP?: number;
    repetitionPenalty?: number;
    do_sample?: boolean;
    similarityThreshold?: number;
}
export interface HuggingFaceRAGRequest {
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
    repetitionPenalty?: number;
    do_sample?: boolean;
}
export interface HuggingFaceRAGResponse {
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
export interface HuggingFaceModelInfo {
    id: string;
    name: string;
    description: string;
    tags: string[];
    task: string;
    downloads: number;
    likes: number;
    author: string;
}
export declare class HuggingFaceRAGService {
    private config;
    private huggingfaceHost;
    private apiKey;
    private personaLoader;
    private vectorStore;
    private embeddingService;
    constructor(config: HuggingFaceRAGConfig, personaLoader: PersonaLoader, vectorStore: VectorStore, embeddingService: EmbeddingService);
    initialize(): Promise<void>;
    query(request: HuggingFaceRAGRequest): Promise<HuggingFaceRAGResponse>;
    private retrieveDocuments;
    private buildContext;
    private buildPrompt;
    private generateWithHuggingFace;
    checkHuggingFaceHealth(): Promise<boolean>;
    getAvailableModels(): Promise<HuggingFaceModelInfo[]>;
    searchModels(query: string, task?: string): Promise<HuggingFaceModelInfo[]>;
    getModelInfo(modelId: string): Promise<HuggingFaceModelInfo | null>;
    getConfig(): HuggingFaceRAGConfig;
    updateConfig(newConfig: Partial<HuggingFaceRAGConfig>): void;
    getStats(): Promise<{
        availableModels: number;
        vectorStoreStatus: string;
        embeddingServiceStatus: string;
        apiEndpoint: string;
    }>;
}
//# sourceMappingURL=huggingface_rag_service.d.ts.map
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
import { PersonaVectorizationService } from './persona_vectorization_service';
export interface PersonaRAGRequest {
    query: string;
    personaId?: string;
    personaFilter?: {
        base?: string;
        variant?: string;
        author?: string;
        tags?: string[];
    };
    limit?: number;
    similarityThreshold?: number;
    includeContent?: boolean;
    contextWindow?: number;
}
export interface PersonaRAGResult {
    personaId: string;
    name: string;
    relevanceScore: number;
    content: string;
    contextSnippet: string;
    metadata: {
        base: string;
        variant: string;
        author: string;
        tags: string[];
        description: string;
    };
    processingTime: number;
}
export interface PersonaRAGResponse {
    query: string;
    results: PersonaRAGResult[];
    totalResults: number;
    processingTime: number;
    selectedPersona?: PersonaRAGResult;
    averageRelevance: number;
    success: boolean;
    error?: string;
}
export declare class PersonaRAGService {
    private vectorStore;
    private embeddingService;
    private personaVectorization;
    private initialized;
    constructor(vectorStore: VectorStore, embeddingService: EmbeddingService, personaVectorization: PersonaVectorizationService);
    initialize(): Promise<void>;
    query(request: PersonaRAGRequest): Promise<PersonaRAGResponse>;
    getPersonaContext(personaId: string, query: string, options?: {
        maxLength?: number;
        includeSkills?: boolean;
        includeKnowledge?: boolean;
    }): Promise<{
        context: string;
        relevanceScore: number;
        metadata: Record<string, any>;
    }>;
    selectBestPersona(query: string, options?: {
        excludePersonas?: string[];
        requiredTags?: string[];
        preferredBase?: string;
        minRelevanceScore?: number;
    }): Promise<PersonaRAGResult | null>;
    getPersonaEnsemble(query: string, ensembleSize?: number, options?: {
        diversityThreshold?: number;
        maxSimilarity?: number;
        requiredTags?: string[];
    }): Promise<PersonaRAGResult[]>;
    getPersonaRecommendations(query: string, userId?: string, options?: {
        includeReasonings?: boolean;
        maxRecommendations?: number;
        contextHistory?: string[];
    }): Promise<{
        primary: PersonaRAGResult;
        alternatives: PersonaRAGResult[];
        reasonings: Array<{
            personaId: string;
            reasoning: string;
            confidence: number;
        }>;
    }>;
    updatePersonaVectors(personaId: string): Promise<void>;
    getRAGStats(): Promise<{
        totalPersonas: number;
        vectorizedPersonas: number;
        averageQueryTime: number;
        totalQueries: number;
        successRate: number;
    }>;
    private verifyVectorStore;
    private buildPersonaFilter;
    private convertToPersonaResults;
    private extractContextSnippet;
    private enhancePersonaContext;
    private selectDiversePersonas;
    private calculatePersonaSimilarity;
    private generatePersonaReasonings;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=persona_rag_service.d.ts.map
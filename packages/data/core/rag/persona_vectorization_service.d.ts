import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
import { PersonaLoader } from '../persona_loader';
export interface PersonaDocument {
    id: string;
    uuid: string;
    name: string;
    base: string;
    variant: string;
    author: string;
    description: string;
    tags: string[];
    content: {
        yaml: string;
        parsed: any;
    };
    vectorId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PersonaVectorizationConfig {
    vectorStore: VectorStore;
    embeddingService: EmbeddingService;
    personaLoader: PersonaLoader;
    chunkSize?: number;
    overlapSize?: number;
    similarityThreshold?: number;
}
export interface PersonaVectorizationResult {
    personaId: string;
    vectorId: string;
    contentLength: number;
    embeddingDimensions: number;
    processingTime: number;
    success: boolean;
    error?: string;
}
export declare class PersonaVectorizationService {
    private config;
    private vectorizedPersonas;
    constructor(config: PersonaVectorizationConfig);
    initialize(): Promise<void>;
    vectorizePersona(personaId: string): Promise<PersonaVectorizationResult>;
    vectorizeAllPersonas(): Promise<PersonaVectorizationResult[]>;
    updatePersonaVectors(personaId: string): Promise<PersonaVectorizationResult>;
    getPersonaVector(personaId: string): Promise<number[] | null>;
    searchPersonas(query: string, options?: {
        limit?: number;
        filter?: Record<string, any>;
        includeContent?: boolean;
    }): Promise<Array<{
        personaId: string;
        score: number;
        metadata: Record<string, any>;
        content?: string;
    }>>;
    getVectorizationStats(): Promise<{
        totalPersonas: number;
        vectorizedPersonas: number;
        averageProcessingTime: number;
        totalContentLength: number;
        averageContentLength: number;
    }>;
    private extractPersonaContent;
    private loadExistingVectors;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=persona_vectorization_service.d.ts.map
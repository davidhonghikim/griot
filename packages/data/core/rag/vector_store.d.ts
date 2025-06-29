export interface VectorDocument {
    id: string;
    content: string;
    embedding: number[];
    metadata: Record<string, any>;
}
export interface SearchOptions {
    limit?: number;
    filter?: Record<string, any>;
    nearVector?: number[];
}
export interface SearchResult {
    id: string;
    content: string;
    embedding: number[];
    metadata: Record<string, any>;
    score: number;
}
export declare class VectorStore {
    private client;
    private className;
    private isInitialized;
    constructor();
    initialize(): Promise<void>;
    storeDocument(document: VectorDocument): Promise<string>;
    getDocument(id: string): Promise<VectorDocument | null>;
    deleteDocument(id: string): Promise<void>;
    search(embedding: number[], options?: SearchOptions): Promise<SearchResult[]>;
    getDocumentCount(): Promise<number>;
    clearAllDocuments(): Promise<void>;
    private ensureClassExists;
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=vector_store.d.ts.map
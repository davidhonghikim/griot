/**
 * vLLM-RAG Integration Service
 * 
 * Integrates vLLM with the existing RAG system for
 * enhanced retrieval-augmented generation capabilities.
 */

import { PersonaLoader } from '../persona_loader';
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';

export interface VLLMRAGConfig {
  vllmHost: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  similarityThreshold: number;
  maxResults: number;
  enableStreaming: boolean;
  tensorParallelSize: number;
  gpuMemoryUtilization: number;
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
    similarity: number;
    metadata?: Record<string, any>;
  }>;
  context: string;
  metadata: {
    retrievalTime: number;
    generationTime: number;
    totalTokens: number;
    documentCount: number;
    modelUsed: string;
    tensorParallelSize: number;
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

export class VLLMRAGService {
  private config: VLLMRAGConfig;
  private personaLoader: PersonaLoader;
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;
  private vllmHost: string;

  constructor(
    config: VLLMRAGConfig,
    personaLoader: PersonaLoader,
    vectorStore: VectorStore,
    embeddingService: EmbeddingService
  ) {
    this.config = {
      vllmHost: 'http://localhost:8000',
      defaultModel: 'microsoft/DialoGPT-medium',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
      similarityThreshold: 0.7,
      maxResults: 5,
      enableStreaming: false,
      tensorParallelSize: 1,
      gpuMemoryUtilization: 0.9,
      ...config,
    };
    
    this.personaLoader = personaLoader;
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
    this.vllmHost = this.config.vllmHost;
  }

  /**
   * Initialize the vLLM-RAG service
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing vLLM-RAG Service...');
    
    // Check vLLM connectivity
    await this.checkVLLMHealth();
    
    // Load available models
    const models = await this.getAvailableModels();
    console.log(`📚 Available vLLM models: ${models.map(m => m.id).join(', ')}`);
    
    // Verify default model is available
    if (!models.find(m => m.id === this.config.defaultModel)) {
      console.warn(`⚠️ Default model ${this.config.defaultModel} not found, using first available`);
      this.config.defaultModel = models[0]?.id || 'microsoft/DialoGPT-medium';
    }
    
    console.log(`✅ vLLM-RAG Service initialized with model: ${this.config.defaultModel}`);
  }

  /**
   * Perform RAG query using vLLM
   */
  async query(request: VLLMRAGRequest): Promise<VLLMRAGResponse> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel;
    
    try {
      // Step 1: Retrieve relevant documents
      const retrievalStart = Date.now();
      const retrievedDocuments = await this.retrieveDocuments(request);
      const retrievalTime = Date.now() - retrievalStart;
      
      // Step 2: Build context from retrieved documents
      const context = this.buildContext(retrievedDocuments, request.query);
      
      // Step 3: Generate response using vLLM
      const generationStart = Date.now();
      const vllmResponse = await this.generateWithVLLM({
        model,
        prompt: this.buildPrompt(context, request.query),
        stream: request.stream || this.config.enableStreaming,
        options: {
          max_tokens: request.maxTokens || this.config.maxTokens,
          temperature: request.temperature || this.config.temperature,
          top_p: request.topP || this.config.topP,
        }
      });
      
      const generationTime = Date.now() - generationStart;
      
      return {
        query: request.query,
        model,
        response: vllmResponse.response,
        retrievedDocuments: request.includeMetadata ? retrievedDocuments : 
          retrievedDocuments.map(doc => ({ 
            id: doc.id, 
            content: doc.content, 
            similarity: doc.similarity 
          })),
        context,
        metadata: {
          retrievalTime,
          generationTime,
          totalTokens: vllmResponse.usage?.total_tokens || 0,
          documentCount: retrievedDocuments.length,
          modelUsed: model,
          tensorParallelSize: this.config.tensorParallelSize,
        },
      };
      
    } catch (error) {
      console.error('vLLM-RAG query failed:', error);
      throw new Error(`vLLM-RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve relevant documents using vector search
   */
  private async retrieveDocuments(request: VLLMRAGRequest): Promise<Array<{
    id: string;
    content: string;
    similarity: number;
    metadata?: Record<string, any>;
  }>> {
    // Generate query embedding
    const queryEmbedding = await this.embeddingService.generateEmbedding(request.query);
    
    // Search vector store
    const searchResults = await this.vectorStore.search({
      vector: queryEmbedding,
      limit: request.maxResults || this.config.maxResults,
      threshold: request.similarityThreshold || this.config.similarityThreshold,
    });
    
    return searchResults.map(result => ({
      id: result.id,
      content: result.content,
      similarity: result.similarity,
      metadata: result.metadata,
    }));
  }

  /**
   * Build context from retrieved documents
   */
  private buildContext(documents: Array<{ content: string; similarity: number }>, query: string): string {
    let context = `Query: ${query}\n\nRelevant Information:\n`;
    
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      context += `${i + 1}. [Similarity: ${doc.similarity.toFixed(3)}] ${doc.content}\n\n`;
    }
    
    return context;
  }

  /**
   * Build prompt for vLLM
   */
  private buildPrompt(context: string, query: string): string {
    return `You are a helpful AI assistant with access to relevant information. Use the context below to answer the user's question accurately and comprehensively.

${context}

Based on the information above, please answer the following question:

Question: ${query}

Answer:`;
  }

  /**
   * Generate response using vLLM API
   */
  private async generateWithVLLM(params: {
    model: string;
    prompt: string;
    stream?: boolean;
    options?: {
      max_tokens?: number;
      temperature?: number;
      top_p?: number;
    };
  }): Promise<{ response: string; usage?: { total_tokens: number } }> {
    const url = `${this.vllmHost}/v1/chat/completions`;
    
    const payload = {
      model: params.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant with access to relevant information.'
        },
        {
          role: 'user',
          content: params.prompt
        }
      ],
      stream: params.stream || false,
      max_tokens: params.options?.max_tokens || this.config.maxTokens,
      temperature: params.options?.temperature || this.config.temperature,
      top_p: params.options?.top_p || this.config.topP,
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.vllmHost.includes('localhost') ? 'token-abc123' : 'your-api-key'}`
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`vLLM API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      response: data.choices[0]?.message?.content || '',
      usage: data.usage,
    };
  }

  /**
   * Check vLLM service health
   */
  async checkVLLMHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.vllmHost}/v1/models`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('vLLM health check failed:', error);
      throw new Error(`vLLM service not available at ${this.vllmHost}`);
    }
  }

  /**
   * Get available vLLM models
   */
  async getAvailableModels(): Promise<VLLMModelInfo[]> {
    try {
      const response = await fetch(`${this.vllmHost}/v1/models`);
      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to get vLLM models:', error);
      return [];
    }
  }

  /**
   * Get service configuration
   */
  getConfig(): VLLMRAGConfig {
    return { ...this.config };
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig: Partial<VLLMRAGConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get service statistics
   */
  async getStats(): Promise<{
    vllmHost: string;
    defaultModel: string;
    availableModels: number;
    vectorStoreStatus: string;
    embeddingServiceStatus: string;
    tensorParallelSize: number;
    gpuMemoryUtilization: number;
  }> {
    const models = await this.getAvailableModels();
    
    return {
      vllmHost: this.vllmHost,
      defaultModel: this.config.defaultModel,
      availableModels: models.length,
      vectorStoreStatus: 'connected', // TODO: Add actual health check
      embeddingServiceStatus: 'ready', // TODO: Add actual health check
      tensorParallelSize: this.config.tensorParallelSize,
      gpuMemoryUtilization: this.config.gpuMemoryUtilization,
    };
  }
} 
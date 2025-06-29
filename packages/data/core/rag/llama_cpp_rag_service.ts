/**
 * Llama.cpp-RAG Integration Service
 * 
 * Integrates Llama.cpp server with the existing RAG system for
 * enhanced retrieval-augmented generation capabilities.
 */

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

export class LlamaCppRAGService {
  private config: LlamaCppRAGConfig;
  private personaLoader: PersonaLoader;
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;
  private llamaCppHost: string;

  constructor(
    config: Partial<LlamaCppRAGConfig>,
    personaLoader: PersonaLoader,
    vectorStore: VectorStore,
    embeddingService: EmbeddingService
  ) {
    this.config = {
      llamaCppHost: 'http://localhost:8080',
      defaultModel: 'gemma-2b-it.gguf',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      similarityThreshold: 0.7,
      maxResults: 5,
      enableStreaming: false,
      contextSize: 4096,
      threads: 8,
      ...config,
    };
    
    this.personaLoader = personaLoader;
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
    this.llamaCppHost = this.config.llamaCppHost;
  }

  /**
   * Initialize the Llama.cpp-RAG service
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing Llama.cpp-RAG Service...');
    
    // Check Llama.cpp connectivity
    await this.checkLlamaCppHealth();
    
    // Load available models
    const models = await this.getAvailableModels();
    console.log(`📚 Available Llama.cpp models: ${models.map(m => m.name).join(', ')}`);
    
    // Verify default model is available
    if (!models.find(m => m.name === this.config.defaultModel)) {
      console.warn(`⚠️ Default model ${this.config.defaultModel} not found, using fallback`);
      this.config.defaultModel = models.find(m => m.name === 'qwen2.5-coder.gguf')?.name || models[0]?.name || 'gemma-2b-it.gguf';
    }
    
    console.log(`✅ Llama.cpp-RAG Service initialized with model: ${this.config.defaultModel}`);
  }

  /**
   * Perform RAG query using Llama.cpp
   */
  async query(request: LlamaCppRAGRequest): Promise<LlamaCppRAGResponse> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel;
    
    try {
      // Step 1: Retrieve relevant documents
      const retrievalStart = Date.now();
      const retrievedDocuments = await this.retrieveDocuments(request);
      const retrievalTime = Date.now() - retrievalStart;
      
      // Step 2: Build context from retrieved documents
      const context = this.buildContext(retrievedDocuments, request.query);
      
      // Step 3: Generate response using Llama.cpp
      const generationStart = Date.now();
      const llamaCppResponse = await this.generateWithLlamaCpp({
        model,
        prompt: this.buildPrompt(context, request.query),
        stream: request.stream || this.config.enableStreaming,
        options: {
          max_tokens: request.maxTokens || this.config.maxTokens,
          temperature: request.temperature || this.config.temperature,
          top_p: request.topP || this.config.topP,
          top_k: request.topK || this.config.topK,
          stop: request.stop || [],
        }
      });
      
      const generationTime = Date.now() - generationStart;
      
      return {
        query: request.query,
        model,
        response: llamaCppResponse.response,
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
          totalTokens: llamaCppResponse.usage?.total_tokens || 0,
          documentCount: retrievedDocuments.length,
          modelUsed: model,
          contextSize: this.config.contextSize,
        },
      };
      
    } catch (error) {
      console.error('Llama.cpp-RAG query failed:', error);
      throw new Error(`Llama.cpp-RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve relevant documents using vector search
   */
  private async retrieveDocuments(request: LlamaCppRAGRequest): Promise<Array<{
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
   * Build prompt for Llama.cpp
   */
  private buildPrompt(context: string, query: string): string {
    return `You are a helpful AI assistant with access to relevant information. Use the context below to answer the user's question accurately and comprehensively.

${context}

Based on the information above, please answer the following question:

Question: ${query}

Answer:`;
  }

  /**
   * Generate response using Llama.cpp API
   */
  private async generateWithLlamaCpp(params: {
    model: string;
    prompt: string;
    stream?: boolean;
    options?: {
      max_tokens?: number;
      temperature?: number;
      top_p?: number;
      top_k?: number;
      stop?: string[];
    };
  }): Promise<{ response: string; usage?: { total_tokens: number } }> {
    const url = `${this.llamaCppHost}/v1/chat/completions`;
    
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
      top_k: params.options?.top_k || this.config.topK,
      stop: params.options?.stop || [],
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Llama.cpp API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      response: data.choices[0]?.message?.content || '',
      usage: data.usage,
    };
  }

  /**
   * Check Llama.cpp service health
   */
  async checkLlamaCppHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.llamaCppHost}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Llama.cpp health check failed:', error);
      throw new Error(`Llama.cpp service not available at ${this.llamaCppHost}`);
    }
  }

  /**
   * Get available Llama.cpp models
   */
  async getAvailableModels(): Promise<LlamaCppModelInfo[]> {
    try {
      const response = await fetch(`${this.llamaCppHost}/v1/models`);
      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to get Llama.cpp models:', error);
      return [];
    }
  }

  /**
   * Load a model into Llama.cpp
   */
  async loadModel(modelName: string): Promise<void> {
    try {
      const response = await fetch(`${this.llamaCppHost}/v1/models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: modelName,
          path: `/models/${modelName}`
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load model: ${response.status}`);
      }
      
      console.log(`✅ Successfully loaded model: ${modelName}`);
    } catch (error) {
      console.error(`Failed to load model ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Get service configuration
   */
  getConfig(): LlamaCppRAGConfig {
    return { ...this.config };
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig: Partial<LlamaCppRAGConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get service statistics
   */
  async getStats(): Promise<{
    llamaCppHost: string;
    defaultModel: string;
    availableModels: number;
    vectorStoreStatus: string;
    embeddingServiceStatus: string;
    contextSize: number;
    threads: number;
  }> {
    const models = await this.getAvailableModels();
    
    return {
      llamaCppHost: this.llamaCppHost,
      defaultModel: this.config.defaultModel,
      availableModels: models.length,
      vectorStoreStatus: 'connected', // TODO: Add actual health check
      embeddingServiceStatus: 'ready', // TODO: Add actual health check
      contextSize: this.config.contextSize,
      threads: this.config.threads,
    };
  }
} 
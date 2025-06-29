/**
 * Ollama-RAG Integration Service
 * 
 * Integrates Ollama local models with the existing RAG system for
 * enhanced retrieval-augmented generation capabilities.
 */

import { PersonaLoader } from '../persona_loader';
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
import { inputValidator, validateQuery, validateModel, validateNumber, validateHost } from '../security/input_validator';

export interface OllamaRAGConfig {
  ollamaHost: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  similarityThreshold: number;
  maxResults: number;
  enableStreaming: boolean;
}

export interface OllamaRAGRequest {
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
}

export interface OllamaRAGResponse {
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
  };
}

export interface OllamaModelInfo {
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

export class OllamaRAGService {
  private config: OllamaRAGConfig;
  private personaLoader: PersonaLoader;
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;
  private ollamaHost: string;

  constructor(
    config: Partial<OllamaRAGConfig>,
    personaLoader: PersonaLoader,
    vectorStore: VectorStore,
    embeddingService: EmbeddingService
  ) {
    // Validate host configuration
    const hostValidation = validateHost(config.ollamaHost || 'http://localhost:11434');
    if (!hostValidation.isValid) {
      throw new Error(`Invalid Ollama host: ${hostValidation.errors.join(', ')}`);
    }

    this.config = {
      ollamaHost: 'http://localhost:11434',
      defaultModel: 'gemma3b',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      similarityThreshold: 0.7,
      maxResults: 5,
      enableStreaming: false,
      ...config,
    };
    
    this.personaLoader = personaLoader;
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
    this.ollamaHost = this.config.ollamaHost;
  }

  /**
   * Initialize the Ollama-RAG service
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing Ollama-RAG Service...');
    
    // Check Ollama connectivity
    await this.checkOllamaHealth();
    
    // Load available models
    const models = await this.getAvailableModels();
    console.log(`📚 Available Ollama models: ${models.map(m => m.name).join(', ')}`);
    
    // Verify default model is available
    if (!models.find(m => m.name === this.config.defaultModel)) {
      console.warn(`⚠️ Default model ${this.config.defaultModel} not found, using fallback`);
      this.config.defaultModel = models.find(m => m.name === 'qwen2.5-coder')?.name || models[0]?.name || 'gemma3b';
    }
    
    console.log(`✅ Ollama-RAG Service initialized with model: ${this.config.defaultModel}`);
  }

  /**
   * Perform RAG query using Ollama
   */
  async query(request: OllamaRAGRequest): Promise<OllamaRAGResponse> {
    const startTime = Date.now();
    
    // Comprehensive input validation
    const validationResult = this.validateQueryRequest(request);
    if (!validationResult.isValid) {
      throw new Error(`Invalid query request: ${validationResult.errors.join(', ')}`);
    }

    const model = request.model || this.config.defaultModel;
    
    try {
      // Step 1: Retrieve relevant documents
      const retrievalStart = Date.now();
      const retrievedDocuments = await this.retrieveDocuments(request);
      const retrievalTime = Date.now() - retrievalStart;
      
      // Step 2: Build context from retrieved documents
      const context = this.buildContext(retrievedDocuments, request.query);
      
      // Step 3: Generate response using Ollama
      const generationStart = Date.now();
      const ollamaResponse = await this.generateWithOllama({
        model,
        prompt: this.buildPrompt(context, request.query),
        stream: request.stream || this.config.enableStreaming,
        options: {
          num_predict: request.maxTokens || this.config.maxTokens,
          temperature: request.temperature || this.config.temperature,
          top_p: request.topP || this.config.topP,
          top_k: request.topK || this.config.topK,
        }
      });
      
      const generationTime = Date.now() - generationStart;
      
      return {
        query: request.query,
        model,
        response: ollamaResponse.response,
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
          totalTokens: ollamaResponse.eval_count || 0,
          documentCount: retrievedDocuments.length,
          modelUsed: model,
        },
      };
      
    } catch (error) {
      console.error('Ollama-RAG query failed:', error);
      throw new Error(`Ollama-RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Comprehensive validation of query request
   */
  private validateQueryRequest(request: OllamaRAGRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate query
    const queryValidation = validateQuery(request.query);
    if (!queryValidation.isValid) {
      errors.push(...queryValidation.errors);
    }

    // Validate model if provided
    if (request.model) {
      const modelValidation = validateModel(request.model);
      if (!modelValidation.isValid) {
        errors.push(...modelValidation.errors);
      }
    }

    // Validate numeric parameters
    if (request.maxTokens !== undefined) {
      const maxTokensValidation = validateNumber(request.maxTokens, 1, 8192);
      if (!maxTokensValidation.isValid) {
        errors.push(...maxTokensValidation.errors);
      }
    }

    if (request.temperature !== undefined) {
      const tempValidation = validateNumber(request.temperature, 0, 2);
      if (!tempValidation.isValid) {
        errors.push(...tempValidation.errors);
      }
    }

    if (request.topP !== undefined) {
      const topPValidation = validateNumber(request.topP, 0, 1);
      if (!topPValidation.isValid) {
        errors.push(...topPValidation.errors);
      }
    }

    if (request.topK !== undefined) {
      const topKValidation = validateNumber(request.topK, 1, 100);
      if (!topKValidation.isValid) {
        errors.push(...topKValidation.errors);
      }
    }

    if (request.similarityThreshold !== undefined) {
      const thresholdValidation = validateNumber(request.similarityThreshold, 0, 1);
      if (!thresholdValidation.isValid) {
        errors.push(...thresholdValidation.errors);
      }
    }

    if (request.maxResults !== undefined) {
      const maxResultsValidation = validateNumber(request.maxResults, 1, 100);
      if (!maxResultsValidation.isValid) {
        errors.push(...maxResultsValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Retrieve relevant documents using vector search
   */
  private async retrieveDocuments(request: OllamaRAGRequest): Promise<Array<{
    id: string;
    content: string;
    similarity: number;
    metadata?: Record<string, any>;
  }>> {
    // Generate query embedding
    const queryEmbedding = await this.embeddingService.embedText(request.query);
    
    // Search vector store
    const searchResults = await this.vectorStore.search(queryEmbedding, {
      limit: request.maxResults || this.config.maxResults,
    });
    
    // Filter by similarity threshold and format results
    return searchResults
      .filter(result => result.score >= (request.similarityThreshold || this.config.similarityThreshold))
      .map(result => ({
        id: result.id,
        content: result.content,
        similarity: result.score,
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
      if (doc) {
        context += `${i + 1}. [Similarity: ${doc.similarity.toFixed(3)}] ${doc.content}\n\n`;
      }
    }
    
    return context;
  }

  /**
   * Build prompt for Ollama
   */
  private buildPrompt(context: string, query: string): string {
    return `You are a helpful AI assistant with access to relevant information. Use the context below to answer the user's question accurately and comprehensively.

${context}

Based on the information above, please answer the following question:

Question: ${query}

Answer:`;
  }

  /**
   * Generate response using Ollama API
   */
  private async generateWithOllama(params: {
    model: string;
    prompt: string;
    stream?: boolean;
    options?: {
      num_predict?: number;
      temperature?: number;
      top_p?: number;
      top_k?: number;
    };
  }): Promise<{ response: string; eval_count?: number }> {
    // Validate model
    const modelValidation = validateModel(params.model);
    if (!modelValidation.isValid) {
      throw new Error(`Invalid model: ${modelValidation.errors.join(', ')}`);
    }

    // Validate prompt
    const promptValidation = inputValidator.validateInput(params.prompt, 'query');
    if (!promptValidation.isValid) {
      throw new Error(`Invalid prompt: ${promptValidation.errors.join(', ')}`);
    }

    const url = `${this.ollamaHost}/api/generate`;
    
    const payload = {
      model: params.model,
      prompt: promptValidation.sanitizedValue || params.prompt,
      stream: params.stream || false,
      options: params.options || {},
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as { response: string; eval_count?: number };
    
    return {
      response: data.response,
      eval_count: data.eval_count,
    };
  }

  /**
   * Check Ollama service health
   */
  async checkOllamaHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaHost}/api/tags`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Ollama health check failed:', error);
      throw new Error(`Ollama service not available at ${this.ollamaHost}`);
    }
  }

  /**
   * Get available Ollama models
   */
  async getAvailableModels(): Promise<OllamaModelInfo[]> {
    try {
      const response = await fetch(`${this.ollamaHost}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`);
      }
      
      const data = await response.json() as { models?: OllamaModelInfo[] };
      return data.models || [];
    } catch (error) {
      console.error('Failed to get Ollama models:', error);
      return [];
    }
  }

  /**
   * Pull a model to Ollama
   */
  async pullModel(modelName: string): Promise<void> {
    // Validate model name
    const modelValidation = validateModel(modelName);
    if (!modelValidation.isValid) {
      throw new Error(`Invalid model name: ${modelValidation.errors.join(', ')}`);
    }

    try {
      const response = await fetch(`${this.ollamaHost}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to pull model: ${response.status}`);
      }
      
      console.log(`✅ Successfully pulled model: ${modelName}`);
    } catch (error) {
      console.error(`Failed to pull model ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a model from Ollama
   */
  async deleteModel(modelName: string): Promise<void> {
    // Validate model name
    const modelValidation = validateModel(modelName);
    if (!modelValidation.isValid) {
      throw new Error(`Invalid model name: ${modelValidation.errors.join(', ')}`);
    }

    try {
      const response = await fetch(`${this.ollamaHost}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete model: ${response.status}`);
      }
      
      console.log(`✅ Successfully deleted model: ${modelName}`);
    } catch (error) {
      console.error(`Failed to delete model ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Get service configuration
   */
  getConfig(): OllamaRAGConfig {
    return { ...this.config };
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig: Partial<OllamaRAGConfig>): void {
    // Validate new configuration
    if (newConfig.ollamaHost) {
      const hostValidation = validateHost(newConfig.ollamaHost);
      if (!hostValidation.isValid) {
        throw new Error(`Invalid host in config: ${hostValidation.errors.join(', ')}`);
      }
    }

    if (newConfig.defaultModel) {
      const modelValidation = validateModel(newConfig.defaultModel);
      if (!modelValidation.isValid) {
        throw new Error(`Invalid model in config: ${modelValidation.errors.join(', ')}`);
      }
    }

    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get service statistics
   */
  async getStats(): Promise<{
    ollamaHost: string;
    defaultModel: string;
    availableModels: number;
    vectorStoreStatus: string;
    embeddingServiceStatus: string;
  }> {
    const models = await this.getAvailableModels();
    
    return {
      ollamaHost: this.ollamaHost,
      defaultModel: this.config.defaultModel,
      availableModels: models.length,
      vectorStoreStatus: 'connected', // TODO: Add actual health check
      embeddingServiceStatus: 'ready', // TODO: Add actual health check
    };
  }
} 
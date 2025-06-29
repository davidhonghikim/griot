/**
 * Ollama-RAG Integration Service
 * 
 * Integrates Ollama local inference API with the existing RAG system for
 * enhanced retrieval-augmented generation capabilities.
 */

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

function validateHost(host: string): { isValid: boolean; error?: string } {
  try {
    const url = new URL(host);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { isValid: false, error: 'Protocol must be http or https' };
    }
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

export class OllamaRAGService {
  private config: OllamaRAGConfig;
  private ollamaHost: string;
  private apiKey: string;
  private personaLoader: PersonaLoader;
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;

  constructor(
    config: OllamaRAGConfig,
    personaLoader: PersonaLoader,
    vectorStore: VectorStore,
    embeddingService: EmbeddingService
  ) {
    this.config = {
      ollamaHost: 'http://localhost:11434',
      defaultModel: 'llama2',
      enableStreaming: false,
      maxTokens: 1000,
      topP: 0.9,
      temperature: 0.7,
      similarityThreshold: 0.7,
      ...config,
    };
    
    const hostValidation = validateHost(this.config.ollamaHost || 'http://localhost:11434');
    if (!hostValidation.isValid) {
      throw new Error(`Invalid Ollama host: ${hostValidation.error}`);
    }
    
    this.ollamaHost = this.config.ollamaHost!;
    this.apiKey = this.config.apiKey || '';
    this.personaLoader = personaLoader;
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
  }

  async initialize(): Promise<void> {
    // Test connection to Ollama
    await this.checkOllamaHealth();
  }

  async query(request: OllamaRAGRequest): Promise<OllamaRAGResponse> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel!;
    
    try {
      // Retrieve relevant documents
      const retrievalStart = Date.now();
      const retrievedDocuments = await this.retrieveDocuments(request);
      const retrievalTime = Date.now() - retrievalStart;

      // Build context from retrieved documents
      const context = this.buildContext(
        retrievedDocuments.map(doc => ({ content: doc.content, score: doc.score })),
        request.query
      );

      // Generate response using Ollama
      const generationStart = Date.now();
      const generationResult = await this.generateWithOllama({
        model,
        prompt: this.buildPrompt(context, request.query),
        stream: request.stream || this.config.enableStreaming,
        options: {
          num_predict: request.maxTokens || this.config.maxTokens,
          temperature: request.temperature || this.config.temperature,
          top_p: request.topP || this.config.topP,
        },
      });
      const generationTime = Date.now() - generationStart;

      return {
        query: request.query,
        model,
        response: generationResult.response,
        retrievedDocuments: request.includeMetadata ? retrievedDocuments : [],
        context,
        metadata: {
          retrievalTime,
          generationTime,
          totalTokens: generationResult.usage?.total_tokens || 0,
          documentCount: retrievedDocuments.length,
          modelUsed: model,
          apiEndpoint: this.ollamaHost,
        },
      };
    } catch (error) {
      throw new Error(`Ollama RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async retrieveDocuments(request: OllamaRAGRequest): Promise<Array<{
    id: string;
    content: string;
    score: number;
    metadata?: Record<string, any>;
  }>> {
    const queryEmbedding = await this.embeddingService.embedText(request.query);
    
    const searchResults = await this.vectorStore.search(queryEmbedding, {
      limit: request.maxResults || 5,
      
    });

    return searchResults.map(result => ({
      id: result.id,
      content: result.content,
      score: result.score,
      metadata: result.metadata,
    }));
  }

  private buildContext(documents: Array<{ content: string; score: number }>, query: string): string {
    if (documents.length === 0) {
      return 'No relevant documents found.';
    }

    const sortedDocuments = documents
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Use top 3 most relevant documents

    return sortedDocuments
      .map((doc, index) => `Document ${index + 1} (Relevance: ${doc.score.toFixed(3)}):\n${doc.content}`)
      .join('\n\n');
  }

  private buildPrompt(context: string, query: string): string {
    return `You are a helpful AI assistant with access to relevant information. Use the context below to answer the user's question accurately and comprehensively.

${context}

Based on the information above, please answer the following question:

Question: ${query}

Answer:`;
  }

  private async generateWithOllama(params: {
    model: string;
    prompt: string;
    stream?: boolean;
    options?: {
      num_predict?: number;
      temperature?: number;
      top_p?: number;
    };
  }): Promise<{ response: string; usage?: { total_tokens: number } }> {
    const url = `${this.ollamaHost}/api/generate`;
    
    const payload = {
      model: params.model,
      prompt: params.prompt,
      stream: params.stream || false,
      options: {
        num_predict: params.options?.num_predict || this.config.maxTokens,
        temperature: params.options?.temperature || this.config.temperature,
        top_p: params.options?.top_p || this.config.topP,
      },
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }
    
    if (params.stream) {
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader for streaming');
      }
      
      let responseText = '';
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              responseText += data.response;
            }
          } catch (error) {
            // Skip malformed JSON lines
          }
        }
      }
      
      return {
        response: responseText,
        usage: { total_tokens: responseText.length }, // Approximate
      };
    } else {
      // Handle non-streaming response
      const data = await response.json() as any;
      
      return {
        response: data.response || '',
        usage: { total_tokens: (data as any).eval_count || 0 }, // Approximate
      };
    }
  }

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

  async getAvailableModels(): Promise<OllamaModelInfo[]> {
    try {
      const response = await fetch(`${this.ollamaHost}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`);
      }
      
      const data = await response.json() as any;
      return (data as any).models || [];
    } catch (error) {
      console.error('Failed to get Ollama models:', error);
      return [];
    }
  }

  async pullModel(modelName: string): Promise<void> {
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
      
      // Wait for pull to complete
      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.status === 'success') {
                return;
              }
            } catch (error) {
              // Skip malformed JSON lines
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to pull model ${modelName}:`, error);
      throw error;
    }
  }

  async deleteModel(modelName: string): Promise<void> {
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
    } catch (error) {
      console.error(`Failed to delete model ${modelName}:`, error);
      throw error;
    }
  }

  getConfig(): OllamaRAGConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<OllamaRAGConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.ollamaHost) {
      const hostValidation = validateHost(newConfig.ollamaHost);
      if (!hostValidation.isValid) {
        throw new Error(`Invalid Ollama host: ${hostValidation.error}`);
      }
      this.ollamaHost = newConfig.ollamaHost;
    }
  }

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
      defaultModel: this.config.defaultModel!,
      availableModels: models.length,
      vectorStoreStatus: 'connected', // TODO: Add actual health check
      embeddingServiceStatus: 'ready', // TODO: Add actual health check
    };
  }
} 